import React from "react";
import { View, ViewStyle } from "react-native";

interface SectionProps {
  children: React.ReactNode;
  rootClassName?: string;
  style?: ViewStyle;
}

const SectionComponent = (props: SectionProps) => {
  const { children, rootClassName, style } = props;
  return (
    <View className={rootClassName} style={style}>
      {children}
    </View>
  );
};

export { SectionComponent };
