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
  const [focusedSegment, setFocusedSegment] = useState<"Actual" | "Planned">(
    "Actual",
  );

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
        item.actualPercentage > updateData[maxIndex].actualPercentage
          ? index
          : maxIndex,
      0,
    );
  }, [updateData]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    highestIndex,
  );

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

  const pieData = useMemo(
    () =>
      updateData.map((item, index) => ({
        ...item,
        value: item.actualPercentage,
        focused: index === selectedIndex,
        showTooltip: index === selectedIndex,
      })),
    [updateData, selectedIndex],
  );

  const handleSelectCategory = (index: any) => {
    if (index === selectedIndex) return;

    setSelectedIndex(index);
    setFocusedSegment("Actual");
    labelOpacity.value = 0;
    labelOpacity.value = withTiming(1, { duration: 500 });
  };

  const handlePress = (index: number) => {
    setFocusedSegment((prev) => (prev === "Actual" ? "Planned" : "Actual"));
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
      focusedSegment,
    },
    handler: { handlePress, handleSelectCategory },
  };
};
