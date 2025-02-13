import TEXT_TRANSLATE_AUTH from "@/app/(auth)/AuthScreen.translate";
import { PATH_NAME } from "@/helpers/constants/pathname";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";

const { MESSAGE_SUCCESS } = TEXT_TRANSLATE_AUTH;
export const handleLogout = async () => {
  await AsyncStorage.clear();
  router.replace(PATH_NAME.AUTH.LOGIN as any);
  ToastAndroid.show(MESSAGE_SUCCESS.LOGOUT_SUCCESS, ToastAndroid.CENTER);
};
