import { useCallback, useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import EXPENSE_DETAIL_CONSTANTS from "../ExpenseDetail.const";

const useExpenseDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const TRANSACTIONS = EXPENSE_DETAIL_CONSTANTS.TRANSACTIONS;
  const CHART_DATA = EXPENSE_DETAIL_CONSTANTS.CHART_DATA;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showAllTransactionsModal = () => {
    setIsModalVisible(true);
  };

  const closeAllTransactionsModal = () => {
    setIsModalVisible(false);
  };

  const loadMoreData = () => {
    console.log("Load more data");
  };
  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };
  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
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
      handleGoBack,
      showAllTransactionsModal,
      closeAllTransactionsModal,
      handleBack,
    },
  };
};

export default useExpenseDetail;
