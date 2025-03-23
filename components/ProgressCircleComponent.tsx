import { Colors } from "@/helpers/constants/color";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as Progress from "react-native-progress";

const ProgressCircleComponent = ({
  value = 0.8,
  size = 50,
  color = Colors.colors.primary,
  iconName = "question-mark",
  iconSize = 30,
  iconColor = Colors.colors.primary,
  thickness = 4,
}: {
  value: number;
  size?: number;
  color?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  thickness?: number;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= value) {
          clearInterval(interval);
          return value;
        }
        return prev + 0.07;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [value]);

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
          color={color}
          borderWidth={0}
          unfilledColor="#eee"
          animated={true}
        />
        <MaterialIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={{ position: "absolute" }}
        />
      </View>
    </View>
  );
};

export { ProgressCircleComponent };
