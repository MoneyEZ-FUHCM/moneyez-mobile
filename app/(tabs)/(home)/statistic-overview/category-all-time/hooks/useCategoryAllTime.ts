import { TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { getRandomColor } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionAllTimeCategoryQuery } from "@/services/transaction";
import { TransactionsReportCategoryItem } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView } from "react-native";
import { useDispatch } from "react-redux";

const useCategoryAllTime = () => {
  const dispatch = useDispatch();
  const [pieData, setPieData] = useState([]);
  const [type, setType] = useState<String>(TRANSACTION_TYPE_TEXT.TOTAL);
  const [expenseItems, setExpenseItems] = useState<
    TransactionsReportCategoryItem[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expenseCount, setExpenseCount] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const categoryColorsRef = useRef<Record<string, string>>({});
  const chartRef = useRef<ScrollView>(null);

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionAllTimeCategoryQuery({ type });

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(true));
  }, [dispatch]);

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
    refetch();
  }, [type, refetch]);

  useEffect(() => {
    if (!transactionsReportResponseData?.items?.categories) return;

    const categories = transactionsReportResponseData.items.categories || [];

    const uniqueIncome = new Set();
    const uniqueExpense = new Set();
    const uniqueTotal = new Set();

    categories?.forEach((item) => {
      if (item.icon) {
        uniqueTotal.add(item.icon);

        if (item.categoryType === TRANSACTION_TYPE_TEXT.INCOME) {
          uniqueIncome.add(item.icon);
        } else if (item.categoryType === TRANSACTION_TYPE_TEXT.EXPENSE) {
          uniqueExpense.add(item.icon);
        }
      }
    });

    setIncomeCount(uniqueIncome.size);
    setExpenseCount(uniqueExpense.size);
    setTotalCategories(uniqueTotal.size);

    const mergedByIcon: Record<string, (typeof categories)[0]> = {};

    categories?.forEach((item) => {
      const key = item.icon;
      if (!mergedByIcon[key]) {
        mergedByIcon[key] = { ...item };
      } else {
        mergedByIcon[key].amount += item.amount ?? 0;
        mergedByIcon[key].percentage += item.percentage ?? 0;
      }
    });

    const mergedList = Object.values(mergedByIcon);

    mergedList.forEach((item) => {
      const icon = item.icon;
      if (icon && !categoryColorsRef.current[icon]) {
        categoryColorsRef.current[icon] = getRandomColor();
      }
    });

    const items = mergedList.map((item: TransactionsReportCategoryItem) => {
      const color = item.icon
        ? categoryColorsRef.current[item.icon]
        : getRandomColor();
      return {
        name: item.name ?? "",
        amount: item.amount ?? 0,
        percentage: `${(item.percentage ?? 0).toFixed(2)}%`,
        icon: item.icon ?? "",
        color,
        categoryType: item.categoryType,
      };
    });

    const pie = mergedList.map((item) => {
      const color = item.icon
        ? categoryColorsRef.current[item.icon]
        : getRandomColor();
      return {
        value: parseFloat((item.percentage ?? 0).toFixed(2)),
        color,
        text: "",
        legend: item.name ?? "",
        icon: item.icon,
        focused: selectedCategory === item.icon,
      };
    });

    setPieData(pie as any);
    setExpenseItems(items as any);
  }, [
    transactionsReportResponseData?.items?.categories,
    type,
    selectedCategory,
  ]);

  return {
    state: {
      pieData,
      expenseItems,
      error,
      isLoading,
      type,
      selectedCategory,
      expenseCount,
      incomeCount,
      totalCategories,
      chartRef,
    },
    handler: {
      handleBack,
      refetch,
      setType,
      handleSelectCategory,
    },
  };
};

export default useCategoryAllTime;
