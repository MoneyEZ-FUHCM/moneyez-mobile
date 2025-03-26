import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetFinancialGoalByIdQuery,
  useGetPersonalTransactionFinancialGoalsQuery,
} from "@/services/financialGoal";
import {
  FinancialGoal,
  PersonalTransactionFinancialGoals,
} from "@/types/financialGoal.type";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import EXPENSE_DETAIL_CONSTANTS from "../ExpenseDetail.const";

const useExpenseDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const TRANSACTIONS = EXPENSE_DETAIL_CONSTANTS.TRANSACTIONS;
  const CHART_DATA = EXPENSE_DETAIL_CONSTANTS.CHART_DATA;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [
    personalTransactionFinancialGoals,
    setPersonalTransactionFinancialGoals,
  ] = useState<PersonalTransactionFinancialGoals[]>([]);

  const { budgetId } = useLocalSearchParams();
  const {
    data,
    refetch: refetchGoalsById,
    isFetching: isFetchingFinancialGoalById,
  } = useGetFinancialGoalByIdQuery(
    {
      id: budgetId,
    },
    {
      skip: !budgetId,
    },
  );

  const {
    data: getPersonalTransactionFinancialGoals,
    refetch: refetchPersonalTransactionFinancialGoals,
    isFetching: isFetchingPersonalTransactionFinancialGoals,
  } = useGetPersonalTransactionFinancialGoalsQuery(
    {
      id: budgetId,
      PageIndex: pageIndex,
      PageSize: 10,
    },
    {
      skip: !budgetId,
    },
  );

  console.log("cjeck budgetId", budgetId);
  useEffect(() => {
    refetchGoalsById();
    refetchPersonalTransactionFinancialGoals();
  }, []);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading &&
      !isLoadingMore &&
      getPersonalTransactionFinancialGoals?.items?.length === pageSize
    ) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [
    isLoading,
    isLoadingMore,
    getPersonalTransactionFinancialGoals?.items?.length,
  ]);

  useEffect(() => {
    if (getPersonalTransactionFinancialGoals?.items) {
      setPersonalTransactionFinancialGoals((prevTransactions: any) => {
        const existingIds = new Set(
          prevTransactions.map(
            (item: PersonalTransactionFinancialGoals) => item.id,
          ),
        );
        const newItems = getPersonalTransactionFinancialGoals.items.filter(
          (item: PersonalTransactionFinancialGoals) =>
            !existingIds.has(item.id),
        );
        return [...prevTransactions, ...newItems];
      });

      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [getPersonalTransactionFinancialGoals?.items]);

  const showAllTransactionsModal = () => {
    setIsModalVisible(true);
  };

  const closeAllTransactionsModal = () => {
    setIsModalVisible(false);
  };

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(true));
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refetchPersonalTransactionFinancialGoals(),
        refetchGoalsById(),
      ]);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  }, [refetchPersonalTransactionFinancialGoals, refetchGoalsById]);

  return {
    state: {
      TRANSACTIONS,
      CHART_DATA,
      isLoading,
      isModalVisible,
      financialGoalDetail: data?.data as FinancialGoal,
      personalTransactionFinancialGoals,
      isLoadingMore,
      isFetchingData,
      getPersonalTransactionFinancialGoals,
      pageSize,
      isFetchingRefresh:
        isFetchingFinancialGoalById ||
        isFetchingPersonalTransactionFinancialGoals,
    },
    handler: {
      setIsLoading,
      handleBack,
      showAllTransactionsModal,
      closeAllTransactionsModal,
      handleLoadMore,
      handleRefresh,
    },
  };
};

export default useExpenseDetail;
