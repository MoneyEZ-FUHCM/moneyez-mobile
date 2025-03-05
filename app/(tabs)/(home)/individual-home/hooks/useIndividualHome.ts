import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatDate } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetCurrentUserSpendingModelQuery } from "@/services/userSpendingModel";
import { router } from "expo-router";
import { useDispatch } from "react-redux";

const useIndividualHome = () => {
  const { HOME } = PATH_NAME;
  const dispatch = useDispatch();
  const { data: currentUserSpendingModel } = useGetCurrentUserSpendingModelQuery();

  const PIE_CHART_DATA = [
    {
      id: 1,
      value: 500000,
      label: "Mua xe",
      color: "#009FFF",
      gradientCenterColor: "#006DFF",
      percentage: 23.24,
    },
    {
      id: 2,
      value: 800000,
      label: "Mua nhà",
      color: "#93FCF8",
      gradientCenterColor: "#3BE9DE",
      percentage: 47.89,
    },
    {
      id: 3,
      value: 100000,
      label: "Mua điện thoại",
      color: "#BDB2FA",
      gradientCenterColor: "#8F80F3",
      percentage: 5.67,
    },
    {
      id: 4,
      value: 200000,
      label: "Mua laptop",
      color: "#FFA5BA",
      gradientCenterColor: "#FF7F97",
      percentage: 11.23,
    },
  ];

  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  const handleHistoryPress = () => {
    if (currentUserSpendingModel) {
      const startDate = currentUserSpendingModel.data.startDate;
      const endDate = currentUserSpendingModel.data.startDate;
      const totalIncome = currentUserSpendingModel.data.totalIncome;
      const totalExpense = currentUserSpendingModel.data.totalExpense;
      
      router.push({
        pathname: HOME.PERIOD_HISTORY as any,
        params: { 
          userSpendingId: currentUserSpendingModel.data.id,
          startDate: startDate,
          endDate: endDate,
          totalIncome: totalIncome,
          totalExpense: totalExpense,
        }
      });
    } else {
      // Fallback if no current spending model is available
      router.navigate(HOME.SPENDING_MODEL_HISTORY as any);
    }
  };

  const handleAddExpense = () => {
    router.navigate(`${HOME.ADD_TRANSACTION}?type=expense` as any);
    dispatch(setMainTabHidden(true));
  };

  const handleAddIncome = () => {
    router.navigate(`${HOME.ADD_TRANSACTION}?type=income` as any);
    dispatch(setMainTabHidden(true));
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
