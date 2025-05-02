import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { USER_SPENDING_MODEL_STATUS } from "@/helpers/enums/globals";
import useHideTabbar from "@/helpers/hooks/useHideTabbar";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { UserSpendingModel } from "@/helpers/types/spendingModel.types";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useCancelUserSpendingModelMutation,
  useGetUserSpendingModelQuery,
} from "@/services/userSpendingModel";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

const useSpendingModelHistory = () => {
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const [spendingModels, setSpendingModels] = useState([]);
  const [isRefetching, setIsRefetching] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const [nonAvailableFilter, setNonAvailableFilter] = useState("all");

  const { HOME } = PATH_NAME;
  const dispatch = useDispatch();

  const [cancelModel] = useCancelUserSpendingModelMutation();

  const {
    data: spendingData,
    error,
    isLoading,
    refetch,
  } = useGetUserSpendingModelQuery(
    { PageIndex: 1, PageSize: 100 },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (spendingData?.items) {
      const models = spendingData.items.map((model: any) => ({
        ...model,
        totalIncome: model?.totalIncome ?? 0,
        totalExpense: model?.totalExpense ?? 0,
        status: determineModelStatus(model),
      }));

      setSpendingModels(models as any);
    }
  }, [spendingData]);

  const determineModelStatus = (model: UserSpendingModel) => {
    if (model.status === USER_SPENDING_MODEL_STATUS.CANCELED) {
      return USER_SPENDING_MODEL_STATUS.CANCELED;
    }

    if (model.status === USER_SPENDING_MODEL_STATUS.EXPIRED) {
      return USER_SPENDING_MODEL_STATUS.EXPIRED;
    }

    return USER_SPENDING_MODEL_STATUS.ACTIVE;
  };

  const handleViewSpendingDetail = (spendingModelId: string) => {
    dispatch(setMainTabHidden(true));

    router.push({
      pathname: HOME.PERIOD_HISTORY as any,
      params: {
        userSpendingId: spendingModelId,
      },
    });
  };

  const handleCreateNew = () => {
    dispatch(setMainTabHidden(true));
    router.push({
      pathname: HOME.PERSONAL_EXPENSES_MODEL as any,
    });
  };

  const handleCancelModel = async () => {
    try {
      // await cancelModel(spendingModelId)
    } catch (err: any) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  };

  const handleBack = () => {
    dispatch(setMainTabHidden(false));
    router.back();
  };

  const handleRefetch = useCallback(async () => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);
    await refetch().finally(() => {
      setTimeout(() => setIsRefetching(false), 2000);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetch, isRefetching]);

  const filteredModels = useMemo(() => {
    if (!spendingModels) return;

    if (activeTab === "available") {
      return spendingModels.filter(
        (model: UserSpendingModel) =>
          model.status === USER_SPENDING_MODEL_STATUS.ACTIVE,
      );
    } else {
      const nonActiveModels = spendingModels.filter(
        (model: UserSpendingModel) =>
          model.status !== USER_SPENDING_MODEL_STATUS.ACTIVE,
      );

      if (nonAvailableFilter === "all") {
        return nonActiveModels;
      } else if (nonAvailableFilter === "expired") {
        return nonActiveModels.filter(
          (model: UserSpendingModel) =>
            model.status === USER_SPENDING_MODEL_STATUS.EXPIRED,
        );
      } else if (nonAvailableFilter === "deleted") {
        return nonActiveModels.filter(
          (model: UserSpendingModel) => model.isDeleted,
        );
      }

      return nonActiveModels;
    }
  }, [spendingModels, activeTab, nonAvailableFilter]);

  return {
    state: {
      spendingModels,
      isLoading,
      error,
      isRefetching,
      activeTab,
      nonAvailableFilter,
      filteredModels,
    },
    handler: {
      formatCurrency,
      formatDate,
      handleBack,
      handleCreateNew,
      refetch,
      handleViewSpendingDetail,
      useHideTabbar,
      handleRefetch,
      setActiveTab,
      setNonAvailableFilter,
      handleCancelModel,
    },
  };
};

export default useSpendingModelHistory;
