import { BudgetCategory } from "@/types/category.types";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Animated from "react-native-reanimated";
import { SectionComponent } from "../SectionComponent";
import { usePieChart } from "./hooks/usePieChart";

export interface PieChartData extends BudgetCategory {
  focused?: any;
  actualPercentage: number;
  plannedPercentage: number;
  categoryName: string;
  totalSpent: number;
  color?: string;
  id: number;
}

interface PieChartCustomProps {
  data: PieChartData[];
  title: string;
}

const RenderTagsComponent = ({
  pieData,
  onSelect,
}: {
  pieData: PieChartData[];
  onSelect: (index: number) => void;
}) => (
  <View className="mt-4 flex-row items-center">
    <FlatList
      removeClippedSubviews={false}
      horizontal
      data={pieData}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <Text
          className={`m-1 rounded-full px-3 py-1 text-sm font-medium ${
            item?.focused
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onPress={() => onSelect(index)}
        >
          {item?.categoryName}
        </Text>
      )}
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

const PieChartCustom = React.memo(({ data, title }: PieChartCustomProps) => {
  const { state, handler } = usePieChart(data);

  return (
    <SectionComponent>
      <Text className="text-lg font-bold">{title}</Text>
      <RenderTagsComponent
        pieData={state.pieData}
        onSelect={handler.handleSelectCategory}
      />
      <View className="mt-6 items-center">
        <Animated.View style={state.animatedStyles.pie}>
          <PieChart
            data={state.pieData
              ?.filter((_, index) => index === state.selectedIndex)
              .flatMap((item: any) => {
                const totalPercentage =
                  item.actualPercentage + item.plannedPercentage;
                const actualPercentageNormalized =
                  (item.actualPercentage / totalPercentage) * 100;
                const plannedPercentageNormalized =
                  (item.plannedPercentage / totalPercentage) * 100;
                return [
                  {
                    ...item,
                    value: actualPercentageNormalized,
                    label: "Actual",
                    color: "#BAD8B6",
                    focused: state.focusedSegment === "Actual",
                  },
                  {
                    ...item,
                    value: plannedPercentageNormalized,
                    label: "Planned",
                    color: "#609084",
                    focused: state.focusedSegment === "Planned",
                  },
                ];
              })}
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
                  <Text className="mb-1 text-lg font-bold text-text-gray">
                    {state.focusedSegment === "Actual" ? "Thực tế" : "Dự định"}
                  </Text>
                  <Text className="text-3xl font-bold text-black">
                    {state.focusedSegment === "Actual"
                      ? `${state.updateData[state.selectedIndex]?.actualPercentage}%`
                      : `${state.updateData[state.selectedIndex]?.plannedPercentage}%`}
                  </Text>

                  <Text className="mt-1 text-center text-sm text-gray-500">
                    {state.updateData[state.selectedIndex].categoryName}
                  </Text>
                </Animated.View>
              ) : null
            }
            onPress={(_item: any, index: number) => handler.handlePress(index)}
          />
        </Animated.View>
      </View>
    </SectionComponent>
  );
});

export { PieChartCustom };
