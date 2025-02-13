import { TabBar } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { Tabs } from "expo-router";
import React from "react";
import "../../globals.css";

export default function TabLayout() {
  const {
    BOTTOM_TABLE_NAME,
    BOTTOM_TABLE_TRANSLATE,
    CONDITION,
    ANIMATION_NAVIGATE_TAB,
  } = COMMON_CONSTANT;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_TAB.SHIFT,
      }}
    >
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.HOME}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.HOME,
          headerShown: CONDITION.FALSE,
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.BOT}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.BOT,
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.GROUP}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.GROUP,
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.ACCOUNT}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.ACCOUNT,
        }}
      />
    </Tabs>
  );
}
