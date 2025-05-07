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
  const groupId = groupDetail?.id ?? "";
  const isGoalActive = groupDetail?.isGoalActive ?? false;

  const {
    data: financialGoalData,
    isLoading,
    error,
    refetch,
  } = useGetGroupFinancialGoalQuery(
    { groupId },
    { skip: !groupId || !isGoalActive },
  );

  useEffect(() => {
    if (groupId && isGoalActive) refetch();
  }, [groupId, isGoalActive]);

  useEffect(() => {
    if (error) {
      ToastAndroid.show(
        TEXT_TRANSLATE_GROUP_STATISTIC.MESSAGE_ERROR.FETCH_FAILED,
        ToastAndroid.SHORT,
      );
    }
  }, [error]);

  const activeGoal = useMemo(() => {
    const goal = financialGoalData?.data?.find((g: any) => !g.isDeleted);
    return {
      name: goal?.name?.trim() ?? "",
      target: goal?.targetAmount ?? 0,
      current: goal?.currentAmount ?? groupDetail?.currentBalance ?? 0,
      deadline: goal?.deadline ?? null,
      createdDate: goal?.createdDate ?? null,
    };
  }, [financialGoalData, groupDetail]);

  const remain = isGoalActive
    ? Math.max(0, activeGoal.target - activeGoal.current)
    : 0;

  const remainDays = useMemo(() => {
    if (!activeGoal.deadline) return { days: 0, hours: 0, minutes: 0 };
    const now = moment();
    const deadline = moment(activeGoal.deadline);
    const duration = moment.duration(deadline.diff(now));

    return {
      days: Math.max(0, Math.floor(duration.asDays())),
      hours: Math.max(0, duration.hours()),
      minutes: Math.max(0, duration.minutes()),
    };
  }, [activeGoal.deadline]);

  const members: StatisticMemberData[] = useMemo(() => {
    return (
      groupDetail?.groupMembers
        ?.filter((m) => m.status === "ACTIVE")
        .map((member) => {
          const target = isGoalActive
            ? (member.contributionPercentage / 100) * activeGoal.target
            : 0;
          return {
            id: member.id,
            avatar: undefined,
            name: member.userInfo.fullName,
            ratio: member.contributionPercentage,
            contributed: member.totalContribution,
            target,
            userId: member.userId,
            hasFundedEnough: member.totalContribution >= target && target > 0,
          };
        }) ?? []
    );
  }, [groupDetail, isGoalActive, activeGoal.target]);

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

  return {
    state: {
      goalName: activeGoal.name,
      groupGoal: activeGoal.target,
      groupCurrent: activeGoal.current,
      remain,
      dueDate: formatDate(activeGoal.deadline, "DD.MM.YYYY"),
      remainDays,
      members,
      isLoading,
      isGoalActive,
      hasFinancialGoal: !!financialGoalData?.data?.length,
      hasGroupName: !!activeGoal.name,
      groupDetail,
      createdDate: activeGoal.createdDate,
    },
    handler: {
      handleGoBack,
    },
  };
}
