import { TransactionPreviewPayload } from "@/types/transaction.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransactionState {
  transactionData: TransactionPreviewPayload | null;
}

const initialState: TransactionState = {
  transactionData: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionData: (
      state,
      action: PayloadAction<TransactionPreviewPayload>,
    ) => {
      state.transactionData = action.payload;
    },
    clearTransaction: (state) => {
      state.transactionData = null;
    },
  },
});

export const { setTransactionData, clearTransaction } =
  transactionSlice.actions;
export default transactionSlice.reducer;
