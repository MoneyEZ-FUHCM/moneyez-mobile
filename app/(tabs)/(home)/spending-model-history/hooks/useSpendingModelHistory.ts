import { useEffect, useState, useMemo } from "react";
import { router } from "expo-router";
import { useGetUserSpendingModelQuery } from "@/services/userSpendingModel";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { COMMON_CONSTANT } from "@/helpers/constants/common";

export interface UserSpendingModel {
  id: string;
  modelId: string;
  modelName: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpense: number;
}

interface SpendingModelHistoryState {
  spendingModelsByYear: Array<{
    year: string;
    userSpendingModels: UserSpendingModel[];
  }>;
  filters: { id: string; label: string }[];
  activeFilter: string;
  isLoading: boolean;
  error: any;
}

const useSpendingModelHistory = () => {
  const [spendingModelsByYear, setSpendingModelsByYear] = useState<
    SpendingModelHistoryState["spendingModelsByYear"]
  >([]);
  const [activeFilter, setActiveFilter] = useState(COMMON_CONSTANT.FILTER.FILTER_ALL);
  const [allSpendingModels, setAllSpendingModels] = useState<UserSpendingModel[]>([]);

  const { HOME } = PATH_NAME;

  const {
    data: spendingData,
    error,
    isLoading,
    refetch,
  } = useGetUserSpendingModelQuery({ PageIndex: 1, PageSize: 20 });

  const filters = useMemo(() => {
    const modelNames = new Set<string>();
    modelNames.add(COMMON_CONSTANT.FILTER.FILTER_ALL);

    allSpendingModels.forEach(model => {
      if (model.modelName) {
        modelNames.add(model.modelName.toUpperCase());
      }
    });

    return Array.from(modelNames).map(name => ({
      id: name,
      label: name === COMMON_CONSTANT.FILTER.FILTER_ALL ? COMMON_CONSTANT.FILTER.FILTER_ALL_LABEL : name,
    }));
  }, [allSpendingModels]);

  // Process API data into grouped spending models
  useEffect(() => {
    if (spendingData?.items) {
      const models = spendingData.items.map((model: any) => ({
        ...model,
        totalIncome: model.totalIncome ?? 0,
        totalExpense: model.totalExpense ?? 0,
      }));

      const allModels: UserSpendingModel[] = [];
      const groups: { [key: string]: UserSpendingModel[] } = {};

      models.forEach((model: any) => {
        const startDate = new Date(model.startDate);
        let year = "Unknown";

        if (!isNaN(startDate.getTime())) {
          year = startDate.getFullYear().toString();
        }

        const userSpendingModel: UserSpendingModel = {
          id: model.id,
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
    }
  }, [spendingData]);

  useEffect(() => {
    if (allSpendingModels.length > 0) {
      const groups: { [key: string]: UserSpendingModel[] } = {};

      allSpendingModels.forEach((model) => {
        if (activeFilter !== COMMON_CONSTANT.FILTER.FILTER_ALL && model.modelName.toUpperCase() !== activeFilter) {
          return;
        }

        const startDate = new Date(model.startDate);
        let year = "Unknown";

        if (!isNaN(startDate.getTime())) {
          year = startDate.getFullYear().toString();
        }

        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(model);
      });

      applyFilter(activeFilter, groups);
    }
  }, [activeFilter, allSpendingModels]);

  const applyFilter = (_filter: string, groups: { [key: string]: UserSpendingModel[] }) => {
    const groupedArray = Object.keys(groups).map((year) => ({
      year,
      userSpendingModels: groups[year],
    }));

    setSpendingModelsByYear(groupedArray);
  };

  const handleViewPeriodHistory = (userSpendingId: string) => {
    const model = allSpendingModels.find(model => model.id === userSpendingId);
    
    router.push({
      pathname: HOME.PERIOD_HISTORY as any,
      params: {
        userSpendingId: userSpendingId,
        startDate: formatDate(model?.startDate),
        endDate: formatDate(model?.endDate),
        totalIncome: model?.totalIncome,
        totalExpense: model?.totalExpense,
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return {
    state: {
      spendingModelsByYear,
      filters,
      activeFilter,
      isLoading,
      error,
    },
    handler: {
      formatCurrency,
      formatDate,
      setActiveFilter,
      handleBack,
      refetch,
      handleViewPeriodHistory
    },
  };
};

export default useSpendingModelHistory;
