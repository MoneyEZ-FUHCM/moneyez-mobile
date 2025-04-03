import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useDebounce from "@/hooks/useDebounce";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useInviteMemberEmailMutation } from "@/services/group";
import { useGetUsersQuery } from "@/services/user";
import { GroupMember } from "@/types/group.type";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import INVITE_MEMBER_CONSTANTS from "../../InviteMember.constant";
import { setLoading } from "@/redux/slices/loadingSlice";

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
