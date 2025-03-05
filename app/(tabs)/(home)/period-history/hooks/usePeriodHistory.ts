import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useLazyGetSubCateByIdQuery } from "@/services/subCategory";
import { useGetTransactionByModelQuery } from "@/services/transaction";
import { TransactionType } from "@/types/invidual.types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface TransactionViewModel {
  id: string;
  subcategory: string;
  amount: number;
  type: TransactionType;
  date: string;
  time: string;
  icon: string;
  description: string;
}

const formatTransaction = (
  item: any,
  subCateIcons: Record<string, string>,
): TransactionViewModel => {
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
    icon: subCateIcons[item.subcategoryId] || "pending",
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
  const [transactions, setTransactions] = useState<TransactionViewModel[]>([]);
  const [fetchSubCate] = useLazyGetSubCateByIdQuery();
  const [subCateIcons, setSubCateIcons] = useState<Record<string, string>>({});
  const [fetchingIcons, setFetchingIcons] = useState(false);
  const dispatch = useDispatch();

  const totalIncome = Number(incomeParam || 0);
  const totalExpense = Number(expenseParam || 0);

  const { HOME } = PATH_NAME;

  const {
    data: transactionsData,
    error,
    isLoading,
    refetch,
  } = useGetTransactionByModelQuery(
    { modelId: userSpendingId, PageIndex: 1, PageSize: 5 },
    { skip: !userSpendingId },
  );

  const fetchSubcategoryIcons = useCallback(
    async (subcategoryIds: string[]) => {
      const newIds = subcategoryIds.filter((id) => !subCateIcons[id]);
      if (newIds.length === 0) return;
      setFetchingIcons(true);
      try {
        const iconPromises = newIds.map(async (id) => {
          try {
            const result = await fetchSubCate({ subcateId: id }).unwrap();
            return { id, icon: result.data.icon };
          } catch (err) {
            console.error(`Failed to fetch icon for subcategory ${id}:`, err);
            return { id, icon: "error" };
          }
        });
        const icons = await Promise.all(iconPromises);
        const iconMap = icons.reduce(
          (acc, { id, icon }) => {
            acc[id] = icon;
            return acc;
          },
          {} as Record<string, string>,
        );
        setSubCateIcons((prev) => ({ ...prev, ...iconMap }));
      } finally {
        setFetchingIcons(false);
      }
    },
    [fetchSubCate, subCateIcons],
  );

  // Fetch icons when new transactions come in.
  useEffect(() => {
    if (transactionsData?.items?.length) {
      const uniqueSubCateIds = Array.from(
        new Set(transactionsData.items.map((item: any) => item.subcategoryId)),
      );
      if (uniqueSubCateIds.length) {
        fetchSubcategoryIcons(uniqueSubCateIds);
      }
    }
  }, [transactionsData, fetchSubcategoryIcons]);

  useEffect(() => {
    if (transactionsData?.items) {
      const formattedTransactions = transactionsData.items.map((item: any) => {
        return formatTransaction(item, subCateIcons);
      });
      setTransactions(formattedTransactions);
    }
  }, [transactionsData, subCateIcons]);

  const handleBack = () => router.back();

  const navigateToPeriodHistoryDetail = () => {
    dispatch(setMainTabHidden(true));
    router.push({
      pathname: HOME.PERIOD_HISTORY_DETAIL as any,
      params: { userSpendingId, startDate, endDate, totalIncome, totalExpense },
    });
  };

  const refetchData = () => refetch();

  return {
    state: {
      transactions,
      modelDetails: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
        startDate: startDate,
        endDate: endDate,
      },
      isLoading: isLoading || fetchingIcons,
      isModelLoading: false,
      error,
      modelError: null,
    },
    handler: {
      formatCurrency,
      handleBack,
      navigateToPeriodHistoryDetail,
      refetchData,
    },
  };
};

export default usePeriodHistory;
