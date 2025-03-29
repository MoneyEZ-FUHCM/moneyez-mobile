import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useInviteMemberByQRCode = () => {
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const handleBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const handleBackInviteByEmail = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  return {
    state: {
      groupDetail,
    },
    handler: {},
  };
};

export default useInviteMemberByQRCode;
