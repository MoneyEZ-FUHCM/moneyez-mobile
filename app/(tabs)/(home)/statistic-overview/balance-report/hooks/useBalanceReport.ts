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
  const [monthlyDetails, setMonthlyDetails] = useState<
    TransactionsReportMonthlyBalance[]
  >([]);

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionBalanceYearQuery({ year: currentYear });
  console.log(
    "check transactionsReportResponseData",
    transactionsReportResponseData?.items?.balances,
  );
  useEffect(() => {
    if (!transactionsReportResponseData?.items?.balances) return;

    let monthMap: Record<string, string> = {
      January: "T1",
      February: "T2",
      March: "T3",
      April: "T4",
      May: "T5",
      June: "T6",
      July: "T7",
      August: "T8",
      September: "T9",
      October: "T10",
      November: "T11",
      December: "T12",
    };

    const multiplier = (currentYear - 2023) * 0.1 + 1;

    const rawData = transactionsReportResponseData.items.balances.map(
      (item) => ({
        month: monthMap[item.month] || item.month,
        balance: Math.round(item.balance * multiplier * 100) / 100,
      }),
    );

    monthMap = {
      January: "1",
      February: "2",
      March: "3",
      April: "4",
      May: "5",
      June: "6",
      July: "7",
      August: "8",
      September: "9",
      October: "10",
      November: "11",
      December: "12",
    };

    // For chart (with Vietnamese labels)
    const chartData = rawData.map((item) => ({
      value: item.balance,
      label: monthMap[item.month] || item.month, // fallback to original if not matched
    }));

    setLineData(chartData);
    setMonthlyDetails(rawData);
  }, [currentYear, transactionsReportResponseData]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(true));
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
    setCurrentYear((prevYear) => prevYear - 1);
  };

  // Handle next year
  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  return {
    state: {
      currentYear,
      lineData,
      monthlyDetails,
      transactionsReportResponseData,
      error,
      isLoading,
    },
    handler: {
      handlePreviousYear,
      handleNextYear,
      handleBack,
      refetch,
    },
  };
};

export default useBalanceReport;
