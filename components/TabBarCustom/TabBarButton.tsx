import React, { memo, useEffect } from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { icons } from "@/assets/icons/icons";
import { AntDesign } from "@expo/vector-icons";

type RouteName = keyof typeof icons;

interface TabBarButtonProps extends PressableProps {
  isFocused: boolean;
  label: string;
  routeName: RouteName;
  color: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  isFocused,
  label,
  routeName,
  color,
  ...props
}) => {
  const animatedScale = useDerivedValue(() => {
    return withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 80,
    });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(animatedScale.value, [0, 1], [1, 1.4]) }],
    top: interpolate(animatedScale.value, [0, 1], [0, 8]),
    backgroundColor: interpolateColor(
      animatedScale.value,
      [0, 1],
      ["transparent", "#609084"],
    ),
    borderRadius: interpolate(animatedScale.value, [0, 1], [0, 100]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedScale.value, [0, 1], [1, 0]),
  }));

  return (
    <Pressable {...props} className="flex-1 items-center justify-center">
      <Animated.View
        style={[
          animatedIconStyle,
          {
            width: 35,
            height: 35,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        {icons[routeName] ? (
          icons[routeName]({ color })
        ) : (
          <AntDesign name="questioncircleo" size={26} color={color} />
        )}
      </Animated.View>

      <Animated.Text
        className="text-[11px]"
        style={[{ color }, animatedTextStyle]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default memo(TabBarButton);
