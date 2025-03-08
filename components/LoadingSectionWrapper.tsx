import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingSectionWrapper = ({
  isLoading,
  children,
}: LoadingWrapperProps) => {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" className="mb-3" color="#609084" />
        <Text className="text-primary">Đang tải...</Text>
      </View>
    );
  }
  return <>{children}</>;
};

export { LoadingSectionWrapper };
