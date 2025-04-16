import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface YearMonthSelectorProps {
  currentYear: number;
  onPrevious: () => void;
  onNext: () => void;
}

const YearMonthSelector: React.FC<YearMonthSelectorProps> = ({
  currentYear,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPrevious} style={styles.button}>
        <MaterialIcons name="chevron-left" size={24} color="black" />
      </Pressable>

      <Text style={styles.yearText}>{currentYear} (Th1 01 - Th12 31)</Text>

      <Pressable onPress={onNext} style={styles.button}>
        <MaterialIcons name="chevron-right" size={24} color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  button: {
    padding: 8,
  },
  yearText: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 8,
  },
});

export default YearMonthSelector;
