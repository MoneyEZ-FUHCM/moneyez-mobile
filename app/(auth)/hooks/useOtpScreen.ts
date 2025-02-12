import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setLoading } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import {
  useConfirmOtpMutation,
  useResetPasswordMutation,
  useVerifyMutation,
} from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";

const useOtpScreen = () => {
  const [otpCode, setOtpCode] = useState("");
  const { AUTH, HOME } = PATH_NAME;
  const { MESSAGE_SUCCESS, MESSAGE_VALIDATE, MESSAGE_ERROR } =
    TEXT_TRANSLATE_AUTH;
  const { ERROR_CODE } = AUTH_SCREEN_CONSTANTS;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const email = useSelector((state: RootState) => state.user.email);
  const [verify] = useVerifyMutation();
  const [confirmOtp] = useConfirmOtpMutation();
  const [resetPassword] = useResetPasswordMutation();
  const dispatch = useDispatch();
  const { mode } = useLocalSearchParams();
  const VERIFY_MODE = "verify";

  const handleConfirmEmail = () => {
    router.push(AUTH.INPUT_OTP as any);
  };

  const handleSubmitOtp = async () => {
    if (otpCode.length !== 5 || !/^[0-9]+$/.test(otpCode)) {
      ToastAndroid.show(MESSAGE_VALIDATE.OTP_5_DIGITS, ToastAndroid.SHORT);
      return;
    }

    dispatch(setLoading(true));
    const payload = { email, otpCode };

    try {
      const res =
        mode === VERIFY_MODE
          ? await verify(JSON.stringify(payload)).unwrap()
          : await confirmOtp(JSON.stringify(payload)).unwrap();

      if (!res || res.status !== HTTP_STATUS.SUCCESS.OK) {
        throw new Error(SYSTEM_ERROR.SERVER_ERROR);
      }

      if (mode === VERIFY_MODE) {
        if (res?.data?.accessToken) {
          await AsyncStorage.multiSet([
            ["accessToken", res.data.accessToken],
            ["refreshToken", res.data.refreshToken],
          ]);
          router.replace(HOME.HOME_DEFAULT as any);
          ToastAndroid.show(
            MESSAGE_SUCCESS.LOGIN_SUCCESSFUL,
            ToastAndroid.SHORT,
          );
        }
      } else {
        router.push(AUTH.SET_NEW_PASSWORD as any);
      }
    } catch (err: any) {
      const error = err?.data;
      const errorMessage =
        error?.errorCode === ERROR_CODE.OTP_INVALID
          ? MESSAGE_ERROR.OTP_INVALID
          : SYSTEM_ERROR.SERVER_ERROR;

      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResendMail = async () => {
    dispatch(setLoading(true));
    try {
      const res = await resetPassword(JSON.stringify(email)).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        router.push(AUTH.INPUT_OTP as any);
        ToastAndroid.show(
          MESSAGE_SUCCESS.REQUEST_PASSWORD_SUCCESSFUL,
          ToastAndroid.SHORT,
        );
      }
    } catch (err: any) {
      const error = err.data;
      if (error.errorCode === ERROR_CODE.RESET_PASSWORD_FAILED) {
        ToastAndroid.show(
          MESSAGE_ERROR.ACCOUNT_DOES_NOT_EXIST,
          ToastAndroid.SHORT,
        );
        return;
      }
      if (error.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST) {
        ToastAndroid.show(
          MESSAGE_ERROR.ACCOUNT_DOES_NOT_EXIST,
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    state: {
      otpCode,
    },
    handler: {
      setOtpCode,
      handleConfirmEmail,
      handleSubmitOtp,
      handleResendMail,
    },
  };
};

export default useOtpScreen;
