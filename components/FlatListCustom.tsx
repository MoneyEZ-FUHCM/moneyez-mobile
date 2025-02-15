import React, { useState } from "react";
import {
  FlatList,
  FlatListProps,
  LayoutChangeEvent,
  ViewStyle,
  StyleProp,
} from "react-native";

interface FlatListCustomProps<T> extends FlatListProps<T> {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function FlatListCustom<T>({
  contentContainerStyle,
  ...props
}: FlatListCustomProps<T>) {
  const [listHeight, setListHeight] = useState<number>(0);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setListHeight(height);
  };

  const handleContentSizeChange = (
    contentWidth: number,
    contentHeight: number,
  ) => {
    setIsScrollable(contentHeight > listHeight);
  };

  return (
    <FlatList
      {...props}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
      contentContainerStyle={[
        { paddingBottom: isScrollable ? 90 : 0, backgroundColor: "#F9F9F9" },
        contentContainerStyle,
      ]}
    />
  );
}
