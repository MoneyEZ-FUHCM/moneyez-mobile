import React, { useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";

interface ScrollViewCustomProps extends ScrollViewProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ScrollViewCustom({
  children,
  contentContainerStyle,
  ...props
}: ScrollViewCustomProps) {
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(0);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const handleContentSizeChange = (
    contentWidth: number,
    contentHeight: number,
  ) => {
    setIsScrollable(contentHeight > scrollViewHeight);
  };

  return (
    <ScrollView
      {...props}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
      contentContainerStyle={[
        { paddingBottom: isScrollable ? 90 : 0, backgroundColor: "#F9F9F9" },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
