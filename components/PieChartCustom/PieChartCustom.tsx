import { formatCurrency } from "@/helpers/libs";
import { BudgetCategory } from "@/types/category.types";
import React from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Animated from "react-native-reanimated";
import { SectionComponent } from "../SectionComponent";
import { usePieChart } from "./hooks/usePieChart";

export interface PieChartData extends BudgetCategory {
  percentage: number;
  label: string;
  value: number;
  color?: string;
  id: number;
}

interface PieChartCustomProps {
  data: PieChartData[];
  title: string;
}

const RenderDetailComponent = ({ pieData }: { pieData: PieChartData[] }) => (
  <View className="mt-12 flex-row flex-wrap items-center px-1">
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
              <Text className="ml-2 text-black">{`${item?.categoryName}`}</Text>
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
            <Text className="ml-2 text-black">{`${item?.categoryName}`}</Text>
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
      <Text className="text-base font-bold">{title}</Text>
      <View className="items-center">
        <Animated.View style={state.animatedStyles.pie}>
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
            showText
            showValuesAsTooltipText
            innerRadius={100}
            centerLabelComponent={() =>
              state.selectedIndex !== null && state.isRotated ? (
                <Animated.View
                  style={state.animatedStyles.fadeIn}
                  className="items-center justify-center px-2"
                >
                  <Text className="text-2xl font-bold text-black">
                    {`${formatCurrency(state.updateData[state.selectedIndex].totalSpent)}`}
                  </Text>
                  <Text className="text-center text-sm text-text-gray">
                    {state.updateData[state.selectedIndex].categoryName}
                  </Text>
                </Animated.View>
              ) : null
            }
            onPress={(_item: any, index: number) => handler.handlePress(index)}
          />
        </Animated.View>
      </View>
      <RenderDetailComponent pieData={state.pieData} />
    </SectionComponent>
  );
});

export { PieChartCustom };
