import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export interface IButtonSwitch {
  buttonLoginName: string;
  buttonRegisterName: string;
  isStatusChange: boolean;
  onChangeStatus: any;
}

const ButtonSwitchComponent = (props: IButtonSwitch) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: props.isStatusChange ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [props.isStatusChange]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth / 2 - 8],
  });

  return (
    <View
      className="relative mb-6 h-9 w-full flex-row items-center justify-between overflow-hidden rounded-md bg-background-gray"
      onLayout={handleLayout}
    >
      <Animated.View
        style={{
          transform: [{ translateX }],
          width: containerWidth / 2,
        }}
        className="absolute z-[-1] mx-1 h-7 rounded-md bg-white py-1"
      />
      <TouchableOpacity
        className={`flex-1 items-center justify-center`}
        onPress={() => props.onChangeStatus(true)}
      >
        <Text
          className={`text-center text-text-gray ${props.isStatusChange && "py-1 font-semibold text-primary"}`}
        >
          {props.buttonLoginName}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 items-center justify-center`}
        onPress={() => props.onChangeStatus(false)}
      >
        <Text
          className={`text-center text-text-gray ${!props.isStatusChange && "py-1 font-semibold text-primary"}`}
        >
          {props.buttonRegisterName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export { ButtonSwitchComponent };
