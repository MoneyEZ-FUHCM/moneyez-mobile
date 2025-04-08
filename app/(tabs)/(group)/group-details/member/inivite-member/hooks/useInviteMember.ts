import { GROUP_MEMBER_STATUS, GROUP_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import {
  useGetGroupDetailQuery,
  useKickMemberMutation,
} from "@/services/group";
import { GroupMember } from "@/types/group.type";
import { router } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import INVITE_MEMBER_CONSTANTS from "../InviteMember.constant";

const MEMBER_TABS = {
  ACTIVE: "active",
  PENDING: "pending",
} as const;

const useInviteMember = () => {
  const dispatch = useDispatch();
  const [members, setMembers] = useState(INVITE_MEMBER_CONSTANTS.MEMBERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] =
    useState<keyof typeof MEMBER_TABS>("ACTIVE");
  const modalizeKickMemberRef = useRef<Modalize>(null);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    null,
  );
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const groupDetail = useSelector(selectCurrentGroup);
  const { refetch, isFetching } = useGetGroupDetailQuery(
    {
      id: groupDetail?.id,
    },
    { skip: !groupDetail?.id },
  );
  const [removeMember] = useKickMemberMutation();

  const groupMembers: GroupMember[] = groupDetail?.groupMembers || [];
  const userInfo = useSelector(selectUserInfo);

  const activeMembers: GroupMember[] = useMemo(
    () =>
      groupMembers.filter(
        (member) => member.status === GROUP_MEMBER_STATUS.ACTIVE,
      ),
    [groupMembers],
  );

  const pendingMembers: GroupMember[] = useMemo(
    () =>
      groupMembers.filter(
        (member) => member.status === GROUP_MEMBER_STATUS.PENDING,
      ),
    [groupMembers],
  );

  const isLeader = useMemo(() => {
    return groupDetail?.groupMembers?.some(
      (member) =>
        member?.userId === userInfo?.id && member?.role === GROUP_ROLE.LEADER,
    );
  }, [groupDetail, userInfo]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const handleBackInviteByEmail = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch, isRefreshing]);

  const handleRemoveMember = useCallback(
    async (memberId?: string) => {
      if (!memberId || !groupDetail?.id) return;
      try {
        await removeMember({
          groupId: groupDetail.id,
          memberId,
        }).unwrap();
        await refetch();
        handleCloseModal();
      } catch (err: any) {
        const error = err?.data;
        if (error.errorCode === "GroupMemberNotFound") {
          ToastAndroid.show("Thành viên không tồn tại", ToastAndroid.SHORT);
          return;
        }
        if (error.errorCode === "GroupMemberHaveTransaction") {
          ToastAndroid.show(
            "Thành viên đã có đóng góp. Không được xóa",
            ToastAndroid.SHORT,
          );
          return;
        }

        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      }
    },
    [groupDetail?.id, removeMember, refetch],
  );

  const handleOpenModalRemoveMember = useCallback(
    (member: GroupMember) => {
      setSelectedMember(member);
      modalizeKickMemberRef.current?.open();
      dispatch(setGroupTabHidden(true));
    },
    [dispatch],
  );

  const handleCloseModal = useCallback(() => {
    modalizeKickMemberRef.current?.close();
    setSelectedMember(null);
    dispatch(setGroupTabHidden(false));
  }, [dispatch]);

  const handleOpenGroupTab = useCallback(() => {
    dispatch(setGroupTabHidden(false));
  }, []);

  return {
    state: {
      members,
      groupDetail,
      groupMembers,
      activeMembers,
      pendingMembers,
      isLeader,
      isFetching,
      isRefreshing,
      activeTab,
      modalizeRef: modalizeKickMemberRef,
      selectedMember,
    },
    handler: {
      setMembers,
      handleBack,
      handleBackInviteByEmail,
      handleRefresh,
      setActiveTab,
      handleRemoveMember,
      setSelectedMember,
      handleOpenModalRemoveMember,
      handleCloseModal,
      handleOpenGroupTab,
    },
  };
};

export default useInviteMember;
