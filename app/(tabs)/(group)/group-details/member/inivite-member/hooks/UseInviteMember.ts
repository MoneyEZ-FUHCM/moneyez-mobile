import { useState } from "react";
import INVITE_MEMBER_CONSTANTS from "../InviteMember.constants";

const useInviteMember = () => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<
    { id: number; name: string; avatar: string }[]
  >([]);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [members, setMembers] = useState(INVITE_MEMBER_CONSTANTS.MEMBERS);

  const handleSearch = (text: string) => {
    setSearch(text);
    setSearchInitiated(true);
    if (text) {
      const filtered = INVITE_MEMBER_CONSTANTS.USERS.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  return {
    state: {
      search,
      filteredUsers,
      searchInitiated,
      members,
    },
    handler: {
      handleSearch,
      setMembers,
    },
  };
};

export default useInviteMember;
