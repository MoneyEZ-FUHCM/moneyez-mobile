import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { Stack } from "expo-router";
import React from "react";

export default function GroupLayout() {
  const { CONDITION } = COMMON_CONSTANT;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "var(--color-primary)" },
        headerShown: CONDITION.FALSE,
      }}
    >
      <Stack.Screen />
    </Stack>
  );
}
