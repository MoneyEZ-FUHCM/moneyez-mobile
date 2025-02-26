import { TabBar } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useHideTabbar from "@/hooks/useHideTabbar";
import { Tabs } from "expo-router";
import React from "react";

export default function GroupDetailTabLayout() {
  const {
    CONDITION,
    ANIMATION_NAVIGATE_TAB,
    BOTTOM_TAB_TRANSLATE,
    BOTTOM_TAB_NAME,
  } = COMMON_CONSTANT;
  useHideTabbar();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} type="group" />}
      screenOptions={{
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_TAB.SHIFT,
      }}
    >
      <Tabs.Screen
        name={BOTTOM_TAB_NAME.GROUP_HOME}
        options={{
          title: BOTTOM_TAB_TRANSLATE.GROUP_HOME,
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TAB_NAME.TRANSACTION}
        options={{
          title: BOTTOM_TAB_TRANSLATE.TRANSACTION,
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TAB_NAME.MEMBER}
        options={{
          title: BOTTOM_TAB_TRANSLATE.MEMBER,
        }}
      />
      <Tabs.Screen
        name={BOTTOM_TAB_NAME.SETTING}
        options={{
          title: BOTTOM_TAB_TRANSLATE.SETTING,
        }}
      />
    </Tabs>
  );
}
