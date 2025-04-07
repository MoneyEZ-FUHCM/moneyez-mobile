import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useInviteMemberQRCodeMutation } from "@/services/group";
import { QrData } from "@/types/group.type";
import { router } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const useInviteMemberByQRCode = () => {
  const [inviteMemberByQRCode] = useInviteMemberQRCodeMutation();
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const { SYSTEM_ERROR, HTTP_STATUS } = COMMON_CONSTANT;
  const [QrData, setQrData] = useState<QrData>();

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const handleBackInviteByEmail = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const handleCreateQRCode = useCallback(async () => {
    const payload = { groupId: groupDetail?.id };
    try {
      const res = await inviteMemberByQRCode(payload).unwrap();
      console.log("check res", res);
      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        setQrData({ groupId: payload as any, inviteCode: res.data });
      }
    } catch (err) {
      console.log("check err", err);
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  }, []);

  useEffect(() => {
    handleCreateQRCode();

    const interval = setInterval(() => {
      handleCreateQRCode();
    }, 5 * 1000);

    return () => clearInterval(interval);
  }, [handleCreateQRCode]);

  return {
    state: {
      groupDetail,
      QrData,
    },
    handler: {
      handleCreateQRCode,
    },
  };
};

export default useInviteMemberByQRCode;
