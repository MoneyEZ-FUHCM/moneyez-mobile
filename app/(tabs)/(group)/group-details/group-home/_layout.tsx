import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { Stack, useLocalSearchParams } from "expo-router";
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
        name="config-group/ConfigGroup"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="create-fund/CreateFund"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
