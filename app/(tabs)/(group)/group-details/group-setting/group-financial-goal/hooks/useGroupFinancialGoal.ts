import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import {
  useDeleteGroupFinancialGoalMutation,
  useGetGroupFinancialGoalQuery,
} from "@/services/financialGoal";
import { router, useFocusEffect } from "expo-router";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "../GroupFinancialGoal.translate";

export interface FinancialGoal {
  id: string;
  isDeleted: boolean;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  status: string;
  approvalStatus: number;
  createdDate: string;
  name: string;
}

export default function useGroupFinancialGoal() {
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const groupId = useMemo(() => groupDetail?.id || "", [groupDetail]);
  const modalizeRef = useRef<Modalize>(null);
  const detailsModalizeRef = useRef<Modalize>(null);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  const [completedFilter, setCompletedFilter] = useState<
    "ARCHIVED" | "COMPLETED"
  >("ARCHIVED");

  // API Hooks
  const {
    data: groupFinancialGoalData,
    isLoading,
    refetch,
  } = useGetGroupFinancialGoalQuery({ groupId }, { skip: !groupId });

  const [showOptions, setShowOptions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCompletedGoal, setSelectedCompletedGoal] =
    useState<FinancialGoal>();

  const handlePressOutside = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const TABS = [
    { label: "Đang hoạt động", type: "ACTIVE" },
    { label: "Không hoạt động", type: "COMPLETED" },
  ];

  const COMPLETED_FILTERS = [
    { label: "Chưa hoàn thành", type: "ARCHIVED" },
    { label: "Đã hoàn thành", type: "COMPLETED" },
  ];

  const handleViewCompletedGoalDetails = (goal: FinancialGoal) => {
    setSelectedCompletedGoal(goal);
    detailsModalizeRef.current?.open();
  };

  const [deleteGroupFinancialGoal, { isLoading: isDeleting }] =
    useDeleteGroupFinancialGoalMutation();

  const financialGoals: FinancialGoal[] = useMemo(
    () =>
      groupFinancialGoalData?.data?.filter(
        (goal: FinancialGoal) => !goal.isDeleted,
      ) || [],
    [groupFinancialGoalData],
  );

  const filteredGoals = useMemo(() => {
    if (activeTab === "ACTIVE") {
      return financialGoals.filter((goal) => goal.status === "ACTIVE");
    }
    return financialGoals.filter((goal) => goal.status === completedFilter);
  }, [financialGoals, activeTab, completedFilter]);

  const financialGoal = filteredGoals[0];

  const hasExistingGoal = !!financialGoal;

  const daysLeft = useMemo(() => {
    if (!financialGoal) return { days: 0, hours: 0, minutes: 0 };

    const now = moment();
    const deadline = moment(financialGoal.deadline);
    const duration = moment.duration(deadline.diff(now));

    const days = Math.max(0, Math.floor(duration.asDays()));
    const hours = Math.max(0, duration.hours());
    const minutes = Math.max(0, duration.minutes());

    return { days, hours, minutes };
  }, [financialGoal]);

  const isGoalCompleted = useMemo(
    () => financialGoal?.currentAmount >= financialGoal?.targetAmount,
    [financialGoal],
  );

  // Navigation handlers
  const handleNavigateToCreate = useCallback(() => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_SETTING.GROUP_FINANCIAL_GOAL_FORM as any,
      params: { mode: "create" },
    });
  }, [dispatch]);

  const handleNavigateToUpdate = useCallback(() => {
    if (financialGoal?.id) {
      dispatch(setGroupTabHidden(true));
      router.push({
        pathname: PATH_NAME.GROUP_SETTING.GROUP_FINANCIAL_GOAL_FORM as any,
        params: { mode: "update", goalId: financialGoal.id },
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
          ToastAndroid.SHORT,
        );
        modalizeRef.current?.close();
        router.back();
        dispatch(setGroupTabHidden(false));
      }
    } catch (error) {
      ToastAndroid.show(
        TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.MESSAGE_ERROR.DELETE_FAILED,
        ToastAndroid.SHORT,
      );
    }
  }, [deleteGroupFinancialGoal, financialGoal, dispatch, refetch]);

  const handleGoBack = useCallback(() => {
    dispatch(setGroupTabHidden(false));
    router.back();
  }, [dispatch]);

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

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "ACTIVE":
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.ACTIVE;
      case "COMPLETED":
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.COMPLETED;
      case "ARCHIVED":
        return TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.STATUS.ARCHIVED;
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
      detailsModalizeRef,
      activeTab,
      completedFilter,
      financialGoals: filteredGoals,
      TABS,
      COMPLETED_FILTERS,
      showOptions,
      refreshing,
      selectedCompletedGoal,
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
      setActiveTab,
      setCompletedFilter,
      handleViewCompletedGoalDetails,
      handlePressOutside,
      handleRefresh,
    },
  };
}
