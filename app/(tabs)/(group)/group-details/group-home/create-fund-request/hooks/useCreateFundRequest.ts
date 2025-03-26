import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { useRequestFundMutation } from "@/services/group";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ToastAndroid } from "react-native";
import { useSelector } from "react-redux";

interface FundRequestForm {
  amount: string;
  description: string;
}

const useCreateFundRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestFund] = useRequestFundMutation();
  const { GROUP_HOME } = PATH_NAME;
  const { HTTP_STATUS } = COMMON_CONSTANT;

  const currentGroup = useSelector(selectCurrentGroup);
  const fundBalance = currentGroup?.currentBalance || 0;
  // Navigate back
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Handle form submission
  const handleCreateFundRequest = useCallback(
    async (values: FundRequestForm) => {
      try {
        setIsSubmitting(true);
        const numericAmount = parseInt(values.amount.replace(/\D/g, ""));

        const response = await requestFund({
          groupId: currentGroup?.id,
          amount: numericAmount,
          description: values.description,
        }).unwrap();

        if (response && response.status === HTTP_STATUS.SUCCESS.OK) {
          router.push({
            pathname: GROUP_HOME.FUND_REQUEST_INFO as any,
            params: {
              amount: response.data.amount,
              createdDate: response.data.createdDate,
              requestCode: response.data.requestCode,
              accountNumber: response.data.bankAccount.accountNumber,
              bankName: response.data.bankAccount.bankName,
              accountHolderName: response.data.bankAccount.accountHolderName,
            },
          });
        }
      } catch (err: any) {
        const error = err.data;
        // if (error.errorCode === "") {
        ToastAndroid.show(error.errorCode, ToastAndroid.SHORT);
        return;
        // }
        // ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        setIsSubmitting(false);
      }
    },
    [requestFund],
  );

  return {
    state: useMemo(
      () => ({
        fundBalance,
        isSubmitting,
      }),
      [fundBalance, isSubmitting],
    ),

    handler: {
      handleBack,
      handleCreateFundRequest,
    },
  };
};

export default useCreateFundRequest;
