import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const SkeletonLoaderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

export { SkeletonLoaderComponent };
