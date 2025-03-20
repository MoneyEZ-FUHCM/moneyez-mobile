import { PATH_NAME } from "@/helpers/constants/pathname";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

const useSpendingBudget = () => {
  const dispatch = useDispatch();
  const { HOME } = PATH_NAME;
  
  const [cycleInfo] = useState({
    cycle: "01.03 đến 31.03.2025",
    remainingDays: 23,
  });

  const [budgetSections] = useState([
    {
      id: "essential",
      title: "Nhu cầu thiết yếu",
      items: [
        {
          id: "1",
          category: "Ăn uống",
          remaining: 1500000,
          spent: 500000,
          total: 2000000,
          icon: "restaurant" as keyof typeof MaterialIcons.glyphMap,
        },
        {
          id: "2",
          category: "Đi lại",
          remaining: 1500000,
          spent: 500000,
          total: 2000000,
          icon: "directions-car" as keyof typeof MaterialIcons.glyphMap,
        },
      ],
    },
    {
      id: "saving",
      title: "Tiết kiệm",
      items: [
        {
          id: "3",
          category: "Tiền mua nhà",
          remaining: 99500000,
          spent: 500000,
          total: 100000000,
          icon: "home" as keyof typeof MaterialIcons.glyphMap,
        },
      ],
    },
  ]);

  const handleAddBudget = useCallback(() => {
    dispatch(setMainTabHidden(true));
    router.push(HOME.ADD_SPENDING_BUDGET_STEP_1 as any);
  }, [dispatch, HOME.ADD_SPENDING_BUDGET_STEP_1]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleBudgetPress = useCallback((budgetId: string) => {
    console.log(`Budget ${budgetId} pressed`);
  }, []);

  return {
    state: useMemo(
      () => ({
        cycleInfo,
        budgetSections,
      }),
      [cycleInfo, budgetSections]
    ),
    handler: {
      handleAddBudget,
      handleBack,
      handleBudgetPress,
    }
  };
};

export default useSpendingBudget;