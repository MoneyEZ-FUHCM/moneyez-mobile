import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import GROUP_HOME_DEFAULT_CONSTANT from "../GroupHomeDefault.constant";

const useGroupHomeDefault = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("contribution");
  const recentActivities = GROUP_HOME_DEFAULT_CONSTANT.RECENT_ACTIVITIES;
  const contactList = GROUP_HOME_DEFAULT_CONSTANT.CONTACT_LIST;

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
