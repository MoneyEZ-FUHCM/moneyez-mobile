import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import useCreateSpendingBudgetStep1 from "./hooks/useCreateSpendingBudgetStep1";

export default function CreateSpendingBudgetStep1() {
  const { categoryGroups, selectedCategoryId, handleBack, handleContinue, handleSelectCategory } =
    useCreateSpendingBudgetStep1();

  /**
   * Renders a single category item row.
   */
  const renderCategoryItem = (item: any) => {
    if (item.label === "Hiển thị thêm ...") {
      return (
        <Pressable
          key={item.id}
          onPress={() => handleSelectCategory(item)}
          className="self-stretch rounded-lg border border-gray-300 flex-1 w-full overflow-hidden py-2.5 px-0 mb-3"
        >
          <Text className="text-base font-semibold text-gray-500 text-center w-full">
            {item.label}
          </Text>
        </Pressable>
      );
    }

    const isSelected = selectedCategoryId === item.id;
    const isDisabled = item.status === 'created';

    return (
      <Pressable
        key={item.id}
        onPress={() => handleSelectCategory(item)}
        className={`flex-row items-center justify-between p-3 border ${isSelected && !isDisabled ? 'border-[#609084]' : 'border-[#E5E7EB]'} rounded-lg mb-3`}
        disabled={isDisabled}
      >
        {/* Left side: Icon + Label */}
        <View className="flex-row items-center space-x-3">
          <MaterialIcons name={item.icon} size={24} color="#609084" />
          <Text className="text-base font-medium text-black">{item.label}</Text>
        </View>

        {/* Right side: radio circle or "Đã tạo ngân sách" pill */}
        {item.status === "created" ? (
          <View className="px-2 py-1 bg-gray-200 rounded-md">
            <Text className="flex items-center justify-center text-sm font-semibold text-gray-500 text-center">Đã tạo ngân sách</Text>
          </View>
        ) : (
          <MaterialCommunityIcons
            name={isSelected ? "radiobox-marked" : "radiobox-blank"}
            size={24}
            color={isSelected ? "#609084" : "#999"}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-[#609084]">Tạo ngân sách</Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      {/* Instruction */}
      <SectionComponent rootClassName="bg-white m-4 rounded-lg p-4">
        <Text className="text-base font-semibold text-black mb-1">
          Chọn danh mục chi tiêu theo mô hình đang sử dụng
        </Text>
        <Text className="text-sm text-gray-500">
          Bạn sẽ nhận được thông báo khi hoàn thành mục tiêu
        </Text>
      </SectionComponent>

      {/* Category Groups */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        {categoryGroups.map((group) => (
          <SectionComponent key={group.id} rootClassName="mb-4 bg-white rounded-lg p-4">
            <Text className="text-base font-bold text-black mb-2">
              {group.title}
            </Text>
            {group.items.map(renderCategoryItem)}
          </SectionComponent>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <SectionComponent rootClassName="h-16 bg-white justify-center items-center border-t border-gray-300">
        <Pressable
          onPress={handleContinue}
          className={`${selectedCategoryId ? 'bg-[#609084]' : 'bg-[#a0c0ba]'} rounded-lg py-3 px-6`}
          disabled={!selectedCategoryId}
        >
          <Text className="text-white text-lg font-semibold">Tiếp tục</Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
