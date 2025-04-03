import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectBudgetStatisticType } from "@/redux/hooks/budgetSelector";
import { setBudgetStatisticType } from "@/redux/slices/budgetSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetFinancialGoalByIdQuery,
  useGetPersonalFinancialGoalChartQuery,
  useGetPersonalTransactionFinancialGoalsQuery,
} from "@/services/financialGoal";
import {
  ChartDataItem,
  FinancialGoal,
  PersonalTransactionFinancialGoals,
} from "@/types/financialGoal.type";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EXPENSE_DETAIL_CONSTANTS from "../ExpenseDetail.const";
import { COMMON_CONSTANT } from "@/helpers/constants/common";

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

  const budgetStatisticType = useSelector(selectBudgetStatisticType);
  const { data: personalTransactionFinancialGoalChart } =
    useGetPersonalFinancialGoalChartQuery({
      goalId: budgetId,
      type: budgetStatisticType,
    });

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
  const { SYSTEM_ERROR } = COMMON_CONSTANT;

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
    dispatch(setBudgetStatisticType("week"));
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
  );

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refetchPersonalTransactionFinancialGoals(),
        refetchGoalsById(),
      ]);
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  }, [refetchPersonalTransactionFinancialGoals, refetchGoalsById]);

  const handleNavigateAndUpdate = useCallback(
    (finalcialGoalDetail: FinancialGoal) => {
      router.navigate({
        pathname: PATH_NAME.HOME.UPDATE_EXPENSE as any,
        params: {
          budgetId: finalcialGoalDetail?.id,
          icon: finalcialGoalDetail?.subcategoryIcon,
          name: finalcialGoalDetail?.subcategoryName,
          amount: finalcialGoalDetail?.targetAmount,
          subCategoryId: finalcialGoalDetail?.subcategoryId,
        },
      });
    },
    [],
  );

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
      personalTransactionFinancialGoalChart:
        personalTransactionFinancialGoalChart?.data
          ?.chartData as ChartDataItem[],
    },
    handler: {
      setIsLoading,
      handleBack,
      showAllTransactionsModal,
      closeAllTransactionsModal,
      handleLoadMore,
      handleRefresh,
      handleNavigateAndUpdate,
    },
  };
};

export default useExpenseDetail;
