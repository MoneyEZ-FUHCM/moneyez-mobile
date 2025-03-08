import { TRANSACTION_TYPE } from "@/enums/globals";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetTransactionByIdQuery,
  useGetUserSpendingModelDetailQuery,
} from "@/services/userSpendingModel";
import { TransactionViewModelDetail } from "@/types/transaction.types";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastAndroid } from "react-native";
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
  const { userSpendingId } = params;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [isRefetching, setIsRefetching] = useState(false);

  const [subcategories, setSubcategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const dispatch = useDispatch();

  const pageSize = 10;

  const {
    data: userSpendingModelDetail,
    refetch: handleRefetchUserSpendingModelDetail,
    isFetching: isFetchingDetail,
  } = useGetUserSpendingModelDetailQuery(
    { id: userSpendingId as string },
    { skip: !userSpendingId },
  );

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
    isFetching: isFetchingTransaction,
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
      setIsFiltering(false);
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

  const handleRefetchData = useCallback(() => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);
    setPageIndex(1);

    Promise.all([refetch(), handleRefetchUserSpendingModelDetail()]).finally(
      () => {
        setIsRefetching(false);
        ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
      },
    );
  }, [refetch, handleRefetchUserSpendingModelDetail, isRefetching]);

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

  return {
    state: {
      transactions,
      allTransactions: transactions,
      totalCount,
      modelDetails,
      isLoading,
      isLoadingMore,
      filterType,
      selectedSubcategory,
      subcategories,
      error,
      showFilters,
      isFetching: isFetchingDetail || isFetchingTransaction,
      isFiltering,
    },
    handler: {
      formatCurrency,
      handleBack,
      handleFilterBySubcategory,
      loadMoreData,
      handleResetFilter,
      handleRefetchData,
      setShowFilters,
      setFilterType,
      setIsFiltering,
    },
  };
};

export default usePeriodHistoryDetail;
