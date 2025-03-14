import { useState, useCallback } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const useCreateSpendingBudgetStep1 = () => {
  // Sample grouped categories data (could be fetched from an API)
  const [categoryGroups] = useState([
    {
      id: "group1",
      title: "Nhu cầu thiết yếu",
      items: [
        {
          id: "1",
          label: "Vật dụng cá nhân",
          icon: "widgets" as keyof typeof MaterialIcons.glyphMap ,
          status: "notCreated",
        },
        {
          id: "2",
          label: "Ăn uống",
          icon: "restaurant" as keyof typeof MaterialIcons.glyphMap ,
          status: "created",
        },
        {
          id: "3",
          label: "Đi lại",
          icon: "directions-car" as keyof typeof MaterialIcons.glyphMap ,
          status: "created",
        },
        {
          id: "4",
          label: "Hiển thị thêm ...",
          icon: "more-horiz" as keyof typeof MaterialIcons.glyphMap ,
          status: "more",
        },
      ],
    },
    {
      id: "group2",
      title: "Nhu cầu thiết yếu",
      items: [
        {
          id: "5",
          label: "Vật dụng cá nhân",
          icon: "widgets" as keyof typeof MaterialIcons.glyphMap ,
          status: "notCreated",
        },
        {
          id: "6",
          label: "Ăn uống",
          icon: "restaurant" as keyof typeof MaterialIcons.glyphMap ,
          status: "created",
        },
        {
          id: "7",
          label: "Đi lại",
          icon: "directions-car" as keyof typeof MaterialIcons.glyphMap ,
          status: "created",
        },
        {
          id: "8",
          label: "Hiển thị thêm ...",
          icon: "more-horiz" as keyof typeof MaterialIcons.glyphMap ,
          status: "more",
        },
      ],
    },
  ]);

  const handleBack = useCallback(() => {
    // Implement navigation back logic
    router.back();
  }, []);

  const handleSelectCategory = useCallback((item) => {
    // Handle category selection logic (e.g., store selected item in state)
    console.log("Selected category:", item);
  }, []);

  const handleContinue = useCallback(() => {
    // Navigate to Step 2 (e.g., passing the selected category)
    router.push("/create-spending-budget-step2");
  }, []);

  return {
    categoryGroups,
    handleBack,
    handleContinue,
    handleSelectCategory,
  };
};

export default useCreateSpendingBudgetStep1;
