// CategoryItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CategoryItemProps {
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  isSelected?: boolean;
  color?: string;
}

export default function CategoryItem({
  label,
  iconName,
  isSelected = false,
  color = "black",
}: CategoryItemProps) {
  return (
    <View className="p-1">
      <View
        className={`flex-1 items-center rounded-xl border-[0.5px] py-5 ${
          isSelected ? "border-primary bg-[#e1eacd]" : "border-[#ccc] bg-white"
        }`}
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow">
          <MaterialIcons name={iconName} size={27} color={color} />
        </View>
        <Text className="mt-2 text-xs font-semibold text-black">{label}</Text>
      </View>
    </View>
  );
}
