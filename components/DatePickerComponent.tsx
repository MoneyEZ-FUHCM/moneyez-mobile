import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useField } from "formik";
import { Calendar } from "iconsax-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DatePickerComponentProps {
  name: string;
  selectedDate: any;
  onChange: any;
  label: string;
  containerClass?: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  name,
  selectedDate,
  onChange,
  label,
  containerClass,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (date) {
      onChange(date);
    }
  };

  return (
    <View className={`${containerClass} mb-5`}>
      <View className="mb-1 flex-row items-center">
        <Text className="text-[12px] text-text-gray">{label}</Text>
      </View>
      <TouchableOpacity
        className="h-10 flex-row items-center rounded-md border border-gray-300 px-3"
        onPress={() => setShowPicker(true)}
      >
        <Calendar size="20" color="#609084" />
        <Text className="ml-2 text-[13px] text-black">
          {selectedDate
            ? selectedDate.toLocaleDateString("vi-VN")
            : "Chọn ngày"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
      {meta.touched && meta.error && (
        <Text className={`absolute -bottom-5 mt-2 text-[12px] text-red`}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export { DatePickerComponent };
