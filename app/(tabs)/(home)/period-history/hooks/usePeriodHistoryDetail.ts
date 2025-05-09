import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { TRANSACTION_TYPE } from "@/helpers/enums/globals";
import { formatCurrency, formatDate, formatTime } from "@/helpers/libs";
import { TransactionViewModelDetail } from "@/helpers/types/transaction.types";
import { setImageView } from "@/redux/slices/systemSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useDeletePersonalTransactionMutation,
  useGetTransactionDetailQuery,
} from "@/services/transaction";
import {
  useGetTransactionByIdQuery,
  useGetUserSpendingModelDetailQuery,
} from "@/services/userSpendingModel";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
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
  return {
    id: item?.id,
    name: item?.subCategoryName,
    subcategory: item?.description || "Không có mô tả",
    amount: item?.amount,
    type: item?.type?.toLowerCase() === "income" ? "income" : "expense",
    date: formatDate(item?.transactionDate),
    time: formatTime(item?.transactionDate),
    icon: item?.subcategoryIcon || "receipt",
    description: item?.description,
    subcategoryId: item?.subcategoryId,
  };
};

const usePeriodHistoryDetail = () => {
  const params = useLocalSearchParams();
  const { userSpendingId, activeTab } = params;
  const dispatch = useDispatch();

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const [transactions, setTransactions] = useState<
    TransactionViewModelDetail[]
  >([]);
  const [subcategories, setSubcategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [filterType, setFilterType] = useState<
    TRANSACTION_TYPE.INCOME | TRANSACTION_TYPE.EXPENSE | ""
  >("");
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const modalizeRef = useRef<Modalize>(null);
  const deleteModalizeRef = useRef<Modalize>(null);
  const swipeRef = useRef<Swipeable>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const pageSize = 10;

  const [deleteTransaction] = useDeletePersonalTransactionMutation();

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
      return () => dispatch(setMainTabHidden(false));
    }, [dispatch]),
  );

  const {
    data: userSpendingModelDetail,
    refetch: handleRefetchUserSpendingModelDetail,
    isFetching: isFetchingDetail,
  } = useGetUserSpendingModelDetailQuery(
    { id: userSpendingId as string },
    { skip: !userSpendingId },
  );

  const handleNavigateTransactionDetail = useCallback(
    (transactionId: string) => {
      setSelectedTransactionId(transactionId);
      modalizeRef.current?.open();
    },
    [],
  );

  const { data: transactionDetail, isFetching: isFetchingTransactionDetail } =
    useGetTransactionDetailQuery(
      { transactionId: selectedTransactionId as string },
      { skip: !selectedTransactionId },
    );

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
    { skip: !userSpendingId, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (transactionsData?.totalCount !== undefined) {
      setTotalCount(transactionsData.totalCount);
    }
  }, [transactionsData?.totalCount]);

  useEffect(() => {
    if (transactions?.length > 0) {
      setTransactions([]);
      setPageIndex(1);
    }
  }, [filterType]);

  useEffect(() => {
    if (transactionsData?.items) {
      if (isRefetching) {
        setTransactions(transactionsData?.items?.map(formatTransaction as any));
        setPageIndex(1);
      } else {
        setTransactions((prevTransactions: any) => {
          const newTransactions = transactionsData?.items?.map(
            formatTransaction as any,
          );
          const uniqueTransactions = [
            ...prevTransactions,
            ...newTransactions.filter(
              (newTrans: any) =>
                !prevTransactions.some(
                  (oldTrans: any) => oldTrans?.id === newTrans?.id,
                ),
            ),
          ];
          return uniqueTransactions;
        });
      }
      setIsFiltering(false);
      setIsLoadingMore(false);
    }
  }, [transactionsData?.items, isRefetching]);

  const loadMoreData = useCallback(() => {
    if (
      !isLoading &&
      !isLoadingMore &&
      transactionsData?.items.length === pageSize
    ) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [transactionsData?.items.length, isLoadingMore, isLoading]);

  const handleResetFilter = useCallback(() => {
    if (filterType !== "") setFilterType("");
  }, [filterType]);

  const handleFilterBySubcategory = useCallback(
    (subcategoryId: string | null) => {
      if (subcategoryId !== selectedSubcategory) {
        setSelectedSubcategory(subcategoryId);
      }
    },
    [selectedSubcategory],
  );

  const handleFilterPress = useCallback(
    (type: string | number) => {
      if (filterType === type) return;
      setFilterType(type as any);
      setIsFiltering(true);
    },
    [filterType, setFilterType, setIsFiltering],
  );

  const handleBack = useCallback(() => router.back(), []);

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

    Promise.all([refetch(), handleRefetchUserSpendingModelDetail()])
      // .then(([newData]) => {
      //   if (newData?.data?.items) {
      //     setTransactions(newData.data.items.map(formatTransaction as any));
      //   }
      // })
      .finally(() => {
        setIsRefetching(false);
        ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
      });
  }, [refetch, handleRefetchUserSpendingModelDetail]);

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

  const handleSetImageView = useCallback(() => {
    dispatch(setImageView(true));
  }, []);

  const handleOpenModalRemoveTransaction = useCallback(
    (transactionId: string) => {
      deleteModalizeRef.current?.open();
      setSelectedTransactionId(transactionId);
    },
    [],
  );

  const handleDeleteTransaction = async (transactionId?: string) => {
    if (!transactionId) return;
    try {
      await deleteTransaction(transactionId).unwrap();
      setTransactions((prevTrans: any) =>
        prevTrans.filter((tran: any) => tran.id !== transactionId),
      );
      refetch();
      ToastAndroid.show("Đã xóa giao dịch thành công", ToastAndroid.SHORT);
      deleteModalizeRef?.current?.close();
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === "TransactionNotFound") {
        ToastAndroid.show("Giao dịch không tồn tại", ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  };

  return {
    state: {
      transactions,
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
      transactionsData,
      pageSize,
      isRefetching,
      modalizeRef,
      transactionDetail: transactionDetail?.data,
      isLoadingTransactionDetail: isFetchingTransactionDetail,
      swipeRef,
      deleteModalizeRef,
      activeTab,
    },
    handler: {
      formatCurrency,
      handleBack,
      handleFilterBySubcategory,
      loadMoreData,
      handleResetFilter,
      handleRefetchData,
      setShowFilters,
      handleFilterPress,
      handleNavigateTransactionDetail,
      handleSetImageView,
      handleOpenModalRemoveTransaction,
      handleDeleteTransaction,
    },
  };
};

export default usePeriodHistoryDetail;
