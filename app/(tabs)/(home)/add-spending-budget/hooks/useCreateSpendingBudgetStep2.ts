import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import { useCreateFinancialGoalMutation } from "@/services/financialGoal";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ToastAndroid } from "react-native";
import { useSelector } from "react-redux";
import TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2 from "../CreateSpendingBudgetStep2.translate";
import { COMMON_CONSTANT } from "@/helpers/constants/common";

const useCreateSpendingBudgetStep2 = () => {
  const { HOME } = PATH_NAME;
  const { HTTP_STATUS } = COMMON_CONSTANT;
  const { subcategoryId, icon, name } = useLocalSearchParams();
  const currentSpendingModel = useSelector(selectCurrentUserSpendingModel);
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE } = TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2;

  const [state, setState] = useState({
    isSubmitting: false,
    isLoading: false,
  });

  const [createFinancialGoal] = useCreateFinancialGoalMutation();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleCreateBudget = useCallback(async (amount: number) => {
    if (!subcategoryId || amount <= 0) {
      ToastAndroid.show(MESSAGE_VALIDATE.INFORMATION_REQUIRED, ToastAndroid.SHORT);
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true, isLoading: true }));

      const response = await createFinancialGoal({
        name: name || "",
        subcategoryId: subcategoryId,
        targetAmount: amount,
        deadline: currentSpendingModel?.endDate,
      }).unwrap();

      if (response && response.status === HTTP_STATUS.SUCCESS.CREATED) {
        ToastAndroid.show(MESSAGE_SUCCESS.CREATE_SUCCESS, ToastAndroid.SHORT);
        router.replace(HOME.SPENDING_BUDGET_LIST as any);
      } else {
        ToastAndroid.show(response.message || MESSAGE_ERROR.SOMETHING_WRONG, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(MESSAGE_ERROR.SOMETHING_WRONG, ToastAndroid.SHORT);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false, isLoading: false }));
    }
  }, [subcategoryId, createFinancialGoal, HOME.SPENDING_BUDGET_LIST, MESSAGE_SUCCESS.CREATE_SUCCESS, MESSAGE_ERROR.SOMETHING_WRONG, currentSpendingModel?.endDate]);

  return {
    state: useMemo(() => ({
      ...state,
      selectedCategory: {
        label: name,
        icon: (icon as keyof typeof MaterialIcons.glyphMap) || "account-balance",
        subcategoryId: subcategoryId,
      }
    }), [state, subcategoryId]),

    handler: {
      handleBack,
      handleCreateBudget,
    }
  };
};

export default useCreateSpendingBudgetStep2;