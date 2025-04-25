import { GROUP_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import {
  useGetGroupDetailQuery,
  useRequestFundMutation,
} from "@/services/group";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CREATE_FUND_REQUEST_CONSTANT from "../CreateFundRequest.constant";
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
  const { ERROR_CODE } = CREATE_FUND_REQUEST_CONSTANT;
  const dispatch = useDispatch();
  const { refetch } = useGetGroupDetailQuery({ id: id });
  const currentGroup = useSelector(selectCurrentGroup);
  const fundBalance = currentGroup?.currentBalance || 0;
  const formikRef = useRef<any>(null);
  const groupDetail = useSelector(selectCurrentGroup);
  const userInfo = useSelector(selectUserInfo);

  const isLeader = useMemo(() => {
    return groupDetail?.groupMembers?.some(
      (member) =>
        member?.userId === userInfo?.id && member?.role === GROUP_ROLE.LEADER,
    );
  }, [groupDetail, userInfo]);

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

  const handleCreateFundRequest = useCallback(
    async (values: FundRequestForm) => {
      dispatch(setLoading(true));
      const numericAmount = parseInt(values.amount.replace(/\D/g, ""));

      try {
        setIsSubmitting(true);

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
              amount: response?.data?.transaction?.amount,
              createdDate: response?.data?.transaction?.createdDate,
              requestCode: response?.data?.transaction?.requestCode,
              accountNumber: response?.data?.bankAccount?.accountNumber,
              bankName: response?.data?.bankAccount?.bankName,
              accountHolderName: response?.data?.bankAccount?.accountHolderName,
              description: values?.description,
              mode: "FUND",
            },
          });
          const successMessage = isLeader
            ? TEXT_TRANSLATE_CREATE_FUND_REQUEST.MESSAGE_SUCCESS
                .CREATE_FUND_REQUEST_SUCCESSS
            : TEXT_TRANSLATE_CREATE_FUND_REQUEST.MESSAGE_SUCCESS.CREATE_SUCCESS;

          ToastAndroid.show(successMessage, ToastAndroid.SHORT);
        }
      } catch (err: any) {
        const error = err?.data;

        if (error.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
          ToastAndroid.show(
            TEXT_TRANSLATE_CREATE_FUND_REQUEST.MESSAGE_ERROR.BANK_NOT_FOUND,
            ToastAndroid.SHORT,
          );
          return;
        }

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
