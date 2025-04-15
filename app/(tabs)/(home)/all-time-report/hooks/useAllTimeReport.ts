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
    if (!transactionsReportResponseData?.items) return;

    const viLabelMap: Record<keyof TransactionsReportAllTime, string> = {
      income: "Thu nhập",
      expense: "Chi tiêu",
      cumulation: "Tích lũy",
      total: "Tổng cộng",
      initialBalance: "Số dư ban đầu",
    };

    const rawData = transactionsReportResponseData.items;

    const translatedSummary: Record<string, number> = Object.entries(rawData).reduce((acc, [key, value]) => {
      const viKey = viLabelMap[key as keyof TransactionsReportAllTime] || key;
      acc[viKey] = value;
      return acc;
    }, {} as Record<string, number>);

    setFinancialSummary(translatedSummary as TransactionsReportAllTime);
  }, [transactionsReportResponseData]);


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