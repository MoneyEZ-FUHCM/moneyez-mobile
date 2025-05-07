import { Colors } from "@/helpers/constants/color";
import { formatCurrency } from "@/helpers/libs";
import { FinancialGoal } from "@/helpers/types/financialGoal.type";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
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
    <View className="mx-4 rounded-2xl bg-white p-4">
      <View className="mb-4 border-b border-gray-100 pb-3">
        <Pressable
          className="flex-row items-center justify-between"
          onPress={onHeaderPress}
        >
          <View className="flex-row items-center space-x-2">
            <Text className="text-base font-bold text-black">
              Ngân sách chi tiêu
            </Text>
            <Pressable onPress={toggleVisibility}>
              <MaterialIcons
                name={isVisible ? "visibility" : "visibility-off"}
                size={20}
              />
            </Pressable>
          </View>
          <View className="p-1">
            <MaterialIcons name="arrow-forward-ios" size={16} />
          </View>
        </Pressable>
      </View>

      {data?.length === 0 ? (
        <View className="items-center py-6">
          <Text className="text-sm text-gray-500">Chưa có ngân sách nào</Text>
        </View>
      ) : (
        data?.map((item) => {
          const percentage = Math.min(
            item?.currentAmount / item?.targetAmount,
            1,
          );

          const progressColor = item?.isSaving
            ? percentage > 0.9
              ? Colors.colors.green
              : percentage > 0.6
                ? Colors.colors.deep_yellow
                : "red"
            : percentage > 0.9
              ? "red"
              : percentage > 0.6
                ? Colors.colors.deep_yellow
                : Colors.colors.green;

          return (
            <TouchableOpacity
              key={item?.id}
              className="mb-3 flex-row items-center rounded-xl bg-superlight/70 p-3"
              onPress={() => {}}
            >
              <View className="h-[45px] w-[45px] items-center justify-center rounded-full bg-secondary/10">
                <MaterialIcons
                  name={(item.subcategoryIcon as any) || "account-balance"}
                  size={29}
                  color={Colors.colors.primary}
                />
              </View>
              <View className="ml-3 flex-1">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text
                    numberOfLines={1}
                    className="max-w-[70%] text-base font-semibold text-gray-800"
                  >
                    {item.name}
                  </Text>
                  <Text className="text-[15px] font-bold text-gray-800">
                    {isVisible ? formatCurrency(item.targetAmount) : "*****"}
                  </Text>
                </View>
                <View className="space-y-1">
                  <Progress.Bar
                    progress={percentage}
                    width={null}
                    height={7}
                    borderRadius={4}
                    borderWidth={0}
                    color={progressColor}
                    unfilledColor={"rgba(0,0,0,0.05)"}
                    useNativeDriver={true}
                    style={{ width: "100%" }}
                  />
                  {isVisible && (
                    <View className="mt-1 flex-row items-center justify-between">
                      <Text className="text-xs text-gray-500">
                        {formatCurrency(item.currentAmount)} /{" "}
                        {formatCurrency(item.targetAmount)}
                      </Text>
                      <Text
                        className="text-sm font-bold"
                        style={{ color: progressColor }}
                      >
                        {Math.round(percentage * 100)}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

export default SpendingBudgetComponent;
