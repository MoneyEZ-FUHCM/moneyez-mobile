import React, { useEffect } from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
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
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.4]) }],
    top: interpolate(scale.value, [0, 1], [0, 8]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0, 1], [1, 0]),
  }));

  return (
    <Pressable {...props} className="flex-1 items-center justify-center gap-1">
      <Animated.View style={animatedIconStyle}>
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

export default TabBarButton;
