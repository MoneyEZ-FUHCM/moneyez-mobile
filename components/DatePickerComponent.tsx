import { Calendar } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { DateTimePicker } from "react-native-ui-lib";

interface DatePickerComponentProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selectedDate,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* Button with Calendar Icon */}
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowPicker(true)}>
        <Calendar size="24" color="#609084" />
        <Text style={styles.dateText}>
          {selectedDate ? selectedDate.toLocaleDateString("vi-VN") : "Chọn ngày"}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Dialog (No Extra Display) */}
      {showPicker && (
        <DateTimePicker
          visible={showPicker}
          mode="date"
          value={selectedDate}
          onChange={(date) => {
            if (date) {
              onChange(date as Date);
            }
            setShowPicker(false);
          }}
          renderInput={null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});

export { DatePickerComponent };
