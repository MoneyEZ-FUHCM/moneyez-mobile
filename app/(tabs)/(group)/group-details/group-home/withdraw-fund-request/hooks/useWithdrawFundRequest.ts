import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

interface WithdrawRequestForm {
  amount: string;
  description: string;
}

const useWithdrawFundRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { GROUP_HOME } = PATH_NAME;

  const currentGroup = useSelector(selectCurrentGroup)
  const fundBalance = currentGroup?.currentBalance || 0;
  // Navigate back
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Handle form submission
  const handleCreateFundRequest = useCallback(async (values: WithdrawRequestForm) => {
    console.log(values)
    router.replace(GROUP_HOME.GROUP_HOME_DEFAULT as any);
  }, [])

  return {
    state: useMemo(() => ({
      fundBalance,
      isSubmitting
    }), [fundBalance, isSubmitting]),

    handler: {
      handleBack,
      handleCreateFundRequest
    }
  };
};

export default useWithdrawFundRequest;
