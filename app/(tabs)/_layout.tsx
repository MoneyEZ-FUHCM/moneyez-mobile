import { IconSymbol } from "@/components/ui/IconSymbol";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { Tabs } from "expo-router";
import React from "react";
import "../../globals.css";

export default function TabLayout() {
  const { BOTTOM_TABLE_NAME, BOTTOM_TABLE_TRANSLATE, CONDITION } =
    COMMON_CONSTANT;

  return (
    <Tabs
      screenOptions={{
        // animation: ANIMATION_NAVIGATE_TAB.SHIFT,
        headerShown: CONDITION.FALSE,
      }}
    >
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.HOME}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.HOME,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.BOT}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.BOT,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.GROUP}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.GROUP,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TABLE_NAME.ACCOUNT}
        options={{
          title: BOTTOM_TABLE_TRANSLATE.ACCOUNT,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
