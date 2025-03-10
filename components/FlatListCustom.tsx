import React, { useCallback } from "react";
import { FlatList, FlatListProps, StyleProp, ViewStyle } from "react-native";

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
  const handleEndReached = useCallback(() => {
    onLoadMore?.();
  }, [onLoadMore, isLoading]);

  return (
    <FlatList
      {...props}
      removeClippedSubviews={true}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      contentContainerStyle={[
        { paddingBottom: isBottomTab ? 90 : 0 },
        contentContainerStyle,
      ]}
    />
  );
}
