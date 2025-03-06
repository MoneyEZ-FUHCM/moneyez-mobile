import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetCurrentUserSpendingModelChartQuery } from "@/services/userSpendingModel";
import { router } from "expo-router";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

const useIndividualHome = () => {
  const EXPENSE = "expense";
  const INCOME = "income";
  const { HOME } = PATH_NAME;
  const dispatch = useDispatch();
  const { data: currentUserSpendingModel } =
    useGetCurrentUserSpendingModelChartQuery({});

  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  const navigateToTransaction = (type: "expense" | "income") => {
    router.navigate(`${HOME.ADD_TRANSACTION}?type=${type}` as any);
    dispatch(setMainTabHidden(true));
  };

  const state = useMemo(() => {
    return {
      categories: currentUserSpendingModel?.data?.categories || [],
      totalSpent: formatCurrency(currentUserSpendingModel?.data?.totalSpent),
    };
  }, [currentUserSpendingModel]);

  return {
    state,
    handler: {
      handleGoBack,
      handleAddExpense: () => navigateToTransaction(EXPENSE),
      handleAddIncome: () => navigateToTransaction(INCOME),
    },
  };
};

export default useIndividualHome;
