import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";
import React from "react";

export default function AccountLayout() {
  const { CONDITION, ANIMATION_NAVIGATE_STACK } = COMMON_CONSTANT;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "var(--color-primary)" },
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_STACK.SLIDE_FROM_BOTTOM,
      }}
    >
      <Stack.Screen name={PATH_NAME.ACCOUNT.ACCOUNT_SETTING} />
      <Stack.Screen name={PATH_NAME.ACCOUNT.UPDATE_INFO} />
      <Stack.Screen name={PATH_NAME.ACCOUNT.BANK_ACCOUNT} />
      <Stack.Screen name={PATH_NAME.ACCOUNT.ADD_BANK_ACCOUNT} />
    </Stack>
  );
}
