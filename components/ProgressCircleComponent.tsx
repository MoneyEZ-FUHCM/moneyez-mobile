import { Colors } from "@/helpers/constants/color";
import { MaterialIcons } from "@expo/vector-icons";
import { useLayoutEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

const interpolateColor = (value: number) => {
  const startColor = [255, 215, 0];
  const endColor = [255, 0, 0];

  const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * value);
  const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * value);
  const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * value);

  return `rgb(${r}, ${g}, ${b})`;
};

const ProgressCircleComponent = ({
  value = 0.8,
  size = 50,
  isSaving = true,
  iconName = "question-mark",
  iconSize = 30,
  iconColor = Colors.colors.primary,
  thickness = 4,
  showPercentage = false,
  percentageTextStyle = {},
}: {
  value: number;
  size?: number;
  isSaving?: boolean;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
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
        return prev + 0.01;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [value]);

  const animatedColor = useMemo(() => {
    return isSaving ? Colors.colors.primary : interpolateColor(progress);
  }, [progress, isSaving]);

  const animatedIconColor = useMemo(() => {
    return isSaving ? iconColor : interpolateColor(progress);
  }, [progress, isSaving, iconColor]);

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
