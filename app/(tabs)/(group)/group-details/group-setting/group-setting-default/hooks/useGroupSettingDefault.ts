import { GROUP_ROLE } from "@/helpers/enums/globals";
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
import GROUP_SETTING_DEFAULT_CONSTANTS from "../GroupSettingDefault.constant";

export default function useGroupSettings() {
  const { GROUP_SETTING } = PATH_NAME;
  const dispatch = useDispatch();
  const modalizeRef = useRef<Modalize>(null);
  const [leaveGroup] = useLeaveGroupMutation();
  const groupDetail = useSelector(selectCurrentGroup);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const navigation = useNavigation();
  const userInfo = useSelector(selectUserInfo);
  const { ERROR_CODE } = GROUP_SETTING_DEFAULT_CONSTANTS;

  const isLeader = useMemo(() => {
    return groupDetail?.groupMembers?.some(
      (member) =>
        member?.userId === userInfo?.id && member?.role === GROUP_ROLE.LEADER,
    );
  }, [groupDetail, userInfo]);

  const handleEditGroupInfo = useCallback(() => {
    dispatch(setGroupTabHidden(true));
    router.navigate({
      pathname: PATH_NAME.GROUP.CREATE_GROUP_STEP_1 as any,
      params: { 
        isEditMode: "true", 
        groupId: groupDetail?.id,
      }
    });
  }, [groupDetail, dispatch]);

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
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.MEMBER_NOT_FOUND) {
        ToastAndroid.show("Thành viên không tồn tại", ToastAndroid.SHORT);
        return;
      }
      if (error?.errorCode === ERROR_CODE.MEMBER_HAVE_CONTRIBUTION) {
        ToastAndroid.show(
          "Bạn đã có đóng góp trong nhóm, không được rời nhóm",
          ToastAndroid.SHORT,
        );
        return;
      }
      if (error?.errorCode === ERROR_CODE.MEMBER_HAVE_TRANSACTION) {
        ToastAndroid.show(
          "Bạn đã có đóng góp trong nhóm, không được rời nhóm",
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
      modalizeRef.current?.close();
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
      handleFinancialGoal,
    },
  };
}
