import React, { useCallback } from "react";
import { FlatListProps, StyleProp, Text, View, ViewStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

interface FlatListCustomProps<T> extends Readonly<FlatListProps<T>> {
  readonly contentContainerStyle?: StyleProp<ViewStyle>;
  readonly isLoading?: boolean;
  readonly onLoadMore?: () => void;
  readonly isBottomTab?: boolean;
  readonly hasMore?: boolean;
}

export function FlatListGestureCustom<T>({
  contentContainerStyle,
  isLoading = false,
  onLoadMore,
  isBottomTab = true,
  hasMore = true,
  ...props
}: FlatListCustomProps<T>) {
  const PRIMARY_COLOR = "#609084";

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      onLoadMore?.();
    }
  }, [onLoadMore, isLoading, hasMore]);

  return (
    <FlatList
      {...props}
      removeClippedSubviews={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      contentContainerStyle={[
        { paddingBottom: isBottomTab ? 80 : 0 },
        contentContainerStyle,
      ]}
      ListFooterComponent={
        isLoading && hasMore ? (
          <View className="my-5 items-center">
            <ActivityIndicator size="small" color={PRIMARY_COLOR} />
          </View>
        ) : !hasMore ? (
          <View className="my-3 items-center">
            <Text className="text-primary">Đã tải xong</Text>
          </View>
        ) : null
      }
    />
  );
}
