import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { FinancialGoal } from "@/types/financialGoal.type";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

type SpendingBudgetComponentProps = {
  data?: FinancialGoal[];
  onHeaderPress?: () => void;
}

const SpendingBudgetComponent = ({ data, onHeaderPress }: SpendingBudgetComponentProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-white p-4">
      {/* Header */}
      <SectionComponent rootClassName="mb-4">
        <Pressable
          className="flex-row items-center justify-between p-2"
          onPress={onHeaderPress}
        >
          <View className="flex-row items-center space-x-2">
            <Text className="text-lg font-semibold text-black">
              Ngân sách chi tiêu
            </Text>
            <Pressable onPress={toggleVisibility}>
              <MaterialIcons
                name={isVisible ? "visibility" : "visibility-off"}
                size={20}
                color="#000"
              />
            </Pressable>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#000" />
        </Pressable>
      </SectionComponent>

      {/* Budget category list */}
      {data?.map((item) => {
        const percentage = Math.min((item.currentAmount / item.targetAmount) * 100, 100);

        return (
          <SectionComponent key={item.id} rootClassName="mb-3">
            <Pressable
              className="p-2 border border-[#bad8b6] rounded-lg"
              onPress={() => { }}
            >
              <View className="flex-row">
                <View className="pr-3 justify-center self-stretch">
                  <MaterialIcons name={item.icon || "account-balance"} size={30} color="#609084" />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-base font-medium text-black">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-black">
                      {isVisible ? formatCurrency(item.targetAmount) : "*****"}
                    </Text>
                  </View>

                  <View className="w-full h-3 bg-[#ebefd6] rounded-full relative">
                    <View
                      className={`absolute left-0 top-0 h-full bg-[#609084] rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          </SectionComponent>
        );
      })}
    </SafeAreaViewCustom>
  );
};

export default SpendingBudgetComponent;
