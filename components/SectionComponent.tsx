import React from "react";
import { View } from "react-native";

interface SectionProps {
  children: React.ReactNode;
  rootClassName?: string;
}

const SectionComponent = (props: SectionProps) => {
  const { children, rootClassName } = props;
  return <View className={rootClassName}>{children}</View>;
};

export { SectionComponent };
