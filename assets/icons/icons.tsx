import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const icons = {
  "(home)": (props: { color: string }) => (
    <AntDesign name="home" size={24} {...props} />
  ),
  "(bot)": (props: { color: string }) => (
    <FontAwesome6 name="snapchat" size={24} {...props} />
  ),
  "(group)": (props: { color: string }) => (
    <AntDesign name="team" size={24} {...props} />
  ),
  "(account)": (props: { color: string }) => (
    <MaterialCommunityIcons
      name="account-circle-outline"
      size={24}
      {...props}
    />
  ),
  ConfigGroup: (props: { color: string }) => (
    <AntDesign name="home" size={24} {...props} />
  ),
};
