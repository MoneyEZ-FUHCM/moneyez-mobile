import { TabBar } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useHideTabbar from "@/hooks/useHideTabbar";
import { Tabs } from "expo-router";
import React from "react";

export default function GroupDetailTabLayout() {
  const { CONDITION, ANIMATION_NAVIGATE_TAB } = COMMON_CONSTANT;
  useHideTabbar();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} type="group" />}
      screenOptions={{
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_TAB.SHIFT,
      }}
    >
      <Tabs.Screen name="group-home" />
      <Tabs.Screen name="transaction" />
      <Tabs.Screen name="notification" />
    </Tabs>
  );
}
