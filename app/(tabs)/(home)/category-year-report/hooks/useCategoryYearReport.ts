import { TRANSACTION_TYPE } from "@/enums/globals";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionCategoryYearQuery } from "@/services/transaction";
import { PieChartDataPoint } from "@/types/chart.types";
import { TransactionsReportCategoryItem } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const CATEGORY_COLORS: Record<string, string> = {
  "Ăn uống": "#FF6384",
  "Ăn uống ngoài": "#FF9F40",
  "Tổ chức từ thiện": "#FFCD56",
  "Nhà ở": "#4BC0C0",
  "Tiết kiệm ngắn hạn": "#36A2EB",
  "Y tế": "#9966FF",
  "Quỹ đầu tư": "#C9CBCF",
  "Điện nước": "#FF6384",
  "Xem phim": "#4BC0C0",
  "Tiền ảo": "#F67019",
  "Quỹ dự phòng": "#00A878",
  "Ủng hộ cộng đồng": "#8B5CF6",
  "Trang phục": "#F43F5E",
  "Chi phí hằng ngày": "#3B82F6",
  "Đi lại": "#6366F1",
  "Học phí": "#EC4899",
  "Giáo dục khác": "#10B981",
};

const getColorForCategory = (name: string): string => {
  return CATEGORY_COLORS[name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

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

    const groupedItems = Object.values(grouped).map((item) => ({
      ...item,
      percentage: parseFloat(item.percentage.toFixed(2)),
      color: getColorForCategory(item.name),
    }));

    const pieChartData = groupedItems.map((item) => ({
      value: item.percentage,
      color: getColorForCategory(item.name),
      text: "",
      legend: item.name,
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
