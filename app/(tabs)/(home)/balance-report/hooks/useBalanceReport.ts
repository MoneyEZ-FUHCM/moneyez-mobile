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

    let monthMap: Record<string, string> = {
      January: "Tháng 1",
      February: "Tháng 2",
      March: "Tháng 3",
      April: "Tháng 4",
      May: "Tháng 5",
      June: "Tháng 6",
      July: "Tháng 7",
      August: "Tháng 8",
      September: "Tháng 9",
      October: "Tháng 10",
      November: "Tháng 11",
      December: "Tháng 12",
    };

    const rawData = transactionsReportResponseData.items.balances.map(item => ({
      month: monthMap[item.month] || item.month,
      balance: item.balance,
    }));

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

    const chartData = transactionsReportResponseData.items?.balances?.map(item => ({
      value: item.balance,
      label: monthMap[item.month] || item.month,
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

  const handlePreviousYear = () => {
    setCurrentYear(prevYear => prevYear - 1);
  };
  
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