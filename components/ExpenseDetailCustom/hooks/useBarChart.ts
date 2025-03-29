import { setBudgetStatisticType } from "@/redux/slices/budgetSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const STATISTIC_TYPES = {
  week: "Tuần",
  month: "Tháng",
} as const;

export const useBarChart = () => {
  const dispatch = useDispatch();
  const selectedType = useSelector((state: RootState) => state.budget.type);

  const handleSelectType = (type: "week" | "month") => {
    dispatch(setBudgetStatisticType(type));
  };

  const getCurrentWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return `${startOfWeek.getDate().toString().padStart(2, "0")}/${(startOfWeek.getMonth() + 1).toString().padStart(2, "0")} - ${endOfWeek.getDate().toString().padStart(2, "0")}/${(endOfWeek.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  const isCurrentWeekRange = (dateRange: string) => {
    console.log("chec dateRange", dateRange);
    const today = new Date();
    const [startStr, endStr] = dateRange.split(" - ");
    const [startDay, startMonth] = startStr.split("/").map(Number);
    const [endDay, endMonth] = endStr.split("/").map(Number);

    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;

    if (currentMonth === startMonth && currentMonth === endMonth) {
      return currentDay >= startDay && currentDay <= endDay;
    }

    if (currentMonth === startMonth) {
      return currentDay >= startDay;
    }

    if (currentMonth === endMonth) {
      return currentDay <= endDay;
    }

    return false;
  };

  const isCurrentPeriod = (date: string, type: string) => {
    const today = new Date();
    const itemDate = new Date(date);

    if (type === "week") {
      const itemWeekStart = new Date(itemDate);
      itemWeekStart.setDate(itemDate.getDate() - itemDate.getDay() + 1);

      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay() + 1);

      itemWeekStart.setHours(0, 0, 0, 0);
      currentWeekStart.setHours(0, 0, 0, 0);

      return itemWeekStart.getTime() === currentWeekStart.getTime();
    }

    return (
      today.getMonth() === itemDate.getMonth() &&
      today.getFullYear() === itemDate.getFullYear()
    );
  };

  return {
    state: {
      currentWeekRange: getCurrentWeekRange(),
      isCurrentWeekRange,
      isCurrentPeriod,
      selectedType,
      types: STATISTIC_TYPES,
    },
    handler: {
      handleSelectType,
    },
  };
};
