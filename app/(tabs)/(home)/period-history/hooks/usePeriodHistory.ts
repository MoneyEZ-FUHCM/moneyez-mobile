import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency, formatDate, formatTime } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetCurrentUserSpendingModelChartDetailQuery,
  useGetTransactionByIdQuery,
  useGetUserSpendingModelDetailQuery,
} from "@/services/userSpendingModel";
import { TransactionViewModel } from "@/types/transaction.types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const formatTransaction = (item: TransactionViewModel) => {
  return {
    id: item?.id,
    subcategory: item?.description || "Không có mô tả",
    amount: item?.amount,
    type: item?.type?.toLowerCase() === "income" ? "income" : "expense",
    date: formatDate(item?.transactionDate),
    time: formatTime(item?.transactionDate),
    icon: item?.subcategoryIcon || "pending",
    description: item?.description,
  };
};

const usePeriodHistory = () => {
  const params = useLocalSearchParams();
  const { userSpendingId } = params;

  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<TransactionViewModel[]>([]);

  const {
    data: transactionsData,
    error,
    isLoading,
    isFetching: isFetchingTransactions,
    refetch: refetchTransaction,
  } = useGetTransactionByIdQuery(
    { id: userSpendingId, PageIndex: 1, PageSize: 20, type: "" },
    { skip: !userSpendingId },
  );

  const {
    data: currentUserSpendingModelChartDetail,
    isLoading: isLoadingCurrentUserSpendingModelChartDetail,
    isFetching,
    refetch: refetchChart,
  } = useGetCurrentUserSpendingModelChartDetailQuery(
    { id: userSpendingId },
    { skip: !userSpendingId },
  );

  const {
    data: userSpendingModelDetail,
    refetch,
    isFetching: isFetchingUserSpendingModelDetail,
  } = useGetUserSpendingModelDetailQuery(
    { id: userSpendingId as string },
    { skip: !userSpendingId },
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
      return () => {
        dispatch(setMainTabHidden(false));
      };
    }, [dispatch]),
  );

  useEffect(() => {
    if (userSpendingId) {
      refetchTransaction();
      refetchChart();
      refetch();
    }
  }, [userSpendingId]);

  useEffect(() => {
    if (transactionsData?.items) {
      const formattedTransactions = transactionsData.items?.map((item: any) => {
        return formatTransaction(item);
      });
      setTransactions(formattedTransactions as TransactionViewModel[]);
    }
  }, [transactionsData]);

  const handleRefetch = useCallback(() => {
    refetchTransaction();
    refetchChart();
    refetch();
  }, [refetchTransaction, refetchChart, refetch]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(true));
  }, []);

  const navigateToPeriodHistoryDetail = () => {
    dispatch(setMainTabHidden(true));
    router.push({
      pathname: PATH_NAME.HOME.PERIOD_HISTORY_DETAIL as any,
      params: { userSpendingId },
    });
  };

  const modelDetails = useMemo(
    () => ({
      income: userSpendingModelDetail?.data?.totalIncome ?? 0,
      expense: userSpendingModelDetail?.data?.totalExpense ?? 0,
      balance:
        (userSpendingModelDetail?.data?.totalIncome ?? 0) -
        (userSpendingModelDetail?.data?.totalExpense ?? 0),
      startDate: formatDate(userSpendingModelDetail?.data?.startDate),
      endDate: formatDate(userSpendingModelDetail?.data?.endDate),
    }),
    [userSpendingModelDetail],
  );

  const actualCategories =
    currentUserSpendingModelChartDetail?.data?.categories?.filter(
      (item: any) => {
        return item?.plannedPercentage !== 0;
      },
    );

  return {
    state: {
      transactions,
      modelDetails,
      isLoading:
        isLoading ||
        isLoadingCurrentUserSpendingModelChartDetail ||
        isFetching ||
        isFetchingTransactions ||
        isFetchingUserSpendingModelDetail,
      error,
      currentUserSpendingModelChart: currentUserSpendingModelChartDetail,
      categories: actualCategories || [],
    },
    handler: {
      formatCurrency,
      handleBack,
      navigateToPeriodHistoryDetail,
      handleRefetch,
    },
  };
};

export default usePeriodHistory;
