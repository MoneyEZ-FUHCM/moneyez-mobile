// CategoryItem.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CategoryItemProps {
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  isSelected?: boolean;
}

export default function CategoryItem({ label, iconName, isSelected = false }: CategoryItemProps) {
  return (
    <View className="p-1">
      <View
        className={`flex-1 rounded-lg border p-3 items-center ${
          isSelected ? 'border-[#609084] bg-[#e1eacd]' : 'border-[#ccc] bg-white'
        }`}
      >
        <View className="w-10 h-10 rounded-full bg-white shadow justify-center items-center">
          <MaterialIcons name={iconName} size={24} color="black" />
        </View>
        <Text className="mt-2 text-xs font-semibold text-black">{label}</Text>
      </View>
    </View>
  );
}
