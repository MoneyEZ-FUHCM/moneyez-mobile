import TEXT_TRANSLATE_AUTH from "@/app/(auth)/AuthScreen.translate";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { clearUserInfo } from "@/redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

const useLogout = () => {
  const dispatch = useDispatch();
  const { SYSTEM_ERROR } = COMMON_CONSTANT;

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await GoogleSignin.signOut();
      dispatch(clearUserInfo());
      ToastAndroid.show(
        TEXT_TRANSLATE_AUTH.MESSAGE_SUCCESS.LOGOUT_SUCCESS,
        ToastAndroid.SHORT,
      );
      router.replace(PATH_NAME.AUTH.LOGIN as any);
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  };

  return { handleLogout };
};

export default useLogout;
