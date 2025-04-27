import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency, formatDate } from "@/helpers/libs";
import useHideTabbar from "@/helpers/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetUserSpendingModelQuery } from "@/services/userSpendingModel";
import {
  SpendingModelHistoryState,
  UserSpendingModel,
} from "@/helpers/types/spendingModel.types";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

const useSpendingModelHistory = () => {
  const [spendingModelsByYear, setSpendingModelsByYear] = useState<
    SpendingModelHistoryState["spendingModelsByYear"]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeFilter, setActiveFilter] = useState(
    COMMON_CONSTANT.FILTER.FILTER_ALL,
  );
  const [allSpendingModels, setAllSpendingModels] = useState<
    UserSpendingModel[]
  >([]);
  const [isRefetching, setIsRefetching] = useState(false);

  const { HOME } = PATH_NAME;
  const dispatch = useDispatch();

  const {
    data: spendingData,
    error,
    isLoading,
    refetch,
  } = useGetUserSpendingModelQuery({ PageIndex: 1, PageSize: 20 });

  const filters = useMemo(() => {
    const modelNames = new Set<string>();
    modelNames.add(COMMON_CONSTANT.FILTER.FILTER_ALL);

    allSpendingModels.forEach((model) => {
      if (model.modelName) {
        modelNames.add(model.modelName.toUpperCase());
      }
    });

    return Array.from(modelNames).map((name) => ({
      id: name,
      label:
        name === COMMON_CONSTANT.FILTER.FILTER_ALL
          ? COMMON_CONSTANT.FILTER.FILTER_ALL_LABEL
          : name,
    }));
  }, [allSpendingModels]);

  // Process API data into grouped spending models
  useEffect(() => {
    setIsLoadingHistory(true);
    if (spendingData?.items) {
      const models = spendingData.items?.map((model: any) => ({
        ...model,
        totalIncome: model?.totalIncome ?? 0,
        totalExpense: model?.totalExpense ?? 0,
      }));

      const allModels: UserSpendingModel[] = [];
      const groups: { [key: string]: UserSpendingModel[] } = {};

      models.forEach((model: any) => {
        const startDate = new Date(model?.startDate);
        let year = "Unknown";

        if (!isNaN(startDate.getTime())) {
          year = startDate.getFullYear().toString();
        }

        const userSpendingModel: UserSpendingModel = {
          id: model?.id,
          modelId: model.spendingModelId,
          modelName: model.name,
          totalIncome: model.totalIncome,
          totalExpense: model.totalExpense,
          startDate: model.startDate,
          endDate: model.endDate,
        };

        allModels.push(userSpendingModel);

        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(userSpendingModel);
      });

      setAllSpendingModels(allModels);

      const groupedArray = Object.keys(groups).map((year) => ({
        year,
        userSpendingModels: groups[year],
      }));

      setSpendingModelsByYear(groupedArray);
      setIsLoadingHistory(false);
    }
  }, [spendingData]);

  const handleViewPeriodHistory = (userSpendingId: string) => {
    const model = allSpendingModels.find(
      (model) => model.id === userSpendingId,
    );
    dispatch(setMainTabHidden(true));

    router.push({
      pathname: HOME.PERIOD_HISTORY as any,
      params: {
        userSpendingId: userSpendingId,
        startDate: formatDate(model?.startDate),
        endDate: formatDate(model?.endDate),
        totalIncome: model?.totalIncome,
        totalExpense: model?.totalExpense,
      },
    });
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

  return {
    state: {
      spendingModelsByYear,
      filters,
      activeFilter,
      isLoading,
      error,
      isLoadingHistory,
      isRefetching,
    },
    handler: {
      formatCurrency,
      formatDate,
      setActiveFilter,
      handleBack,
      refetch,
      handleViewPeriodHistory,
      useHideTabbar,
      handleRefetch,
    },
  };
};

export default useSpendingModelHistory;
