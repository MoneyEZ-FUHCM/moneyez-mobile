import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function useGroupRemind() {
  const [selectedTab, setSelectedTab] = useState<"add" | "history">("add");
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});
  const { GROUP_HOME } = PATH_NAME;
  const dispatch = useDispatch();
  // MOCK DATA
  const groupGoal = 3000000;
  const groupCurrent = 2500000;
  const remain = groupGoal - groupCurrent;
  const dueDate = "30.04.2025";
  const remainDays = 40;

  const [perMemberAmount, setPerMemberAmount] = useState("50000");
  const [note, setNote] = useState("Cùng góp quỹ bạn nhé");

  const [members, setMembers] = useState([
    {
      id: 1,
      avatar: undefined,
      name: "Đặng Gia Đức",
      ratio: 30,
      contributed: 100000,
      target: 900000,
      checked: true,
    },
    {
      id: 2,
      avatar: undefined,
      name: "Dương Bảo",
      ratio: 30,
      contributed: 100000,
      target: 900000,
      checked: true,
    },
    {
      id: 3,
      avatar: undefined,
      name: "Minh Trí",
      ratio: 40,
      contributed: 100000,
      target: 1200000,
      checked: true,
    },
  ]);

  const handleSelectTab = useCallback((tab: "add" | "history") => {
    setSelectedTab(tab);
  }, []);

  const handleToggleMember = useCallback((id: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m)),
    );
  }, []);

  const handleToggleAll = useCallback(() => {
    const allChecked = members.every((m) => m.checked);
    setMembers((prev) => prev.map((m) => ({ ...m, checked: !allChecked })));
  }, [members]);

  const handleCreateRemind = useCallback((values: any) => {
    console.log("Đã tạo lời nhắc cho các thành viên đã chọn! ", values);
    router.replace(GROUP_HOME.GROUP_HOME_DEFAULT as any);
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  return {
    state: {
      selectedTab,
      groupGoal,
      groupCurrent,
      remain,
      dueDate,
      remainDays,
      perMemberAmount,
      note,
      members,
    },
    refState: {
      formikRef,
    },
    handler: {
      handleSelectTab,
      handleToggleMember,
      handleToggleAll,
      handleCreateRemind,
      setPerMemberAmount,
      setNote,
      handleGoBack,
      handleSubmitRef,
    },
  };
}
