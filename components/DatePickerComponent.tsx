import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useField } from "formik";
import { Calendar } from "iconsax-react-native";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DatePickerComponentProps {
  name: string;
  label: string;
  containerClass?: string;
  labelClass?: string;
  isRequired?: boolean;
  onChange?: (date: Date) => void;
  selectedDate?: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  name,
  label,
  containerClass,
  labelClass,
  isRequired = false,
  onChange,
  selectedDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    if (selectedDate) {
      helpers.setValue(new Date(selectedDate));
    }
  }, [selectedDate]);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (date) {
      helpers.setValue(date);
      if (onChange) {
        onChange(date);
      }
    }
  };

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
          onPress={() => setShowPicker(true)}
        >
          <Calendar size="20" color="#609084" />
          <Text className="ml-2 text-[13px] text-black">
            {field.value
              ? new Date(field.value).toLocaleDateString("vi-VN")
              : "Chọn ngày"}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={field.value ? new Date(field.value) : new Date()}
          mode="date"
          is24Hour={true}
          display="default"
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

export { DatePickerComponent };
