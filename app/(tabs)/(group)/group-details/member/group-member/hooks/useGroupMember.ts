import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GROUP_MEMBER_CONSTANT from "../GroupMember.constant";
import { RootState } from "@/redux/store";

const useGroupMember = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("contribution");
  const recentActivities = GROUP_MEMBER_CONSTANT.RECENT_ACTIVITIES;
  const contactList = GROUP_MEMBER_CONSTANT.CONTACT_LIST;
  const groupId = useSelector(
    (state: RootState) => state.groupHomeDefault.groupId,
  );
  return {
    state: {
      selectedTab,
      recentActivities,
      contactList,
      groupId,
    },
    handler: {
      setSelectedTab,
    },
  };
};

export default useGroupMember;
