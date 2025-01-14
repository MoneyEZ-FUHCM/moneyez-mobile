import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeAreaViewCustom = ({
  children,
  rootClassName,
}: {
  children: ReactNode;
  rootClassName?: string;
}) => {
  return (
    <SafeAreaView className={`${rootClassName} flex-1`}>
      {children}
    </SafeAreaView>
  );
};

export { SafeAreaViewCustom };
