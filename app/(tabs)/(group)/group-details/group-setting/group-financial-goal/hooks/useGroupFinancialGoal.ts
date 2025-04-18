import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import {
  useDeleteGroupFinancialGoalMutation,
  useGetGroupFinancialGoalQuery
} from "@/services/financialGoal";
import { router } from "expo-router";
import moment from "moment";
import { useCallback, useMemo, useRef } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "../GroupFinancialGoal.translate";

interface FinancialGoal {
  id: string;
  isDeleted: boolean;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  status: number;
  approvalStatus: number;
  createdDate: string;
  name: string;
}

export default function useGroupFinancialGoal() {
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const groupId = useMemo(() => groupDetail?.id || '', [groupDetail]);
  const modalizeRef = useRef<Modalize>(null);

  // API Hooks
  const {
    data: groupFinancialGoalData,
    isLoading,
    refetch
  } = useGetGroupFinancialGoalQuery(
    { groupId },
    { skip: !groupId }
  );

  const [deleteGroupFinancialGoal, { isLoading: isDeleting }] = useDeleteGroupFinancialGoalMutation();

  const financialGoal: FinancialGoal = useMemo(() =>
    groupFinancialGoalData?.data?.filter((goal: FinancialGoal) => goal.isDeleted === false)[0],
    [groupFinancialGoalData]);

  const hasExistingGoal = !!financialGoal;

  const daysLeft = useMemo(() =>
    financialGoal
      ? Math.max(0, moment(financialGoal.deadline).diff(moment(), "days"))
      : 0,
    [financialGoal]);

  const isGoalCompleted = useMemo(() =>
    (financialGoal?.currentAmount) >= (financialGoal?.targetAmount),
    [financialGoal]);

  // Navigation handlers
  const handleNavigateToCreate = useCallback(() => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_SETTING.GROUP_FINANCIAL_GOAL_FORM as any,
      params: { mode: "create" }
    });
  }, [dispatch]);

  const handleNavigateToUpdate = useCallback(() => {
    if (financialGoal?.id) {
      dispatch(setGroupTabHidden(true));
      router.push({
        pathname: PATH_NAME.GROUP_SETTING.GROUP_FINANCIAL_GOAL_FORM as any,
        params: { mode: "update", goalId: financialGoal.id }
      });
    }
  }, [dispatch, financialGoal]);

  const handleOpenDeleteModal = () => {
    modalizeRef.current?.open();
  };

  const handleCloseDeleteModal = () => {
    modalizeRef.current?.close();
  };

  const handleDelete = useCallback(async () => {
    try {
      if (financialGoal?.id) {
        await deleteGroupFinancialGoal({ id: financialGoal.id }).unwrap();
        ToastAndroid.show(
          TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_SUCCESS.DELETE_SUCCESS,
          ToastAndroid.SHORT
        );
        modalizeRef.current?.close();
        router.back();
        refetch();
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      ToastAndroid.show(
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR.DELETE_FAILED,
        ToastAndroid.SHORT
      );
    }
  }, [deleteGroupFinancialGoal, financialGoal, dispatch, refetch]);

  const handleGoBack = useCallback(() => {
    dispatch(setGroupTabHidden(false));
    router.back();
  }, [dispatch]);

  const getStatusText = useCallback((status: number) => {
    switch (status) {
      case 1:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.ACTIVE;
      default:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.INACTIVE;
    }
  }, []);

  const getApprovalStatusText = useCallback((status: number) => {
    switch (status) {
      case 1:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.APPROVED;
      case 2:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.PENDING;
      case 3:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.REJECTED;
      default:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.PENDING;
    }
  }, []);

  return {
    state: {
      isLoading,
      isSubmitting: isDeleting,
      financialGoal,
      hasExistingGoal,
      daysLeft,
      isGoalCompleted,
      modalizeRef,
    },
    handler: {
      handleNavigateToCreate,
      handleNavigateToUpdate,
      handleOpenDeleteModal,
      handleCloseDeleteModal,
      handleDelete,
      handleGoBack,
      getStatusText,
      getApprovalStatusText,
      formatCurrency,
      formatDate,
      refetch,
    },
  };
}