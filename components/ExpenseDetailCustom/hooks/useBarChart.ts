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
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);

      const itemDateStart = new Date(itemDate);
      itemDateStart.setHours(0, 0, 0, 0);

      const currentWeekStart = new Date(todayStart);
      currentWeekStart.setDate(
        todayStart.getDate() -
          todayStart.getDay() +
          (todayStart.getDay() === 0 ? -6 : 1),
      );

      const itemWeekStart = new Date(itemDateStart);
      itemWeekStart.setDate(
        itemDateStart.getDate() -
          itemDateStart.getDay() +
          (itemDateStart.getDay() === 0 ? -6 : 1),
      );

      return currentWeekStart.getTime() === itemWeekStart.getTime();
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
