import { Colors } from "@/helpers/constants/color";
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
  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      onLoadMore?.();
    }
  }, [onLoadMore, isLoading, hasMore]);

  return (
    <FlatList
      {...props}
      removeClippedSubviews={true}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      contentContainerStyle={[
        { paddingBottom: isBottomTab ? 80 : 0 },

        contentContainerStyle,
      ]}
      ListFooterComponent={
        isLoading && hasMore ? (
          <View className="my-5 items-center">
            <ActivityIndicator size="small" color={Colors.colors.primary} />
          </View>
        ) : !hasMore && (props.data?.length ?? 0) > 0 ? (
          <View className="my-3 items-center"></View>
        ) : null
      }
    />
  );
}
