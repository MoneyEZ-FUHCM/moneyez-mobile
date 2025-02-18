import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideTabbar from "@/hooks/useHideTabbar";
import useLogout from "@/hooks/useLogout";
import useUploadImage from "@/hooks/useUploadImage";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { router } from "expo-router";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ACCOUNT_SCREEN_CONSTANT from "../AccountScreen.constant";
import * as Yup from "yup";
import TEXT_TRANSLATE_ACCOUNT from "../AccountScreen.translate";

const useAccountScreen = () => {
  const { handleLogout } = useLogout();
  const { imageUrl, pickAndUploadImage } = useUploadImage();
  const { FORM_NAME } = ACCOUNT_SCREEN_CONSTANT;
  const { MESSAGE_VALIDATE } = TEXT_TRANSLATE_ACCOUNT;

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

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
    address: Yup.string().trim().required(MESSAGE_VALIDATE.FULLNAME_REQUIRED),
    dob: Yup.string().trim().required(MESSAGE_VALIDATE.FULLNAME_REQUIRED),
    gender: Yup.string().trim().required(MESSAGE_VALIDATE.FULLNAME_REQUIRED),
  });

  const handleBack = () => {
    dispatch(setHiddenTabbar(false));
    router.back();
  };

  const handleUpdateInfo = () => {
    console.log("first");
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
