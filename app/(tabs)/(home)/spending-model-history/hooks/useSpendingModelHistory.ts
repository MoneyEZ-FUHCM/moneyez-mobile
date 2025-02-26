import { useEffect, useState, useMemo } from "react";
import { router } from "expo-router";
import { useGetUserSpendingModelQuery } from "@/services/userSpendingModel";
import { PATH_NAME } from "@/helpers/constants/pathname";

export interface SpendingModel {
  id: string;
  modelName: string;
  period: string;
  income: string | number;
  expense: string | number;
}

interface SpendingModelHistoryState {
  spendingModelsByYear: Array<{
    year: string;
    spendingModels: SpendingModel[];
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
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [allSpendingModels, setAllSpendingModels] = useState<SpendingModel[]>([]);

  const { HOME } = PATH_NAME;

  const {
    data: spendingData,
    error,
    isLoading,
    refetch,
  } = useGetUserSpendingModelQuery({ PageIndex: 1, PageSize: 20 });

  // Generate filter options based on unique model names in transactions
  const filters = useMemo(() => {
    const modelNames = new Set<string>();
    modelNames.add("ALL");

    allSpendingModels.forEach(model => {
      if (model.modelName) {
        modelNames.add(model.modelName.toUpperCase());
      }
    });

    return Array.from(modelNames).map(name => ({
      id: name,
      label: name === "ALL" ? "Tất cả" : name
    }));
  }, [allSpendingModels]);

  // Process API data into grouped spending models
  useEffect(() => {
    if (spendingData?.data?.data) {
      const models = spendingData.data.data.map((model: any) => ({
        ...model,
        income: model.income ?? 0,
        expense: model.expense ?? 0,
      }));

      const allModels: SpendingModel[] = [];
      const groups: { [key: string]: SpendingModel[] } = {};

      models.forEach((model: any) => {
        // Ensure we have valid dates to extract year
        const startDate = new Date(model.startDate);
        let year = "Unknown";

        if (!isNaN(startDate.getTime())) {
          year = startDate.getFullYear().toString();
        }

        const spendingModel: SpendingModel = {
          id: model.spendingModelId,
          modelName: model.name,
          income: model.income,
          expense: model.expense,
          period: `${new Date(model.startDate).toLocaleDateString("vi-VN")} - ${new Date(
            model.endDate
          ).toLocaleDateString("vi-VN")}`,
        };

        allModels.push(spendingModel);

        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(spendingModel);
      });

      setAllSpendingModels(allModels);
      applyFilter(activeFilter, groups);
    }
  }, [spendingData]);

  // Apply filtering when filter or spending models change
  useEffect(() => {
    if (allSpendingModels.length > 0) {
      const groups: { [key: string]: SpendingModel[] } = {};

      allSpendingModels.forEach((model) => {
        if (activeFilter !== "ALL" && model.modelName.toUpperCase() !== activeFilter) {
          return;
        }

        // Extract date from period and handle potential parsing errors
        const dateParts = model.period.split(" - ")[0].split("/");
        let year = "Unknown";

        if (dateParts.length >= 3) {
          // Format is DD/MM/YYYY
          year = dateParts[2];
        }

        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(model);
      });

      applyFilter(activeFilter, groups);
    }
  }, [activeFilter, allSpendingModels]);

  const applyFilter = (_filter: string, groups: { [key: string]: SpendingModel[] }) => {
    const groupedArray = Object.keys(groups).map((year) => ({
      year,
      spendingModels: groups[year],
    }));

    setSpendingModelsByYear(groupedArray);
  };

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const handleViewPeriodHistory = (modelId: string) => {
    router.push({
      pathname: HOME.PERIOD_HISTORY as any,
      params: { id: modelId }
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
      setActiveFilter,
      handleBack,
      refetch,
      handleViewPeriodHistory
    },
  };
};

export default useSpendingModelHistory;