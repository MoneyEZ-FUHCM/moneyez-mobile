import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import useCreateSpendingBudgetStep2 from "./hooks/useCreateSpendingBudgetStep2";
import TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2 from "./CreateSpendingBudgetStep2.translate";

export default function CreateSpendingBudgetStep2() {
  const { selectedCategory, handleBack, handleCreateBudget } =
    useCreateSpendingBudgetStep2();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-[#609084]">
            {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2.TITLE.MAIN_TITLE}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      {/* Budget Limit Setup */}
      <SectionComponent rootClassName="bg-white m-4 rounded-lg p-4">
        <View className="mb-4">
          <Text className="text-base font-semibold text-black">
            {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2.TITLE.SETUP_LIMIT}
          </Text>
          <Text className="text-sm text-gray-500">
            {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2.TITLE.SETUP_DESCRIPTION}
          </Text>
        </View>

        {/* Display Selected Category and Maximum Budget */}
        <View className="flex-row items-center justify-between p-3 border border-[#609084] rounded-lg">
          <View className="flex-row items-center space-x-3">
            <MaterialIcons name={selectedCategory.icon} size={30} color="#609084" />
            <Text className="font-bold text-black">{selectedCategory.label}</Text>
          </View>
          <View className="items-end">
            <Text className="text-sm text-gray-500">
              {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2.LABELS.MAX_AMOUNT}{" "}
              <Text className="font-bold text-black">
                {selectedCategory.maxAmountFormatted}
              </Text>
            </Text>
          </View>
        </View>

        {/* Budget Input/Display */}
        <SectionComponent rootClassName="bg-white rounded-lg p-4 mt-4">
          <Text className="text-sm text-gray-500 mb-2">
            {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2.LABELS.CURRENT_AMOUNT}
          </Text>
          <View className="border border-[#609084] rounded-lg p-3">
            <Text className="text-2xl font-bold text-black">
              {selectedCategory.currentAmountFormatted}
            </Text>
          </View>
        </SectionComponent>
      </SectionComponent>

      {/* Create Budget Button */}
      <SectionComponent rootClassName="h-16 bg-white justify-center items-center border-t border-gray-300">
        <Pressable
          onPress={handleCreateBudget}
          className="bg-[#609084] rounded-lg py-3 px-6"
        >
          <Text className="text-white text-lg font-semibold">
            {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2.BUTTON.CREATE_BUDGET}
          </Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}