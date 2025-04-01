import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";
import React from "react";
import "../../../globals.css";

export default function GroupLayout() {
  const { CONDITION, ANIMATION_NAVIGATE_STACK } = COMMON_CONSTANT;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "var(--color-primary)" },
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_STACK.SLIDE_FROM_RIGHT,
      }}
    >
      <Stack.Screen name={PATH_NAME.GROUP.GROUP_LIST} />
      <Stack.Screen name={PATH_NAME.GROUP.CREATE_FUNCTION_BANK_ACCOUNT} />
      <Stack.Screen name="group-details" options={{ headerShown: false }} />
    </Stack>
  );
}
