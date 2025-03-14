import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import useSpendingBudget from "./hooks/useSpendingBudgetList";
import { formatCurrency } from "@/helpers/libs";
import ProgressCircle from "./components/ProgressCircle";

export default function SpendingBudget() {
  const { cycleInfo, budgetSections, handleAddBudget, handleBack } = useSpendingBudget();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-[#609084]">Ngân sách chi tiêu</Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      {/* Cycle Info & Add Budget */}
      <SectionComponent rootClassName="bg-white m-4 rounded-lg p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold">
              Chu kỳ {cycleInfo.cycle}
            </Text>
            <Text className="text-sm text-gray-500">
              Còn {cycleInfo.remainingDays} ngày nữa hết chu kỳ
            </Text>
          </View>
          <Pressable onPress={handleAddBudget} className="flex-row items-center">
            <MaterialIcons name="add" size={24} color="#609084" />
            <Text className="ml-2 text-base font-semibold text-[#609084]">
              Thêm ngân sách
            </Text>
          </Pressable>
        </View>
      </SectionComponent>

      {/* Budget Sections */}
      <View className="flex-1 m-4">
        {budgetSections.map((section) => (
          <SectionComponent
            key={section.id}
            rootClassName="mb-4 bg-white rounded-lg p-4"
          >
            <Text className="text-lg font-bold text-black mb-2">
              {section.title}
            </Text>
            {section.items.map((item) => {
              const progressPercent = (item.spent / item.total) * 100;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {}}
                  className="flex-row items-center justify-between p-3 border border-[#609084] rounded-lg mb-3"
                >
                  <View className="flex-row items-center space-x-3">
                    <ProgressCircle progress={progressPercent} size={60} strokeWidth={4}>
                      <MaterialIcons name={item.icon} size={30} color="#609084" />
                    </ProgressCircle>
                    <View>
                      <Text className="font-bold text-black">
                        {item.category}
                      </Text>
                      <View className="flex-col gap-1">
                        <View className="flex-row items-center">
                          <Text className="text-sm text-[#808080] w-16">
                            Còn lại{" "}
                          </Text>
                          <Text className="font-bold text-primary">
                            {formatCurrency(item.remaining)}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Text className="text-sm text-text-gray w-16">Chi </Text>
                          <View className="flex-row items-center">
                            <Text className="font-bold text-black">
                              {formatCurrency(item.spent)}
                            </Text>
                            <Text className="text-sm text-text-gray">
                              {" / "}{formatCurrency(item.total)}
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
    </SafeAreaViewCustom>
  );
}
