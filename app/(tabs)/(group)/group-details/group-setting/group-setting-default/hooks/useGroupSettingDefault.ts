import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export default function useGroupSettings() {
  const { GROUP_SETTING } = PATH_NAME;
  const dispatch = useDispatch();

  const handleEditGroupInfo = useCallback(() => {
    alert("Chỉnh sửa thông tin nhóm");
  }, []);

  const handleUpdateContributionRate = useCallback(() => {
    dispatch(setGroupTabHidden(true));
    router.navigate(GROUP_SETTING.GROUP_RATIO_MEMBER as any);
  }, []);

  const handleCloseGroupFund = useCallback(() => {
    alert("Đóng quỹ nhóm");
  }, []);

  return {
    handler: {
      handleEditGroupInfo,
      handleUpdateContributionRate,
      handleCloseGroupFund,
    },
  };
}
