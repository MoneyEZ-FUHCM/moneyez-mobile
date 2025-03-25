import {
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { Colors } from "@/helpers/constants/color";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatCurrency } from "@/helpers/libs";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import useSpendingBudget from "./hooks/useSpendingBudgetList";
import TEXT_TRANSLATE_SPENDING_BUDGET from "./SpendingBudgetList.translate";

export default function SpendingBudget() {
  const { state, handler } = useSpendingBudget();
  const { cycleInfo, budgetSections, isLoading } = state;
  const { handleAddBudget, handleBack, handleBudgetPress, handleRefresh } =
    handler;

  if (isLoading) {
    return (
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
        <SectionComponent rootClassName="h-14 bg-white justify-center">
          <View className="flex-row items-center justify-between px-5">
            <Pressable onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="#609084" />
            </Pressable>
            <Text className="text-lg font-bold text-[#609084]">
              {TEXT_TRANSLATE_SPENDING_BUDGET.TITLE.MAIN_TITLE}
            </Text>
            <SpaceComponent width={24} />
          </View>
        </SectionComponent>
        <SectionComponent rootClassName="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#609084" />
          <Text className="mt-2 text-primary">
            {COMMON_CONSTANT.LOADING_TRANSLATE.LOADING}
          </Text>
        </SectionComponent>
      </SafeAreaViewCustom>
    );
  }

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_SPENDING_BUDGET.TITLE.MAIN_TITLE}
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>
      {/* Cycle Info & Add Budget */}
      <SectionComponent rootClassName="bg-white p-4 mt-2.5">
        <View className="mb-2">
          <Text className="text-base font-semibold">
            Chu kỳ {cycleInfo.cycle}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">
            Còn {cycleInfo.remainingDays} ngày nữa hết chu kỳ
          </Text>
          <Pressable
            onPress={handleAddBudget}
            className="flex-row items-center"
          >
            <Entypo
              name="circle-with-plus"
              size={21}
              color={Colors.colors.primary}
            />
            <Text className="ml-1 text-base font-semibold text-[#609084]">
              {TEXT_TRANSLATE_SPENDING_BUDGET.BUTTON.ADD_BUDGET}
            </Text>
          </Pressable>
        </View>
      </SectionComponent>
      <ScrollViewCustom
        showsVerticalScrollIndicator={false}
        isBottomTab={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
      >
        {/* Budget Sections */}
        <View className="m-4">
          {budgetSections?.map((section) => (
            <SectionComponent
              key={section.id}
              rootClassName="mb-[10px] bg-white rounded-[10px] p-[10px]"
            >
              <Text className="mb-4 text-base font-semibold text-[#808080]">
                {section.category}
              </Text>
              {section.items.map((item) => {
                const progressPercent = item.currentAmount / item.targetAmount;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleBudgetPress(item.id)}
                    className="mb-3 flex-row items-center justify-between rounded-[10px] border border-[#609084] p-3"
                  >
                    <View className="flex-row items-center space-x-3">
                      <View>
                        <ProgressCircleComponent
                          value={progressPercent}
                          size={72}
                          thickness={9}
                          color="#609084"
                          iconName={item?.icon}
                          iconSize={28}
                          iconColor="#609084"
                        />
                      </View>
                      <View className="gap-y-1">
                        <Text className="text-base font-bold text-black">
                          {item.name}
                        </Text>
                        <View className="flex-col gap-0.5">
                          <View className="flex-row items-center space-x-1">
                            <Text className="text-sm text-[#808080]">
                              {TEXT_TRANSLATE_SPENDING_BUDGET.LABELS.REMAINING}
                            </Text>
                            <Text className="font-bold text-primary">
                              {formatCurrency(item.remaining)}
                            </Text>
                          </View>
                          <View className="flex-row items-center space-x-2">
                            <Text className="text-sm text-text-gray">
                              {TEXT_TRANSLATE_SPENDING_BUDGET.LABELS.SPENT}
                            </Text>
                            <View className="flex-row items-center">
                              <Text className="font-bold text-black">
                                {formatCurrency(item.currentAmount)}
                              </Text>
                              <Text className="text-sm text-text-gray">
                                {" / "}
                                {formatCurrency(item.targetAmount)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </SectionComponent>
          ))}
        </View>
      </ScrollViewCustom>
    </SafeAreaViewCustom>
  );
}
