import { useState, useCallback } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PATH_NAME } from "@/helpers/constants/pathname";

const useCreateSpendingBudgetStep2 = () => {
  const { HOME } = PATH_NAME;

  const [selectedCategory] = useState({
    id: "3",
    label: "Đi lại",
    icon: "directions-car" as keyof typeof MaterialIcons.glyphMap,
    maxAmount: 500000,
    currentAmount: 0,
    maxAmountFormatted: "500.000đ",
    currentAmountFormatted: "0đ",
  });

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleCreateBudget = useCallback(() => {
    console.log("Creating spending budget for category:", selectedCategory);
    router.replace(HOME.SPENDING_BUDGET_LIST as any);
  }, [selectedCategory]);

  return {
    selectedCategory,
    handleBack,
    handleCreateBudget,
  };
};

export default useCreateSpendingBudgetStep2;
