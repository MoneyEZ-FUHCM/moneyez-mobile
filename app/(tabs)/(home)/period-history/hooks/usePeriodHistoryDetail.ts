import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useGetTransactionByModelQuery } from "@/services/transaction";
import { useLazyGetSubCateByIdQuery } from "@/services/subCategory";
import { formatCurrency } from "@/helpers/libs";
import useDebounce from "@/hooks/useDebounce";

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

const formatTransaction = (
  item: any,
  icons: Record<string, string>,
): Transaction => {
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
    icon: icons[item.subcategoryId] || "receipt",
    description: item.description,
    subcategoryId: item.subcategoryId,
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
  const [totalCount, setTotalCount] = useState(0);
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
  const [fetchSubCate] = useLazyGetSubCateByIdQuery();
  const [subCateIcons, setSubCateIcons] = useState<Record<string, string>>({});
  const [fetchingIcons, setFetchingIcons] = useState(false);
  const totalIncome = Number(incomeParam || 0);
  const totalExpense = Number(expenseParam || 0);

  const {
    data: transactionsData,
    error,
    isLoading,
    refetch,
  } = useGetTransactionByModelQuery(
    { modelId: userSpendingId, PageIndex: currentPage, PageSize: 20 },
    { skip: !userSpendingId },
  );

  const fetchSubcategoryIcons = useCallback(
    async (subcategoryIds: string[]) => {
      const newIds = subcategoryIds.filter((id) => !subCateIcons[id]);
      if (newIds.length === 0) return;
      setFetchingIcons(true);
      try {
        const iconPromises = newIds
          .filter((id) => !!id)
          .map(async (id) => {
            try {
              const result = await fetchSubCate({ subcateId: id }).unwrap();
              return { id, icon: result.data.icon, name: result.data.name };
            } catch (err) {
              console.error(`Failed to fetch icon for subcategory ${id}:`, err);
              return { id, icon: "receipt", name: "Unknown" };
            }
          });
        const icons = await Promise.all(iconPromises);

        const uniqueSubcategories = icons.reduce(
          (acc, { id, name }) => {
            if (id && !acc.some((item) => item.id === id)) {
              acc.push({ id, name });
            }
            return acc;
          },
          [] as Array<{ id: string; name: string }>,
        );
        setSubcategories((prev) => {
          const existing = [...prev];
          uniqueSubcategories.forEach((category) => {
            if (!existing.some((item) => item.id === category.id)) {
              existing.push(category);
            }
          });
          return existing;
        });

        const iconMap = icons.reduce(
          (acc, { id, icon }) => {
            if (id) acc[id] = icon;
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

  useEffect(() => {
    if (transactionsData) {
      if (transactionsData.totalCount)
        setTotalCount(transactionsData.totalCount);
      if (transactionsData.items && transactionsData.items.length > 0) {
        const uniqueSubCateIds = Array.from(
          new Set(
            transactionsData.items.map((item: any) => item.subcategoryId),
          ),
        );
        if (uniqueSubCateIds.length > 0) {
          fetchSubcategoryIcons(uniqueSubCateIds);
        }
      }
      setIsLoadingMore(false);
    }
  }, [transactionsData, fetchSubcategoryIcons]);

  useEffect(() => {
    if (transactionsData?.items) {
      const formattedTransactions = transactionsData.items.map((item: any) =>
        formatTransaction(item, subCateIcons),
      );

      if (currentPage === 1) {
        setTransactions(formattedTransactions);
      } else {
        setTransactions((prev) => {
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
  }, [transactionsData, subCateIcons, currentPage]);

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
      isLoading: isLoading || fetchingIcons,
      isLoadingMore,
      searchQuery,
      filterType,
      selectedSubcategory,
      subcategories,
      error,
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
    },
  };
};

export default usePeriodHistoryDetail;
