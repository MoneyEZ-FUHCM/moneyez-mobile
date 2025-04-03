import { TRANSACTION_STATUS } from "@/enums/globals";
import useHideGroupTabbar from "@/hooks/useHideGroupTabbar";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { useGetGroupTransactionQuery } from "@/services/transaction";
import { GroupTransaction } from "@/types/transaction.types";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useSelector } from "react-redux";
import ACTION_LOG_HISTORY_CONSTANT from "../ActionLogHistory.constant";

type NotificationTabType =
  | TRANSACTION_STATUS.APPROVED
  | TRANSACTION_STATUS.PENDING
  | TRANSACTION_STATUS.REJECTED;

const useActionLogHistory = () => {
  const pageSize = 10;
  const initialActiveTab: NotificationTabType = TRANSACTION_STATUS.APPROVED;
  const { TABS } = ACTION_LOG_HISTORY_CONSTANT;
  const [activeTab, setActiveTab] =
    useState<NotificationTabType>(initialActiveTab);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [transactionActivities, setTransactionActivities] = useState<
    GroupTransaction[]
  >([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const groupDetail = useSelector(selectCurrentGroup);

  const {
    data: groupTransaction,
    refetch: refetchGroupTransactions,
    isLoading,
  } = useGetGroupTransactionQuery(
    {
      groupId: groupDetail?.id,
      PageIndex: pageIndex,
      PageSize: pageSize,
      status: activeTab,
    },
    { skip: !groupDetail?.id },
  );

  useHideGroupTabbar();

  useEffect(() => {
    if (transactionActivities?.length > 0) {
      setTransactionActivities([]);
      setPageIndex(1);
    }
  }, [activeTab]);

  useEffect(() => {
    if (groupTransaction?.items) {
      if (isRefetching) {
        setTransactionActivities(groupTransaction?.items);
        setPageIndex(1);
      } else {
        setTransactionActivities((prevActivities) => {
          const existingIds = new Set(prevActivities.map((item) => item.id));
          const newItems = groupTransaction.items.filter(
            (item: any) => !existingIds.has(item.id),
          );
          return [...prevActivities, ...newItems];
        });
      }

      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [groupTransaction?.items, isFetchingData]);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading &&
      !isLoadingMore &&
      groupTransaction?.items?.length === pageSize
    ) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [isLoading, isLoadingMore, groupTransaction?.items?.length, pageSize]);

  const handleRefetchActivities = useCallback(async () => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);
    setPageIndex(1);
    await refetchGroupTransactions().finally(() => {
      setTimeout(() => setIsRefetching(false), 2000);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetchGroupTransactions, isRefetching]);

  const handleAcceptTransaction = useCallback((transactionId: string) => {
    console.log("Accept", transactionId);
  }, []);

  const handleRejectTransaction = useCallback((transactionId: string) => {
    console.log("Reject", transactionId);
  }, []);

  return {
    state: {
      TABS,
      activeTab,
      transactionActivities,
      isLoading,
      isFetchingData,
      isRefetching,
      pageSize,
      isLoadingMore,
      groupTransaction,
    },
    handler: {
      setActiveTab,
      handleRefetchActivities,
      handleLoadMore,
      handleAcceptTransaction,
      handleRejectTransaction,
    },
  };
};
export default useActionLogHistory;
