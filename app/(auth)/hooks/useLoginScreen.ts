import { VALID_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setLoading, setShowSplash } from "@/redux/slices/loadingSlice";
import { setEmail } from "@/redux/slices/userSlice";
import { useLoginMutation } from "@/services/auth";
import { AuthRequest, GoogleSignInResponse } from "@/types/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";

const useLoginScreen = () => {
  const [data, setData] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { MESSAGE_VALIDATE, MESSAGE_ERROR } = TEXT_TRANSLATE_AUTH;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE } = AUTH_SCREEN_CONSTANTS;
  const { HOME, AUTH } = PATH_NAME;

  const [login] = useLoginMutation();
  const dispatch = useDispatch();

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
            router.replace(HOME.HOME_DEFAULT as any);
          }
        }
      }
    } catch (err: any) {
      const error = err.data;

      if (error.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST) {
        ToastAndroid.show(MESSAGE_ERROR.INVALID_INFO, ToastAndroid.SHORT);
        return;
      }
      if (error.errorCode === ERROR_CODE.INVALID_ACCOUNT) {
        ToastAndroid.show(MESSAGE_ERROR.INVALID_INFO, ToastAndroid.SHORT);
        return;
      }
      if (error.errorCode === ERROR_CODE.ACCOUNT_BLOCKED) {
        ToastAndroid.show(MESSAGE_ERROR.ACCOUNT_BLOCKED, ToastAndroid.SHORT);
        return;
      }
      if (error.errorCode === ERROR_CODE.ACCOUNT_NEED_CONFIRM_EMAIL) {
        dispatch(setEmail(payload.email));
        router.navigate({
          pathname: AUTH.INPUT_OTP as any,
          params: { mode: "verify" },
        });
        ToastAndroid.show(
          MESSAGE_ERROR.DOEST_NOT_VERIFY_EMAIL,
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
      dispatch(setShowSplash(false));
    }
  };

  const handleLoginGoogle = async () => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      const googleSignInResponse: GoogleSignInResponse = {
        idToken: userInfo.idToken ?? undefined,
        user: {
          id: userInfo.user.id,
          name: userInfo.user.name ?? "",
          email: userInfo.user.email,
          photo: userInfo.user.photo ?? "",
          familyName: userInfo.user.familyName ?? "",
          givenName: userInfo.user.givenName ?? "",
        },
        scopes: userInfo.scopes,
        serverAuthCode: userInfo.serverAuthCode ?? undefined,
      };
    } catch (err) {}
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
    },
  };
};

export default useLoginScreen;
