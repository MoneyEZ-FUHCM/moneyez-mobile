import React from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";

interface ScrollViewCustomProps extends ScrollViewProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  isBottomTab: boolean;
}

export function ScrollViewCustom({
  children,
  contentContainerStyle,
  isBottomTab,
  ...props
}: ScrollViewCustomProps) {
  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        { paddingBottom: isBottomTab ? 90 : 0, backgroundColor: "#F9F9F9" },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
