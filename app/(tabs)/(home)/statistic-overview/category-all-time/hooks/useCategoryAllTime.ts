import { TRANSACTION_TYPE_TEXT } from "@/helpers/enums/globals";
import { getRandomColor } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionAllTimeCategoryQuery } from "@/services/transaction";
import { TransactionsReportCategoryItem } from "@/helpers/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView } from "react-native";
import { useDispatch } from "react-redux";

const useCategoryAllTime = () => {
  const dispatch = useDispatch();
  const [pieData, setPieData] = useState([]);
  const [type, setType] = useState<String>(TRANSACTION_TYPE_TEXT.EXPENSE);
  const [expenseItems, setExpenseItems] = useState<
    TransactionsReportCategoryItem[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
