import { PATH_NAME } from "@/helpers/constants/pathname";
import useLogout from "@/hooks/useLogout";
import useUploadImage from "@/hooks/useUploadImage";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { router } from "expo-router";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import ACCOUNT_SCREEN_CONSTANT from "../../AccountScreen.constant";

const useAccountScreen = () => {
  const { handleLogout } = useLogout();
  const { imageUrl } = useUploadImage();
  const { FORM_NAME } = ACCOUNT_SCREEN_CONSTANT;

  const userInfo = useSelector(selectUserInfo);

  const handleNavigateAccountOptions = useCallback((id: number) => {
    switch (id) {
      case 1:
        router.navigate(PATH_NAME.ACCOUNT.UPDATE_INFO as any);
        break;
      case 2:
        router.navigate(PATH_NAME.ACCOUNT.BANK_ACCOUNT as any);
        break;
      case 3:
        //
        break;
      default:
      //
    }
  }, []);

  return {
    state: {
      userInfo,
      imageUrl,
      FORM_NAME,
    },
    handler: {
      handleLogout,
      handleNavigateAccountOptions,
    },
  };
};

export default useAccountScreen;
