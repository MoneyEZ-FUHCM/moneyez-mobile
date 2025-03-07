import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetTransactionByIdQuery } from "@/services/transaction";
import { useGetCurrentUserSpendingModelChartDetailQuery } from "@/services/userSpendingModel";
import { TransactionViewModel } from "@/types/transaction.types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const formatTransaction = (item: TransactionViewModel) => {
  const dateObj = new Date(item.transactionDate);
  return {
    id: item.id,
    subcategory: item.description || "Không có mô tả",
    amount: item.amount,
    type: item.type.toLowerCase() === "income" ? "income" : "expense",
    date: dateObj.toLocaleDateString("vi-VN"),
    time: dateObj.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    icon: item.subcategoryIcon || "pending",
    description: item.description,
  };
};

const usePeriodHistory = () => {
  const params = useLocalSearchParams();
  const {
    userSpendingId,
    startDate,
    endDate,
    totalIncome: incomeParam,
    totalExpense: expenseParam,
  } = params;

  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<TransactionViewModel[]>([]);

  const totalIncome = useMemo(() => Number(incomeParam || 0), [incomeParam]);
  const totalExpense = useMemo(() => Number(expenseParam || 0), [expenseParam]);

  const {
    data: transactionsData,
    error,
    isLoading,
    isFetching: isFetchingTransactions,
    refetch: refetchTransaction,
  } = useGetTransactionByIdQuery(
    { id: userSpendingId, PageIndex: 1, PageSize: 20 },
    { skip: !userSpendingId },
  );

  const {
    data: currentUserSpendingModelChart,
    isLoading: isLoadingCurrentUserSpendingModelChart,
    isFetching,
    refetch: refetchChart,
  } = useGetCurrentUserSpendingModelChartDetailQuery(
    { id: userSpendingId },
    { skip: !userSpendingId },
  );

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
  }, [refetchTransaction, refetchChart]);

  const handleBack = useCallback(() => router.back(), []);

  const navigateToPeriodHistoryDetail = () => {
    dispatch(setMainTabHidden(true));
    router.push({
      pathname: PATH_NAME.HOME.PERIOD_HISTORY_DETAIL as any,
      params: { userSpendingId, startDate, endDate, totalIncome, totalExpense },
    });
  };

  const modelDetails = useMemo(
    () => ({
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      startDate,
      endDate,
    }),
    [totalIncome, totalExpense, startDate, endDate],
  );

  return {
    state: {
      transactions,
      modelDetails,
      isLoading:
        isLoading ||
        isLoadingCurrentUserSpendingModelChart ||
        isFetching ||
        isFetchingTransactions,
      error,
      currentUserSpendingModelChart,
      categories: currentUserSpendingModelChart?.data?.categories || [],
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
