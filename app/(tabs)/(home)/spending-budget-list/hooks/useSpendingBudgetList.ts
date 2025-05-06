import { PATH_NAME } from "@/helpers/constants/pathname";
import {
  calculateRemainingDays,
  formatDateMonth,
  formatDateMonthYear,
} from "@/helpers/libs";
import { Category } from "@/helpers/types/category.types";
import { FinancialGoal } from "@/helpers/types/financialGoal.type";
import { Subcategory } from "@/helpers/types/subCategory";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import { useGetPersonalFinancialGoalUserSpendingModelQuery } from "@/services/financialGoal";
import { useGetCurrentCategoriesQuery } from "@/services/userSpendingModel";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";

interface BudgetItem {
  id: string;
  name: string;
  remaining: number;
  currentAmount: number;
  targetAmount: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  subcategoryId: string;
  isSaving: boolean;
}

interface BudgetSection {
  id: string;
  category: string;
  items: BudgetItem[];
  isSaving: boolean;
}

interface SubcategoryMapItem {
  id: string;
  name: string;
  icon: string;
  categoryCode: string;
  categoryName: string;
}

const useSpendingBudget = () => {
  const { userSpendingId, activeTab } = useLocalSearchParams();

  const dispatch = useDispatch();
  const currentSpendingModel = useSelector(selectCurrentUserSpendingModel);
  const { HOME } = PATH_NAME;
  const modalizeRef = useRef<Modalize>(null);

  const openRulesModal = () => {
    modalizeRef.current?.open();
  };

  // const {
  //   data: financialGoalsData,
  //   isLoading: isLoadingGoals,
  //   refetch: refetchGoals,
  // } = useGetPersonalFinancialGoalsQuery({ PageIndex: 1, PageSize: 20 });

  const {
    data: financialGoalsData,
    isLoading: isLoadingGoals,
    refetch: refetchPersonalFinancialGoals,
  } = useGetPersonalFinancialGoalUserSpendingModelQuery({
    id: userSpendingId || currentSpendingModel?.id,
  });

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

      categoriesData?.data?.forEach((category: Category) => {
        category?.subcategories?.forEach((subcategory: Subcategory) => {
          subcategoryMap?.set(subcategory?.id, {
            id: subcategory?.id,
            name: subcategory?.name,
            icon: subcategory?.icon,
            categoryCode: category?.code,
            categoryName: category?.name,
          });
        });
      });

      financialGoalsData?.items?.forEach((goal: FinancialGoal) => {
        const subcategory = subcategoryMap?.get(goal?.subcategoryId);

        if (subcategory) {
          const categoryCode = subcategory.categoryCode;

          if (!sectionMap?.has(categoryCode)) {
            sectionMap?.set(categoryCode, {
              id: categoryCode,
              category: subcategory?.categoryName,
              items: [],
              isSaving: goal?.isSaving,
            });
          }

          const section = sectionMap?.get(categoryCode);
          if (section) {
            section?.items?.push({
              id: goal?.id,
              name: goal?.name,
              remaining:
                goal?.targetAmount - goal?.currentAmount < 0
                  ? 0
                  : goal?.targetAmount - goal?.currentAmount,
              currentAmount: goal?.currentAmount,
              targetAmount: goal?.targetAmount,
              isSaving: goal?.isSaving,
              icon:
                (subcategory?.icon as keyof typeof MaterialIcons.glyphMap) ||
                "account-balance",
              subcategoryId: goal?.subcategoryId,
            });
          }
        }
      });

      setBudgetSections(Array.from(sectionMap?.values()));
      setIsLoading(false);
    }
  }, [financialGoalsData, categoriesData, isLoadingGoals, isLoadingCategories]);

  const cycleInfo = useMemo(() => {
    if (
      !currentSpendingModel ||
      !currentSpendingModel?.startDate ||
      !currentSpendingModel?.endDate
    ) {
      return { cycle: "Không có chu kỳ", remainingDays: 0 };
    }

    return {
      cycle: `${formatDateMonth(currentSpendingModel?.startDate)} đến ${formatDateMonthYear(currentSpendingModel?.endDate)}`,
      remainingDays: calculateRemainingDays(currentSpendingModel?.endDate),
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
      refetchPersonalFinancialGoals();
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
  );

  const handleBudgetPress = useCallback(
    (budgetId: string, subCategoryId: string) => {
      router.navigate({
        pathname: PATH_NAME.HOME.EXPENSES_DETAIL as any,
        params: {
          budgetId: budgetId,
          subCategoryId: subCategoryId,
          activeTab: activeTab,
        },
      });
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    refetchPersonalFinancialGoals().finally(() => setIsLoading(false));
  }, [refetchPersonalFinancialGoals]);

  return {
    state: useMemo(
      () => ({
        cycleInfo,
        budgetSections,
        isLoading,
        modalizeRef,
        activeTab,
      }),
      [cycleInfo, budgetSections, isLoading, activeTab],
    ),
    handler: {
      handleAddBudget,
      handleBack,
      handleBudgetPress,
      handleRefresh,
      openRulesModal,
    },
  };
};

export default useSpendingBudget;
