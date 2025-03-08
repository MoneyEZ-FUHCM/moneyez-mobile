import React, { useCallback } from "react";
import {
  FlatList,
  FlatListProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface FlatListCustomProps<T> extends Readonly<FlatListProps<T>> {
  readonly contentContainerStyle?: StyleProp<ViewStyle>;
  readonly isLoading?: boolean;
  readonly onLoadMore?: () => void;
  readonly isBottomTab?: boolean;
  readonly hasMore?: boolean;
}

export function FlatListCustom<T>({
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
      onEndReachedThreshold={0.1}
      contentContainerStyle={[
        { paddingBottom: isBottomTab ? 30 : 0 },
        contentContainerStyle,
      ]}
      ListFooterComponent={
        isLoading && hasMore ? (
          <View className="items-center">
            <ActivityIndicator size="small" color={PRIMARY_COLOR} />
          </View>
        ) : !hasMore ? (
          <View className="items-center">
            <Text className="text-primary">Đã tải xong</Text>
          </View>
        ) : null
      }
    />
  );
}
