import { formatCurrency } from "@/helpers/libs";
import { BudgetCategory } from "@/types/category.types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { SectionComponent } from "../SectionComponent";
import { usePieChart } from "./hooks/usePieChart";

export interface PieChartData extends BudgetCategory {
  percentage: number;
  label: string;
  value: number;
  color?: string;
  id: number;
  planningSpent: number;
  overSpent: number;
}

interface PieChartCustomProps {
  data: PieChartData[];
  title: string;
}

const RenderDetailComponent = ({ pieData }: { pieData: PieChartData[] }) => (
  <View className="mt-12 flex-row flex-wrap items-center">
    <View className="flex-1 flex-row justify-between">
      <View className="w-1/2 pr-4">
        {pieData
          ?.slice(0, Math.ceil(pieData.length / 2))
          ?.map((item, index) => (
            <View key={index} className="mb-2 flex-row items-center">
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <Text className="ml-2 text-black">{`${item?.categoryName}: ${item?.plannedPercentage}%`}</Text>
            </View>
          ))}
      </View>
      <View className="w-1/2 pl-4">
        {pieData?.slice(Math.ceil(pieData.length / 2))?.map((item, index) => (
          <View key={index} className="mb-2 flex-row items-center">
            <View
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item?.color }}
            />
            <Text className="ml-2 text-black">{`${item?.categoryName}: ${item?.plannedPercentage}%`}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const PieChartCustom = React.memo(({ data, title }: PieChartCustomProps) => {
  const { state, handler } = usePieChart(data);

  return (
    <SectionComponent>
      <Text className="text-lg font-bold text-gray-800">{title}</Text>
      <View className="mt-4 items-center">
        {state.selectedIndex !== null && (
          <View className="w-full rounded-lg bg-gray-50/60 p-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-600">
                  Thực tế
                </Text>
                <Text className="text-xl font-extrabold text-primary">
                  {formatCurrency(
                    state.updateData[state.selectedIndex]?.totalSpent,
                  )}
                </Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-sm font-medium text-gray-600">
                  Dự định
                </Text>
                <Text className="text-xl font-extrabold text-secondary">
                  {formatCurrency(
                    state.updateData[state.selectedIndex]?.planningSpent,
                  )}
                </Text>
              </View>
            </View>
            <Animated.View
              style={[
                useAnimatedStyle(() => ({
                  height: state.height.value,
                  opacity: state.opacity.value,
                  overflow: "hidden",
                })),
              ]}
            >
              <View className="mt-1 flex-row items-center">
                <MaterialIcons name="error-outline" size={16} color="red" />
                <Text className="ml-1 text-sm font-semibold text-red">
                  Vượt: {formatCurrency(state.overSpentValue)}
                </Text>
              </View>
            </Animated.View>
          </View>
        )}
        <Animated.View style={[state.animatedStyles.pie, { marginTop: 20 }]}>
          <PieChart
            data={state.pieData?.map((item: any, index: any) => ({
              ...item,
              focused: index === state.selectedIndex,
            }))}
            donut
            showGradient
            sectionAutoFocus
            animationDuration={1000}
            radius={140}
            innerRadius={90}
            showText
            showValuesAsTooltipText
            centerLabelComponent={() =>
              state.selectedIndex !== null && state.isRotated ? (
                <Animated.View
                  style={state.animatedStyles.fadeIn}
                  className="items-center justify-center px-2"
                >
                  <Text className="text-2xl font-bold text-black">
                    {formatCurrency(
                      state.updateData[state.selectedIndex].totalSpent,
                    )}
                  </Text>
                  <Text className="text-center text-sm text-gray-500">
                    {state.updateData[state.selectedIndex].categoryName}
                  </Text>
                </Animated.View>
              ) : null
            }
            onPress={(_item: any, index: number) => handler.handlePress(index)}
          />
        </Animated.View>
      </View>
      <RenderDetailComponent pieData={state.pieDataCategory} />
    </SectionComponent>
  );
});

export { PieChartCustom };
