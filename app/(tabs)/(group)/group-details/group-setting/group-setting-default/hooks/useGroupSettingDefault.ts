import { GROUP_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useLeaveGroupMutation } from "@/services/group";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";

export default function useGroupSettings() {
  const { GROUP_SETTING } = PATH_NAME;
  const dispatch = useDispatch();
  const modalizeRef = useRef<Modalize>(null);
  const [leaveGroup] = useLeaveGroupMutation();
  const groupDetail = useSelector(selectCurrentGroup);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const navigation = useNavigation();
  const userInfo = useSelector(selectUserInfo);

  const isLeader = useMemo(() => {
    return groupDetail?.groupMembers?.some(
      (member) =>
        member?.userId === userInfo?.id && member?.role === GROUP_ROLE.LEADER,
    );
  }, [groupDetail, userInfo]);

  const handleEditGroupInfo = useCallback(() => {
    ToastAndroid.show("Tính năng này đang được phát triển", ToastAndroid.SHORT);
  }, []);

  const handleUpdateContributionRate = useCallback(() => {
    dispatch(setGroupTabHidden(true));
    router.navigate(GROUP_SETTING.GROUP_RATIO_MEMBER as any);
  }, []);

  const handleFinancialGoal = useCallback(() => {
    dispatch(setGroupTabHidden(true));
    router.navigate(GROUP_SETTING.GROUP_FINANCIAL_GOAL as any);
  }, []);

  const handleCloseGroupFund = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await leaveGroup(groupDetail?.id).unwrap();
      modalizeRef.current?.close();
      setTimeout(() => {
        dispatch(setLoading(false));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: PATH_NAME.HOME.HOME_NAVIGATOR }],
          }),
        );
        dispatch(setGroupTabHidden(true));
        dispatch(setMainTabHidden(false));
        ToastAndroid.show("Rời nhóm thành công", ToastAndroid.SHORT);
      }, 2500);
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      dispatch(setLoading(false));
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    dispatch(setGroupTabHidden(true));
  }, []);

  const handleCloseModal = useCallback(() => {
    dispatch(setGroupTabHidden(false));
  }, []);

  return {
    state: {
      modalizeRef,
      isLeader,
    },
    handler: {
      handleEditGroupInfo,
      handleUpdateContributionRate,
      handleCloseGroupFund,
      handleOpenModal,
      handleCloseModal,
      handleFinancialGoal
    },
  };
}
