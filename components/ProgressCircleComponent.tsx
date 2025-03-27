import { MaterialIcons } from "@expo/vector-icons";
import { useLayoutEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

const interpolateColor = (value: number, isSaving: boolean) => {
  if (isSaving) {
    const startColor = [144, 238, 144];
    const endColor = [96, 144, 132];

    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * value);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * value);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * value);

    return `rgb(${r}, ${g}, ${b})`;
  } else {
    if (value <= 0.5) return "green";
    if (value <= 0.75) return "#FFCC00";
    return "red";
  }
};

const ProgressCircleComponent = ({
  value = 0.8,
  size = 50,
  isSaving = true,
  iconName = "question-mark",
  iconSize = 30,
  thickness = 4,
  showPercentage = false,
  percentageTextStyle = {},
}: {
  value: number;
  size?: number;
  isSaving?: boolean;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  thickness?: number;
  showPercentage?: boolean;
  percentageTextStyle?: object;
}) => {
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= value) {
          clearInterval(interval);
          return value;
        }
        return prev + 0.02;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [value]);

  const animatedColor = useMemo(() => {
    return interpolateColor(progress, isSaving);
  }, [progress, isSaving]);

  const animatedIconColor = useMemo(() => {
    if (progress === 0) return "#d6d6d6";
    return interpolateColor(progress, isSaving);
  }, [progress, isSaving]);

  return (
    <View className="flex-1 items-center justify-center">
      <View
        className="relative items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Progress.Circle
          size={size}
          progress={progress}
          thickness={thickness}
          color={animatedColor}
          borderWidth={0}
          unfilledColor="#eee"
          animated={true}
        />
        {showPercentage ? (
          <Text
            style={[
              {
                position: "absolute",
                fontSize: size * 0.3,
                fontWeight: "bold",
                color: animatedIconColor,
              },
              percentageTextStyle,
            ]}
          >
            {Math.round(progress * 100)}%
          </Text>
        ) : (
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={animatedIconColor}
            style={{ position: "absolute" }}
          />
        )}
      </View>
    </View>
  );
};

export { ProgressCircleComponent };
