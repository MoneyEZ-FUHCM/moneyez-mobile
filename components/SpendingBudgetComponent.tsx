import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency } from "@/helpers/libs";
import { FinancialGoal } from "@/types/financialGoal.type";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Progress from "react-native-progress";

type SpendingBudgetComponentProps = {
  data?: FinancialGoal[];
  onHeaderPress?: () => void;
};

const SpendingBudgetComponent = ({
  data,
  onHeaderPress,
}: SpendingBudgetComponentProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <SafeAreaViewCustom rootClassName="p-4 bg-white mx-5 rounded-[10px]">
      {/* Header */}
      <SectionComponent rootClassName="mb-3.5">
        <Pressable
          className="flex-row items-center justify-between"
          onPress={onHeaderPress}
        >
          <View className="flex-row items-center space-x-2">
            <Text className="text-base font-semibold text-black">
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
        const percentage = Math.min(item?.currentAmount / item?.targetAmount);
        return (
          <SectionComponent key={item?.id} rootClassName="mb-3">
            <Pressable
              className="rounded-lg border border-[#bad8b6] p-2"
              onPress={() => {}}
            >
              <View className="flex-row">
                <View className="justify-center self-stretch pr-3">
                  <MaterialIcons
                    name={(item.subcategoryIcon as any) || "account-balance"}
                    size={30}
                    color="#609084"
                  />
                </View>
                <View className="flex-1">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-sm text-black">{item.name}</Text>
                    <Text className="text-sm text-black">
                      {isVisible ? formatCurrency(item.targetAmount) : "*****"}
                    </Text>
                  </View>
                  <Progress.Bar
                    progress={percentage}
                    className="w-full"
                    width={300}
                    height={7.5}
                    borderRadius={100}
                    borderWidth={0}
                    color={Colors.colors.primary}
                    unfilledColor={Colors.colors.light}
                    useNativeDriver={true}
                  />
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
