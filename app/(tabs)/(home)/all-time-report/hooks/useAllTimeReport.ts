import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionAllTimeQuery } from "@/services/transaction";
import { TransactionsReportAllTime } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useAllTimeReport = () => {
  const dispatch = useDispatch();

  const [financialSummary, setFinancialSummary] = useState<TransactionsReportAllTime>()

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionAllTimeQuery({});

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
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

  useEffect(() => {
    setFinancialSummary(transactionsReportResponseData?.items)
  }, [transactionsReportResponseData])

  return {
    state: {
      financialSummary,
      error,
      isLoading,
      refetch
    },
    handler: {
      handleBack,
    },
  };
};

export default useAllTimeReport;