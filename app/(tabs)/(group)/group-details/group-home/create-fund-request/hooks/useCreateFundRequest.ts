import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideGroupTabbar from "@/hooks/useHideGroupTabbar";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useRequestFundMutation } from "@/services/group";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface FundRequestForm {
  amount: string;
  description: string;
}

const useCreateFundRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestFund] = useRequestFundMutation();
  const { GROUP_HOME } = PATH_NAME;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const dispatch = useDispatch();
  const currentGroup = useSelector(selectCurrentGroup);
  const fundBalance = currentGroup?.currentBalance || 0;

  useFocusEffect(
    useCallback(() => {
      dispatch(setGroupTabHidden(true));
    }, [dispatch]),
  );

  // Navigate back
  const handleBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
  );

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
          router.replace({
            pathname: GROUP_HOME.FUND_REQUEST_INFO as any,
            params: {
              id: currentGroup?.id,
              amount: response?.data?.amount,
              createdDate: response?.data?.bankAccount?.createdDate,
              requestCode: response?.data?.requestCode,
              accountNumber: response?.data?.bankAccount?.accountNumber,
              bankName: response?.data?.bankAccount?.bankName,
              accountHolderName: response?.data?.bankAccount?.accountHolderName,
              description: values?.description,
            },
          });
        }
      } catch (err: any) {
        const error = err.data;

        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
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
