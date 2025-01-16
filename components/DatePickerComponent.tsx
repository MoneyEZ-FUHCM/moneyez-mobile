import { Calendar } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DateTimePicker } from "react-native-ui-lib";

const DatePickerComponent = () => {
  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowPicker(true)}
      >
        <Calendar size="32" color="#FF8A65" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="date"
          onChange={(selectedDate) => {
            setDate(selectedDate as any);
            setShowPicker(false);
          }}
          placeholder="Chọn ngày"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});

export { DatePickerComponent };
