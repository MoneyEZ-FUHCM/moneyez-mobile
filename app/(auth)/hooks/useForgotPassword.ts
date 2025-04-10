import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectOtpCode } from "@/redux/hooks/systemSelector";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setEmail } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import {
  useConfirmNewPasswordMutation,
  useResetPasswordMutation,
} from "@/services/auth";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";

const useForgotPassword = () => {
  const { AUTH } = PATH_NAME;
  const { MESSAGE_SUCCESS, MESSAGE_VALIDATE, MESSAGE_ERROR } =
    TEXT_TRANSLATE_AUTH;
  const { FORM_NAME, ERROR_CODE } = AUTH_SCREEN_CONSTANTS;
  const [resetPassword] = useResetPasswordMutation();
  const [confirmNewPassword] = useConfirmNewPasswordMutation();
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const email = useSelector((state: RootState) => state.user.email);
  const otpCode = useSelector(selectOtpCode);

  const dispatch = useDispatch();

  // validation
  const validationChangePasswordSchema = Yup.object({
    password: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.PASSWORD_REQUIRED)
      .min(8, MESSAGE_VALIDATE.PASSWORD_8_CHARACTERS)
      .matches(/[\W_]/, MESSAGE_VALIDATE.PASSWORD_SPECIAL_CHAR)
      .matches(/[a-zA-Z]/, MESSAGE_VALIDATE.PASSWORD_LETTERS)
      .matches(/^\S*$/, MESSAGE_VALIDATE.PASSWORD_NO_WHITESPACE)
      .matches(/[A-Z]/, MESSAGE_VALIDATE.PASSWORD_UPPERCASE),
    confirmPassword: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.CONFIRM_PASSWORD_REQUIRED)
      .oneOf(
        [Yup.ref(FORM_NAME.PASSWORD)],
        MESSAGE_VALIDATE.PASSWORDS_MUST_MATCH,
      ),
  });

  const validationConfirmEmailSchema = Yup.object({
    email: Yup.string()
      .required(MESSAGE_VALIDATE.EMAIL_REQUIRED)
      .email(MESSAGE_VALIDATE.INPUT_EMAIL),
  });

  const handleRecoveryPassword = async (payload: any) => {
    dispatch(setLoading(true));
    try {
      dispatch(setEmail(payload.email));
      const res = await resetPassword(JSON.stringify(payload.email)).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        router.navigate({
          pathname: AUTH.INPUT_OTP as any,
          params: { mode: "reset" },
        });
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
      if (error.errorCode === ERROR_CODE.OTP_HAS_SENT) {
        router.navigate({
          pathname: AUTH.INPUT_OTP as any,
          params: { mode: "reset" },
        });
        ToastAndroid.show(MESSAGE_ERROR.OTP_HAS_SENT, ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChangePassword = async (payload: any) => {
    dispatch(setLoading(true));
    const updatePayload = {
      password: payload.password,
      email,
      otpCode: otpCode,
    };
    try {
      const res = await confirmNewPassword(updatePayload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        router.replace(AUTH.LOGIN as any);
        ToastAndroid.show(
          MESSAGE_SUCCESS.CONFIRM_PASSWORD_SUCCESSFUL,
          ToastAndroid.SHORT,
        );
      }
    } catch (err: any) {
      const error = err.data;
      if (error.errorCode === ERROR_CODE.OLD_PASSWORD_INVALID) {
        ToastAndroid.show(MESSAGE_ERROR.OTP_INVALID, ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    state: {},
    handler: {
      validationChangePasswordSchema,
      validationConfirmEmailSchema,
      handleRecoveryPassword,
      handleChangePassword,
    },
  };
};

export default useForgotPassword;
