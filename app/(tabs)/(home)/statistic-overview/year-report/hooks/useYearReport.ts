import { Colors } from "@/helpers/constants/color";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionYearQuery } from "@/services/transaction";
import { TransactionsReportMonthlyData } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useYearReport = () => {
  const dispatch = useDispatch();

  const [currentYear, setCurrentYear] = useState(2025);
  const [activeTab, setActiveTab] = useState("EXPENSE");
  const [barData, setBarData] = useState([]);
  const [quarterlyDetails, setQuarterlyDetails] = useState<
    TransactionsReportMonthlyData[]
  >([]);

  const { data: transactionsReportResponseData, refetch } =
    useGetReportTransactionYearQuery({
      year: currentYear,
      type: activeTab,
    });

  useEffect(() => {
    refetch();
  }, [activeTab, currentYear]);

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

    const monthAmountMap = monthlyData.reduce(
      (acc, item) => {
        const index = monthNames.indexOf(item.month);
        if (index !== -1) {
          acc[monthLabelsForChart[index]] = item.amount;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const data = monthLabelsForChart.map((month) => ({
      value: monthAmountMap[month] || 0,
      frontColor:
        monthAmountMap[month] >= 0 ? Colors.colors.primary : Colors.colors.red,
      label: month,
    }));

    setBarData(data as any);

    const details: TransactionsReportMonthlyData[] = [
      { month: "Tổng cộng", amount: total },
      { month: "Trung bình", amount: average },
      ...data.map((item, index) => ({
        month: monthLabelsForDetail[index] || item.label,
        amount: item.value,
      })),
    ];

    setQuarterlyDetails(details);
  }, [currentYear, transactionsReportResponseData]);

  const handlePreviousYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  const updateBarData = barData?.map(
    (item: { value: number; [key: string]: any }) => ({
      ...item,
      labelTextStyle: {
        color: item.value < 0 ? "white" : "gray",
        textAlign: "center",
      },
    }),
  );

  return {
    state: {
      currentYear,
      activeTab,
      barData,
      quarterlyDetails,
      updateBarData,
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
