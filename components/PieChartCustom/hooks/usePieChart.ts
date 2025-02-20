import { useEffect, useMemo } from "react";
import {
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

export const usePieChart = (data: PieChartData[]) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withSpring(1, { damping: 8, stiffness: 100 });
  }, []);

  const totalValue = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data],
  );

  const formattedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        percentage: ((item.value / totalValue) * 100).toFixed(2),
      })),
    [data, totalValue],
  );

  const highestData = useMemo(
    () =>
      formattedData.length
        ? formattedData.reduce(
            (max, item) =>
              parseFloat(item.percentage) > parseFloat(max.percentage)
                ? item
                : max,
            formattedData[0],
          )
        : null,
    [formattedData],
  );

  const pieData = useMemo(
    () =>
      formattedData.map((item) => ({
        ...item,
        value: parseFloat(item.percentage),
        focused: item.label === highestData?.label,
        showTooltip: item.label === highestData?.label,
      })),
    [formattedData, highestData],
  );

  return {
    state: {
      opacity,
      scale,
      pieData,
      highestData,
      formattedData,
    },
  };
};
