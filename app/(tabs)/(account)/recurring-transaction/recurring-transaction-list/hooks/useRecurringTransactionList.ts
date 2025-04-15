import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useDeleteRecurringTransactionMutation,
  useGetRecurringTransactionQuery
} from "@/services/recurringTransaction";
import { RecurringTransaction } from "@/types/recurringTransaction.types";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import TEXT_TRANSLATE from "../RecurringTransactionList.translate";

const useRecurringTransactionList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<RecurringTransaction | null>(null);
  const modalizeRef = useRef<Modalize>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);

  const { data, isLoading, refetch, isFetching } = useGetRecurringTransactionQuery({
    PageIndex: pageIndex,
    PageSize: pageSize
  });
  const [deleteRecurringTransaction, { isLoading: isDeleting }] = useDeleteRecurringTransactionMutation();

  const dispatch = useDispatch();
  useHideTabbar();

  useEffect(() => {
    if (data?.data?.data) {
      if (pageIndex === 1) {
        setTransactions(data.data.data);
      } else {
        const existingIds = new Set(transactions.map(t => t.id));
        const newItems = data.data.data.filter((item: RecurringTransaction) => !existingIds.has(item.id));

        setTransactions(prev => [...prev, ...newItems]);
      }

      const metaData = data.data.metaData;
      if (metaData) {
        setHasMore(metaData.hasNext);
      }
    }
  }, [data, pageIndex, transactions]);

  const handleOpenDetail = useCallback((item: RecurringTransaction) => {
    setSelectedTransaction(item);
    modalizeRef.current?.open();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageIndex(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPageIndex(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

  const handleNavigateToForm = useCallback(() => {
    dispatch(setMainTabHidden(true));
    router.push({
      pathname: PATH_NAME.ACCOUNT.RECURRING_TRANSACTION_FORM as any,
    });
  }, [dispatch]);

  const handleEditTransaction = useCallback(() => {
    if (selectedTransaction) {
      dispatch(setMainTabHidden(true));
      router.push({
        pathname: PATH_NAME.ACCOUNT.RECURRING_TRANSACTION_FORM as any,
        params: { id: selectedTransaction.id },
      });
      modalizeRef.current?.close();
    }
  }, [selectedTransaction, dispatch]);

  const handleDeleteTransaction = useCallback(() => {
    if (selectedTransaction) {
      Alert.alert(
        "Xác nhận",
        TEXT_TRANSLATE.MESSAGE.DELETE_CONFIRM,
        [
          {
            text: TEXT_TRANSLATE.BUTTON.CANCEL,
            style: "cancel",
          },
          {
            text: TEXT_TRANSLATE.BUTTON.DELETE,
            style: "destructive",
            onPress: async () => {
              try {
                await deleteRecurringTransaction({ id: selectedTransaction.id }).unwrap();
                modalizeRef.current?.close();
                setPageIndex(1);
                refetch();
                Alert.alert("Thành công", TEXT_TRANSLATE.MESSAGE.DELETE_SUCCESS);
              } catch (error) {
                console.error("Failed to delete recurring transaction:", error);
                Alert.alert("Lỗi", TEXT_TRANSLATE.MESSAGE.DELETE_ERROR);
              }
            },
          },
        ]
      );
    }
  }, [selectedTransaction, deleteRecurringTransaction, refetch]);

  const getFrequencyText = useCallback((frequencyType: number, interval: number) => {
    switch (frequencyType) {
      case 0:
        return `Chu kỳ ${TEXT_TRANSLATE.FREQUENCY.EVERY} ${interval} ${TEXT_TRANSLATE.FREQUENCY.DAILY}`;
      case 1:
        return `Chu kỳ ${TEXT_TRANSLATE.FREQUENCY.EVERY} ${interval} ${TEXT_TRANSLATE.FREQUENCY.WEEKLY}`;
      case 2:
        return `Chu kỳ ${TEXT_TRANSLATE.FREQUENCY.EVERY} ${interval} ${TEXT_TRANSLATE.FREQUENCY.MONTHLY}`;
      case 3:
        return `Chu kỳ ${TEXT_TRANSLATE.FREQUENCY.EVERY} ${interval} ${TEXT_TRANSLATE.FREQUENCY.YEARLY}`;
      default:
        return "";
    }
  }, []);

  const handleBack = () => {
    dispatch(setMainTabHidden(false));
    router.back();
  };

  return {
    state: {
      refreshing,
      selectedTransaction,
      modalizeRef,
      pageIndex,
      transactions,
      isLoading,
      isFetching,
      hasMore,
      isDeleting,
    },
    handler: {
      handleBack,
      handleOpenDetail,
      handleRefresh,
      handleLoadMore,
      handleNavigateToForm,
      handleEditTransaction,
      handleDeleteTransaction,
      getFrequencyText,
    }
  };
};

export default useRecurringTransactionList;