import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useField } from "formik";
import { Calendar } from "iconsax-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DatePickerComponentProps {
  name: string;
  label: string;
  containerClass?: string;
  labelClass?: string;
  isRequired?: boolean;
}

const DatePickerTransactionComponent: React.FC<
  DatePickerComponentProps & { createdDate?: string; endDate?: string }
> = ({
  name,
  label,
  containerClass,
  labelClass,
  isRequired = false,
  createdDate,
  endDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (date) {
      if (mode === "date") {
        setMode("time");
        setShowPicker(true);
        helpers.setValue(date);
      } else {
        setShowPicker(false);
        helpers.setValue(date);
      }
    }
  };

  const minDate = createdDate ? new Date(createdDate) : new Date();
  const maxDate = endDate
    ? new Date(endDate)
    : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  return (
    <View className={`${containerClass} mb-5`}>
      <View className="mb-1 flex-row items-center">
        {isRequired && <Text className="mr-1 text-red">*</Text>}
        <Text
          className={`${labelClass} ${meta.touched && meta.error ? "text-red" : ""}`}
        >
          {label}
        </Text>
      </View>
      <View className="relative">
        <TouchableOpacity
          className={`h-10 flex-row items-center rounded-md border px-3 ${
            meta.touched && meta.error ? "border-red" : "border-gray-300"
          }`}
          onPress={() => {
            setMode("date");
            setShowPicker(true);
          }}
        >
          <Calendar size="20" color="#609084" />
          <Text className="ml-2 text-[13px] text-black">
            {field.value
              ? new Date(field.value).toLocaleString("vi-VN")
              : "Chọn ngày giờ"}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={field.value ? new Date(field.value) : new Date()}
          mode={mode}
          is24Hour={true}
          display="default"
          minimumDate={minDate}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}

      {meta.touched && meta.error && (
        <Text className="absolute -bottom-5 mt-2 text-[12px] text-red">
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export { DatePickerTransactionComponent };
