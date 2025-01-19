import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { AUTH } = PATH_NAME;
  const { ANIMATION_NAVIGATE_STACK, CONDITION } = COMMON_CONSTANT;

  return (
    <Stack
      screenOptions={{
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_STACK.SLIDE_FROM_RIGHT,
      }}
    >
      <Stack.Screen name={AUTH.LOGIN} />
      <Stack.Screen name={AUTH.REGISTER} />
      <Stack.Screen name={AUTH.CONFIRM_EMAIL} />
      <Stack.Screen name={AUTH.INPUT_OTP} />
      <Stack.Screen name={AUTH.SET_NEW_PASSWORD} />
    </Stack>
  );
}
