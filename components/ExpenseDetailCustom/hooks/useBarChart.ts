import { useEffect, useMemo, useState } from "react";
import { useGetPersonalFinancialGoalChartQuery } from "@/services/financialGoal";
import { ChartDataItem } from "@/helpers/types/financialGoal.type";

const STATISTIC_TYPES = {
  week: "Tuần",
  month: "Tháng",
} as const;

export const useBarChart = (budgetId: string) => {
  const [selectedType, setSelectedType] = useState<"week" | "month">("week");

  const { data, refetch: refetchChartData } =
    useGetPersonalFinancialGoalChartQuery(
      { goalId: budgetId, type: selectedType },
      { skip: !budgetId },
    );

  useEffect(() => {
    if (budgetId) {
      refetchChartData();
    }
  }, [budgetId, selectedType]);

  const getCurrentWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = today.getDay() === 0 ? 7 : today.getDay();
    startOfWeek.setDate(today.getDate() - day + 1);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const format = (date: Date) =>
      `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

    return `${format(startOfWeek)} - ${format(endOfWeek)}`;
  };

  const isCurrentPeriod = (date: string, type: "week" | "month") => {
    const today = new Date();
    const target = new Date(date);

    if (type === "week") {
      const getWeekStart = (d: Date) => {
        const day = d.getDay() === 0 ? 7 : d.getDay();
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - day + 1);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
      };

      return getWeekStart(today).getTime() === getWeekStart(target).getTime();
    }

    return (
      today.getFullYear() === target.getFullYear() &&
      today.getMonth() === target.getMonth()
    );
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
    return amount.toString();
  };

  const chartData = useMemo(() => {
    const raw = data?.data?.chartData;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    return [{ amount: 0, date: new Date().toISOString() }];
  }, [data]);

  const maxAmount = useMemo(
    () => Math.max(...chartData.map((item) => item.amount || 0)),
    [chartData],
  );

  const adjustedMaxValue =
    maxAmount >= 1000 ? maxAmount * 1.1 : maxAmount + 100;

  const formattedYAxisLabels = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) =>
      formatAmount((adjustedMaxValue / 4) * i),
    );
  }, [adjustedMaxValue]);

  return {
    state: {
      currentWeekRange: getCurrentWeekRange(),
      isCurrentPeriod,
      selectedType,
      types: STATISTIC_TYPES,
      adjustedMaxValue,
      formattedYAxisLabels,
      safeData: chartData,
    },
    handler: {
      setSelectedType,
    },
  };
};
