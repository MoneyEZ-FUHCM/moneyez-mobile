import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useGetTransactionByModelQuery } from "@/services/transaction";
import { useLazyGetSubCateByIdQuery } from "@/services/subCategory";

export interface Transaction {
  id: string;
  subcategory: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  time: string;
  icon: string;
  description: string;
  subcategoryId: string;
}

const usePeriodHistoryDetail = () => {
  const params = useLocalSearchParams();
  const { userSpendingId, startDate, endDate } = params;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Array<{ id: string, name: string }>>([]);
  const [fetchSubCate] = useLazyGetSubCateByIdQuery();
  const [subCateIcons, setSubCateIcons] = useState<Record<string, string>>({});
  const [fetchingIcons, setFetchingIcons] = useState(false);

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
    PageIndex: currentPage,
    PageSize: 20,
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
          return { id, icon: result.data.icon, name: result.data.name };
        } catch (err) {
          console.error(`Failed to fetch icon for subcategory ${id}:`, err);
          return { id, icon: "receipt", name: "Unknown" };
        }
      });

    const icons = await Promise.all(iconPromises);

    // Update subcategories list for filter
    const uniqueSubcategories = icons.reduce((acc, { id, name }) => {
      if (id && !acc.some(item => item.id === id)) {
        acc.push({ id, name });
      }
      return acc;
    }, [] as Array<{ id: string, name: string }>);

    setSubcategories(prev => {
      const existing = [...prev];
      uniqueSubcategories.forEach(category => {
        if (!existing.some(item => item.id === category.id)) {
          existing.push(category);
        }
      });
      return existing;
    });

    // Update icons
    const iconMap = icons.reduce((acc, { id, icon }) => {
      if (id) acc[id] = icon;
      return acc;
    }, {} as Record<string, string>);

    setSubCateIcons(prev => ({ ...prev, ...iconMap }));
    setFetchingIcons(false);
  }, [fetchSubCate]);

  useEffect(() => {
    if (transactionsData) {
      if (transactionsData?.totalCount) {
        setTotalCount(transactionsData.totalCount);
      }
      
      if (transactionsData.items && transactionsData.items.length > 0) {
        const uniqueSubCateIds = Array.from(
          new Set(transactionsData.items.map((item: any) => item.subcategoryId))
        );
  
        if (uniqueSubCateIds.length > 0) {
          fetchSubcategoryIcons(uniqueSubCateIds);
        }
  
        // Determine if there's more data (assuming pageSize is 20)
        setHasMoreData(transactionsData.items.length === 20);
      } else {
        setHasMoreData(false);
      }
  
      setIsLoadingMore(false);
    }
  }, [transactionsData, fetchSubcategoryIcons]);
  

  // Process transactions data
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
        const icon = subCateIcons[item.subcategoryId] || "receipt";

        return {
          id: item.id,
          subcategory: item.description || "Không có mô tả",
          amount: item.amount,
          type: item.type.toLowerCase() === "income" ? "income" : "expense",
          date: formattedDate,
          time: formattedTime,
          icon,
          description: item.description,
          subcategoryId: item.subcategoryId,
        };
      });

      // Update state values
      if (currentPage === 1) {
        setTransactions(formattedTransactions as Transaction[]);
      } else {
        setTransactions(prev => [...prev, ...formattedTransactions as Transaction[]]);
      }

      if (currentPage === 1) {
        setTotalIncome(incomeTotal);
        setTotalExpense(expenseTotal);
      } else {
        setTotalIncome(prev => prev + incomeTotal);
        setTotalExpense(prev => prev + expenseTotal);
      }
    }
  }, [transactionsData, subCateIcons, currentPage]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Apply search filter
      const matchesSearch = searchQuery ?
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Apply type filter
      const matchesType = filterType === 'all' ?
        true : transaction.type === filterType;

      // Apply subcategory filter
      const matchesSubcategory = selectedSubcategory ?
        transaction.subcategoryId === selectedSubcategory : true;

      return matchesSearch && matchesType && matchesSubcategory;
    });
  }, [transactions, searchQuery, filterType, selectedSubcategory]);

  const loadMoreData = useCallback(() => {
    console.log("Reached end, attempting to load more...");
    if (!isLoadingMore && hasMoreData) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMoreData]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterType('all');
    setSelectedSubcategory(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterByType = useCallback((type: 'all' | 'income' | 'expense') => {
    setFilterType(type);
  }, []);

  const handleFilterBySubcategory = useCallback((subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
  }, []);

  const formatCurrency = useCallback((value: number): string =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value),
    []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
        period: period,
      },
      isLoading: isLoading || fetchingIcons,
      isLoadingMore,
      hasMoreData,
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