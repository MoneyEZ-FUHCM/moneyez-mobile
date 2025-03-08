import { TRANSACTION_TYPE } from "@/enums/globals";
import { formatCurrency } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetTransactionByIdQuery } from "@/services/userSpendingModel";
import { TransactionViewModelDetail } from "@/types/transaction.types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface Transaction {
  id: string;
  subcategory: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  time: string;
  icon: string;
  description: string;
  subcategoryId: string;
}

const formatTransaction = (item: TransactionViewModelDetail) => {
  const dateObj = new Date(item.transactionDate);
  return {
    id: item?.id,
    name: item?.subCategoryName,
    subcategory: item?.description || "Không có mô tả",
    amount: item?.amount,
    type: item?.type?.toLowerCase() === "income" ? "income" : "expense",
    date: dateObj.toLocaleDateString("vi-VN"),
    time: dateObj.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    icon: item?.subcategoryIcon || "receipt",
    description: item?.description,
    subcategoryId: item?.subcategoryId,
  };
};

const usePeriodHistoryDetail = () => {
  const params = useLocalSearchParams();
  const {
    userSpendingId,
    startDate,
    endDate,
    totalIncome: incomeParam,
    totalExpense: expenseParam,
  } = params;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [pageIndex, setPageIndex] = useState(1);

  const [subcategories, setSubcategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  const totalIncome = Number(incomeParam || 0);
  const totalExpense = Number(expenseParam || 0);
  const dispatch = useDispatch();

  const pageSize = 10;

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );
  const [filterType, setFilterType] = useState<
    TRANSACTION_TYPE.INCOME | TRANSACTION_TYPE.EXPENSE | ""
  >("");
  const {
    data: transactionsData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetTransactionByIdQuery(
    {
      id: userSpendingId,
      PageIndex: pageIndex,
      PageSize: pageSize,
      type: filterType,
    },
    { skip: !userSpendingId },
  );
  const totalCount = transactionsData?.totalCount ?? 0;

  useEffect(() => {
    setTransactions([]);
    setPageIndex(1);
  }, [filterType]);

  const loadMoreData = useCallback(() => {
    if (
      !isLoading &&
      !isLoadingMore &&
      transactionsData?.items.length === pageSize
    ) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [transactions.length, totalCount, isLoadingMore]);

  useEffect(() => {
    if (transactionsData?.items) {
      setTransactions((prevGroups) => [
        ...prevGroups,
        ...transactionsData.items.map(formatTransaction as any),
      ]);
      setIsLoadingMore(false);
    }
  }, [transactionsData]);

  const handleResetFilter = useCallback(() => {
    setFilterType("");
  }, []);

  const handleFilterBySubcategory = useCallback(
    (subcategoryId: string | null) => {
      setSelectedSubcategory(subcategoryId);
    },
    [],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const refetchData = useCallback(() => {
    setPageIndex(1);
    refetch();
  }, [refetch]);

  return {
    state: {
      transactions,
      allTransactions: transactions,
      totalCount,
      modelDetails: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
        startDate,
        endDate,
      },
      isLoading,
      isLoadingMore,
      searchQuery,
      filterType,
      selectedSubcategory,
      subcategories,
      error,
      showFilters,
      isFetching,
    },
    handler: {
      formatCurrency,
      handleBack,
      // handleFilterByType,
      handleFilterBySubcategory,
      loadMoreData,
      handleResetFilter,
      refetchData,
      setShowFilters,
      setFilterType,
    },
  };
};

export default usePeriodHistoryDetail;
