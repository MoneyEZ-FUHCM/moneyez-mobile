import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { useLoginMutation } from "@/services/auth";
import { AuthRequest } from "@/types/auth.types";
import { useState } from "react";
import { ToastAndroid } from "react-native";
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

  const [login, { isLoading }] = useLoginMutation();

  // validation
  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .required(MESSAGE_VALIDATE.INPUT_REQUIRED)
      .email(MESSAGE_VALIDATE.INPUT_EMAIL),
    password: Yup.string()
      .required(MESSAGE_VALIDATE.PASSWORD_REQUIRED)
      .min(8, MESSAGE_VALIDATE.PASSWORD_8_CHARACTERS),
  });

  const handleLogin = async (payload: AuthRequest) => {
    try {
      const res = await login(payload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        // router.replace("/home");
      }
    } catch (err: any) {
      const error = err.data;
      if (
        error.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED &&
        error.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST
      ) {
        ToastAndroid.show(MESSAGE_ERROR.ACCOUNT_NOT_EXISTS, ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  };

  const handleLoginGoogle = () => {
    console.log("login google");
  };

  return {
    state: {
      data,
      isChecked,
      isLogin,
      isLoading,
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
