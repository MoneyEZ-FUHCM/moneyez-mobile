import { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useSearchParams } from "expo-router/build/hooks";
import { FinancialGoal } from "@/types/financialGoal.type";
import EXPENSE_DETAIL_CONSTANTS from "../ExpenseDetail.const";
import { useGetFinancialGoalByIdQuery } from "@/services/financialGoal";
import { PATH_NAME } from "@/helpers/constants/pathname";

interface BudgetItem extends FinancialGoal {}

const useExpenseDetail = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const budgetId = searchParams.get("budgetId");
  const { CHART_DATA } = EXPENSE_DETAIL_CONSTANTS;
  const TRANSACTIONS = EXPENSE_DETAIL_CONSTANTS.TRANSACTIONS;
  const [isLoading, setIsLoading] = useState(true);
  // State để lưu thông tin budgetItem
  const [budgetItem, setBudgetItem] = useState<BudgetItem>();

  // Gọi API để lấy thông tin financialGoal
  const { data: financialGoalDetail, isLoading: isLoadingDetail } =
    useGetFinancialGoalByIdQuery(budgetId);
  // State isLoading tổng hợp

  // Cập nhật budgetItem khi nhận được dữ liệu từ API
  const temp = financialGoalDetail?.data;
  console.log(financialGoalDetail);

  useEffect(() => {
    if (financialGoalDetail?.data && !isLoadingDetail) {
      setBudgetItem({
        ...temp,
        // Map thêm các trường nếu cần thiết
        id: temp.id,
        name: temp.name,
        amount: temp.amount,
        startDate: temp.startDate,
        endDate: temp.endDate,
        icon: temp.subcategoryIcon,
      }); // Gán dữ liệu financialGoal vào budgetItem
    }
  }, [financialGoalDetail, isLoadingDetail]);
  const handleUpdateButton = useCallback(() => {
    if (budgetId) {
      router.navigate(`${PATH_NAME.HOME.UPDATE_EXPENSE}/${budgetId}` as any);
    }
  }, [budgetId]);
  // Cập nhật trạng thái isLoading
  useEffect(() => {
    setIsLoading(isLoadingDetail);
  }, [isLoadingDetail]);

  const handleGoBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, [dispatch]);

  return {
    state: {
      CHART_DATA,
      budgetItem,
      isLoading,
      TRANSACTIONS,
    },
    handler: {
      handleGoBack,
      handleUpdateButton,
    },
  };
};

export default useExpenseDetail;
