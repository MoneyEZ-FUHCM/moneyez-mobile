import { formatPercentage } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

const interpolateColor = (value: number, isSaving: boolean) => {
  if (isSaving) {
    return "green";
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
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(progressRef.current);

  useEffect(() => {
    if (progressRef.current < value) {
      const timer = setInterval(() => {
        if (progressRef.current < value) {
          progressRef.current += 0.02;
          setProgress(progressRef.current);
        } else {
          clearInterval(timer);
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [value, progress]);

  const animatedColor = useMemo(
    () => interpolateColor(progress, isSaving),
    [progress, isSaving],
  );
  const animatedIconColor = progress === 0 ? "#d6d6d6" : animatedColor;
  console.log("check value123", value.toFixed(4));

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
            {/* {Math.round(progress * 100)}% */}
            {formatPercentage(value)}%{/* {(value * 100).toFixed(2)}% */}
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
