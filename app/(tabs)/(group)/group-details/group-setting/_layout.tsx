import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";
import React from "react";

export default function GroupSettingLayout() {
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
        name={PATH_NAME.GROUP_SETTING.GROUP_SETTING_DEFAULT}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PATH_NAME.GROUP_SETTING.GROUP_RATIO_MEMBER}
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
