import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SectionComponent } from "../SectionComponent";
import { useBarChart } from "./hooks/useBarChart";
import { Colors } from "@/helpers/constants/color";

interface DataItem {
  [key: string]: number | string;
  label: string;
}

interface GenericBarChartProps {
  data: DataItem[];
  categories: string[];
  screenWidth: number;
}

const BarChartCustom = React.memo(
  ({ data, categories, screenWidth }: GenericBarChartProps) => {
    const { state, handler } = useBarChart(categories);
    const GRAY_COLOR = "#E7E7E7";

    return (
      <SectionComponent
        style={{ width: screenWidth - 40 }}
        rootClassName="self-center"
      >
        <View className="mb-4 flex-row justify-end">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => handler.handleSelectCategory(category)}
              className={`mx-2 rounded-lg px-2 py-2 ${
                state.selectedCategory === category
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}
            >
              <Text className="text-xs text-white">
                {category.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <BarChart
          barWidth={30}
          spacing={16}
          noOfSections={3}
          barBorderRadius={6}
          data={data.map((item) => ({
            value:
              typeof item[state.selectedCategory] === "number"
                ? (item[state.selectedCategory] as number)
                : 0,
            label: item.label,
            frontColor:
              item.label === state.dow[state.currentDateIndex]
                ? Colors.colors.primary
                : GRAY_COLOR,
            opacity: item.label === state.dow[state.currentDateIndex] ? 1 : 0.5,
          }))}
          yAxisThickness={0}
          xAxisThickness={0}
          isAnimated
          animationDuration={300}
        />
      </SectionComponent>
    );
  },
);

export { BarChartCustom };
