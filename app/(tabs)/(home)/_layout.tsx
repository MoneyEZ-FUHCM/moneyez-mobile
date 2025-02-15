import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  const { CONDITION } = COMMON_CONSTANT;
  const { HOME } = PATH_NAME;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "var(--color-primary)" },
        headerShown: CONDITION.FALSE,
      }}
    >
      <Stack.Screen name={"HomeScreen"} />
      <Stack.Screen name={HOME.INVIDUAL_HOME} />
      <Stack.Screen name={HOME.ADD_TRANSACTION} />
    </Stack>
  );
}
