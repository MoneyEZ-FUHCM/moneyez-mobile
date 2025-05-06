import {
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CREATE_SPENDING_BUDGET from "./CreateSpendingBudget.constant";
import TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1 from "./CreateSpendingBudgetStep1.translate";
import useCreateSpendingBudgetStep1 from "./hooks/useCreateSpendingBudgetStep1";

export default function CreateSpendingBudgetStep1() {
  const { state, handler } = useCreateSpendingBudgetStep1();
  const { CREATE, MORE } = CREATE_SPENDING_BUDGET;
  const { categoryGroups, selectedCategoryId, isLoading } = state;
  const { handleBack, handleContinue, handleSelectCategory } = handler;

  const renderCategoryItem = (item: any) => {
    const isSelected = selectedCategoryId === item.id;
    const isDisabled = item.status === CREATE;

    if (item.status === MORE) {
      return (
        <Pressable
          key={item.id}
          onPress={() => handleSelectCategory(item)}
          className="mb-3 w-full flex-1 self-stretch overflow-hidden rounded-[10px] border border-gray-300 px-0 py-2.5"
        >
          <Text className="w-full text-center text-base font-semibold text-gray-500">
            {item.label}
          </Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={item.id}
        onPress={() => handleSelectCategory(item)}
        className={`flex-row items-center justify-between border p-3 ${isSelected && !isDisabled ? "border-[#609084]" : "border-[#E5E7EB]"} mb-3 rounded-[10px]`}
        disabled={isDisabled}
      >
        <View className="flex-row items-center space-x-3">
          <MaterialIcons name={item.icon} size={24} color="#609084" />
          <Text className="text-base font-medium text-black">{item.label}</Text>
        </View>
        {item.status === "created" ? (
          <View className="rounded-md bg-gray-200 px-2 py-1">
            <Text className="flex items-center justify-center text-center text-sm font-semibold text-text-gray">
              {
                TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1.LABELS
                  .BUDGET_CREATED
              }
            </Text>
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
    <SafeAreaViewCustom rootClassName="relative bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleBack}
            className="rounded-full bg-gray-50 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1.TITLE.MAIN_TITLE}
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>

      {/* Instruction */}
      <SectionComponent rootClassName="bg-white p-5">
        <Text className="mb-1 text-base font-semibold text-black">
          {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1.TITLE.INSTRUCTION_TITLE}
        </Text>
        <View className="w-[65%]">
          <Text className="text-sm text-gray-500">
            {
              TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1.TITLE
                .INSTRUCTION_SUBTITLE
            }
          </Text>
        </View>
      </SectionComponent>

      {/* Category Groups */}
      <ScrollViewCustom
        isBottomTab={true}
        className="mx-[15px] mt-3"
        showsVerticalScrollIndicator={false}
      >
        {categoryGroups?.map((group) => (
          <SectionComponent
            key={group.id}
            rootClassName="mb-4 bg-white rounded-lg p-4"
          >
            <Text className="mb-4 text-base font-bold text-text-gray">
              {group.title}
            </Text>
            {group.items.map(renderCategoryItem)}
          </SectionComponent>
        ))}
      </ScrollViewCustom>
      <SectionComponent rootClassName="absolute bottom-0 w-full bg-white pb-5">
        <TouchableOpacity
          onPress={handleContinue}
          className={`${selectedCategoryId ? "bg-primary" : "bg-[#a0c0ba]"} mx-5 rounded-[10px] py-2.5`}
          disabled={!selectedCategoryId}
        >
          <Text className="text-center text-lg font-medium text-white">
            {TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1.BUTTON.CONTINUE}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
