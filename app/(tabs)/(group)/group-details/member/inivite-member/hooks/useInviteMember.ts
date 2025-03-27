import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { GroupMember } from "@/types/group.type";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import INVITE_MEMBER_CONSTANTS from "../InviteMember.constant";

const useInviteMember = () => {
  const dispatch = useDispatch();
  const [members, setMembers] = useState(INVITE_MEMBER_CONSTANTS.MEMBERS);
  const groupDetail = useSelector(selectCurrentGroup);
  const groupMembers: GroupMember[] = groupDetail?.groupMembers || [];
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
      members,
      groupDetail,
      groupMembers,
    },
    handler: {
      setMembers,
      handleBack,
      handleBackInviteByEmail,
    },
  };
};

export default useInviteMember;
