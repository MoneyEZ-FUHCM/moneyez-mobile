import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import GROUP_MEMBER_CONSTANT from "../GroupMember.constant";

const useGroupHomeDefault = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("contribution");
  const recentActivities = GROUP_MEMBER_CONSTANT.RECENT_ACTIVITIES;
  const contactList = GROUP_MEMBER_CONSTANT.CONTACT_LIST;

  const handleBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
    dispatch(setGroupTabHidden(true));
  };
  return {
    state: {
      selectedTab,
      recentActivities,
      contactList,
    },
    handler: {
      handleBack,
      setSelectedTab,
    },
  };
};

export default useGroupHomeDefault;
