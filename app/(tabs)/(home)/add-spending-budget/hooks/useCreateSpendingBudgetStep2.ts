import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setLoading } from "@/redux/slices/loadingSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import {
  useCreateFinancialGoalMutation,
  useGetPersonalLimitBudgetSubcategoryQuery,
} from "@/services/financialGoal";
import { PersonalLimitBudgetSubcate } from "@/types/financialGoal.type";
import { MaterialIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CREATE_SPENDING_BUDGET from "../CreateSpendingBudget.constant";
import TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2 from "../CreateSpendingBudgetStep2.translate";

const useCreateSpendingBudgetStep2 = () => {
  const { HOME } = PATH_NAME;
  const { HTTP_STATUS } = COMMON_CONSTANT;
  const { subcategoryId, icon, name } = useLocalSearchParams();
  const currentSpendingModel = useSelector(selectCurrentUserSpendingModel);
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE } =
    TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2;
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});
  const [createFinancialGoal] = useCreateFinancialGoalMutation();
  const { data: personalLimitBudgetSubcate } =
    useGetPersonalLimitBudgetSubcategoryQuery(
      { id: subcategoryId },
      { skip: !subcategoryId },
    );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { ERROR_CODE } = CREATE_SPENDING_BUDGET;

  const handleBack = useCallback(() => {
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

  const handleCreateBudget = useCallback(
    async (amount: number) => {
      if (!subcategoryId || amount <= 0) {
        ToastAndroid.show(
          MESSAGE_VALIDATE.INFORMATION_REQUIRED,
          ToastAndroid.SHORT,
        );
        return;
      }
      dispatch(setLoading(true));
      try {
        const response = await createFinancialGoal({
          name: name || "",
          subcategoryId: subcategoryId,
          targetAmount: amount,
          deadline: currentSpendingModel?.endDate,
        }).unwrap();

        if (response && response.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(MESSAGE_SUCCESS.CREATE_SUCCESS, ToastAndroid.SHORT);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: PATH_NAME.HOME.HOME_DEFAULT },
                {
                  name: PATH_NAME.HOME.SPENDING_BUDGET_LIST,
                },
              ],
            }),
          );
        } else {
          ToastAndroid.show(
            response.message || MESSAGE_ERROR.SOMETHING_WRONG,
            ToastAndroid.SHORT,
          );
        }
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.INVALID_TARGET_AMOUNT) {
          ToastAndroid.show(
            TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2.MESSAGE_ERROR
              .INVALID_TARGET_AMOUNT,
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
      subcategoryId,
      createFinancialGoal,
      HOME.SPENDING_BUDGET_LIST,
      MESSAGE_SUCCESS.CREATE_SUCCESS,
      MESSAGE_ERROR.SOMETHING_WRONG,
      currentSpendingModel?.endDate,
    ],
  );

  return {
    state: useMemo(
      () => ({
        selectedCategory: {
          label: name,
          icon:
            (icon as keyof typeof MaterialIcons.glyphMap) || "account-balance",
          subcategoryId: subcategoryId,
        },
        personalLimitBudgetSubcate:
          personalLimitBudgetSubcate?.data as PersonalLimitBudgetSubcate,
      }),
      [subcategoryId, name, icon, personalLimitBudgetSubcate],
    ),
    refState: {
      formikRef,
    },
    handler: {
      handleBack,
      handleCreateBudget,
      handleSubmitRef,
    },
  };
};

export default useCreateSpendingBudgetStep2;
