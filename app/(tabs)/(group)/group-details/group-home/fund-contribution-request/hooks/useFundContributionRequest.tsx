import { useState } from "react";
import { ToastAndroid } from "react-native";
import TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST from "../FundContributionRequest.translate";

const useFundContributionRequest = () => {
  const [balance] = useState(300000);
  const [note, setNote] = useState("");

  const handleSubmitForm = (values: { amount: string; note: string }) => {
    const amountValue = parseInt(values.amount.replace(/\./g, ""), 10);
    if (!amountValue || amountValue <= 0) {
      ToastAndroid.show(
        TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.INVALID_AMOUNT,
        ToastAndroid.SHORT,
      );
      return;
    }
    ToastAndroid.show(
      TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.SUCCESS_MESSAGE.replace(
        "{amount}",
        amountValue.toLocaleString(),
      ),
      ToastAndroid.SHORT,
    );
  };

  return {
    state: {
      balance,
      note,
    },
    handler: {
      handleSubmitForm,
      setNote,
    },
  };
};

export default useFundContributionRequest;
