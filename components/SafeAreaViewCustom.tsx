import React, { ReactNode } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SafeAreaViewCustom = ({
  children,
  rootClassName,
}: {
  children: ReactNode;
  rootClassName?: string;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className={`${rootClassName} flex-1`}
      style={{ flex: 1, paddingBottom: insets.bottom }}
    >
      {children}
    </SafeAreaView>
  );
};

export { SafeAreaViewCustom };
