import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useDispatch } from "react-redux";


const useGroupHomeDefault = () => {
  const dispatch = useDispatch();
  const handleCreateFundRequest = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.CREATE_FUND_REQUEST as any,
    });
  }

  const handleFundRemind = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.GROUP_FUND_REMIND as any,
    });
  }

  const handleStatistic = () => {
    
  }

  return {
    state: {

    },
    handler: {
      handleCreateFundRequest,
      handleFundRemind,
      handleStatistic,
    },
  };
}

export default useGroupHomeDefault;