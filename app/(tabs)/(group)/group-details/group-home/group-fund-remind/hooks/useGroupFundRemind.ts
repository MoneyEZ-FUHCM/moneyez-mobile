import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupFinancialGoalQuery } from "@/services/financialGoal";
import { useFundRaisingRemindMutation } from "@/services/group";
import { router } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_GROUP_REMIND from "../GroupFundRemind.translate";
import { formatDate } from "@/helpers/libs";

export interface MemberData {
  id: string;
  avatar?: any;
  name: string;
  ratio: number;
  contributed: number;
  target: number;
  checked: boolean;
  userId: string;
}

export default function useGroupRemind() {
  const [selectedTab, setSelectedTab] = useState<"add" | "history">("add");
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => { });
  const { GROUP_HOME } = PATH_NAME;
  const dispatch = useDispatch();

  const groupDetail = useSelector(selectCurrentGroup);
  const isGoalActive = groupDetail?.isGoalActive || false;

  const [fundRaisingRemind, { isLoading: isRemindLoading }] = useFundRaisingRemindMutation();

  const { data: financialGoalData, isLoading: isGoalLoading } = useGetGroupFinancialGoalQuery({
    groupId: groupDetail?.id || ''
  }, { skip: !groupDetail?.id || !isGoalActive });

  const groupGoal = financialGoalData?.data?.[0]?.targetAmount || 0;
  const groupCurrent = financialGoalData?.data?.[0]?.currentAmount || groupDetail?.currentBalance || 0;
  const deadlineDate = financialGoalData?.data?.[0]?.deadline;

  const dueDate = formatDate(deadlineDate, 'DD.MM.YYYY')

  const remainDays = moment(deadlineDate).diff(moment(), 'days')
  const [members, setMembers] = useState<MemberData[]>([]);
  const isLoading = isRemindLoading || isGoalLoading;

  useEffect(() => {
    if (groupDetail?.groupMembers) {
      const mappedMembers = groupDetail.groupMembers.map(member => {
        const target = isGoalActive && groupGoal > 0
          ? (member.contributionPercentage / 100) * groupGoal
          : 0;

        return {
          id: member.id,
          avatar: undefined,
          name: member.userInfo.fullName,
          ratio: member.contributionPercentage,
          contributed: member.totalContribution,
          target: target,
          checked: true,
          userId: member.userId
        };
      });
      setMembers(mappedMembers);
    }
  }, [groupDetail, isGoalActive, groupGoal]);

  const handleSelectTab = useCallback((tab: "add" | "history") => {
    setSelectedTab(tab);
  }, []);

  const handleToggleMember = useCallback((id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m)),
    );
  }, []);

  const handleToggleAll = useCallback(() => {
    const allChecked = members.every((m) => m.checked);
    setMembers((prev) => prev.map((m) => ({ ...m, checked: !allChecked })));
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

        if (isGoalActive) {
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
        Alert.alert(
          "Thành công",
          TEXT_TRANSLATE_GROUP_REMIND.MESSAGE_SUCCESS.CREATE_SUCCESS,
          [{ text: "OK", onPress: () => router.replace(GROUP_HOME.GROUP_HOME_DEFAULT as any) }]
        );
      }
    } catch (error) {
      console.error("Fund raising remind error:", error);
      Alert.alert("Lỗi", TEXT_TRANSLATE_GROUP_REMIND.MESSAGE_ERROR.CREATE_FAILED);
    }
  }, [members, groupDetail, isGoalActive]);

  const handleGoBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  const remain = isGoalActive ? (groupGoal - groupCurrent > 0 ? groupGoal - groupCurrent : 0) : 0;

  return {
    state: {
      selectedTab,
      isGoalActive,
      groupGoal,
      groupCurrent,
      remain,
      dueDate,
      remainDays,
      members,
      isLoading,
      hasFinancialGoal: !!financialGoalData?.data?.[0]
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
