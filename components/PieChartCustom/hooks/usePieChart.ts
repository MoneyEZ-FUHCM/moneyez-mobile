import { getRandomColor } from "@/helpers/libs";
import { useEffect, useMemo, useState } from "react";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PieChartData } from "../PieChartCustom";

export const usePieChart = (data: PieChartData[]) => {
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const [isRotated, setIsRotated] = useState(false);

  const updateData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        color: item.color ?? getRandomColor(),
      })),
    [data],
  );

  const highestIndex = useMemo(() => {
    if (updateData.length === 0) return null;
    return updateData.reduce(
      (maxIndex, item, index) =>
        item.percentage > updateData[maxIndex].percentage ? index : maxIndex,
      0,
    );
  }, [updateData]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    highestIndex,
  );

  const overSpentValue =
    selectedIndex !== null ? updateData[selectedIndex]?.overSpent || 0 : 0;
  const showOverSpent = selectedIndex !== null && overSpentValue > 0;

  const height = useSharedValue(showOverSpent ? 30 : 0);

  useEffect(() => {
    height.value = withTiming(showOverSpent ? 30 : 0, { duration: 300 });
    opacity.value = withTiming(showOverSpent ? 1 : 0, { duration: 300 });
  }, [showOverSpent]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });

    rotation.value = 0;
    labelOpacity.value = 0;
    setIsRotated(false);

    rotation.value = withTiming(360, { duration: 1000 }, () => {
      runOnJS(setIsRotated)(true);
      labelOpacity.value = withTiming(1, { duration: 500 });
    });

    if (highestIndex !== null) {
      runOnJS(setSelectedIndex)(highestIndex);
    }
  }, [highestIndex]);

  const pieDataCategory = useMemo(
    () =>
      updateData.map((item, index) => ({
        ...item,
        value: item.actualPercentage,
        focused: index === selectedIndex,
        showTooltip: index === selectedIndex,
      })),
    [updateData, selectedIndex],
  );

  const pieData = useMemo(() => {
    const totalActual = updateData.reduce(
      (sum, item) => sum + item.actualPercentage,
      0,
    );
    const remainingPercentage = 100 - totalActual;

    const additionalData =
      remainingPercentage > 0
        ? [
            {
              id: -1,
              label: "Trống",
              categoryName: "Trống",
              percentage: remainingPercentage,
              actualPercentage: remainingPercentage,
              color: "#EBF0F199",
              value: remainingPercentage,
              focused: false,
              showTooltip: true,
            },
          ]
        : [];

    return [
      ...updateData.map((item, index) => ({
        ...item,
        value: item.actualPercentage,
        focused: index === selectedIndex,
        showTooltip: index === selectedIndex,
        color:
          item.actualPercentage > item.plannedPercentage &&
          index === selectedIndex
            ? "red"
            : item.color,
      })),
      ...additionalData,
    ];
  }, [updateData, selectedIndex]);

  const handlePress = (index: number) => {
    if (index === selectedIndex || pieData[index]?.id === -1) return;

    setSelectedIndex(index);
    labelOpacity.value = 0;
    labelOpacity.value = withTiming(1, { duration: 500 });
  };

  const animatedStyles = {
    pie: useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    })),
    fadeIn: useAnimatedStyle(() => ({
      opacity: labelOpacity.value,
    })),
  };

  return {
    state: {
      opacity,
      rotation,
      labelOpacity,
      updateData,
      pieData,
      animatedStyles,
      selectedIndex,
      isRotated,
      pieDataCategory,
      overSpentValue,
      height,
    },
    handler: { handlePress },
  };
};
