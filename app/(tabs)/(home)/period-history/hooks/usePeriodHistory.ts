import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useGetTransactionByModelQuery } from "@/services/transaction";
import { useLazyGetSubCateByIdQuery } from "@/services/subCategory";
import { PATH_NAME } from "@/helpers/constants/pathname";

export interface Transaction {
  id: string;
  subcategory: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  time: string;
  icon: string;
  description: string;
}

const usePeriodHistory = () => {
  const params = useLocalSearchParams();
  const { userSpendingId, startDate, endDate } = params;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [fetchSubCate] = useLazyGetSubCateByIdQuery();
  const [subCateIcons, setSubCateIcons] = useState<Record<string, string>>({});
  const [fetchingIcons, setFetchingIcons] = useState(false);

  const { HOME } = PATH_NAME;

  const period = startDate && endDate
    ? `${startDate} - ${endDate}`
    : "Kỳ chi tiêu";

  const {
    data: transactionsData,
    error,
    isLoading,
    refetch,
  } = useGetTransactionByModelQuery({
    modelId: userSpendingId,
    PageIndex: 1,
    PageSize: 3,
  }, {
    skip: !userSpendingId,
  });

  // Separate function to fetch subcategory icons
  const fetchSubcategoryIcons = useCallback(async (subcategoryIds: string[]) => {
    setFetchingIcons(true);
    const iconPromises = subcategoryIds
      .filter(id => !!id) // Filter out null/undefined IDs
      .map(async (id) => {
        try {
          const result = await fetchSubCate({ subcateId: id }).unwrap();
          return { id, icon: result.data.icon };
        } catch (err) {
          console.error(`Failed to fetch icon for subcategory ${id}:`, err);
          return { id, icon: "error" };
        }
      });

    const icons = await Promise.all(iconPromises);

    const iconMap = icons.reduce((acc, { id, icon }) => {
      acc[id] = icon;
      return acc;
    }, {} as Record<string, string>);

    setSubCateIcons(prev => ({ ...prev, ...iconMap }));
    setFetchingIcons(false);
  }, [fetchSubCate]);

  useEffect(() => {
    if (transactionsData?.items && transactionsData.items.length > 0) {
      const uniqueSubCateIds = Array.from(
        new Set(transactionsData.items.map((item: any) => item.subcategoryId))
      );

      if (uniqueSubCateIds.length > 0) {
        fetchSubcategoryIcons(uniqueSubCateIds);
      }
    }
  }, [transactionsData, fetchSubcategoryIcons]);

  useEffect(() => {
    if (transactionsData?.items) {
      let incomeTotal = 0;
      let expenseTotal = 0;

      const formattedTransactions = transactionsData.items.map((item: any) => {
        // Calculate totals
        if (item.type === "INCOME") {
          incomeTotal += item.amount;
        } else {
          expenseTotal += item.amount;
        }

        const date = new Date(item.transactionDate);
        const formattedDate = date.toLocaleDateString("vi-VN");
        const formattedTime = date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Use a default icon if we don't have the real one yet
        const icon = subCateIcons[item.subcategoryId] || "pending";

        return {
          id: item.id,
          subcategory: item.description || "Không có mô tả",
          amount: item.amount,
          type: item.type.toLowerCase() === "income" ? "income" : "expense",
          date: formattedDate,
          time: formattedTime,
          icon,
          description: item.description,
        };
      });

      // Update state values
      setTransactions(formattedTransactions as any);
      setTotalIncome(incomeTotal);
      setTotalExpense(expenseTotal);
    }
  }, [transactionsData, subCateIcons]);

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const handleBack = () => {
    router.back();
  };

  const navigateToPeriodHistoryDetail = () => {
    router.push({
      pathname: HOME.PERIOD_HISTORY_DETAIL as any,
      params: {
        userSpendingId,
        startDate,
        endDate,
      },
    });
  }

  const refetchData = () => {
    refetch();
  };

  return {
    state: {
      transactions,
      modelDetails: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
        period: period,
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