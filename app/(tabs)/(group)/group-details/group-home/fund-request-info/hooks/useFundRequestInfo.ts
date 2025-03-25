import { PATH_NAME } from "@/helpers/constants/pathname";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { ToastAndroid } from "react-native";
import TEXT_TRANSLATE_FUND_REQUEST_INFO from "../FundRequestInfo.translate";


const useFundRequestInfo = () => {
  const { GROUP_HOME } = PATH_NAME
  const { MESSAGE } = TEXT_TRANSLATE_FUND_REQUEST_INFO
  const params = useLocalSearchParams();
  const { amount, createdDate, requestCode, accountNumber, bankName, accountHolderName } = params;
  const fundRequest = {
    amount: amount,
    createdDate: createdDate ? createdDate : "2025-03-23T23:31:56.1750155",
    transferContent: requestCode,
    recipientAccount: accountNumber,
    bankName: bankName,
    accountHolder: accountHolderName,
  };


  const copyToClipboard = async (text: string | string[]) => {
    try {
      await Clipboard.setStringAsync(Array.isArray(text) ? text.join("\n") : text);
      ToastAndroid.show(MESSAGE.COPY_SUCCESS, ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(MESSAGE.COPY_ERROR, ToastAndroid.SHORT);
    }
  };

  const handleConfirm = () => {
    router.replace(GROUP_HOME.GROUP_HOME_DEFAULT as any);
  }

  return {
    state: {
      fundRequest,
    },
    handler: {
      copyToClipboard,
      handleConfirm,
    }
  };
};

export default useFundRequestInfo;
