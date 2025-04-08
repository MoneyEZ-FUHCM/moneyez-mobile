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
import { useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "../GroupFinancialGoal.translate";

interface FinancialGoal {
  id: string;
  isDeleted: boolean;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  status: number;
}

export default function useGroupFinancialGoal() {
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const groupId = groupDetail?.id || '';

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const cancelRef = useRef(null);

  // API Hooks
  const { data: groupFinancialGoalData, isLoading, refetch } = useGetGroupFinancialGoalQuery(
    { groupId },
    { skip: !groupId }
  );

  const [deleteGroupFinancialGoal, { isLoading: isDeleting }] = useDeleteGroupFinancialGoalMutation();

  const isSubmitting = isDeleting;
  
  const financialGoal = groupFinancialGoalData?.data?.filter((goal: FinancialGoal) => goal.isDeleted === false)[0];
  const hasExistingGoal = !!financialGoal;

  const daysLeft = financialGoal
    ? Math.max(0, moment(financialGoal.deadline).diff(moment(), "days"))
    : 0;

  const isGoalCompleted = financialGoal?.currentAmount >= financialGoal?.targetAmount;

  // Navigation handlers
  const handleNavigateToCreate = () => {
    setFormMode("create");
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_SETTING.GROUP_FINANCIAL_GOAL_FORM as any,
      params: { mode: "create" }
    });
  };

  const handleNavigateToUpdate = () => {
    if (financialGoal?.id) {
      setFormMode("update");
      dispatch(setGroupTabHidden(true));
      router.push({
        pathname: PATH_NAME.GROUP_SETTING.GROUP_FINANCIAL_GOAL_FORM as any,
        params: { mode: "update", goalId: financialGoal.id }
      });
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      if (financialGoal?.id) {
        await deleteGroupFinancialGoal({ id: financialGoal.id }).unwrap();
        ToastAndroid.show(
          TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_SUCCESS.DELETE_SUCCESS,
          ToastAndroid.SHORT
        );
        handleCloseDeleteModal();
        dispatch(setGroupTabHidden(false));
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
  };

  const handleGoBack = () => {
    dispatch(setGroupTabHidden(false));
    router.back();
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.ACTIVE;
      default:
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.INACTIVE;
    }
  };

  const getApprovalStatusText = (status: number) => {
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
  };

  return {
    state: {
      isLoading,
      isSubmitting,
      financialGoal,
      hasExistingGoal,
      daysLeft,
      isGoalCompleted,
      isDeleteModalVisible,
      formMode,
    },
    refState: {
      cancelRef,
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
    },
  };
}