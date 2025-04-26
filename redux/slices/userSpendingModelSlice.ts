import { UserSpendingModel } from "@/helpers/types/spendingModel.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import userSpendingModelApi from "@/services/userSpendingModel";

interface UserSpendingModelState {
  currentModel: UserSpendingModel | null;
}

const initialState: UserSpendingModelState = {
  currentModel: null,
};

const userSpendingModelSlice = createSlice({
  name: "userSpendingModel",
  initialState,
  reducers: {
    clearCurrentModel: (state) => {
      state.currentModel = null;
    },
    setCurrentModel: (
      state,
      action: PayloadAction<UserSpendingModel | null>,
    ) => {
      state.currentModel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userSpendingModelApi.endpoints.getCurrentUserSpendingModel.matchFulfilled,
      (state, action) => {
        state.currentModel = action.payload.data;
      },
    );
  },
});

export const selectCurrentUserSpendingModel = (state: RootState) =>
  state.userSpendingModel.currentModel;

export const { clearCurrentModel, setCurrentModel } =
  userSpendingModelSlice.actions;
export default userSpendingModelSlice.reducer;
