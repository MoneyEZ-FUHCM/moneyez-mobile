import { TabBar } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import "../../globals.css";
import { PATH_NAME } from "@/helpers/constants/pathname";
import * as Linking from "expo-linking";
import useGroupList from "./(group)/hooks/useGroupList";

export default function TabLayout() {
  const {
    BOTTOM_TAB_NAME: BOTTOM_TABLE_NAME,
    BOTTOM_TAB_TRANSLATE: BOTTOM_TABLE_TRANSLATE,
    CONDITION,
    ANIMATION_NAVIGATE_TAB,
  } = COMMON_CONSTANT;
  const { handler } = useGroupList();

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const { url } = event;
      if (url) {
        if (url.includes(PATH_NAME.GROUP.GROUP_LIST)) {
          await handler.handleRefetchGrouplist();
          router.push(PATH_NAME.GROUP.GROUP_LIST as any);
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url } as Linking.EventType);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} type="main" />}
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
