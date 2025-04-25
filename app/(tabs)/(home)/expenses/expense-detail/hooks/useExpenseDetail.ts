import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setBudgetStatisticType } from "@/redux/slices/budgetSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetFinancialGoalByIdQuery,
  useGetPersonalLimitBudgetSubcategoryQuery,
  useGetPersonalTransactionFinancialGoalsQuery,
} from "@/services/financialGoal";
import {
  FinancialGoal,
  PersonalTransactionFinancialGoals,
} from "@/types/financialGoal.type";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

const useExpenseDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [transactions, setTransactions] = useState<
    PersonalTransactionFinancialGoals[]
  >([]);

  const dispatch = useDispatch();
  const { budgetId, subCategoryId } = useLocalSearchParams();

  const pageSize = 10;

  const { SYSTEM_ERROR } = COMMON_CONSTANT;

  const {
    data: financialGoalDetail,
    refetch: refetchGoalsById,
    isFetching: isFetchingFinancialGoalById,
  } = useGetFinancialGoalByIdQuery({ id: budgetId }, { skip: !budgetId });

  const { data: personalTransactionData, refetch: refetchTransactions } =
    useGetPersonalTransactionFinancialGoalsQuery(
      {
        id: budgetId,
        PageIndex: pageIndex,
        PageSize: 50,
      },
      { skip: !budgetId },
    );

  const { data: personalLimitBudgetSubcate } =
    useGetPersonalLimitBudgetSubcategoryQuery(
      { id: subCategoryId },
      { skip: !subCategoryId },
    );

  useEffect(() => {
    if (budgetId && subCategoryId) {
      refetchGoalsById();
      refetchTransactions();
    }
  }, [budgetId, subCategoryId]);

  useEffect(() => {
    if (personalTransactionData?.items?.length) {
      setTransactions((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = personalTransactionData.items.filter(
          (item) => !existingIds.has(item.id),
        );
        return [...prev, ...newItems];
      });
      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [personalTransactionData?.items]);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading &&
      !isLoadingMore &&
      personalTransactionData?.items?.length === pageSize
    ) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [isLoading, isLoadingMore, personalTransactionData?.items?.length]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([refetchGoalsById(), refetchTransactions()]);
      setPageIndex(1);
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  }, [refetchGoalsById, refetchTransactions]);

  const showAllTransactionsModal = () => setIsModalVisible(true);
  const closeAllTransactionsModal = () => setIsModalVisible(false);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(true));
    dispatch(setBudgetStatisticType("week"));
  }, [dispatch]);

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

  const handleNavigateAndUpdate = useCallback(
    (financialGoal: FinancialGoal) => {
      const data = financialGoalDetail?.data;
      const limitBudget = personalLimitBudgetSubcate?.data?.limitBudget;

      if (!data || !limitBudget) {
        ToastAndroid.show(
          "Không thể cập nhật ngay lúc này. Vui lòng thử lại.",
          ToastAndroid.SHORT,
        );
        return;
      }

      const isOverLimit = data.currentAmount > limitBudget;
      const isTargetReached = data.targetAmount - data.currentAmount <= 0;

      if (isOverLimit || isTargetReached) {
        ToastAndroid.show(
          "Mức chi tiêu của bạn đã vượt định mức. Không thể cập nhật",
          ToastAndroid.SHORT,
        );
        return;
      }

      router.navigate({
        pathname: PATH_NAME.HOME.UPDATE_EXPENSE as any,
        params: {
          budgetId: financialGoal.id,
          icon: financialGoal.subcategoryIcon,
          name: financialGoal.subcategoryName,
          amount: financialGoal.targetAmount,
          subCategoryId: financialGoal.subcategoryId,
        },
      });
    },
    [financialGoalDetail?.data, personalLimitBudgetSubcate?.data?.limitBudget],
  );

  return {
    state: {
      isLoading,
      isModalVisible,
      financialGoalDetail: financialGoalDetail?.data as FinancialGoal,
      personalTransactionFinancialGoals: transactions,
      isLoadingMore,
      isFetchingData,
      getPersonalTransactionFinancialGoals: personalTransactionData,
      pageSize,
      isFetchingRefresh: isFetchingFinancialGoalById,
      budgetId,
    },
    handler: {
      setIsLoading,
      handleBack,
      showAllTransactionsModal,
      closeAllTransactionsModal,
      handleLoadMore,
      handleRefresh,
      handleNavigateAndUpdate,
    },
  };
};

export default useExpenseDetail;
