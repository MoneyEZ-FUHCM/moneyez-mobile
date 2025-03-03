import React from "react";
import { TouchableOpacity } from "react-native";
import { Eye, EyeSlash } from "iconsax-react-native";

const VisibilityIcon = ({
  visible,
  onPress,
}: {
  visible: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="p-2">
    {visible ? (
      <Eye size="20" color="#555" variant="Outline" />
    ) : (
      <EyeSlash size="20" color="#555" variant="Outline" />
    )}
  </TouchableOpacity>
);

export default VisibilityIcon;
