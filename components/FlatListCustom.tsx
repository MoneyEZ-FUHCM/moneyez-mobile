import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  FlatListProps,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

interface FlatListCustomProps<T> extends Readonly<FlatListProps<T>> {
  readonly contentContainerStyle?: StyleProp<ViewStyle>;
  readonly isLoading?: boolean;
  readonly onLoadMore?: () => void;
  readonly isBottomTab?: boolean;
}

export function FlatListCustom<T>({
  contentContainerStyle,
  isLoading = false,
  onLoadMore,
  isBottomTab = true,
  ...props
}: FlatListCustomProps<T>) {
  const [listHeight, setListHeight] = useState<number>(0);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setListHeight(height);
  };

  const handleContentSizeChange = (contentHeight: number) => {
    setIsScrollable(contentHeight < listHeight);
  };

  const handleEndReached = useCallback(() => {
    const now = Date.now();
    if (!isLoading && onLoadMore && now - lastCallTimeRef.current > 1000) {
      lastCallTimeRef.current = now;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onLoadMore?.();
      }, 2000);
    }
  }, [isLoading, onLoadMore]);

  return (
    <FlatList
      {...props}
      removeClippedSubviews={false}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      contentContainerStyle={[
        { paddingBottom: isScrollable && isBottomTab ? 90 : 0 },
        contentContainerStyle,
      ]}
    />
  );
}
