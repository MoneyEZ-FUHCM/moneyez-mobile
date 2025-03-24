import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";
import React from "react";

export default function ConfigGroupLayout() {
  const { CONDITION, ANIMATION_NAVIGATE_STACK } = COMMON_CONSTANT;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "var(--color-primary)" },
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_STACK.SLIDE_FROM_RIGHT,
      }}
    >
      <Stack.Screen
        name={PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PATH_NAME.GROUP_HOME.CREATE_FUND_REQUEST}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PATH_NAME.GROUP_HOME.FUND_REQUEST_INFO}
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
