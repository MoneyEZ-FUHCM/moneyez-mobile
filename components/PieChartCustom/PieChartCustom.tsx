import { formatCurrency } from "@/helpers/libs";
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
  planningSpent: number;
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

  console.log("check state", state.pieData);

  return (
    <SectionComponent>
      <Text className="text-lg font-bold">{title}</Text>
      <RenderTagsComponent
        pieData={state.pieData}
        onSelect={handler.handleSelectCategory}
      />
      <View className="mt-6 items-center">
        {state.selectedIndex !== null && (
          <View className="w-full flex-row justify-between bg-transparent px-2">
            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-600">Thực tế</Text>
              <Text className="text-xl font-extrabold text-primary">
                {formatCurrency(
                  state.updateData[state.selectedIndex]?.totalSpent,
                )}
              </Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-600">Dự định</Text>
              <Text className="text-xl font-extrabold text-secondary">
                {formatCurrency(
                  state.updateData[state.selectedIndex]?.planningSpent,
                )}
              </Text>
            </View>
          </View>
        )}
        <Animated.View style={state.animatedStyles.pie}>
          <PieChart
            data={state.pieData
              ?.filter((_, index) => index === state.selectedIndex)
              .flatMap((item: any) => {
                const actualPercentage = Math.round(
                  (item.totalSpent / item.planningSpent) * 100,
                );
                const plannedPercentage = 100 - actualPercentage;

                return [
                  {
                    ...item,
                    value: actualPercentage,
                    text: `${actualPercentage}%`,
                    color: "#609084",
                    textColor: "#FFFFFF",
                    focused: state.focusedSegment === "Actual",
                  },
                  {
                    ...item,
                    value: plannedPercentage,
                    text: `${plannedPercentage}%`,
                    color: "#BAD8B6",
                    textColor:
                      state.focusedSegment === "Planned"
                        ? "#000000"
                        : "#808080",

                    focused: state.focusedSegment === "Planned",
                  },
                ];
              })}
            donut
            showValuesAsLabels
            sectionAutoFocus
            animationDuration={1000}
            radius={110}
            showText
            showValuesAsTooltipText
            labelsPosition="outward"
            innerRadius={30}
            onPress={(_item: any, index: number) => handler.handlePress(index)}
          />
        </Animated.View>
      </View>
      <RenderDetailComponent pieData={state.pieData} />
    </SectionComponent>
  );
});

export { PieChartCustom };
