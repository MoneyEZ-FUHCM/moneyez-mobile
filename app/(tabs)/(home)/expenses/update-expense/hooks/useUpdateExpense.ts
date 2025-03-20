import { useState } from "react";
import UPDATE_EXPENSE_CONSTANTS from "../UpdateExpense.const";

export const useUpdateExpense = () => {
  const [budget, setBudget] = useState(UPDATE_EXPENSE_CONSTANTS.DEFAULT_BUDGET);

  const handleCancel = () => {
    console.log("Cancel editing budget");
  };

  const handleEdit = () => {
    console.log("Edit budget:", budget);
  };

  return {
    state: {
      budget,
    },
    handler: {
      setBudget,
      handleCancel,
      handleEdit,
    },
  };
};
