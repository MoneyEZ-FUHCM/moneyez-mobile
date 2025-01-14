import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { CONDITION } = COMMON_CONSTANT;
  const { AUTH } = PATH_NAME;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "var(--color-primary)" },
        headerShown: CONDITION.FALSE,
      }}
    >
      <Stack.Screen name={AUTH.LOGIN} />
      <Stack.Screen name={AUTH.INPUT_OTP} />
      <Stack.Screen name={AUTH.REGISTER} />
    </Stack>
  );
}
