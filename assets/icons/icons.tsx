import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const icons = {
  "(home)": (props: { color: string }) => (
    <AntDesign name="home" size={26} {...props} />
  ),
  "(bot)": (props: { color: string }) => (
    <FontAwesome6 name="snapchat" size={26} {...props} />
  ),
  "(group)": (props: { color: string }) => (
    <AntDesign name="team" size={26} {...props} />
  ),
  "(account)": (props: { color: string }) => (
    <MaterialCommunityIcons
      name="account-circle-outline"
      size={26}
      {...props}
    />
  ),
};
