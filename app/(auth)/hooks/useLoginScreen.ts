import { VALID_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setLoading, setShowSplash } from "@/redux/slices/loadingSlice";
import { setEmail } from "@/redux/slices/userSlice";
import {
  useGetInfoUserQuery,
  useLoginGoogleMutation,
  useLoginMutation,
} from "@/services/auth";
import { AuthRequest } from "@/types/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMessaging } from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

const useLoginScreen = () => {
  const [data, setData] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { MESSAGE_VALIDATE, MESSAGE_ERROR, MESSAGE_SUCCESS } =
    TEXT_TRANSLATE_AUTH;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE } = AUTH_SCREEN_CONSTANTS;
  const { HOME, AUTH } = PATH_NAME;
  const [loginGoogle] = useLoginGoogleMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const { refetch } = useGetInfoUserQuery();

  // validation
  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.EMAIL_REQUIRED)
      .email(MESSAGE_VALIDATE.INPUT_EMAIL),
    password: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.PASSWORD_REQUIRED)
      .min(8, MESSAGE_VALIDATE.PASSWORD_8_CHARACTERS),
  });

  const handleLogin = async (payload: AuthRequest) => {
    try {
      dispatch(setLoading(true));
      const res = await login(payload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        const jwtToken = res.data.accessToken;
        if (jwtToken) {
          const decoded: any = jwtDecode(jwtToken);
          const role =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          if (role !== VALID_ROLE.USER) {
            ToastAndroid.show(
              MESSAGE_ERROR.NOT_PERMISSION,
              ToastAndroid.CENTER,
            );
            return;
          } else {
            await Promise.all([
              AsyncStorage.setItem("accessToken", res.data.accessToken),
              AsyncStorage.setItem("refreshToken", res.data.refreshToken),
            ]);
            refetch();
            router.replace(HOME.HOME_DEFAULT as any);
            ToastAndroid.show(
              MESSAGE_SUCCESS.LOGIN_SUCCESSFUL,
              ToastAndroid.SHORT,
            );
          }
        }
      }
    } catch (err: any) {
      const error = err?.data;

      if (error?.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST) {
        ToastAndroid.show(MESSAGE_ERROR.INVALID_INFO, ToastAndroid.SHORT);
        return;
      }
      if (error?.errorCode === ERROR_CODE.INVALID_ACCOUNT) {
        ToastAndroid.show(MESSAGE_ERROR.INVALID_INFO, ToastAndroid.SHORT);
        return;
      }
      if (error?.errorCode === ERROR_CODE.ACCOUNT_BLOCKED) {
        ToastAndroid.show(MESSAGE_ERROR.ACCOUNT_BLOCKED, ToastAndroid.SHORT);
        return;
      }
      if (error?.errorCode === ERROR_CODE.ACCOUNT_NEED_CONFIRM_EMAIL) {
        dispatch(setEmail(payload.email));
        router.navigate({
          pathname: AUTH.INPUT_OTP as any,
          params: { mode: "verify" },
        });
        ToastAndroid.show(MESSAGE_ERROR.OTP_HAS_SENT, ToastAndroid.SHORT);
        return;
      }
      if (error?.errorCode === ERROR_CODE.OTP_HAS_SENT) {
        dispatch(setEmail(payload.email));
        router.navigate({
          pathname: AUTH.INPUT_OTP as any,
          params: { mode: "verify" },
        });
        ToastAndroid.show(MESSAGE_ERROR.OTP_HAS_SENT, ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
      dispatch(setShowSplash(false));
    }
  };

  const sendUserInfoToServer = async (idToken: string) => {
    dispatch(setLoading(true));

    try {
      const res = await loginGoogle(JSON.stringify(idToken)).unwrap();
      if (res && res?.status === HTTP_STATUS.SUCCESS.OK) {
        const jwtToken = res?.data?.accessToken;
        if (jwtToken) {
          const decoded: any = jwtDecode(jwtToken);
          const role =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          if (role !== VALID_ROLE.USER) {
            ToastAndroid.show(
              MESSAGE_ERROR.NOT_PERMISSION,
              ToastAndroid.CENTER,
            );
            await GoogleSignin.signOut();
            return;
          } else {
            await Promise.all([
              AsyncStorage.setItem("accessToken", res.data.accessToken),
              AsyncStorage.setItem("refreshToken", res.data.refreshToken),
            ]);
            refetch();
            router.replace(HOME.HOME_DEFAULT as any);
            ToastAndroid.show(
              MESSAGE_SUCCESS.LOGIN_SUCCESSFUL,
              ToastAndroid.SHORT,
            );
          }
        }
      }
    } catch (err: any) {
      const error = err?.data;

      if (error?.errorCode === ERROR_CODE.ACCOUNT_BLOCKED) {
        ToastAndroid.show(MESSAGE_ERROR.ACCOUNT_BLOCKED, ToastAndroid.SHORT);
        await GoogleSignin.signOut();
        return;
      }

      await GoogleSignin.signOut();
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLoginGoogle = async () => {
    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      if (userInfo?.data?.idToken) {
        await sendUserInfoToServer(userInfo.data.idToken);
      }
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  };

  const getToken = async () => {
    try {
      const token = await getMessaging().getToken();
      if (token) {
        await AsyncStorage.setItem("fcmToken", token);
      }
      return token;
    } catch (error) {
      return null;
    }
  };

  return {
    state: {
      data,
      isChecked,
      isLogin,
    },
    handler: {
      setData,
      setIsChecked,
      setIsLogin,
      loginValidationSchema,
      handleLogin,
      handleLoginGoogle,
      getToken,
    },
  };
};

export default useLoginScreen;
