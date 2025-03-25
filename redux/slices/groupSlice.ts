import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";


interface GroupState {
  currentGroup: Group | null;
}

const initialState: GroupState = {
  currentGroup: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<Group>) => {
      state.currentGroup = action.payload;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
  },
});

export const selectCurrentGroup = (state: RootState) => state.group.currentGroup;
export const { setCurrentGroup, clearCurrentGroup } = groupSlice.actions;
export default groupSlice.reducer;