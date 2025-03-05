import { appInfo } from "@/helpers/constants/appInfos";
import React from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface BarChartData {
  value: number;
  label: string;
}

interface BarChartCustomProps {
  data: BarChartData[];
}

const BarChartCustom = React.memo(({ data }: BarChartCustomProps) => {
  const currentDateIndex = new Date().getDay();
  const dow = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const screenWidth = appInfo.sizes.WIDTH;

  return (
    <View style={{ width: screenWidth - 40 }} className="self-center">
      <BarChart
        barWidth={30}
        spacing={16}
        noOfSections={3}
        barBorderRadius={6}
        data={data.map((item) => ({
          ...item,
          frontColor:
            item.label === dow[currentDateIndex] ? "#609084" : "#E7E7E7",
          opacity: item.label === dow[currentDateIndex] ? 1 : 0.5,
        }))}
        yAxisThickness={0}
        xAxisThickness={0}
        isAnimated
        animationDuration={300}
      />
    </View>
  );
});

export { BarChartCustom };
