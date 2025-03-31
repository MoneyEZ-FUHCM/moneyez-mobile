import { RootState } from "@/redux/store";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

interface LoadingWrapperProps {
  children: React.ReactNode;
  spinnerSize?: "small" | "large";
  spinnerColor?: string;
}

const LoadingWrapper = ({
  children,
  spinnerSize = "large",
  spinnerColor = "#609084",
}: LoadingWrapperProps) => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

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

export { LoadingWrapper };
