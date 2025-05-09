import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { GROUP_ROLE } from "@/helpers/enums/globals";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import {
  useDeleteGroupMutation,
  useLeaveGroupMutation,
} from "@/services/group";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import GROUP_SETTING_DEFAULT_CONSTANTS from "../GroupSettingDefault.constant";

type CloseGroupType = "leader" | "member";

export default function useGroupSettings() {
  const { GROUP_SETTING } = PATH_NAME;
  const dispatch = useDispatch();
  const modalizeRef = useRef<Modalize>(null);
  const clsoeGroupModalizeRef = useRef<Modalize>(null);
  const [leaveGroup] = useLeaveGroupMutation();
  const groupDetail = useSelector(selectCurrentGroup);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const navigation = useNavigation();
  const userInfo = useSelector(selectUserInfo);
  const { ERROR_CODE } = GROUP_SETTING_DEFAULT_CONSTANTS;
  const [closeGroup] = useDeleteGroupMutation();

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
      },
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

  const handleViewRule = useCallback(() => {
    dispatch(setGroupTabHidden(true));
    router.navigate(GROUP_SETTING.GROUP_RULE as any);
  }, []);

  const handleCloseGroupFund = useCallback(
    async (type: CloseGroupType) => {
      if (!groupDetail?.id) {
        ToastAndroid.show("Nhóm không tồn tại", ToastAndroid.SHORT);
        return;
      }

      dispatch(setLoading(true));

      try {
        if (type === "member") {
          await leaveGroup(groupDetail.id).unwrap();
        } else if (type === "leader") {
          await closeGroup(groupDetail.id).unwrap();
        }

        modalizeRef.current?.close();
        clsoeGroupModalizeRef?.current?.close();

        if (type === "member") {
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
          }, 1000);
        } else {
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
            ToastAndroid.show("Đóng nhóm thành công", ToastAndroid.SHORT);
          }, 1000);
        }
      } catch (err: any) {
        const error = err?.data;

        if (error?.errorCode === ERROR_CODE.MEMBER_NOT_FOUND) {
          ToastAndroid.show("Thành viên không tồn tại", ToastAndroid.SHORT);
          return;
        }
        if (error?.errorCode === ERROR_CODE.MUST_EQUAL_ZERO) {
          ToastAndroid.show(
            "Vui lòng rút toàn bộ số dư trước khi đóng quỹ nhóm",
            ToastAndroid.SHORT,
          );
          return;
        }
        if (
          error?.errorCode === ERROR_CODE.MEMBER_HAVE_CONTRIBUTION ||
          error?.errorCode === ERROR_CODE.MEMBER_HAVE_TRANSACTION
        ) {
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
        clsoeGroupModalizeRef?.current?.close();
      }
    },
    [groupDetail?.id],
  );

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
      clsoeGroupModalizeRef,
    },
    handler: {
      handleEditGroupInfo,
      handleUpdateContributionRate,
      handleCloseGroupFund,
      handleOpenModal,
      handleCloseModal,
      handleFinancialGoal,
      handleViewRule,
    },
  };
}
