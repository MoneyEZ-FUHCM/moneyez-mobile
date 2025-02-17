import { RootState } from "@/redux/store";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useSelector } from "react-redux";
import TabBarButton from "./TabBarButton";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const primaryColor = "#609084";
  const greyColor = "#737373";
  const hiddenTabbar = useSelector(
    (state: RootState) => state.tab.hiddenTabbar,
  );

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: hiddenTabbar ? 100 : 0,
      duration: 650,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: hiddenTabbar ? 0 : 1,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, [hiddenTabbar]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
      className="absolute bottom-5 mx-5 flex-row items-center justify-between rounded-full bg-white/95 px-4 py-1.5 shadow-lg transition-all duration-500"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title !== undefined
              ? options.title
              : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name as any}
            color={isFocused ? primaryColor : greyColor}
            label={label}
          />
        );
      })}
    </Animated.View>
  );
};

export { TabBar };
