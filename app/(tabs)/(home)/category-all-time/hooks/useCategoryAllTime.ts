import { TRANSACTION_TYPE } from "@/enums/globals";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionAllTimeCategoryQuery } from "@/services/transaction";
import { TransactionsReportCategoryItem } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useCategoryAllTime = () => {
  const dispatch = useDispatch();
  const [pieData, setPieData] = useState([]);
  const [type, setType] = useState<Number>(TRANSACTION_TYPE.EXPENSE)
  const [expenseItems, setExpenseItems] = useState<TransactionsReportCategoryItem[]>([]);

  const {
    data: transactionsReportResponseData,
    error,
    isLoading,
    refetch,
  } = useGetReportTransactionAllTimeCategoryQuery({ type: type });

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
    refetch(); // ensures fetch on type change
  }, [type, refetch]);

  useEffect(() => {
    if (!transactionsReportResponseData?.items?.categories) return;

    const categories = transactionsReportResponseData.items.categories || [];

    // Merge by icon
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

    const colorPalette = [
      '#FFA500', '#32CD32', '#FF69B4', '#FFD700', '#1E90FF',
      '#A52A2A', '#808080', '#800000', '#FFFF00', '#FF0000',
      '#00CED1', '#6A5ACD', '#228B22', '#DC143C', '#00FA9A',
      '#BDB76B', '#8B0000', '#20B2AA', '#FF8C00', '#2F4F4F'
    ];

    const pie = mergedList.map((item, index) => ({
      value: parseFloat((item.percentage ?? 0).toFixed(2)),
      color: colorPalette[index % colorPalette.length],
      text: '',
      legend: item.name ?? '',
    }));

    const items: TransactionsReportCategoryItem[] = mergedList.map((item, index) => ({
      name: item.name ?? '',
      amount: `${(item.amount ?? 0).toLocaleString()}₫`,
      percentage: `${(item.percentage ?? 0).toFixed(2)}%`,
      icon: item.icon ?? '',
      color: colorPalette[index % colorPalette.length],
    }));


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
