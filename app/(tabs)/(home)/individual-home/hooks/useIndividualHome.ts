import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetCurrentUserSpendingModelChartQuery,
  useGetCurrentUserSpendingModelQuery,
} from "@/services/userSpendingModel";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
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

  useHideTabbar();

  useEffect(() => {
    refetchCurrentUserSpendingModelChart();
    refetchCurrentUserSpendingModel();
  }, []);

  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

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
  }, [currentUserSpendingModelChart, isLoading]);

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

  return {
    state: {
      isLoading,
      currentUserSpendingModelData,
      actualCategories,
    },
    handler: {
      handleGoBack,
      handleAddExpense: () => navigateToTransaction("EXPENSE"),
      handleAddIncome: () => navigateToTransaction("INCOME"),
      handleHistoryPress,
    },
  };
};

export default useIndividualHome;
