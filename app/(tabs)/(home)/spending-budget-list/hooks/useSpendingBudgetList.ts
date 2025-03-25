import { PATH_NAME } from "@/helpers/constants/pathname";
import {
  calculateRemainingDays,
  formatDateMonth,
  formatDateMonthYear,
} from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import { useGetPersonalFinancialGoalsQuery } from "@/services/financialGoal";
import { useGetCurrentCategoriesQuery } from "@/services/userSpendingModel";
import { Category } from "@/types/category.types";
import { FinancialGoal } from "@/types/financialGoal.type";
import { Subcategory } from "@/types/subCategory";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface BudgetItem {
  id: string;
  name: string;
  remaining: number;
  currentAmount: number;
  targetAmount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  subcategoryId: string;
}

interface BudgetSection {
  id: string;
  category: string;
  items: BudgetItem[];
}

interface SubcategoryMapItem {
  id: string;
  name: string;
  icon: string;
  categoryCode: string;
  categoryName: string;
}

const useSpendingBudget = () => {
  const dispatch = useDispatch();
  const currentSpendingModel = useSelector(selectCurrentUserSpendingModel);
  const { HOME } = PATH_NAME;

  const {
    data: financialGoalsData,
    isLoading: isLoadingGoals,
    refetch: refetchGoals,
  } = useGetPersonalFinancialGoalsQuery({ PageIndex: 1, PageSize: 20 });

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCurrentCategoriesQuery({});

  const [budgetSections, setBudgetSections] = useState<BudgetSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      !isLoadingGoals &&
      !isLoadingCategories &&
      financialGoalsData?.items &&
      categoriesData?.data
    ) {
      const subcategoryMap = new Map<string, SubcategoryMapItem>();
      const sectionMap = new Map<string, BudgetSection>();

      categoriesData.data.forEach((category: Category) => {
        category.subcategories.forEach((subcategory: Subcategory) => {
          subcategoryMap.set(subcategory.id, {
            id: subcategory.id,
            name: subcategory.name,
            icon: subcategory.icon,
            categoryCode: category.code,
            categoryName: category.name,
          });
        });
      });

      financialGoalsData.items.forEach((goal: FinancialGoal) => {
        const subcategory = subcategoryMap.get(goal.subcategoryId);

        if (subcategory) {
          const categoryCode = subcategory.categoryCode;

          if (!sectionMap.has(categoryCode)) {
            sectionMap.set(categoryCode, {
              id: categoryCode,
              category: subcategory.categoryName,
              items: [],
            });
          }

          const section = sectionMap.get(categoryCode);
          if (section) {
            section.items.push({
              id: goal.id,
              name: goal.name,
              remaining: goal.targetAmount - goal.currentAmount,
              currentAmount: goal.currentAmount,
              targetAmount: goal.targetAmount,
              icon:
                (subcategory.icon as keyof typeof MaterialIcons.glyphMap) ||
                "account-balance",
              subcategoryId: goal.subcategoryId,
            });
          }
        }
      });

      setBudgetSections(Array.from(sectionMap.values()));
      setIsLoading(false);
    }
  }, [financialGoalsData, categoriesData, isLoadingGoals, isLoadingCategories]);

  const cycleInfo = useMemo(() => {
    if (
      !currentSpendingModel ||
      !currentSpendingModel.startDate ||
      !currentSpendingModel.endDate
    ) {
      return { cycle: "Không có chu kỳ", remainingDays: 0 };
    }

    return {
      cycle: `${formatDateMonth(currentSpendingModel.startDate)} đến ${formatDateMonthYear(currentSpendingModel.endDate)}`,
      remainingDays: calculateRemainingDays(currentSpendingModel.endDate),
    };
  }, [currentSpendingModel]);

  const handleAddBudget = useCallback(() => {
    dispatch(setMainTabHidden(true));
    router.push(HOME.ADD_SPENDING_BUDGET_STEP_1 as any);
  }, [dispatch, HOME.ADD_SPENDING_BUDGET_STEP_1]);

  const handleBack = useCallback(() => {
    dispatch(setMainTabHidden(false));
    router.back();
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

  const handleBudgetPress = useCallback((budgetId: string) => {
    router.navigate({
      pathname: PATH_NAME.HOME.EXPENSES_DETAIL as any,
      params: { budgetId: budgetId },
    });
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    refetchGoals().finally(() => setIsLoading(false));
  }, [refetchGoals]);

  return {
    state: useMemo(
      () => ({
        cycleInfo,
        budgetSections,
        isLoading,
      }),
      [cycleInfo, budgetSections, isLoading],
    ),
    handler: {
      handleAddBudget,
      handleBack,
      handleBudgetPress,
      handleRefresh,
    },
  };
};

export default useSpendingBudget;
