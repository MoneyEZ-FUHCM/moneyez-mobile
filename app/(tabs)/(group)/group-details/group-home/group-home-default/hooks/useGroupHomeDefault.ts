import { TRANSACTION_STATUS } from "@/enums/globals";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup, setCurrentGroup } from "@/redux/slices/groupSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupDetailQuery, useGetGroupLogsQuery } from "@/services/group";
import { useGetGroupTransactionQuery } from "@/services/transaction";
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
    dispatch(setCurrentGroup(groupDetailInfo?.data));
  }, [dispatch]);

  const groupDetail = useSelector(selectCurrentGroup);

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
      status: TRANSACTION_STATUS.APPROVED,
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
