import { LineChartDataPoint } from "@/helpers/types/chart.types";
import { TransactionsReportMonthlyBalance } from "@/helpers/types/transaction.types";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionBalanceYearQuery } from "@/services/transaction";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    refetch();
  }, [currentYear]);

  useEffect(() => {
    if (!transactionsReportResponseData?.items?.balances) return;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthLabelsForChart = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];

    const monthLabelsForDetail = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    const rawData = transactionsReportResponseData.items.balances.map(
      (item) => {
        const monthIndex = monthNames.indexOf(item.month);
        return {
          month: monthLabelsForDetail[monthIndex] || item.month,
          balance: Math.round(item.balance),
        };
      },
    );

    const chartData = transactionsReportResponseData.items.balances.map(
      (item) => {
        const monthIndex = monthNames.indexOf(item.month);
        return {
          label: monthLabelsForChart[monthIndex] || item.month,
          value: Math.round(item.balance),
        };
      },
    );

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

  const handlePreviousYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  const chartMaxValue = useMemo(() => {
    if (!lineData || lineData.length === 0) return 0;

    const maxAbsValue = Math.max(
      ...lineData.map((item) => Math.abs(Number(item.value))),
    );

    const roundedValue = Math.ceil(maxAbsValue / 1000000) * 1000000;
    return roundedValue + roundedValue * 0.1;
  }, [lineData]);

  return {
    state: {
      currentYear,
      lineData,
      monthlyDetails,
      transactionsReportResponseData,
      error,
      isLoading,
      chartMaxValue,
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
