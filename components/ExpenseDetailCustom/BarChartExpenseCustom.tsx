import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SectionComponent } from "../SectionComponent";
import { useBarChart } from "./hooks/useBarChart";
import { ChartDataItem, Goal } from "@/types/financialGoal.type";
import { formatDateMonth } from "@/helpers/libs";

interface GenericBarChartProps {
  data: ChartDataItem[];
  screenWidth: number;
}

const BarChartExpenseCustom = React.memo(
  ({ data, screenWidth }: GenericBarChartProps) => {
    const { state, handler } = useBarChart();
    const PRIMARY_COLOR = "#609084";
    const GRAY_COLOR = "#E7E7E7";

    return (
      <SectionComponent
        style={{ width: screenWidth - 40 }}
        rootClassName="self-center"
      >
        <View className="mb-4 flex-row justify-start">
          {Object.entries(state.types).map(([type, label]) => (
            <TouchableOpacity
              key={type}
              onPress={() => handler.handleSelectType(type as any)}
              className={`mx-1 rounded-lg border px-6 py-0.5 ${
                state.selectedType === type
                  ? "border-primary bg-thirdly"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text
                className={`text-sm ${
                  state.selectedType === type
                    ? "font-extrabold text-primary"
                    : "text-black"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="w-full overflow-hidden">
          <BarChart
            barWidth={40}
            spacing={24}
            noOfSections={3}
            minHeight={3}
            maxValue={Math.max(...data.map((item) => item.amount))}
            barBorderRadius={6}
            data={data?.map((item) => ({
              value: item?.amount,
              label: formatDateMonth(item?.date),
              frontColor: state.isCurrentPeriod(item?.date, state.selectedType)
                ? PRIMARY_COLOR
                : GRAY_COLOR,
              opacity: state.isCurrentPeriod(item?.date, state.selectedType)
                ? 1
                : 0.5,
            }))}
            yAxisThickness={0}
            xAxisThickness={0}
            isAnimated
            animationDuration={300}
          />
        </View>
      </SectionComponent>
    );
  },
);

export { BarChartExpenseCustom };
