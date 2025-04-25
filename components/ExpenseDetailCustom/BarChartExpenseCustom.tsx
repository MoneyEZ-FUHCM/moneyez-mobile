import { Colors } from "@/helpers/constants/color";
import { formatCurrency, formatDateMonth } from "@/helpers/libs";
import { ChartDataItem } from "@/types/financialGoal.type";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SectionComponent } from "../SectionComponent";
import { useBarChart } from "./hooks/useBarChart";

interface GenericBarChartProps {
  screenWidth: number;
  budgetId: string;
}
const GRAY_COLOR = "#E7E7E7";

const BarChartExpenseCustom = React.memo(
  ({ screenWidth, budgetId }: GenericBarChartProps) => {
    const { state, handler } = useBarChart(budgetId);

    const chartData = useMemo(() => {
      return state.safeData.map((item: ChartDataItem) => {
        const isCurrent = state.isCurrentPeriod(item?.date, state.selectedType);
        return {
          value: item?.amount || 0,
          label: formatDateMonth(item?.date),
          frontColor: isCurrent ? Colors.colors.primary : GRAY_COLOR,
          opacity: isCurrent ? 1 : 0.5,
        };
      });
    }, [state.safeData, state.selectedType]);

    const renderTypeTabs = useMemo(
      () =>
        Object.entries(state.types).map(([type, label]) => {
          const isSelected = state.selectedType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => handler.setSelectedType(type as "week" | "month")}
              className={`mx-1 rounded-lg border px-6 py-0.5 ${
                isSelected
                  ? "border-primary bg-thirdly"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text
                className={`text-sm ${
                  isSelected ? "font-extrabold text-primary" : "text-black"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        }),
      [state.selectedType],
    );

    const renderTooltip = useCallback(
      (item: any) => (
        <View className="flex w-full items-center justify-center bg-white">
          <Text className="text-center text-xs">
            {formatCurrency(item?.value)}
          </Text>
        </View>
      ),
      [],
    );

    return (
      <SectionComponent
        style={{ width: screenWidth - 40 }}
        rootClassName="self-center"
      >
        <View className="mb-4 flex-row justify-start">{renderTypeTabs}</View>

        <View className="w-full overflow-hidden">
          <BarChart
            yAxisLabelTexts={state.formattedYAxisLabels}
            barWidth={40}
            spacing={18}
            noOfSections={4}
            minHeight={3}
            maxValue={state.adjustedMaxValue}
            barBorderRadius={6}
            data={chartData}
            yAxisThickness={0}
            xAxisThickness={0}
            isAnimated
            animationDuration={300}
            yAxisTextStyle={{ fontSize: 12 }}
            showYAxisIndices
            leftShiftForLastIndexTooltip={20}
            renderTooltip={renderTooltip}
          />
        </View>
      </SectionComponent>
    );
  },
);

export { BarChartExpenseCustom };
