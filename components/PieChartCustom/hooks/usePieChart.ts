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
  const originalConsoleLog = console.log;

  // ẩn log
  console.log = (...args) => {
    if (
      typeof args[0] === "string" &&
      ["showTooltip", "tooltipSelectedIndex"].some((prefix) =>
        args[0].startsWith(prefix),
      )
    ) {
      return;
    }
    originalConsoleLog(...args);
  };

  const highestIndex = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce(
      (maxIndex, item, index) =>
        item.percentage > data[maxIndex].percentage ? index : maxIndex,
      0,
    );
  }, [data]);

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
      data.map((item, index) => ({
        ...item,
        value: item.percentage,
        focused: index === selectedIndex,
        showTooltip: index === selectedIndex,
      })),
    [data, selectedIndex],
  );

  const handlePress = (index: number) => {
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
      pieData,
      animatedStyles,
      selectedIndex,
      isRotated,
    },
    handler: { handlePress },
  };
};
