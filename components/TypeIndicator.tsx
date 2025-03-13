import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    animateDot(dot1).start();

    setTimeout(() => {
      animateDot(dot2).start();
    }, 150);

    setTimeout(() => {
      animateDot(dot3).start();
    }, 300);
  }, []);

  return (
    <View className="flex-row items-center">
      <Animated.Text
        style={{
          transform: [{ translateY: dot1 }],
          fontSize: 20,
          marginHorizontal: 1,
        }}
      >
        .
      </Animated.Text>
      <Animated.Text
        style={{
          transform: [{ translateY: dot2 }],
          fontSize: 20,
          marginHorizontal: 1,
        }}
      >
        .
      </Animated.Text>
      <Animated.Text
        style={{
          transform: [{ translateY: dot3 }],
          fontSize: 20,
          marginHorizontal: 1,
        }}
      >
        .
      </Animated.Text>
    </View>
  );
};

export default TypingIndicator;
