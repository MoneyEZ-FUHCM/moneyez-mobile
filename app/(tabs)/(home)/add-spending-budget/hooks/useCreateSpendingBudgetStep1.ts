import { useState, useCallback, useMemo, useEffect } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { useGetCurrentCategoriesQuery } from "@/services/userSpendingModel";
import { useGetPersonalFinancialGoalsQuery } from "@/services/financialGoal";
import TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1 from "../CreateSpendingBudgetStep1.translate";
import { Category } from "@/types/category.types";
import { Subcategory } from "@/types/subCategory";
import { FinancialGoal } from "@/types/financialGoal.type";

export interface CategoryItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  status: 'notCreated' | 'created' | 'more';
  subcategoryId?: string;
  categoryCode?: string;
}

export interface CategoryGroup {
  id: string;
  title: string;
  items: CategoryItem[];
  allItems: CategoryItem[];
  visibleCount: number;
  itemsPerPage: number;
}

const ITEMS_PER_PAGE = 3;

const useCreateSpendingBudgetStep1 = () => {
  const { HOME } = PATH_NAME;

  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    selectedCategoryId: null as string | null,
    categoryGroups: [] as CategoryGroup[],
  });

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCurrentCategoriesQuery({});

  const { data: financialGoalsData, isLoading: isLoadingGoals } =
    useGetPersonalFinancialGoalsQuery({ PageIndex: 1, PageSize: 100 });

  useEffect(() => {
    if (
      !isLoadingCategories &&
      !isLoadingGoals &&
      categoriesData?.data &&
      financialGoalsData?.items
    ) {
      const budgetMap = new Map<string, FinancialGoal>();

      financialGoalsData.items.forEach((goal: FinancialGoal) => {
        budgetMap.set(goal.subcategoryId, goal);
      });

      const groups: CategoryGroup[] = [];

      const expenseCategories = categoriesData.data.filter(
        (category: Category) => category.type === "EXPENSE"
      );

      expenseCategories.forEach((category: Category) => {
        const allItems: CategoryItem[] = [];

        category.subcategories.forEach((subcategory: Subcategory) => {
          const hasBudget = budgetMap.has(subcategory.id);

          allItems.push({
            id: subcategory.id,
            label: subcategory.name,
            icon: (subcategory.icon as keyof typeof MaterialIcons.glyphMap) || "account-balance",
            status: hasBudget ? "created" : "notCreated",
            subcategoryId: subcategory.id,
            categoryCode: category.code
          });
        });

        const visibleCount = Math.min(ITEMS_PER_PAGE, allItems.length);
        const visibleItems = allItems.slice(0, visibleCount);

        if (allItems.length > 0) {
          const showMoreNeeded = allItems.length > visibleCount;

          const items = [...visibleItems];
          if (showMoreNeeded) {
            items.push({
              id: `more-${category.code}`,
              label: TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1.BUTTON.SHOW_MORE,
              icon: "more-horiz" as keyof typeof MaterialIcons.glyphMap,
              status: "more",
              categoryCode: category.code
            });
          }

          groups.push({
            id: category.code,
            title: category.name,
            items: items,
            allItems: allItems,
            visibleCount: visibleCount,
            itemsPerPage: ITEMS_PER_PAGE
          });
        }
      });

      setState(prev => ({
        ...prev,
        categoryGroups: groups
      }));

      setIsLoading(false);
    }
  }, [categoriesData, financialGoalsData, isLoadingCategories, isLoadingGoals]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleSelectCategory = useCallback((item: CategoryItem) => {
    if (item.status === 'created') {
      return;
    }

    if (item.status === 'more' && item.categoryCode) {
      setState(prev => {
        const updatedGroups = prev.categoryGroups.map(group => {
          if (group.id === item.categoryCode) {
            const newVisibleCount = Math.min(
              group.visibleCount + group.itemsPerPage,
              group.allItems.length
            );

            const newVisibleItems = group.allItems.slice(0, newVisibleCount);
            const showMoreNeeded = group.allItems.length > newVisibleCount;

            const items = [...newVisibleItems];
            if (showMoreNeeded) {
              items.push({
                id: `more-${group.id}`,
                label: TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP1.BUTTON.SHOW_MORE,
                icon: "more-horiz" as keyof typeof MaterialIcons.glyphMap,
                status: "more",
                categoryCode: group.id
              });
            }

            return {
              ...group,
              items,
              visibleCount: newVisibleCount
            };
          }
          return group;
        });

        return {
          ...prev,
          categoryGroups: updatedGroups
        };
      });
      return;
    }

    setState(prev => ({
      ...prev,
      selectedCategoryId: prev.selectedCategoryId === item.id ? null : item.id
    }));
  }, []);

  const handleContinue = useCallback(() => {
    if (state.selectedCategoryId) {
      const selectedItem = state.categoryGroups
        .flatMap(group => group.allItems)
        .find(item => item.id === state.selectedCategoryId);
      router.push({
        pathname: HOME.ADD_SPENDING_BUDGET_STEP_2 as any,
        params: {
          subcategoryId: selectedItem?.subcategoryId,
          icon: selectedItem?.icon,
          name: selectedItem?.label
        }
      });
    }
  }, [state.selectedCategoryId, state.categoryGroups, HOME.ADD_SPENDING_BUDGET_STEP_2]);

  return {
    state: useMemo(() => ({
      ...state,
      isLoading
    }), [state, isLoading]),

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