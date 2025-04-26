import { GROUP_MEMBER_STATUS } from "@/helpers/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useDebounce from "@/helpers/hooks/useDebounce";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useInviteMemberEmailMutation } from "@/services/group";
import { useGetUsersQuery } from "@/services/user";
import { GroupMember } from "@/helpers/types/group.type";
import { UserInfo } from "@/helpers/types/user.types";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import INVITE_MEMBER_CONSTANTS from "../../InviteMember.constant";

type InviteStatus = {
  type: "MESSAGE" | "COUNTDOWN" | "INVITABLE";
  message?: string;
  createdDate?: string;
};

const INVITE_SUGGESTION = [
  {
    id: "friendly",
    label: "Vui vẻ",
    text: (fullName: string) =>
      `${fullName} sẽ giận nếu bạn không đồng ý tham gia quỹ cùng. Tham gia ngay!`,
  },
  {
    id: "formal",
    label: "Trang trọng",
    text: (fullName: string) =>
      `Trân trọng kính mời bạn tham gia quỹ của ${fullName}. Sự tham gia của bạn rất quan trọng.`,
  },
  {
    id: "casual",
    label: "Lãng mạn",
    text: (fullName: string) =>
      `Hãy cùng ${fullName} khám phá cơ hội tuyệt vời này. Bạn có muốn tham gia quỹ không?`,
  },
  {
    id: "default",
    label: "Mặc định",
    text: (fullName: string) =>
      `${fullName} mời bạn tham gia quỹ. Tham gia ngay để nhận lợi ích!`,
  },
];

const useInviteMemberByEmail = () => {
  const [members, setMembers] = useState(INVITE_MEMBER_CONSTANTS.MEMBERS);
  const userInfoDetail = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const groupMembers: GroupMember[] = groupDetail?.groupMembers || [];
  const [searchUser, setSearchUser] = useState("");
  const debouncedSearchTerm = useDebounce(searchUser, 500);
  const [iniviteMemberByEmail] = useInviteMemberEmailMutation();
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { data: userInfo, isFetching } = useGetUsersQuery(
    {
      search: debouncedSearchTerm,
    },
    {
      skip: debouncedSearchTerm.length < 2,
    },
  );

  const [selectedForInvite, setSelectedForInvite] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState(INVITE_SUGGESTION[0]);

  useEffect(() => {
    if (searchUser && searchUser.length === 0) {
      setSelectedForInvite([]);
    }
  }, [searchUser]);

  const handleSearch = (text: string) => {
    setSearchUser(text);
  };

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const handleBackInviteByEmail = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const toggleInvite = (user: any) => {
    setSelectedForInvite((current) =>
      current.includes(user.email)
        ? current.filter((email) => email !== user.email)
        : [...current, user.email],
    );
  };

  const handleSentInvite = async () => {
    const payload = {
      groupId: groupDetail?.id,
      emails: selectedForInvite,
      description: selectedTone.text(userInfoDetail?.fullName as string),
    };
    dispatch(setLoading(true));
    try {
      await iniviteMemberByEmail(payload).unwrap();
      ToastAndroid.show("Mời thành viên thành công", ToastAndroid.SHORT);
      router.back();
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const isUserInvitable = useCallback(
    (user: any) => {
      if (user?.id === userInfoDetail?.id) return false;

      const isMember = groupMembers?.some(
        (member) =>
          member?.userInfo?.id === user?.id &&
          member?.status === GROUP_MEMBER_STATUS.ACTIVE,
      );
      if (isMember) return false;

      const pendingInvite = groupMembers?.find(
        (member) =>
          member?.userInfo?.email === user?.email &&
          member?.status === GROUP_MEMBER_STATUS.PENDING,
      );

      if (pendingInvite) {
        const inviteTime = new Date(pendingInvite.createdDate).getTime();
        const now = Date.now();
        const hoursDiff = (now - inviteTime) / (1000 * 60 * 60);
        return hoursDiff >= 24;
      }

      return true;
    },
    [groupMembers, userInfoDetail],
  );

  const getInviteStatus = useCallback(
    (user: UserInfo): InviteStatus => {
      if (user?.id === userInfoDetail?.id) {
        return {
          type: "MESSAGE",
          message: "Không thể tự mời bản thân",
        };
      }

      const activeMember = groupMembers?.find(
        (member) =>
          member?.userInfo?.id === user?.id &&
          member?.status === GROUP_MEMBER_STATUS.ACTIVE,
      );
      if (activeMember) {
        return {
          type: "MESSAGE",
          message: "Đã là thành viên",
        };
      }

      const pendingMember = groupMembers?.find(
        (member) =>
          member?.userInfo?.email?.toLowerCase() ===
            user?.email?.toLowerCase() &&
          member?.status === GROUP_MEMBER_STATUS.PENDING,
      );

      if (pendingMember) {
        return {
          type: "COUNTDOWN",
          createdDate: pendingMember.createdDate,
        };
      }

      return {
        type: "INVITABLE",
      };
    },
    [groupMembers, userInfoDetail],
  );

  return {
    state: {
      members,
      groupDetail,
      groupMembers,
      searchUserQuery: searchUser,
      userInfo: userInfo?.items,
      isLoading: isFetching,
      selectedForInvite,
      selectedTone,
      inviteSuggestions: INVITE_SUGGESTION,
      isUserInvitable,
      getInviteStatus,
    },
    handler: {
      handleSearch,
      setMembers,
      handleBack,
      handleBackInviteByEmail,
      toggleInvite,
      setSelectedTone,
      handleSentInvite,
    },
  };
};

export default useInviteMemberByEmail;
