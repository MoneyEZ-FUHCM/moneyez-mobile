import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetPersonalFinancialGoalsQuery } from "@/services/financialGoal";
import {
  useGetCurrentUserSpendingModelChartQuery,
  useGetCurrentUserSpendingModelQuery,
} from "@/services/userSpendingModel";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useIndividualHome = () => {
  const { HOME } = PATH_NAME;
  const dispatch = useDispatch();
  const {
    data: currentUserSpendingModelChart,
    isLoading,
    refetch: refetchCurrentUserSpendingModelChart,
  } = useGetCurrentUserSpendingModelChartQuery({});
  const {
    data: currentUserSpendingModel,
    refetch: refetchCurrentUserSpendingModel,
  } = useGetCurrentUserSpendingModelQuery();

  const {
    data: personalFinancialGoals,
    refetch: refetchPersonalFinancialGoals,
  } = useGetPersonalFinancialGoalsQuery({ PageIndex: 1, PageSize: 100 });

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  useEffect(() => {
    refetchCurrentUserSpendingModelChart();
    refetchCurrentUserSpendingModel();
    refetchPersonalFinancialGoals();
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleGoBack]),
  );

  const navigateToTransaction = (type: "EXPENSE" | "INCOME") => {
    router.navigate(`${HOME.ADD_TRANSACTION}?type=${type}` as any);
    dispatch(setMainTabHidden(true));
  };

  const currentUserSpendingModelData = useMemo(() => {
    return {
      categories: currentUserSpendingModelChart?.data?.categories || [],
      totalSpent: formatCurrency(
        (currentUserSpendingModel?.data?.totalIncome ?? 0) -
          (currentUserSpendingModel?.data?.totalExpense ?? 0),
      ),
    };
  }, [currentUserSpendingModelChart]);

  const handleHistoryPress = () => {
    if (currentUserSpendingModel) {
      router.push({
        pathname: HOME.PERIOD_HISTORY_DETAIL as any,
        params: {
          userSpendingId: currentUserSpendingModel?.data?.id,
        },
      });
    } else {
      router.navigate(HOME.SPENDING_MODEL_HISTORY as any);
    }
  };

  const actualCategories = currentUserSpendingModelData?.categories?.filter(
    (item: any) => {
      return item?.plannedPercentage !== 0;
    },
  );

  const personalFinancialGoalsData = personalFinancialGoals?.items || [];

  const handleSpendingBudgetPress = () => {
    dispatch(setMainTabHidden(true));
    router.push(HOME.SPENDING_BUDGET_LIST as any);
  };

  return {
    state: {
      isLoading,
      currentUserSpendingModelData,
      actualCategories,
      personalFinancialGoalsData,
    },
    handler: {
      handleGoBack,
      handleAddExpense: () => navigateToTransaction("EXPENSE"),
      handleAddIncome: () => navigateToTransaction("INCOME"),
      handleHistoryPress,
      handleSpendingBudgetPress,
    },
  };
};

export default useIndividualHome;
