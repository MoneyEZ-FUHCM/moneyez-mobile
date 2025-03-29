import { GROUP_MEMBER_STATUS, GROUP_ROLE } from "@/enums/globals";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useGetGroupDetailQuery } from "@/services/group";
import { GroupMember } from "@/types/group.type";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
  const groupDetail = useSelector(selectCurrentGroup);
  const { refetch, isFetching } = useGetGroupDetailQuery(
    {
      id: groupDetail?.id,
    },
    { skip: !groupDetail?.id },
  );

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
        (member) => member.status !== GROUP_MEMBER_STATUS.ACTIVE,
      ),
    [groupMembers],
  );

  const isLeader = !!groupMembers?.find(
    (member) => member.id === userInfo?.id && member.role === GROUP_ROLE.LEADER,
  );

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
    },
    handler: {
      setMembers,
      handleBack,
      handleBackInviteByEmail,
      handleRefresh,
      setActiveTab,
    },
  };
};

export default useInviteMember;
