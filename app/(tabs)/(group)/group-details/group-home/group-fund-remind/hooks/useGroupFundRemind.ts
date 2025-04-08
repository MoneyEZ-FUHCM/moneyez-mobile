import { formatDate } from "@/helpers/libs";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupFinancialGoalQuery } from "@/services/financialGoal";
import { useFundRaisingRemindMutation } from "@/services/group";
import { router } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_GROUP_REMIND from "../GroupFundRemind.translate";

export interface MemberData {
  id: string;
  avatar?: any;
  name: string;
  ratio: number;
  contributed: number;
  target: number;
  checked: boolean;
  userId: string;
  disabled: boolean;
}

export default function useGroupRemind() {
  const [selectedTab, setSelectedTab] = useState<"add" | "history">("add");
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => { });
  const dispatch = useDispatch();

  const groupDetail = useSelector(selectCurrentGroup);
  const isGoalActive = groupDetail?.isGoalActive || false;

  const [fundRaisingRemind, { isLoading: isRemindLoading }] = useFundRaisingRemindMutation();

  const { data: financialGoalData, isLoading: isGoalLoading } = useGetGroupFinancialGoalQuery({
    groupId: groupDetail?.id || ''
  }, { skip: !groupDetail?.id || !isGoalActive });

  const hasFinancialGoal = financialGoalData?.data && financialGoalData.data.length > 0;

  const activeFinancialGoals = hasFinancialGoal ? financialGoalData?.data?.filter((goal: { isDeleted: boolean }) => !goal.isDeleted) || [] : [];
  const activeFinancialGoal = activeFinancialGoals.length > 0 ? activeFinancialGoals[0] : null;
  
  const goalName = activeFinancialGoal?.name
  const groupGoal = activeFinancialGoal?.targetAmount || 0;
  const groupCurrent = activeFinancialGoal?.currentAmount || groupDetail?.currentBalance || 0;
  const deadlineDate = activeFinancialGoal?.deadline || null;

  const dueDate = deadlineDate ? formatDate(deadlineDate, 'DD.MM.YYYY') : '';
  const remainDays = deadlineDate ? moment(deadlineDate).diff(moment(), 'days') : 0;

  const [members, setMembers] = useState<MemberData[]>([]);
  const isLoading = isRemindLoading || isGoalLoading;

  useEffect(() => {
    if (groupDetail?.groupMembers) {
      const mappedMembers = groupDetail.groupMembers
        .filter(member => member.status === "ACTIVE")
        .map(member => {
          const target = isGoalActive && hasFinancialGoal && groupGoal > 0
            ? (member.contributionPercentage / 100) * groupGoal
            : 0;

          const hasFundedEnough = hasFinancialGoal && target > 0 && member.totalContribution >= target;

          return {
            id: member.id,
            avatar: undefined,
            name: member.userInfo.fullName,
            ratio: member.contributionPercentage,
            contributed: member.totalContribution,
            target: target,
            checked: !hasFundedEnough, 
            userId: member.userId,
            disabled: hasFundedEnough 
          };
        });
      setMembers(mappedMembers);
    }
  }, [groupDetail, isGoalActive, groupGoal, hasFinancialGoal]);

  const handleSelectTab = useCallback((tab: "add" | "history") => {
    setSelectedTab(tab);
  }, []);

  const handleToggleMember = useCallback((id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id && !m.disabled ? { ...m, checked: !m.checked } : m)),
    );
  }, []);

  const handleToggleAll = useCallback(() => {
    const allAvailableChecked = members
      .filter(m => !m.disabled)
      .every((m) => m.checked);

    setMembers((prev) =>
      prev.map((m) => (m.disabled ? m : { ...m, checked: !allAvailableChecked }))
    );
  }, [members]);

  const handleCreateRemind = useCallback(async (values: { amount: string, description: string }) => {
    if (!groupDetail?.id) {
      ToastAndroid.show(TEXT_TRANSLATE_GROUP_REMIND.MESSAGE_ERROR.CREATE_FAILED, ToastAndroid.SHORT);
      return;
    }

    try {
      const amount = parseInt(values.amount.replace(/\D/g, ""), 10);
      const checkedMembers = members.filter(member => member.checked);

      if (checkedMembers.length === 0) {
        ToastAndroid.show(TEXT_TRANSLATE_GROUP_REMIND.MESSAGE_VALIDATE.SELECT_MEMBER_MIN, ToastAndroid.SHORT);
        return;
      }

      const memberData = checkedMembers.map(member => {
        let finalAmount = amount;

        if (isGoalActive && hasFinancialGoal) {
          const remaining = member.target - member.contributed;
          if (finalAmount > remaining && remaining > 0) {
            finalAmount = remaining;
          } else if (remaining <= 0) {
            finalAmount = 0;
          }
        }

        return {
          memberId: member.userId,
          amount: finalAmount
        };
      });

      const payload = {
        groupId: groupDetail.id,
        description: values.description,
        members: memberData
      };

      const response = await fundRaisingRemind(payload).unwrap();

      if (response) {
        ToastAndroid.show(TEXT_TRANSLATE_GROUP_REMIND.MESSAGE_SUCCESS.CREATE_SUCCESS, ToastAndroid.SHORT);
        router.back();
      }
    } catch (error) {
      console.error("Fund raising remind error:", error);
      ToastAndroid.show(TEXT_TRANSLATE_GROUP_REMIND.MESSAGE_ERROR.CREATE_FAILED, ToastAndroid.SHORT);
    }
  }, [members, groupDetail, isGoalActive, hasFinancialGoal]);

  const handleGoBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const remain = isGoalActive && hasFinancialGoal ? (groupGoal - groupCurrent > 0 ? groupGoal - groupCurrent : 0) : 0;

  return {
    state: {
      selectedTab,
      isGoalActive,
      goalName,
      groupGoal,
      groupCurrent,
      remain,
      dueDate,
      remainDays,
      members,
      isLoading,
      hasFinancialGoal
    },
    refState: {
      formikRef,
    },
    handler: {
      handleSelectTab,
      handleToggleMember,
      handleToggleAll,
      handleCreateRemind,
      handleGoBack,
      handleSubmitRef,
    },
  };
}
