import { useEffect, useState, useMemo } from "react";
import { router } from "expo-router";
import { useGetUserSpendingModelQuery } from "@/services/userSpendingModel";
import { PATH_NAME } from "@/helpers/constants/pathname";

export interface UserSpendingModel {
  id: string;
  modelId: string;
  modelName: string;
  period: string;
  income: string | number;
  expense: string | number;
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
  const [activeFilter, setActiveFilter] = useState("ALL");
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
    if (spendingData?.items) {
      const models = spendingData.items.map((model: any) => ({
        ...model,
        income: model.income ?? 0,
        expense: model.expense ?? 0,
      }));

      const allModels: UserSpendingModel[] = [];
      const groups: { [key: string]: UserSpendingModel[] } = {};

      models.forEach((model: any) => {
        // Ensure we have valid dates to extract year
        const startDate = new Date(model.startDate);
        let year = "Unknown";

        if (!isNaN(startDate.getTime())) {
          year = startDate.getFullYear().toString();
        }

        const userSpendingModel: UserSpendingModel = {
          id: model.id,
          modelId: model.spendingModelId,
          modelName: model.name,
          income: model.income,
          expense: model.expense,
          period: `${new Date(model.startDate).toLocaleDateString("vi-VN")} - ${new Date(
            model.endDate
          ).toLocaleDateString("vi-VN")}`,
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
        userSpendingModels: groups[year], // Make sure this property name matches what's used in the render function
      }));

      setSpendingModelsByYear(groupedArray);
    }
  }, [spendingData]);

  // Apply filtering when filter or spending models change
  useEffect(() => {
    if (allSpendingModels.length > 0) {
      const groups: { [key: string]: UserSpendingModel[] } = {};

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

  const applyFilter = (_filter: string, groups: { [key: string]: UserSpendingModel[] }) => {
    const groupedArray = Object.keys(groups).map((year) => ({
      year,
      userSpendingModels: groups[year], // Make sure this property name matches what's used in the render function
    }));

    setSpendingModelsByYear(groupedArray);
  };

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const handleViewPeriodHistory = (userSpendingId: string) => {
    router.push({
      pathname: HOME.PERIOD_HISTORY as any,
      params: { 
        userSpendingId: userSpendingId,
        startDate: allSpendingModels.find(model => model.id === userSpendingId)?.period.split(" - ")[0],
        endDate: allSpendingModels.find(model => model.id === userSpendingId)?.period.split(" - ")[1]
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
      setActiveFilter,
      handleBack,
      refetch,
      handleViewPeriodHistory
    },
  };
};

export default useSpendingModelHistory;