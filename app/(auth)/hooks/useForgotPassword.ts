import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ToastAndroid } from "react-native";
import * as Yup from "yup";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";

const useForgotPassword = () => {
  const [otp, setOtp] = useState("");
  const { AUTH } = PATH_NAME;
  const { MESSAGE_SUCCESS, MESSAGE_VALIDATE } = TEXT_TRANSLATE_AUTH;
  const { FORM_NAME } = AUTH_SCREEN_CONSTANTS;

  // validation
  const validationChangePasswordSchema = Yup.object({
    password: Yup.string()
      .required(MESSAGE_VALIDATE.PASSWORD_REQUIRED)
      .min(8, MESSAGE_VALIDATE.PASSWORD_8_CHARACTERS),
    confirmPassword: Yup.string()
      .required(MESSAGE_VALIDATE.CONFIRM_PASSWORD_REQUIRED)
      .oneOf(
        [Yup.ref(FORM_NAME.PASSWORD)],
        MESSAGE_VALIDATE.PASSWORDS_MUST_MATCH,
      ),
  });

  const validationConfirmEmailSchema = Yup.object({
    email: Yup.string()
      .required(MESSAGE_VALIDATE.INPUT_REQUIRED)
      .email(MESSAGE_VALIDATE.INPUT_EMAIL),
  });

  const handleConfirmEmail = () => {
    router.push(AUTH.INPUT_OTP as any);
  };

  const handleChangePassword = () => {
    router.replace(AUTH.LOGIN as any);
    ToastAndroid.show(MESSAGE_SUCCESS.REGISTER_SUCCESS, ToastAndroid.SHORT);
  };

  const handleSubmitOtp = useCallback(() => {
    if (otp.length !== 5 || !/^[0-9]+$/.test(otp)) {
      ToastAndroid.show(MESSAGE_VALIDATE.OTP_5_DIGITS, ToastAndroid.SHORT);
      return;
    }
    router.push(AUTH.SET_NEW_PASSWORD as any);
  }, [otp]);

  return {
    state: {
      otp,
    },
    handler: {
      setOtp,
      handleConfirmEmail,
      handleChangePassword,
      validationChangePasswordSchema,
      validationConfirmEmailSchema,
      handleSubmitOtp,
    },
  };
};

export default useForgotPassword;
