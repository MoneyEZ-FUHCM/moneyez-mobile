import { createSlice } from "@reduxjs/toolkit";

interface BudgetState {
  type: "month" | "week"; // Fixed typo in "mmonth"
}

const initialState: BudgetState = {
  type: "week",
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setBudgetStatisticType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setBudgetStatisticType } = budgetSlice.actions;
export default budgetSlice.reducer;
