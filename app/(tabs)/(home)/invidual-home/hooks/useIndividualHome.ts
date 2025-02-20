import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";

const useIndividualHome = () => {
  const { HOME } = PATH_NAME;

  const PIE_CHART_DATA = [
    {
      value: 500000,
      label: "Mua xe",
      color: "#009FFF",
      gradientCenterColor: "#006DFF",
    },
    {
      value: 800000,
      label: "Mua nhà",
      color: "#93FCF8",
      gradientCenterColor: "#3BE9DE",
    },
    {
      value: 100000,
      label: "Mua điện thoại",
      color: "#BDB2FA",
      gradientCenterColor: "#8F80F3",
    },
    {
      value: 200000,
      label: "Mua laptop",
      color: "#FFA5BA",
      gradientCenterColor: "#FF7F97",
    },
  ];

  const handleGoBack = () => {
    router.back();
  };

  const handleHistoryPress = () => {
    router.navigate(HOME.TRANSACTION_HISTORY as any);
  };

  const handleAddExpense = () => {
    router.navigate(HOME.ADD_TRANSACTION as any);
  };

  const handleAddIncome = () => {
    router.navigate(HOME.ADD_TRANSACTION as any);
  };

  return {
    state: {
      PIE_CHART_DATA,
    },
    handler: {
      handleGoBack,
      handleHistoryPress,
      handleAddExpense,
      handleAddIncome,
    },
  };
};

export default useIndividualHome;
