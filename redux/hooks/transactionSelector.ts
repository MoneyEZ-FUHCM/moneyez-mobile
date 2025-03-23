import { RootState } from "../store";

export const selectTransactionData = (state: RootState) =>
  state.transaction.transactionData;
