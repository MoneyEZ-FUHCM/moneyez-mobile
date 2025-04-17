import { TRANSACTION_TYPE } from "@/enums/globals";
import { getRandomColor } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionCategoryYearQuery } from "@/services/transaction";
import { PieChartDataPoint } from "@/types/chart.types";
import { TransactionsReportCategoryItem } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useCategoryYearReport = () => {
  const dispatch = useDispatch();

  const [currentYear, setCurrentYear] = useState(2025);
  const [type, setType] = useState<number>(TRANSACTION_TYPE.INCOME);
  const [pieData, setPieData] = useState<PieChartDataPoint[]>([]);
  const [detailItems, setDetailItems] = useState<TransactionsReportCategoryItem[]>([]);

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionCategoryYearQuery({ year: currentYear, type });

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch])
  );

  useEffect(() => {
    const rawCategories = transactionsReportResponseData?.items?.categories || [];

    const grouped: Record<string, TransactionsReportCategoryItem> = {};
    rawCategories.forEach((item) => {
      if (grouped[item.name]) {
        grouped[item.name].amount += item.amount;
        grouped[item.name].percentage += item.percentage;
      } else {
        grouped[item.name] = { ...item };
      }
    });

    const groupedArray = Object.values(grouped).map((item) => ({
      ...item,
      percentage: parseFloat(item.percentage.toFixed(2)),
    }));

    const colors = groupedArray.map(() => getRandomColor());

    const pieChartData = groupedArray.map((item, index) => ({
      value: item.percentage,
      color: colors[index],
      text: "",
      legend: item.name,
    }));

    const groupedItems = groupedArray.map((item, index) => ({
      ...item,
      color: colors[index],
    }));

    setPieData(
      pieChartData.length > 0
        ? pieChartData
        : [
          {
            value: 1,
            color: "#E0E0E0",
            text: "No data",
            legend: "No Data",
          },
        ]
    );

    setDetailItems(groupedItems);
  }, [transactionsReportResponseData, currentYear, type]);

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
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack])
  );

  const handlePreviousYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  const getTotalAmount = () => {
    let totalAmount = 0;
    detailItems.map(item => totalAmount += item.amount)
    return totalAmount
  }

  return {
    state: {
      currentYear,
      pieData,
      detailItems,
      transactionsReportResponseData,
      error,
      isLoading,
      type,
    },
    handler: {
      handlePreviousYear,
      handleNextYear,
      handleBack,
      refetch,
      setType,
      getTotalAmount
    },
  };
};

export default useCategoryYearReport;
