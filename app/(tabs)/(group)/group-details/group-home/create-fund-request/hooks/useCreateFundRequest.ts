import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetGroupDetailQuery,
  useRequestFundMutation,
} from "@/services/group";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_CREATE_FUND_REQUEST from "../CreateFundRequest.translate";

interface FundRequestForm {
  amount: string;
  description: string;
}

const useCreateFundRequest = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestFund] = useRequestFundMutation();
  const { GROUP_HOME } = PATH_NAME;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const dispatch = useDispatch();
  const { refetch } = useGetGroupDetailQuery({ id: id });
  const currentGroup = useSelector(selectCurrentGroup);
  const fundBalance = currentGroup?.currentBalance || 0;
  const formikRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      dispatch(setGroupTabHidden(true));
    }, [dispatch]),
  );

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

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
      dispatch(setLoading(true));
      try {
        setIsSubmitting(true);
        const numericAmount = parseInt(values.amount.replace(/\D/g, ""));

        const response = await requestFund({
          groupId: currentGroup?.id,
          amount: numericAmount,
          description: values.description,
        }).unwrap();

        if (response && response?.status === HTTP_STATUS.SUCCESS.OK) {
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
          ToastAndroid.show(
            TEXT_TRANSLATE_CREATE_FUND_REQUEST.MESSAGE_SUCCESS.CREATE_SUCCESS,
            ToastAndroid.SHORT,
          );
        }
      } catch (err: any) {
        const error = err?.data;

        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        setIsSubmitting(false);
        dispatch(setLoading(false));
      }
    },
    [requestFund],
  );

  return {
    state: useMemo(
      () => ({
        fundBalance,
        isSubmitting,
        formikRef,
      }),
      [fundBalance, isSubmitting, formikRef],
    ),
    handler: {
      handleBack,
      handleCreateFundRequest,
    },
  };
};

export default useCreateFundRequest;
