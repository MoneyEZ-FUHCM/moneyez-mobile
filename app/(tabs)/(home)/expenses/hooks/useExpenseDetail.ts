import { useState } from "react";
import TRANSACTIONS from "../ExpenseDetail.const";

export const useExpenseDetail = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreData = () => {
    console.log("Load more data");
  };
  return {
    state: {
      TRANSACTIONS,
      isLoading,
    },
    handler: {
      loadMoreData,
      setIsLoading,
    },
  };
};
