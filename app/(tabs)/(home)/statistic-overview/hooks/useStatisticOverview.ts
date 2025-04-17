import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetReportTransactionAllTimeQuery } from "@/services/transaction";
import { TransactionsReportAllTime } from "@/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useStatisticOverview = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const dispatch = useDispatch();
  const [financialSummary, setFinancialSummary] =
    useState<TransactionsReportAllTime>();
  const {
    data: transactionsReportResponseData,
    isLoading,
    refetch,
  } = useGetReportTransactionAllTimeQuery({});

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!transactionsReportResponseData?.items) return;

    const viLabelMap: Record<keyof TransactionsReportAllTime, string> = {
      income: "income",
      expense: "expense",
      cumulation: "cumulation",
      total: "total",
      initialBalance: "initialBalance",
    };

    const rawData = transactionsReportResponseData.items;

    const translatedSummary: Record<string, number> = Object.entries(
      rawData,
    ).reduce(
      (acc, [key, value]) => {
        const viKey = viLabelMap[key as keyof TransactionsReportAllTime] || key;
        acc[viKey] = value;
        return acc;
      },
      {} as Record<string, number>,
    );

    setFinancialSummary(translatedSummary as any);
  }, [transactionsReportResponseData]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, []);

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

  const handleRefetch = useCallback(() => {
    refetch();
  }, []);

  return {
    state: {
      financialSummary,
      isLoading,
      activeCategory,
    },
    handler: {
      handleBack,
      handleRefetch,
      setActiveCategory,
      refetch,
    },
  };
};

export default useStatisticOverview;
