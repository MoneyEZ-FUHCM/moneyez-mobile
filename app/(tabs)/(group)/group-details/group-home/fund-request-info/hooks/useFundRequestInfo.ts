import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import * as Clipboard from "expo-clipboard";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import TEXT_TRANSLATE_FUND_REQUEST_INFO from "../FundRequestInfo.translate";

const useFundRequestInfo = () => {
  const { GROUP_HOME } = PATH_NAME;
  const { MESSAGE } = TEXT_TRANSLATE_FUND_REQUEST_INFO;
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const {
    id,
    amount,
    createdDate,
    requestCode,
    accountNumber,
    bankName,
    accountHolderName,
    description,
  } = params;
  const fundRequest = {
    id: id,
    amount: amount,
    createdDate: createdDate ?? "2025-03-23T23:31:56.1750155",
    transferContent: requestCode,
    recipientAccount: accountNumber,
    bankName: bankName,
    accountHolder: accountHolderName,
    description: description,
  };

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

  const copyToClipboard = async (text: string | string[]) => {
    try {
      await Clipboard.setStringAsync(
        Array.isArray(text) ? text.join("\n") : text,
      );
      ToastAndroid.show(MESSAGE.COPY_SUCCESS, ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(MESSAGE.COPY_ERROR, ToastAndroid.SHORT);
    }
  };

  const handleConfirm = useCallback(() => {
    router.replace({
      pathname: GROUP_HOME.GROUP_HOME_DEFAULT as any,
      params: { id: fundRequest.id },
    });
    dispatch(setGroupTabHidden(false));
  }, []);

  return {
    state: {
      fundRequest,
    },
    handler: {
      copyToClipboard,
      handleConfirm,
      handleBack,
    },
  };
};

export default useFundRequestInfo;
