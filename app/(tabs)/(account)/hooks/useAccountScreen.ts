import useLogout from "@/hooks/useLogout";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useSelector } from "react-redux";

const useAccountScreen = () => {
  const { handleLogout } = useLogout();
  const userInfo = useSelector(selectUserInfo);

  return {
    state: {
      userInfo,
    },
    handler: {
      handleLogout,
    },
  };
};

export default useAccountScreen;
