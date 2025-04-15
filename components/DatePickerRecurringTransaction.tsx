import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useField } from "formik";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DatePickerRecurringTransactionProps {
  name: string;
  label: string;
  containerClass?: string;
  labelClass?: string;
  isRequired?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePickerRecurringTransaction: React.FC<DatePickerRecurringTransactionProps> = ({
  name,
  label,
  containerClass,
  labelClass,
  isRequired = false,
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (date) {
      helpers.setValue(date);
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
          className={`h-10 flex-row items-center rounded-md border px-3 ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"
            }`}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons name="date-range" size={20} color="#609084" />
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
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}

      {meta.touched && meta.error && (
        <Text className="absolute -bottom-5 mt-2 text-[12px] text-red-500">
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export { DatePickerRecurringTransaction };