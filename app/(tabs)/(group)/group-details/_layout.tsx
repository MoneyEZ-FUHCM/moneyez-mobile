import { TabBar } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useHideTabbar from "@/hooks/useHideTabbar";
import { Tabs } from "expo-router";
import React from "react";
import useGroupHomeDefault from "./group-home/group-home-default/hooks/useGroupHomeDefault";

export default function GroupDetailTabLayout() {
  const {
    CONDITION,
    ANIMATION_NAVIGATE_TAB,
    BOTTOM_TAB_TRANSLATE,
    BOTTOM_TAB_NAME,
  } = COMMON_CONSTANT;
  useHideTabbar();
  const {
    state: { groupId },
  } = useGroupHomeDefault();

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
        initialParams={{ groupId }}
      />
      <Tabs.Screen
        name={BOTTOM_TAB_NAME.TRANSACTION}
        options={{
          title: BOTTOM_TAB_TRANSLATE.TRANSACTION,
        }}
        initialParams={{ groupId }}
      />
      <Tabs.Screen
        name={BOTTOM_TAB_NAME.MEMBER}
        options={{
          title: BOTTOM_TAB_TRANSLATE.MEMBER,
        }}
        initialParams={{ groupId }}
      />
      <Tabs.Screen
        name={BOTTOM_TAB_NAME.GROUP_SETTING}
        options={{
          title: BOTTOM_TAB_TRANSLATE.SETTING,
        }}
        initialParams={{ groupId }}
      />
    </Tabs>
  );
}
