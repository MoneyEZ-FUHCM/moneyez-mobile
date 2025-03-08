import useDebounce from "@/hooks/useDebounce";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import INVITE_MEMBER_CONSTANTS from "../InviteMember.constant";

const useInviteMember = () => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<
    { id: number; name: string; avatar: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(INVITE_MEMBER_CONSTANTS.MEMBERS);
  const searchQuery = useDebounce(search, 500);
  const dispatch = useDispatch();

  useEffect(() => {
    // xử lý tạm v, có api thì nhét vào query sau
    if (searchQuery) {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = INVITE_MEMBER_CONSTANTS.USERS.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredUsers(filtered);
        setIsLoading(false);
      }, 300);
    } else {
      setFilteredUsers([]);
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

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
      search,
      filteredUsers,
      isLoading,
      members,
    },
    handler: {
      handleSearch,
      setMembers,
      handleBack,
      handleBackInviteByEmail,
    },
  };
};

export default useInviteMember;
