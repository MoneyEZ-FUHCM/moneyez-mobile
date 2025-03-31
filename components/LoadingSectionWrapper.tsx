import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  rootClassName?: string;
}

const LoadingSectionWrapper = ({
  isLoading,
  children,
  rootClassName = "",
}: LoadingWrapperProps) => {
  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${rootClassName}`}>
        <ActivityIndicator size="large" className="mb-3" color="#609084" />
        <Text className="text-primary">Đang tải...</Text>
      </View>
    );
  }
  return <View className={rootClassName}>{children}</View>;
};

export { LoadingSectionWrapper };
