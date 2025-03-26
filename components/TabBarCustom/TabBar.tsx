import { RootState } from "@/redux/store";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";
import { shallowEqual, useSelector } from "react-redux";
import TabBarButton from "./TabBarButton";

interface TabBarProps extends BottomTabBarProps {
  type: "main" | "group";
}

const TabBar = React.memo(
  ({ state, descriptors, navigation, type }: TabBarProps) => {
    const primaryColor = "white";
    const greyColor = "#737373";

    const { hiddenTabbar, groupRoutes } = useSelector(
      (state: RootState) => ({
        hiddenTabbar:
          type === "main" ? state.tab.mainTabHidden : state.tab.groupTabHidden,
        groupRoutes: state.tab.groupRoutes,
      }),
      shallowEqual,
    );

    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const animationConfig = {
        useNativeDriver: true,
      };

      if (hiddenTabbar) {
        Animated.timing(translateY, {
          toValue: 100,
          duration: 650,
          ...animationConfig,
        }).start();

        Animated.timing(opacity, {
          toValue: 0,
          duration: 650,
          ...animationConfig,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 650,
          ...animationConfig,
        }).start();

        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          ...animationConfig,
        }).start();
      }
    }, [hiddenTabbar]);

    const filteredRoutes = useMemo(
      () =>
        state.routes.filter(
          (route) => type === "main" || groupRoutes.includes(route.name),
        ),
      [state.routes, type, groupRoutes],
    );

    const handlePress = useCallback(
      (route: any, isFocused: boolean) => () => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      },
      [navigation],
    );

    const handleLongPress = useCallback(
      (route: any) => () => {
        navigation.emit({
          type: "tabLongPress",
          target: route.key,
        });
      },
      [navigation],
    );

    const animatedStyle = useMemo(
      () => ({
        transform: [{ translateY }],
        opacity,
      }),
      [translateY, opacity],
    );

    return (
      <Animated.View
        style={animatedStyle}
        className={`absolute bottom-5 ${
          type === "group" ? "mx-16" : "mx-8"
        } flex-row items-center justify-between rounded-full bg-white/95 px-4 py-1.5 shadow-lg transition-all duration-500`}
      >
        {filteredRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            (options.tabBarLabel as string) ?? options.title ?? route.name;

          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const isFocused = state.index === index;

          return (
            <TabBarButton
              key={route.name}
              onPress={handlePress(route, isFocused)}
              onLongPress={handleLongPress(route)}
              isFocused={isFocused}
              routeName={route.name as any}
              color={isFocused ? primaryColor : greyColor}
              label={label}
              size={isFocused ? 20 : 24}
            />
          );
        })}
      </Animated.View>
    );
  },
);

export { TabBar };
