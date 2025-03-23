import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import EXPENSE_DETAIL_CONSTANTS from "../ExpenseDetail.const";

const useExpenseDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const TRANSACTIONS = EXPENSE_DETAIL_CONSTANTS.TRANSACTIONS;
  const CHART_DATA = EXPENSE_DETAIL_CONSTANTS.CHART_DATA;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { budgetId } = useLocalSearchParams();

  const showAllTransactionsModal = () => {
    setIsModalVisible(true);
  };

  const closeAllTransactionsModal = () => {
    setIsModalVisible(false);
  };

  const loadMoreData = () => {
    console.log("Load more data");
  };

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(true));
  }, [dispatch]);

  return {
    state: {
      TRANSACTIONS,
      CHART_DATA,
      isLoading,
      isModalVisible,
    },
    handler: {
      loadMoreData,
      setIsLoading,
      handleBack,
      showAllTransactionsModal,
      closeAllTransactionsModal,
    },
  };
};

export default useExpenseDetail;
