import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionYearQuery } from "@/services/transaction";
import { TransactionsReportMonthlyData } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const monthMap = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec"
};

const allMonths = Object.values(monthMap);

const useYearReport = () => {
  const dispatch = useDispatch();

  const [currentYear, setCurrentYear] = useState(2025);
  const [activeTab, setActiveTab] = useState('expense');
  const [barData, setBarData] = useState([]);
  const [quarterlyDetails, setQuarterlyDetails] = useState<TransactionsReportMonthlyData[]>([]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );
  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionYearQuery({ year: currentYear, type: activeTab === "expence" ? 1 : activeTab === "income" ? 0 : 2 });
  // useGetReportTransactionYearQuery

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
    const monthlyData = transactionsReportResponseData?.items?.monthlyData || [];

    // Create a map from full month name to amount
    const monthAmountMap = monthlyData.reduce((acc, item) => {
      acc[monthMap[item.month]] = item.amount;
      return acc;
    }, {} as Record<string, number>);

    // Generate barData
    const data = allMonths.map(month => ({
      value: monthAmountMap[month] || 0,
      frontColor: '#1E90FF',
      label: month,
    }));

    setBarData(data);

    // Set quarterlyDetails (example - customize as needed)
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const average = total / data.length;

    const formatted = (value: number) => Number((value / 100));

    const details: TransactionsReportMonthlyData[] = [
      { month: 'Total', amount: formatted(total) },
      { month: 'Average', amount: formatted(average) },
      ...data.map(item => ({ month: item.label, amount: formatted(item.value) }))
    ];

    setQuarterlyDetails(details);
  }, [currentYear, transactionsReportResponseData]);

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
      activeTab,
      barData,
      quarterlyDetails,
      error,
      isLoading
    },
    handler: {
      handlePreviousYear,
      handleNextYear,
      handleBack,
      setActiveTab,
      refetch
    },
  };
};

export default useYearReport;