import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import GROUP_MEMBER_CONSTANT from "../GroupMember.constant";

const useGroupMember = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("contribution");
  const recentActivities = GROUP_MEMBER_CONSTANT.RECENT_ACTIVITIES;
  const contactList = GROUP_MEMBER_CONSTANT.CONTACT_LIST;

  return {
    state: {
      selectedTab,
      recentActivities,
      contactList,
    },
    handler: {
      setSelectedTab,
    },
  };
};

export default useGroupMember;
