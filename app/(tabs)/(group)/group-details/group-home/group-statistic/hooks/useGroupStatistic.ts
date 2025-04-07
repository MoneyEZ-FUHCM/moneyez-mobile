import { formatDate } from "@/helpers/libs";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupFinancialGoalQuery } from "@/services/financialGoal";
import { router } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
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

  const { data: financialGoalData, isLoading: isGoalLoading, error } = useGetGroupFinancialGoalQuery({
    groupId: groupDetail?.id || ''
  }, { skip: !groupDetail?.id || !isGoalActive });

  const [members, setMembers] = useState<StatisticMemberData[]>([]);
  
  const groupGoal = financialGoalData?.data?.[0]?.targetAmount || 0;
  const groupCurrent = financialGoalData?.data?.[0]?.currentAmount || groupDetail?.currentBalance || 0;
  const deadlineDate = financialGoalData?.data?.[0]?.deadline;

  const dueDate = formatDate(deadlineDate, 'DD.MM.YYYY');
  const remainDays = moment(deadlineDate).diff(moment(), 'days');
  const remain = isGoalActive ? (groupGoal - groupCurrent > 0 ? groupGoal - groupCurrent : 0) : 0;

  useEffect(() => {
    if (error) {
      ToastAndroid.show(TEXT_TRANSLATE_GROUP_STATISTIC.MESSAGE_ERROR.FETCH_FAILED, ToastAndroid.SHORT);
    }
  }, [error]);

  useEffect(() => {
    if (groupDetail?.groupMembers) {
      const mappedMembers = groupDetail.groupMembers.map(member => {
        const target = isGoalActive && groupGoal > 0
          ? (member.contributionPercentage / 100) * groupGoal
          : 0;
        
        // Determine if this member has already funded enough
        const hasFundedEnough = member.totalContribution >= target && target > 0;

        return {
          id: member.id,
          avatar: undefined,
          name: member.userInfo.fullName,
          ratio: member.contributionPercentage,
          contributed: member.totalContribution,
          target: target,
          userId: member.userId,
          hasFundedEnough: hasFundedEnough
        };
      });
      setMembers(mappedMembers);
    }
  }, [groupDetail, isGoalActive, groupGoal]);

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
      isLoading: isGoalLoading,
      isGoalActive,
      hasFinancialGoal: !!financialGoalData?.data?.[0]
    },
    handler: {
      handleGoBack,
    },
  };
}