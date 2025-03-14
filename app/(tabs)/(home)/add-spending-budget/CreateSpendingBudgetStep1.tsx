import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import useCreateSpendingBudgetStep1 from "./hooks/useCreateSpendingBudgetStep1";

export default function CreateSpendingBudgetStep1() {
  const { categoryGroups, handleBack, handleContinue, handleSelectCategory } =
    useCreateSpendingBudgetStep1();

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
            {group.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleSelectCategory(item)}
                className="flex-row items-center justify-between p-3 border border-[#609084] rounded-lg mb-3"
              >
                <View className="flex-row items-center space-x-3">
                  <MaterialIcons name={item.icon} size={30} color="#609084" />
                  <Text className="font-bold text-black">{item.label}</Text>
                </View>
                {item.status === "created" && (
                  <Text className="text-sm text-green-600">Đã tạo ngân sách</Text>
                )}
              </Pressable>
            ))}
          </SectionComponent>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <SectionComponent rootClassName="h-16 bg-white justify-center items-center border-t border-gray-300">
        <Pressable
          onPress={handleContinue}
          className="bg-[#609084] rounded-lg py-3 px-6"
        >
          <Text className="text-white text-lg font-semibold">Tiếp tục</Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
