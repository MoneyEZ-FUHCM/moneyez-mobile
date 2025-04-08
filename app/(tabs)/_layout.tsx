import { TabBar } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import * as Linking from "expo-linking";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import "../../globals.css";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useDispatch } from "react-redux";
import { addNewNotification } from "@/redux/slices/notificationSlice";

export default function TabLayout() {
  const dispatch = useDispatch();
  const {
    BOTTOM_TAB_NAME: BOTTOM_TABLE_NAME,
    BOTTOM_TAB_TRANSLATE: BOTTOM_TABLE_TRANSLATE,
    CONDITION,
    ANIMATION_NAVIGATE_TAB,
  } = COMMON_CONSTANT;

  useEffect(() => {
    const requestPermissions = async () => {
      await Notifications.requestPermissionsAsync();
    };

    requestPermissions();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    messaging().onMessage(async (remoteMessage) => {
      const notification = remoteMessage.notification;

      const title = notification?.title ?? "MoneyEz";
      const body = notification?.body ?? "Bạn có thông báo mới";

      dispatch(
        addNewNotification({
          id: remoteMessage.messageId,
          title,
          message: body,
          type: "all",
          isRead: false,
          createdDate: new Date().toISOString(),
        }),
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null,
      });
    });
  }, [dispatch]);

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const { url } = event;
      if (url) {
        if (url.includes(PATH_NAME.GROUP.GROUP_LIST)) {
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
