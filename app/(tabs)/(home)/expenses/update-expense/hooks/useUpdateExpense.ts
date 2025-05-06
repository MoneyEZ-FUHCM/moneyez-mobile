import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { setLoading } from "@/redux/slices/loadingSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import {
  useGetPersonalLimitBudgetSubcategoryQuery,
  useUpdateFinancialGoalMutation,
} from "@/services/financialGoal";
import {
  PersonalLimitBudgetSubcate,
  UpdateBudgetPayload,
} from "@/helpers/types/financialGoal.type";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import UPDATE_EXPENSE_CONSTANTS from "../UpdateExpense.const";
import TEXT_TRANSLATE_UPDATE_EXPENSE from "../UpdateExpense.translate";

const useUpdateExpense = () => {
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});
  const handleBack = useCallback(() => {
    router.back();
  }, []);
  const currentSpendingModel = useSelector(selectCurrentUserSpendingModel);
  const { ERROR_CODE } = UPDATE_EXPENSE_CONSTANTS;
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const [updateFinancialGoal] = useUpdateFinancialGoalMutation();
  const { HTTP_STATUS } = COMMON_CONSTANT;

  const params = useLocalSearchParams();
  const data: UpdateBudgetPayload = {
    amount: Number(params?.amount),
    icon: params?.icon as string,
    name: params?.name as string,
    subCategoryId: params?.subCategoryId as string,
    budgetId: params.budgetId as string,
  };
  const { data: personalLimitBudgetSubcate, refetch } =
    useGetPersonalLimitBudgetSubcategoryQuery(
      { id: params?.subCategoryId },
      { skip: !params.subCategoryId },
    );

  useEffect(() => {
    refetch();
  }, [params?.subCategoryId]);

  const initialValues = {
    amount: "",
  };

  const BudgetSchema = Yup.object().shape({
    amount: Yup.string()
      .required("Vui lòng nhập số tiền tối đa")
      .test("is-valid-amount", "Số tiền phải lớn hơn 0", (value) => {
        const numericValue = value ? parseInt(value.replace(/\D/g, "")) : 0;
        return numericValue > 0;
      }),
  });
  const dispatch = useDispatch();

  const handleUpdateBudget = useCallback(
    async (amount: number) => {
      if (!data?.budgetId || amount <= 0) {
        ToastAndroid.show(
          TEXT_TRANSLATE_UPDATE_EXPENSE.MESSAGE_VALIDATE.INFORMATION_REQUIRED,
          ToastAndroid.SHORT,
        );
        return;
      }

      // if (amount > personalLimitBudgetSubcate?.data?.limitBudget) {
      //   ToastAndroid.show(
      //     "Vui lòng không cập nhật số tiền lớn hơn số dư hiện tại",
      //     ToastAndroid.SHORT,
      //   );
      //   return;
      // }
      dispatch(setLoading(true));
      const payload = {
        name: data.name || "",
        id: data.budgetId,
        targetAmount: amount,
        deadline: currentSpendingModel?.endDate,
      };

      try {
        const response = await updateFinancialGoal(payload).unwrap();
        if (response && response.status === HTTP_STATUS.SUCCESS.OK) {
          ToastAndroid.show(
            TEXT_TRANSLATE_UPDATE_EXPENSE.MESSAGE_SUCCESS.UPDATE_SUCCESS,
            ToastAndroid.SHORT,
          );
          router.back();
        }
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.INVALID_TARGET_AMOUNT) {
          ToastAndroid.show(
            TEXT_TRANSLATE_UPDATE_EXPENSE.MESSAGE_ERROR.INVALID_TARGET_AMOUNT,
            ToastAndroid.SHORT,
          );
          return;
        }
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [
      data?.budgetId,
      updateFinancialGoal,
      TEXT_TRANSLATE_UPDATE_EXPENSE.MESSAGE_SUCCESS.UPDATE_SUCCESS,
      currentSpendingModel?.endDate,
    ],
  );

  return {
    state: {
      budget: data,
      formikRef,
      initialValues,
      personalLimitBudgetSubcate:
        personalLimitBudgetSubcate?.data as PersonalLimitBudgetSubcate,
    },
    handler: {
      handleBack,
      handleSubmitRef,
      BudgetSchema,
      handleUpdateBudget,
    },
  };
};

export default useUpdateExpense;
