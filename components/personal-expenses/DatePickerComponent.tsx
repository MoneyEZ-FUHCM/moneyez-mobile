import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
  label,
  containerClass,
  labelClass,
  isRequired = false,
  onChange,
  selectedDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined,
  );

  useEffect(() => {
    if (selectedDate) {
      setDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (onChange) {
        onChange(selectedDate);
      }
    }
  };

  return (
    <View className={`${containerClass} mb-5`}>
      <View className="mb-1 flex-row items-center">
        {isRequired && <Text className="mr-1 text-red">*</Text>}
        <Text className={`${labelClass}`}>{label}</Text>
      </View>
      <View className="relative">
        <TouchableOpacity
          className={`h-10 flex-row items-center rounded-md border border-gray-300 px-3`}
          onPress={() => setShowPicker(true)}
        >
          <Calendar size="20" color="#609084" />
          <Text className="ml-2 text-[13px] text-black">
            {date ? date.toLocaleDateString("vi-VN") : "Chọn ngày"}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export { DatePickerComponent };
