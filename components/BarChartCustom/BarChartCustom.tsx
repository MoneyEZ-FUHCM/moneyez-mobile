import React from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SectionComponent } from "../SectionComponent";

interface DataItem {
  categoryName: string;
  actualPercentage: number;
  plannedPercentage: number;
}

interface GenericBarChartProps {
  data: DataItem[];
  screenWidth: number;
}

const BarChartCustom = React.memo(
  ({ data, screenWidth }: GenericBarChartProps) => {
    const PRIMARY_COLOR = "#609084";
    const SECONDARY_COLOR = "#E7E7E7";

    const formattedData = data.flatMap((item) => [
      {
        value: item.plannedPercentage,
        frontColor: SECONDARY_COLOR,
        spacing: 5,
        label: item.categoryName,
      },
      {
        value: item.actualPercentage,
        frontColor: PRIMARY_COLOR,
        spacing: 21,
        label: "",
      },
    ]);
    const chartWidth = 337;
    const numBars = formattedData.length;
    const spacing = 10;
    const barWidth = (chartWidth - (numBars + 3) * spacing) / numBars;
    return (
      <SectionComponent
        style={{ width: screenWidth - 40 }}
        rootClassName="self-center"
      >
        <View className="mb-4 flex-row justify-center">
          <View className="mr-4 flex-row items-center">
            <View className="mr-2 h-4 w-4 bg-gray-400" />
            <Text className="text-xs">Kế hoạch</Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-2 h-4 w-4 bg-primary" />
            <Text className="text-xs">Thực tế</Text>
          </View>
        </View>

        <BarChart
          width={chartWidth}
          barWidth={barWidth}
          spacing={spacing}
          noOfSections={5}
          barBorderRadius={4}
          data={formattedData}
          yAxisThickness={0}
          xAxisThickness={0}
          isAnimated
          animationDuration={300}
          xAxisLabelTextStyle={{
            fontSize: 10,
            textAlign: "center",
            width: 50,
            flexWrap: "wrap",
          }}
          xAxisTextNumberOfLines={2}
        />
      </SectionComponent>
    );
  },
);

export { BarChartCustom };
