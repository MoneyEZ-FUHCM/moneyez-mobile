import React from "react";
import { View } from "react-native";

interface SpaceProps {
  width?: number;
  height?: number;
}

const SpaceComponent = ({ width, height }: SpaceProps) => {
  return <View style={{ width, height }} />;
};

export { SpaceComponent };
