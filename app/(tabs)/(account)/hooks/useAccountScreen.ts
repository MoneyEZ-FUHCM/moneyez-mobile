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

const useAccountScreen = () => {
  const { handleLogout } = useLogout();
  const { imageUrl, pickAndUploadImage } = useUploadImage();
  const { FORM_NAME } = ACCOUNT_SCREEN_CONSTANT;

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

  const handleBack = () => {
    dispatch(setHiddenTabbar(false));
    router.back();
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
    },
  };
};

export default useAccountScreen;
