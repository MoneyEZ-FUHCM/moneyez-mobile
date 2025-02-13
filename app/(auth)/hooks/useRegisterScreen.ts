import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setEmail } from "@/redux/slices/userSlice";
import { useRegisterMutation } from "@/services/auth";
import { RegisterRequest } from "@/types/auth.types";
import { router } from "expo-router";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";

const useRegisterScreen = () => {
  const [data, setData] = useState();
  const { MESSAGE_VALIDATE, MESSAGE_ERROR } = TEXT_TRANSLATE_AUTH;
  const { ERROR_CODE, FORM_NAME } = AUTH_SCREEN_CONSTANTS;
  const { SYSTEM_ERROR, HTTP_STATUS } = COMMON_CONSTANT;
  const { AUTH } = PATH_NAME;
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();

  const registerValidationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.EMAIL_REQUIRED)
      .email(MESSAGE_VALIDATE.INPUT_EMAIL),
    fullName: Yup.string().trim().required(MESSAGE_VALIDATE.FULLNAME_REQUIRED),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^\d{10}$/, MESSAGE_VALIDATE.INPUT_PHONE_NUMBER)
      .required(MESSAGE_VALIDATE.PHONE_NUMBER_REQUIRED),
    password: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.PASSWORD_REQUIRED)
      .min(8, MESSAGE_VALIDATE.PASSWORD_8_CHARACTERS),
    confirmPassword: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.CONFIRM_PASSWORD_REQUIRED)
      .oneOf([Yup.ref("password")], MESSAGE_VALIDATE.PASSWORDS_MUST_MATCH),
  });

  const handleRegister = async (payload: RegisterRequest) => {
    try {
      dispatch(setLoading(true));
      const res = await register(payload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        dispatch(setEmail(payload.email));
        router.navigate({
          pathname: AUTH.INPUT_OTP as any,
          params: { mode: "verify" },
        });
        ToastAndroid.show(
          MESSAGE_ERROR.DOEST_NOT_VERIFY_EMAIL,
          ToastAndroid.SHORT,
        );
      }
    } catch (err: any) {
      const error = err.data;
      if (error.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST) {
        ToastAndroid.show(MESSAGE_ERROR.INVALID_INFO, ToastAndroid.SHORT);
        return;
      }
      if (error.errorCode === ERROR_CODE.DUPLICATE_PHONE_NUMBER) {
        ToastAndroid.show(
          MESSAGE_ERROR.PHONE_ALREADY_EXISTED,
          ToastAndroid.SHORT,
        );
        return;
      }
      if (error.errorCode === ERROR_CODE.ACCOUNT_EXISTED) {
        ToastAndroid.show(
          MESSAGE_ERROR.ACCOUNT_ALREADY_EXISTED,
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
      data,
    },
    handler: {
      setData,
      registerValidationSchema,
      handleRegister,
    },
  };
};

export default useRegisterScreen;
