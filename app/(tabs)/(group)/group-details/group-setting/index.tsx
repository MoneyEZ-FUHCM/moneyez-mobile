import { Redirect } from "expo-router";
import { PATH_NAME } from "@/helpers/constants/pathname";

export default function GroupSettingIndex() {
  return (
    <Redirect href={PATH_NAME.GROUP_SETTING.GROUP_SETTING_DEFAULT as any} />
  );
}
