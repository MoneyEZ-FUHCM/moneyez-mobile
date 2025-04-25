import { convertUTCToVietnamTime, formatCurrencyInput } from "@/helpers/libs";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import {
  useCreateGroupFinancialGoalMutation,
  useGetGroupFinancialGoalQuery,
  useUpdateGroupFinancialGoalMutation,
} from "@/services/financialGoal";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import GROUP_FINANCIAL_GOAL_CONSTANT from "../GroupFinancialGoal.constant";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "../GroupFinancialGoal.translate";

export default function useGroupFinancialGoalForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const groupId = groupDetail?.id || "";

  const { mode, goalId } = useLocalSearchParams<{
    mode?: "create" | "update";
    goalId?: string;
  }>();

  const isCreateMode = !goalId || mode === "create";
  const [initialValues, setInitialValues] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: new Date(),
  });

  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});
  const { ERROR_CODE } = GROUP_FINANCIAL_GOAL_CONSTANT;

  const { data: groupFinancialGoalData, isLoading: isLoadingGoal } =
    useGetGroupFinancialGoalQuery({ groupId }, { skip: !groupId });

  const [createGroupFinancialGoal, { isLoading: isCreating }] =
    useCreateGroupFinancialGoalMutation();
  const [updateGroupFinancialGoal, { isLoading: isUpdating }] =
    useUpdateGroupFinancialGoalMutation();

  const isSubmitting = isCreating || isUpdating;
  const isLoading = isLoadingGoal;

  const financialGoal = groupFinancialGoalData?.data
    ? groupFinancialGoalData.data.filter(
        (goal: { isDeleted: boolean }) => goal.isDeleted === false,
      )[0] || null
    : null;

  useEffect(() => {
    if (!isCreateMode && financialGoal) {
      console.log("check financialGoal", financialGoal.deadline);
      setInitialValues({
        name: financialGoal.name,
        targetAmount: formatCurrencyInput(
          financialGoal.targetAmount?.toString() || "",
        ),
        currentAmount: formatCurrencyInput(
          financialGoal.currentAmount?.toString() || "",
        ),
        deadline: new Date(financialGoal.deadline),
      });
    }
  }, [groupFinancialGoalData, isCreateMode, goalId]);

  // Validation schema
  const FinancialGoalSchema = Yup.object().shape({
    name: Yup.string()
      .required(TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR.NAME_REQUIRED)
      .min(
        3,
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR.NAME_MIN_LENGTH,
      ),
    targetAmount: Yup.string()
      .required(
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
          .TARGET_AMOUNT_REQUIRED,
      )
      .test(
        "is-valid-amount",
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
          .TARGET_AMOUNT_MUST_GREATER_THAN_ZERO,
        (value) => {
          const numericValue = value
            ? parseInt(value.toString().replace(/\D/g, ""))
            : 0;
          return numericValue > 0;
        },
      )
      .test(
        "is-greater-than-current",
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
          .TARGET_AMOUNT_MUST_BE_GREATER_THAN_CURRENT,
        function (value) {
          // if (isCreateMode) return true;

          const targetAmount = value
            ? parseInt(value.toString().replace(/\D/g, ""))
            : 0;
          const currentAmount = financialGoal?.currentAmount || 0;

          return targetAmount >= currentAmount;
        },
      ),
    currentAmount: Yup.string().when("$isUpdateMode", {
      is: (val: boolean) => val === true,
      then: () =>
        Yup.string()
          .required(
            TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
              .CURRENT_AMOUNT_REQUIRED,
          )
          .test(
            "is-valid-amount",
            TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
              .CURRENT_AMOUNT_MUST_GREATER_THAN_ZERO,
            (value) => {
              const numericValue = value
                ? parseInt(value.toString().replace(/\D/g, ""))
                : 0;
              return numericValue >= 0;
            },
          ),
      otherwise: () => Yup.string(),
    }),
    deadline: Yup.date()
      .required(
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR.DEADLINE_REQUIRED,
      )
      .min(
        new Date(),
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
          .DEADLINE_MUST_BE_FUTURE,
      ),
  });

  const handleSubmit = async (values: any) => {
    try {
      const targetAmount = parseInt(
        values.targetAmount.toString().replace(/\D/g, ""),
      );

      if (isCreateMode) {
        const createPayload = {
          groupId,
          name: values.name,
          targetAmount,
          currentAmount: 0,
          deadline: convertUTCToVietnamTime(values.deadline),
        };

        await createGroupFinancialGoal(createPayload).unwrap();
        ToastAndroid.show(
          TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_SUCCESS.CREATE_SUCCESS,
          ToastAndroid.SHORT,
        );
      } else if (financialGoal?.id) {
        const updatePayload = {
          id: financialGoal.id,
          groupId,
          name: values.name,
          targetAmount,
          deadline: convertUTCToVietnamTime(values.deadline),
        };
        await updateGroupFinancialGoal(updatePayload).unwrap();
        ToastAndroid.show(
          TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_SUCCESS.UPDATE_SUCCESS,
          ToastAndroid.SHORT,
        );
      }

      dispatch(setGroupTabHidden(true));
      router.back();
    } catch (err: any) {
      console.log("check err", err);
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.INVALID_DEADLINE) {
        ToastAndroid.show(
          TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
            .DEADLINE_MUST_BE_FUTURE,
          ToastAndroid.SHORT,
        );
        return;
      }
      if (error?.errorCode === ERROR_CODE.INVALID_TARGET_AMOUNT) {
        ToastAndroid.show(
          TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR
            .TARGET_AMOUNT_MUST_BE_GREATER_THAN_CURRENT,
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR.SAVE_FAILED,
        ToastAndroid.SHORT,
      );
    }
  };

  const handleGoBack = () => {
    router.back();
    dispatch(setGroupTabHidden(true));
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleGoBack]),
  );

  return {
    state: {
      isLoading,
      isSubmitting,
      isCreateMode,
      financialGoal,
      initialValues,
    },
    refState: {
      formikRef,
    },
    handler: {
      handleSubmit,
      handleGoBack,
      handleSubmitRef,
      FinancialGoalSchema,
    },
  };
}
