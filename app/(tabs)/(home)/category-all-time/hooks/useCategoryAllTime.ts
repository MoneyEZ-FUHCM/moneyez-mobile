import { TRANSACTION_TYPE } from "@/enums/globals";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionAllTimeCategoryQuery } from "@/services/transaction";
import { TransactionsReportCategoryItem } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";
import { getRandomColor } from "@/helpers/libs";

const useCategoryAllTime = () => {
  const dispatch = useDispatch();
  const [pieData, setPieData] = useState([]);
  const [type, setType] = useState<Number>(TRANSACTION_TYPE.EXPENSE);
  const [expenseItems, setExpenseItems] = useState<TransactionsReportCategoryItem[]>([]);

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionAllTimeCategoryQuery({ type });

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch])
  );

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
    }, [handleBack])
  );

  useEffect(() => {
    refetch();
  }, [type, refetch]);

  useEffect(() => {
    if (!transactionsReportResponseData?.items?.categories) return;

    const categories = transactionsReportResponseData.items.categories || [];

    const mergedByIcon: Record<string, typeof categories[0]> = {};

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

    const pie = mergedList.map((item) => {
      const color = getRandomColor();
      return {
        value: parseFloat((item.percentage ?? 0).toFixed(2)),
        color,
        text: '',
        legend: item.name ?? '',
      };
    });

    const items: TransactionsReportCategoryItem[] = mergedList.map((item) => {
      const color = getRandomColor();
      return {
        name: item.name ?? '',
        amount: `${(item.amount ?? 0).toLocaleString()}₫`,
        percentage: `${(item.percentage ?? 0).toFixed(2)}%`,
        icon: item.icon ?? '',
        color,
      };
    });

    setPieData(pie);
    setExpenseItems(items);
  }, [transactionsReportResponseData?.items?.categories, type]);

  return {
    state: {
      pieData,
      expenseItems,
      error,
      isLoading,
      type
    },
    handler: {
      handleBack,
      refetch,
      setType
    },
  };
};

export default useCategoryAllTime;
