import { useState } from "react";
import * as Yup from "yup";
import TEXT_TRANSLATE_ADD_TRANSACTION from "../../add-transaction/AddTransaction.translate";

const usePersonalExpensesModelStep2 = () => {
  const [selectedTime, setSelectedTime] = useState("1 tháng");

  const { MESSAGE_VALIDATE } = TEXT_TRANSLATE_ADD_TRANSACTION;
  const validationSchema = Yup.object().shape({
    amount: Yup.string().required(MESSAGE_VALIDATE.MONEY_REQUIRED),
    dob: Yup.string().required(MESSAGE_VALIDATE.DATE_REQUIRED),
    description: Yup.string().required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED),
  });

  return {
    state: {
      selectedTime,
      validationSchema,
    },
    handler: {
      setSelectedTime,
    },
  };
};
export default usePersonalExpensesModelStep2;
