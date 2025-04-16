import { Colors } from "@/helpers/constants/color";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionYearQuery } from "@/services/transaction";
import { TransactionsReportMonthlyData } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const monthMap = {
  January: "Th 1",
  February: "Th 2",
  March: "Th 3",
  April: "Th 4",
  May: "Th 5",
  June: "Th 6",
  July: "Th 7",
  August: "Th 8",
  September: "Th 9",
  October: "Th 10",
  November: "Th 11",
  December: "Th 12",
};

const allMonths = Object.values(monthMap);

const useYearReport = () => {
  const dispatch = useDispatch();

  const [currentYear, setCurrentYear] = useState(2025);
  const [activeTab, setActiveTab] = useState("expense");
  const [barData, setBarData] = useState([]);
  const [quarterlyDetails, setQuarterlyDetails] = useState<
    TransactionsReportMonthlyData[]
  >([]);

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionYearQuery({
    year: currentYear,
    type: activeTab === "expense" ? 1 : activeTab === "income" ? 0 : 2,
  });

  useEffect(() => {
    console.log("123");
    refetch();
  }, []);

  console.log(
    "check transactionsReportResponseData",
    transactionsReportResponseData,
  );

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

  useEffect(() => {
    const monthlyData =
      transactionsReportResponseData?.items?.monthlyData || [];
    const average = transactionsReportResponseData?.items?.average || 0;
    const total = transactionsReportResponseData?.items?.total || 0;

    // Create a map from full month name to amount
    const monthAmountMap = monthlyData.reduce(
      (acc, item) => {
        acc[monthMap[item.month as keyof typeof monthMap]] = item.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Generate barData
    const data = allMonths.map((month) => ({
      value: monthAmountMap[month] || 0,
      frontColor: Colors.colors.primary,
      label: month,
    }));

    setBarData(data as any);

    // Set quarterlyDetails (example - customize as needed)
    // const total = data.reduce((sum, item) => sum + item.value, 0);
    // const average = total / data.length;

    // const formatted = (value: number) => Number(value / 100).toFixed(0);

    const details: TransactionsReportMonthlyData[] = [
      { month: "Tổng cộng", amount: total },
      { month: "Trung bình", amount: average },
      ...data.map((item) => ({
        month: item.label,
        amount: item.value,
      })),
    ];

    setQuarterlyDetails(details);
  }, [currentYear, transactionsReportResponseData]);

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
      activeTab,
      barData,
      quarterlyDetails,
      error,
      isLoading,
    },
    handler: {
      handlePreviousYear,
      handleNextYear,
      handleBack,
      setActiveTab,
      refetch,
    },
  };
};

export default useYearReport;
