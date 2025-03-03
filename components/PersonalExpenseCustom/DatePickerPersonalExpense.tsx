import { Calendar } from "iconsax-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DatePickerComponentProps {
  label: string;
  containerClass?: string;
  labelClass?: string;
  isRequired?: boolean;
  selectedDate?: string;
}

const DatePickerPersonalExpense: React.FC<DatePickerComponentProps> = ({
  label,
  containerClass,
  labelClass,
  isRequired = false,
  selectedDate,
}) => {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined,
  );

  return (
    <View className={`${containerClass} mb-5`}>
      <View className="mb-1 flex-row items-center">
        {isRequired && <Text className="mr-1 text-red">*</Text>}
        <Text className={`${labelClass}`}>{label}</Text>
      </View>
      <View className="relative">
        <TouchableOpacity
          className={`h-10 flex-row items-center rounded-md border border-gray-300 px-3`}
        >
          <Calendar size="20" color="#609084" />
          <Text className="ml-2 text-[13px] text-black">
            {date ? date.toLocaleDateString("vi-VN") : "Chọn ngày"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DatePickerPersonalExpense;
