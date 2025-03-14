import { MaterialIcons } from "@expo/vector-icons";
import { useState, useCallback } from "react";

const useSpendingBudget = () => {
  // Cycle information (could be fetched from an API)
  const [cycleInfo] = useState({
    cycle: "01.03 đến 31.03.2025",
    remainingDays: 23,
  });

  // Budget sections with items (sample data)
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
    // Implement logic to add a new budget item (e.g., navigate to a form)
  }, []);

  const handleBack = useCallback(() => {
    // Implement navigation logic to go back (e.g., router.back())
  }, []);

  return {
    cycleInfo,
    budgetSections,
    handleAddBudget,
    handleBack,
  };
};

export default useSpendingBudget;
