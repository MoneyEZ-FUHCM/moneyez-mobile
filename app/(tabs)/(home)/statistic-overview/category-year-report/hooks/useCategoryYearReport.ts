import { TRANSACTION_TYPE_TEXT } from "@/helpers/enums/globals";
import { getRandomColor } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionCategoryYearQuery } from "@/services/transaction";
import { PieChartDataPoint } from "@/helpers/types/chart.types";
import { TransactionsReportCategoryItem } from "@/helpers/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView } from "react-native";
import { useDispatch } from "react-redux";

const useCategoryYearReport = () => {
  const dispatch = useDispatch();

  const chartRef = useRef<ScrollView>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2025);
  const [type, setType] = useState<string>(TRANSACTION_TYPE_TEXT.EXPENSE);
  const [pieData, setPieData] = useState<PieChartDataPoint[]>([]);
  const [detailItems, setDetailItems] = useState<
    TransactionsReportCategoryItem[]
  >([]);
  const categoryColorsRef = useRef<Record<string, string>>({});

  const { data: transactionsReportResponseData, refetch } =
    useGetReportTransactionCategoryYearQuery({ year: currentYear, type });

  useEffect(() => {
    refetch();
  }, [type, refetch]);

  useEffect(() => {
    const rawCategories =
      transactionsReportResponseData?.items?.categories || [];

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

    groupedArray.forEach((item) => {
      if (item.icon && !categoryColorsRef.current[item.icon]) {
        categoryColorsRef.current[item.icon] = getRandomColor();
      }
    });

    const pieChartData = groupedArray.map((item) => ({
      value: item.percentage,
      color: item.icon
        ? categoryColorsRef.current[item.icon]
        : getRandomColor(),
      text: "",
      legend: item.name,
      icon: item.icon,
      focused: selectedCategory === item.icon,
    }));

    const groupedItems = groupedArray.map((item) => ({
      ...item,
      color: item.icon
        ? categoryColorsRef.current[item.icon]
        : getRandomColor(),
    }));

    setPieData(
      pieChartData.length > 0
        ? pieChartData
        : [
            {
              value: 1,
              color: "#E0E0E0",
              text: "Không có dữ liệu",
              legend: "Không có dữ liệu",
              icon: "",
            },
          ],
    );
    setDetailItems(groupedItems);
  }, [transactionsReportResponseData, currentYear, type, selectedCategory]);

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

  const getTotalAmount = () => {
    let totalAmount = 0;
    detailItems.map((item) => (totalAmount += item.amount));
    return totalAmount;
  };

  const handleSelectCategory = useCallback(
    (categoryIcon: string) => {
      setSelectedCategory(
        selectedCategory === categoryIcon ? null : categoryIcon,
      );
      setTimeout(() => {
        chartRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    },

    [selectedCategory],
  );

  return {
    state: {
      currentYear,
      pieData,
      detailItems,
      transactionsReportResponseData,
      type,
      chartRef,
      selectedCategory,
    },
    handler: {
      handlePreviousYear,
      handleNextYear,
      handleBack,
      refetch,
      setType,
      getTotalAmount,
      handleSelectCategory,
    },
  };
};

export default useCategoryYearReport;
