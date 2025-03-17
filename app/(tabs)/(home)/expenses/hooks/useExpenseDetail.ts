import { useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import EXPENSE_DETAIL_CONSTANTS from "../ExpenseDetail.const";

export const useExpenseDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const TRANSACTIONS = EXPENSE_DETAIL_CONSTANTS.TRANSACTIONS;
  const CHART_DATA = EXPENSE_DETAIL_CONSTANTS.CHART_DATA;

  const loadMoreData = () => {
    console.log("Load more data");
  };
  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  return {
    state: {
      TRANSACTIONS,
      CHART_DATA,
      isLoading,
    },
    handler: {
      loadMoreData,
      setIsLoading,
      handleGoBack,
    },
  };
};
