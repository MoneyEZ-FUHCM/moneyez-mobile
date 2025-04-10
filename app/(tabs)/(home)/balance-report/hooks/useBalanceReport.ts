import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionBalanceYearQuery } from "@/services/transaction";
import { LineChartDataPoint } from "@/types/chart.types";
import { TransactionsReportMonthlyBalance } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useBalanceReport = () => {
  const dispatch = useDispatch();

  const [currentYear, setCurrentYear] = useState(2025);
  const [lineData, setLineData] = useState<LineChartDataPoint[]>([]);
  const [monthlyDetails, setMonthlyDetails] = useState<TransactionsReportMonthlyBalance[]>([]);

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionBalanceYearQuery({ year: currentYear });

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  useEffect(() => {
    if (!transactionsReportResponseData?.items?.balances) return;

    const multiplier = (currentYear - 2023) * 0.1 + 1;

    const rawData = transactionsReportResponseData.items.balances.map(item => ({
      month: item.month,
      balance: Math.round(item.balance * multiplier * 100) / 100,
    }));

    // For chart
    const chartData = rawData.map(item => ({
      value: item.balance,
      label: item.month.slice(0, 3), // Optional: "Jan", "Feb", etc.
    }));

    setLineData(chartData);
    setMonthlyDetails(rawData);
  }, [currentYear, transactionsReportResponseData]);

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

  // Handle previous year
  const handlePreviousYear = () => {
    setCurrentYear(prevYear => prevYear - 1);
  };

  // Handle next year
  const handleNextYear = () => {
    setCurrentYear(prevYear => prevYear + 1);
  };

  return {
    state: {
      currentYear,
      lineData,
      monthlyDetails,
      transactionsReportResponseData,
      error,
      isLoading
    },
    handler: {
      handlePreviousYear,
      handleNextYear,
      handleBack,
      refetch
    },
  };
};

export default useBalanceReport;