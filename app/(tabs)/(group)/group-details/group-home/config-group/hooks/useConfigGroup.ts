import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import GROUP_CONFIG_CONSTANT from "../ConfigGroup.constant";

const useConfigGroup = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("contribution");
  const recentActivities = GROUP_CONFIG_CONSTANT.RECENT_ACTIVITIES;
  const contactList = GROUP_CONFIG_CONSTANT.CONTACT_LIST;

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

export default useConfigGroup;
