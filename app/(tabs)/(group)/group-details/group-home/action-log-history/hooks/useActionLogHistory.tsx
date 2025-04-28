import { GROUP_ROLE, TRANSACTION_STATUS } from "@/helpers/enums/globals";
import useHideGroupTabbar from "@/helpers/hooks/useHideGroupTabbar";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import {
  useGetGroupTransactionQuery,
  useUpdateGroupTransactionStatusMutation,
} from "@/services/transaction";
import { GroupTransaction } from "@/helpers/types/transaction.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import ACTION_LOG_HISTORY_CONSTANT from "../ActionLogHistory.constant";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { setLoading } from "@/redux/slices/loadingSlice";
import TEXT_TRANSLATE_ACTION_LOG_HISTORY from "../ActionLogHistory.translate";

type NotificationTabType =
  | TRANSACTION_STATUS.CONFIRMED
  | TRANSACTION_STATUS.PENDING
  | TRANSACTION_STATUS.REJECTED;

const useActionLogHistory = () => {
  const pageSize = 10;
  const initialActiveTab: NotificationTabType = TRANSACTION_STATUS.CONFIRMED;
  const { TABS } = ACTION_LOG_HISTORY_CONSTANT;
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const [activeTab, setActiveTab] =
    useState<NotificationTabType>(initialActiveTab);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const detailModalizeRef = useRef<Modalize>(null);
  const [selectedLog, setSelectedLog] = useState<GroupTransaction | null>(null);
  const [transactionActivities, setTransactionActivities] = useState<
    GroupTransaction[]
  >([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [updateGroupTransactionStatus] =
    useUpdateGroupTransactionStatusMutation();
  const dispatch = useDispatch();

  const groupDetail = useSelector(selectCurrentGroup);
  const userInfo = useSelector(selectUserInfo);

  const isLeader = useMemo(() => {
    return groupDetail?.groupMembers?.some(
      (member) =>
        member?.userId === userInfo?.id && member?.role === GROUP_ROLE.LEADER,
    );
  }, [groupDetail, userInfo]);

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

  const [selectedTransaction, setSelectedTransaction] =
    useState<GroupTransaction | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const modalizeRef = useRef<Modalize>(null);

  const handleOpenRejectModal = useCallback((transaction: GroupTransaction) => {
    setSelectedTransaction(transaction);
    setRejectReason("");
    modalizeRef.current?.open();
  }, []);

  const handleAcceptTransaction = useCallback(
    async (transactionId: string) => {
      const payload = {
        transactionId,
        isApprove: true,
        note: "",
      };

      dispatch(setLoading(true));
      try {
        await updateGroupTransactionStatus(payload).unwrap();
        ToastAndroid.show(
          TEXT_TRANSLATE_ACTION_LOG_HISTORY.MESSAGE_SUCCESS.ACCEPT,
          ToastAndroid.SHORT,
        );

        if (activeTab === TRANSACTION_STATUS.PENDING) {
          setTransactionActivities((prevActivities) =>
            prevActivities.filter((item) => item.id !== transactionId),
          );
        }
      } catch (err: any) {
        const error = err?.data;
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [activeTab, refetchGroupTransactions],
  );

  const handleRejectTransaction = useCallback(
    async (transactionId: string) => {
      if (!rejectReason.trim()) {
        ToastAndroid.show("Vui lòng nhập lý do từ chối", ToastAndroid.SHORT);
        return;
      }

      const payload = {
        transactionId,
        isApprove: false,
        note: rejectReason.trim(),
      };
      dispatch(setLoading(true));
      try {
        await updateGroupTransactionStatus(payload).unwrap();
        ToastAndroid.show(
          TEXT_TRANSLATE_ACTION_LOG_HISTORY.MESSAGE_SUCCESS.REJECT,
          ToastAndroid.SHORT,
        );

        modalizeRef.current?.close();

        if (activeTab === TRANSACTION_STATUS.PENDING) {
          setTransactionActivities((prevActivities) =>
            prevActivities.filter((item) => item.id !== transactionId),
          );
        }
      } catch (err: any) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [activeTab, rejectReason],
  );

  const handleOpenDetailModal = (activity: GroupTransaction) => {
    setSelectedLog(activity);
    detailModalizeRef.current?.open();
  };

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
      isLeader,
      modalizeRef,
      selectedTransaction,
      rejectReason,
      detailModalizeRef,
      selectedLog,
    },
    handler: {
      setActiveTab,
      handleRefetchActivities,
      handleLoadMore,
      handleAcceptTransaction,
      handleRejectTransaction,
      setRejectReason,
      handleOpenRejectModal,
      setSelectedLog,
      handleOpenDetailModal,
    },
  };
};
export default useActionLogHistory;
