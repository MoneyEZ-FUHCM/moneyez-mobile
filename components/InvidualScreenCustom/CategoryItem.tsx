import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface CategoryItemProps {
  readonly label: string;
  readonly iconName?: keyof typeof MaterialIcons.glyphMap;
  readonly isSelected?: boolean;
  readonly color?: string;
  readonly rootClassName?: string;
}

export function CategoryItem({
  label,
  iconName,
  isSelected = false,
  color = "black",
  rootClassName,
}: Readonly<CategoryItemProps>) {
  return (
    <View className={`p-1 ${rootClassName}`}>
      <View
        className={`flex-1 items-center rounded-xl border-[0.5px] py-5 ${
          isSelected ? "border-primary bg-[#e1eacd]" : "border-[#ccc] bg-white"
        }`}
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow">
          <MaterialIcons name={iconName} size={27} color={color} />
        </View>
        <Text className="px-1.5 text-center text-[10px] font-medium text-black">
          {label}
        </Text>
      </View>
    </View>
  );
}
