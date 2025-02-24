import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { usePieChart } from "./hooks/usePieChart";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartCustomProps {
  data: PieChartData[];
  title: string;
}

const PieChartCustom = React.memo(({ data, title }: PieChartCustomProps) => {
  const { state } = usePieChart(data);
  const { opacity, scale, pieData, highestData, formattedData } = state;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedPieStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderDot = (color: string) => (
    <View
      className="mr-2 h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );

  const renderDetailComponent = useMemo(
    () => (
      <View className="mt-3 flex-row flex-wrap justify-between px-1">
        {formattedData.map((item, index) => (
          <View key={index} className="mb-2 flex-row items-center">
            {renderDot(item.color)}
            <Text className="text-black">{`${item.label}: ${item.percentage}%`}</Text>
          </View>
        ))}
      </View>
    ),
    [formattedData],
  );

  return (
    <Animated.View style={animatedContainerStyle}>
      <Text className="text-base font-bold">{title}</Text>
      <View className="items-center">
        <Animated.View style={animatedPieStyle}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            animationDuration={1000}
            radius={120}
            showTooltip
            innerRadius={60}
            centerLabelComponent={() =>
              highestData?.percentage !== undefined ? (
                <View className="items-center justify-center">
                  <Text className="text-2xl font-bold text-black">
                    {highestData?.percentage
                      ? `${highestData.percentage}%`
                      : ""}
                  </Text>
                  <Text className="text-base text-black">
                    {highestData?.label || ""}
                  </Text>
                </View>
              ) : null
            }
          />
        </Animated.View>
      </View>
      {renderDetailComponent}
    </Animated.View>
  );
});

export { PieChartCustom };
