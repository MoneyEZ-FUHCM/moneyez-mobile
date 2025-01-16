import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export interface IButtonSwitch {
  buttonLoginName: string;
  buttonRegisterName: string;
  isStatusChange: boolean;
  onChangeStatus: any;
}

const ButtonSwitchComponent = (props: IButtonSwitch) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: props.isStatusChange ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [props.isStatusChange]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 168],
  });

  return (
    <View className="relative mb-6 h-9 w-full flex-row items-center justify-between overflow-hidden rounded-md bg-[#ececec]">
      <Animated.View
        style={{
          transform: [{ translateX }],
        }}
        className="absolute z-[-1] mx-1 h-7 w-1/2 rounded-md bg-superlight py-1"
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
