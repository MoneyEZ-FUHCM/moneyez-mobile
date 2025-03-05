import React from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Animated from "react-native-reanimated";
import { usePieChart } from "./hooks/usePieChart";
import { formatCurrency } from "@/helpers/libs";

export interface PieChartData {
  percentage: number;
  label: string;
  value: number;
  color: string;
  id: number;
}

interface PieChartCustomProps {
  data: PieChartData[];
  title: string;
}

const RenderDetailComponent = ({ pieData }: { pieData: PieChartData[] }) => (
  <View className="mt-3 flex-row flex-wrap justify-between px-1">
    {pieData.map((item) => (
      <View key={item.id} className="mb-2 flex-row items-center">
        <View
          className="mr-2 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <Text className="text-black">{`${item.label}: ${item.percentage}%`}</Text>
      </View>
    ))}
  </View>
);

const PieChartCustom = React.memo(({ data, title }: PieChartCustomProps) => {
  const { state, handler } = usePieChart(data);

  return (
    <View>
      <Text className="text-base font-bold">{title}</Text>
      <View className="items-center">
        <Animated.View style={state.animatedStyles.pie}>
          <PieChart
            data={state.pieData.map((item: any, index: any) => ({
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
                    {`${formatCurrency(data[state.selectedIndex].value)}`}
                  </Text>
                  <Text className="text-center text-sm text-text-gray">
                    {data[state.selectedIndex].label}
                  </Text>
                </Animated.View>
              ) : null
            }
            onPress={(_item: any, index: number) => handler.handlePress(index)}
          />
        </Animated.View>
      </View>
      <RenderDetailComponent pieData={state.pieData} />
    </View>
  );
});

export { PieChartCustom };
