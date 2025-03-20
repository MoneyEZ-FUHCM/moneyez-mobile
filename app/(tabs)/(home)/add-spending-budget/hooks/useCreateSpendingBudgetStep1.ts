import { useState, useCallback, useMemo } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PATH_NAME } from "@/helpers/constants/pathname";

export interface CategoryItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  status: 'notCreated' | 'created' | 'more';
}

export interface CategoryGroup {
  id: string;
  title: string;
  items: CategoryItem[];
}

const useCreateSpendingBudgetStep1 = () => {
  const { HOME } = PATH_NAME;
  
  const [state, setState] = useState({
    selectedCategoryId: null as string | null,
    categoryGroups: [
      {
        id: "group1",
        title: "Nhu cầu thiết yếu",
        items: [
          {
            id: "1",
            label: "Vật dụng cá nhân",
            icon: "widgets" as keyof typeof MaterialIcons.glyphMap,
            status: "notCreated",
          },
          {
            id: "2",
            label: "Ăn uống",
            icon: "restaurant" as keyof typeof MaterialIcons.glyphMap,
            status: "created",
          },
          {
            id: "3",
            label: "Đi lại",
            icon: "directions-car" as keyof typeof MaterialIcons.glyphMap,
            status: "created",
          },
          {
            id: "4",
            label: "Hiển thị thêm ...",
            icon: "more-horiz" as keyof typeof MaterialIcons.glyphMap,
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
            icon: "widgets" as keyof typeof MaterialIcons.glyphMap,
            status: "notCreated",
          },
          {
            id: "6",
            label: "Ăn uống",
            icon: "restaurant" as keyof typeof MaterialIcons.glyphMap,
            status: "created",
          },
          {
            id: "7",
            label: "Đi lại",
            icon: "directions-car" as keyof typeof MaterialIcons.glyphMap,
            status: "created",
          },
          {
            id: "8",
            label: "Hiển thị thêm ...",
            icon: "more-horiz" as keyof typeof MaterialIcons.glyphMap,
            status: "more",
          },
        ],
      },
    ],
  });

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleSelectCategory = useCallback((item: CategoryItem) => {
    if (item.status === 'created' || item.status === 'more') {
      return;
    }

    setState(prev => ({
      ...prev,
      selectedCategoryId: prev.selectedCategoryId === item.id ? null : item.id
    }));
    console.log("Selected category:", item);
  }, []);

  const handleContinue = useCallback(() => {
    if (state.selectedCategoryId) {
      router.push({
        pathname: HOME.ADD_SPENDING_BUDGET_STEP_2 as any,
        params: { categoryId: state.selectedCategoryId }
      });
    } else {
      console.log("Please select a category first");
    }
  }, [state.selectedCategoryId, HOME.ADD_SPENDING_BUDGET_STEP_2]);

  return {
    state: useMemo(() => ({
      ...state
    }), [state]),
    
    handler: {
      handleBack,
      handleContinue,
      handleSelectCategory,
      setSelectedCategory: (categoryId: string | null) => 
        setState(prev => ({ ...prev, selectedCategoryId: categoryId })),
    }
  };
};

export default useCreateSpendingBudgetStep1;