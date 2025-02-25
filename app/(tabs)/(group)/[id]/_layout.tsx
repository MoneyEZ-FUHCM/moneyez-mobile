import { Tabs } from "expo-router";
import { TabBar } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import React from "react";
import useHideTabbar from "@/hooks/useHideTabbar";

export default function GroupDetailLayout() {
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
      <Tabs.Screen name="ConfigGroup" options={{ title: "Trang chủ" }} />
      <Tabs.Screen name="Transaction" options={{ title: "tra" }} />
      <Tabs.Screen name="Notification" options={{ title: "noti" }} />
    </Tabs>
  );
}
