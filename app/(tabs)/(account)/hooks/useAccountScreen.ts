import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideTabbar from "@/hooks/useHideTabbar";
import useLogout from "@/hooks/useLogout";
import useUploadImage from "@/hooks/useUploadImage";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { selectUserInfo, setUserInfo } from "@/redux/slices/userSlice";
import { useUpdateInfoMutation } from "@/services/user";
import { router } from "expo-router";
import { useCallback } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import ACCOUNT_SCREEN_CONSTANT from "../AccountScreen.constant";
import TEXT_TRANSLATE_ACCOUNT from "../AccountScreen.translate";

const useAccountScreen = () => {
  const { handleLogout } = useLogout();
  const { imageUrl, pickAndUploadImage } = useUploadImage();
  const { FORM_NAME, ERROR_CODE } = ACCOUNT_SCREEN_CONSTANT;
  const { SYSTEM_ERROR, HTTP_STATUS } = COMMON_CONSTANT;
  const { MESSAGE_VALIDATE, MESSAGE_SUCCESS, MESSAGE_ERROR } =
    TEXT_TRANSLATE_ACCOUNT;

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [updateInfoUser] = useUpdateInfoMutation();

  const handleNavigateAccountOptions = useCallback((id: number) => {
    switch (id) {
      case 1:
        router.navigate(PATH_NAME.ACCOUNT.UPDATE_INFO as any);
        break;
      case 2:
        //
        break;
      case 3:
        //
        break;
      default:
      //
    }
  }, []);

  // validation
  const updateValidationSchema = Yup.object({
    fullName: Yup.string().trim().required(MESSAGE_VALIDATE.FULLNAME_REQUIRED),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^\d{10}$/, MESSAGE_VALIDATE.INPUT_PHONE_NUMBER)
      .required(MESSAGE_VALIDATE.PHONE_NUMBER_REQUIRED),
    dob: Yup.string().trim().required(MESSAGE_VALIDATE.DOB_REQUIRED),
    gender: Yup.string().trim().required(MESSAGE_VALIDATE.GENDER_REQUIRED),
  });

  const handleBack = () => {
    dispatch(setHiddenTabbar(false));
    router.back();
  };

  const handleUpdateInfo = async (payload: any) => {
    const update = { ...payload, id: userInfo?.id, avatar: imageUrl };
    dispatch(setLoading(true));
    try {
      const res = await updateInfoUser(update).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        ToastAndroid.show(
          MESSAGE_SUCCESS.UPDATE_USER_SUCCESSFUL,
          ToastAndroid.SHORT,
        );
        dispatch(setUserInfo(res.data));
      }
    } catch (err: any) {
      const error = err.data;

      if (error && error.errorCode === ERROR_CODE.DUPLICATE_PHONE_NUMBER) {
        ToastAndroid.show(
          MESSAGE_ERROR.PHONE_ALREADY_EXISTED,
          ToastAndroid.SHORT,
        );
        return;
      }
      if (error && error.errorCode === ERROR_CODE.USER_MUST_16) {
        ToastAndroid.show(MESSAGE_ERROR.MUST_BE_16, ToastAndroid.SHORT);
        return;
      }

      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    state: {
      userInfo,
      imageUrl,
      FORM_NAME,
    },
    handler: {
      handleLogout,
      handleNavigateAccountOptions,
      handleHideTabbar: useHideTabbar,
      handleBack,
      pickAndUploadImage,
      handleUpdateInfo,
      updateValidationSchema,
    },
  };
};

export default useAccountScreen;
