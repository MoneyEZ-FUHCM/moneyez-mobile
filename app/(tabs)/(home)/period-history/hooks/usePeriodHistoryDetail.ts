import { formatCurrency } from "@/helpers/libs";
import useDebounce from "@/hooks/useDebounce";
import { useGetTransactionByIdQuery } from "@/services/transaction";
import { TransactionViewModelDetail } from "@/types/transaction.types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // NEW: Debounce the search input
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [subcategories, setSubcategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  const totalIncome = Number(incomeParam || 0);
  const totalExpense = Number(expenseParam || 0);

  const {
    data: transactionsData,
    error,
    isLoading,
    refetch,
  } = useGetTransactionByIdQuery(
    { id: userSpendingId, PageIndex: 1, PageSize: 20 },
    { skip: !userSpendingId },
  );
  const totalCount = transactionsData?.totalCount ?? 0;

  useEffect(() => {
    if (transactionsData?.items) {
      const formattedTransactions = transactionsData.items.map((item: any) =>
        formatTransaction(item),
      );

      if (currentPage === 1) {
        setTransactions(formattedTransactions as TransactionViewModelDetail[]);
      } else {
        setTransactions((prev: any) => {
          const merged = [...prev, ...formattedTransactions];
          // Remove duplicates based on transaction id.
          const unique = merged.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id),
          );
          return unique;
        });
      }
    }
  }, [transactionsData, currentPage]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = debouncedSearchQuery
        ? transaction.description
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        : true;
      const matchesType =
        filterType === "all" ? true : transaction.type === filterType;
      const matchesSubcategory = selectedSubcategory
        ? transaction.subcategoryId === selectedSubcategory
        : true;
      return matchesSearch && matchesType && matchesSubcategory;
    });
  }, [transactions, debouncedSearchQuery, filterType, selectedSubcategory]);

  const loadMoreData = useCallback(() => {
    if (transactions.length < totalCount && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [transactions.length, totalCount, isLoadingMore]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setFilterType("all");
    setSelectedSubcategory(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterByType = useCallback(
    (type: "all" | "income" | "expense") => {
      setFilterType(type);
    },
    [],
  );

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
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  return {
    state: {
      transactions: filteredTransactions,
      allTransactions: transactions,
      totalCount,
      modelDetails: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
        startDate,
        endDate,
      },
      isLoading: isLoading,
      isLoadingMore,
      searchQuery,
      filterType,
      selectedSubcategory,
      subcategories,
      error,
      showFilters,
    },
    handler: {
      formatCurrency,
      handleBack,
      handleSearch,
      handleFilterByType,
      handleFilterBySubcategory,
      loadMoreData,
      resetFilters,
      refetchData,
      setShowFilters,
    },
  };
};

export default usePeriodHistoryDetail;
