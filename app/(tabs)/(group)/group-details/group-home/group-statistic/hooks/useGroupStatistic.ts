import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export default function useGroupStatistic() {
  const dispatch = useDispatch();
  
  // MOCK DATA
  const groupGoal = 3000000;
  const groupCurrent = 2500000;
  const remain = groupGoal - groupCurrent;
  const dueDate = "30.04.2025";
  const remainDays = 40;

  const [members, setMembers] = useState([
    {
      id: 1,
      avatar: undefined,
      name: "Đặng Gia Đức",
      ratio: 30,
      contributed: 100000,
      target: 900000,
    },
    {
      id: 2,
      avatar: undefined,
      name: "Dương Bảo",
      ratio: 30,
      contributed: 100000,
      target: 900000,
    },
    {
      id: 3,
      avatar: undefined,
      name: "Minh Trí",
      ratio: 40,
      contributed: 100000,
      target: 1200000,
    },
  ]);

  const handleGoBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  return {
    state: {
      groupGoal,
      groupCurrent,
      remain,
      dueDate,
      remainDays,
      members,
    },
    handler: {
      handleGoBack,
    },
  };
}