import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerSize?: "small" | "large";
  spinnerColor?: string;
}

const LoadingWrapper = ({
  isLoading,
  children,
  spinnerSize = "large",
  spinnerColor = "#609084",
}: LoadingWrapperProps) => {
  return (
    <View style={styles.wrapper}>
      {children}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size={spinnerSize} color={spinnerColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingWrapper;
