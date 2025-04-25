import { formatDate } from "@/helpers/libs";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupFinancialGoalQuery } from "@/services/financialGoal";
import { router, useFocusEffect } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_GROUP_STATISTIC from "../GroupStatistic.translate";

export interface StatisticMemberData {
  id: string;
  avatar?: any;
  name: string;
  ratio: number;
  contributed: number;
  target: number;
  userId: string;
  hasFundedEnough: boolean;
}

export default function useGroupStatistic() {
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const isGoalActive = groupDetail?.isGoalActive || false;
  const groupId = groupDetail?.id || "";

  const {
    data: financialGoalData,
    isLoading: isGoalLoading,
    error,
  } = useGetGroupFinancialGoalQuery(
    { groupId },
    { skip: !groupId || !isGoalActive },
  );

  useEffect(() => {
    if (error) {
      ToastAndroid.show(
        TEXT_TRANSLATE_GROUP_STATISTIC.MESSAGE_ERROR.FETCH_FAILED,
        ToastAndroid.SHORT,
      );
    }
  }, [error]);

  const activeFinancialGoal = useMemo(() => {
    return (
      financialGoalData?.data?.find((goal: any) => !goal.isDeleted) || null
    );
  }, [financialGoalData]);

  const goalName = activeFinancialGoal?.name ?? "";
  const groupGoal = activeFinancialGoal?.targetAmount ?? 0;
  const groupCurrent =
    activeFinancialGoal?.currentAmount ?? groupDetail?.currentBalance ?? 0;
  const deadlineDate = activeFinancialGoal?.deadline ?? null;

  const dueDate = formatDate(deadlineDate, "DD.MM.YYYY");

  const remainDays = useMemo(() => {
    if (!deadlineDate) return { days: 0, hours: 0, minutes: 0 };

    const now = moment();
    const deadline = moment(deadlineDate);
    const duration = moment.duration(deadline.diff(now));

    return {
      days: Math.max(0, Math.floor(duration.asDays())),
      hours: Math.max(0, duration.hours()),
      minutes: Math.max(0, duration.minutes()),
    };
  }, [deadlineDate]);

  const remain = isGoalActive ? Math.max(0, groupGoal - groupCurrent) : 0;

  const members: StatisticMemberData[] = useMemo(() => {
    if (!groupDetail?.groupMembers) return [];
    return groupDetail.groupMembers
      .filter((m) => m.status === "ACTIVE")
      .map((member) => {
        const target = isGoalActive
          ? (member.contributionPercentage / 100) * groupGoal
          : 0;
        const hasFundedEnough =
          member.totalContribution >= target && target > 0;
        return {
          id: member.id,
          avatar: undefined,
          name: member.userInfo.fullName,
          ratio: member.contributionPercentage,
          contributed: member.totalContribution,
          target,
          userId: member.userId,
          hasFundedEnough,
        };
      });
  }, [groupDetail, isGoalActive, groupGoal]);

  const handleGoBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleGoBack]),
  );

  const hasGroupName = goalName.trim() !== "";
  const hasFinancialGoal = !!financialGoalData?.data?.length;

  return {
    state: {
      goalName,
      groupGoal,
      groupCurrent,
      remain,
      dueDate,
      remainDays,
      members,
      isLoading: isGoalLoading,
      isGoalActive,
      hasFinancialGoal,
      hasGroupName,
    },
    handler: {
      handleGoBack,
    },
  };
}
