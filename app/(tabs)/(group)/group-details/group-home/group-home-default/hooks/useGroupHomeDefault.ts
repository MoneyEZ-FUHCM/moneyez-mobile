import { GROUP_ROLE, TRANSACTION_STATUS } from "@/helpers/enums/globals";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup, setCurrentGroup } from "@/redux/slices/groupSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useGetGroupDetailQuery, useGetGroupLogsQuery } from "@/services/group";
import { useGetGroupTransactionQuery } from "@/services/transaction";
import { GroupMember } from "@/helpers/types/group.type";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const useGroupHomeDefault = () => {
  const dispatch = useDispatch();
  const RECENT_ACTIVITIES = "recent-activities";
  const EDIT_LOGS = "edit-logs";
  const { id } = useLocalSearchParams();
  const {
    data: groupDetailInfo,
    refetch: refetchGroupDetail,
    isLoading: isLoadingGroupDetailInfo,
  } = useGetGroupDetailQuery({ id }, { skip: !id });

  useLayoutEffect(() => {
    if (groupDetailInfo?.data) {
      dispatch(setCurrentGroup(groupDetailInfo.data));
    }
  }, [dispatch, groupDetailInfo]);

  const groupDetail = useSelector(selectCurrentGroup);
  const groupMembers: GroupMember[] = groupDetail?.groupMembers || [];
  const userInfo = useSelector(selectUserInfo);

  const isLeader = !!groupMembers?.find(
    (member) =>
      member.userInfo.id === userInfo?.id && member.role === GROUP_ROLE.LEADER,
  );

  const {
    data: groupLogs,
    refetch: refetchGroupLogs,
    isLoading: isLoadingGroupLogs,
  } = useGetGroupLogsQuery(
    { groupId: id, PageIndex: 1, PageSize: 100 },
    { skip: !id },
  );
  const {
    data: groupTransaction,
    refetch: refetchGroupTransactions,
    isLoading: isLoadingGroupTransactions,
  } = useGetGroupTransactionQuery(
    {
      groupId: id,
      PageIndex: 1,
      PageSize: 100,
      status: TRANSACTION_STATUS.CONFIRMED,
    },
    { skip: !id },
  );

  useEffect(() => {
    if (
      isLoadingGroupDetailInfo ||
      isLoadingGroupLogs ||
      isLoadingGroupTransactions
    ) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [
    isLoadingGroupDetailInfo,
    isLoadingGroupLogs,
    isLoadingGroupTransactions,
  ]);

  const handleCreateFundRequest = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.CREATE_FUND_REQUEST as any,
    });
  };

  const handleCreateWithdrawRequest = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.WITHDRAW_FUND_REQUEST as any,
    });
  };

  const handleFundRemind = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.GROUP_FUND_REMIND as any,
    });
  };

  const handleStatistic = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.GROUP_STATISTIC as any,
    });
  };
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetchData = useCallback(() => {
    Promise.all([
      refetchGroupDetail(),
      refetchGroupLogs(),
      refetchGroupTransactions(),
    ]).finally(() => {
      setIsRefetching(false);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetchGroupDetail, refetchGroupLogs, refetchGroupTransactions]);

  const handlePress = (type: string) => {
    if (type === RECENT_ACTIVITIES) {
      router.navigate(PATH_NAME.GROUP_HOME.ACTION_LOG_HISTORY as any);
    } else if (type === EDIT_LOGS) {
      router.navigate(PATH_NAME.GROUP_HOME.EDIT_LOG_HISTORY as any);
    }
  };

  return {
    state: {
      groupDetail,
      groupLogs: groupLogs?.items,
      groupTransaction: groupTransaction?.items,
      refreshing: isRefetching,
      RECENT_ACTIVITIES,
      EDIT_LOGS,
      isLeader,
      isLoading:
        isLoadingGroupDetailInfo ||
        isLoadingGroupLogs ||
        isLoadingGroupTransactions,
    },
    handler: {
      handleCreateFundRequest,
      handleCreateWithdrawRequest,
      handleFundRemind,
      handleStatistic,
      handleRefetchData,
      handlePress,
    },
  };
};

export default useGroupHomeDefault;
