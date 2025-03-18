import { useState } from "react";
import { DEFAULT_BUDGET } from "../UpdateExpense.const";

export const useUpdateExpense = () => {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);

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
