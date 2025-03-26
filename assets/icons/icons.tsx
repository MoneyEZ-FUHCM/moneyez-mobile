import {
  AntDesign,
  Feather,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export const icons = {
  "(home)": (props: { color: string; size: number }) => (
    <AntDesign name="home" {...props} />
  ),
  "(bot)": (props: { color: string; size: number }) => (
    <FontAwesome6 name="snapchat" {...props} />
  ),
  "(group)": (props: { color: string; size: number }) => (
    <AntDesign name="team" {...props} />
  ),
  "(account)": (props: { color: string; size: number }) => (
    <MaterialCommunityIcons name="account-circle-outline" {...props} />
  ),
  "group-home": (props: { color: string; size: number }) => (
    <AntDesign name="home" {...props} />
  ),
  member: (props: { color: string; size: number }) => (
    <Feather name="users" {...props} />
  ),
  "group-setting": (props: { color: string; size: number }) => (
    <AntDesign name="setting" {...props} />
  ),
};
