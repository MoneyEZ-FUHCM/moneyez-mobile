import { formatCurrency, formatDateMonth } from "@/helpers/libs";
import { ChartDataItem } from "@/types/financialGoal.type";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SectionComponent } from "../SectionComponent";
import { useBarChart } from "./hooks/useBarChart";

interface GenericBarChartProps {
  data: ChartDataItem[];
  screenWidth: number;
}

const BarChartExpenseCustom = React.memo(
  ({ data, screenWidth }: GenericBarChartProps) => {
    const { state, handler } = useBarChart();
    const PRIMARY_COLOR = "#609084";
    const GRAY_COLOR = "#E7E7E7";
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
      return amount.toString();
    };

    const maxAmount = Math.max(...data?.map((item) => item?.amount || 0));
    const adjustedMaxValue =
      maxAmount >= 1000 ? maxAmount * 1.1 : maxAmount + 100;
    const yAxisValues = Array.from(
      { length: 5 },
      (_, i) => (adjustedMaxValue / 4) * i,
    );

    const formattedYAxisLabels = yAxisValues.map(formatAmount);

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
            yAxisLabelTexts={formattedYAxisLabels}
            barWidth={40}
            spacing={18}
            noOfSections={4}
            minHeight={3}
            maxValue={adjustedMaxValue}
            barBorderRadius={6}
            data={data?.map((item) => ({
              value: item?.amount || 0,
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
            yAxisTextStyle={{ fontSize: 12 }}
            showYAxisIndices={true}
            leftShiftForLastIndexTooltip={20}
            renderTooltip={(item: any) => (
              <View className="rounded-md bg-white p-2">
                <Text className="text-sm">{formatCurrency(item?.value)}</Text>
              </View>
            )}
          />
        </View>
      </SectionComponent>
    );
  },
);

export { BarChartExpenseCustom };
