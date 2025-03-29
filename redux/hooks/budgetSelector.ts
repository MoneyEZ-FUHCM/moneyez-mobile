import { RootState } from "../store";

export const selectBudgetStatisticType = (state: RootState) =>
  state.budget.type;
