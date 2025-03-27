import groupApi from "@/services/group";
import { GroupDetail } from "@/types/group.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GroupState {
  currentGroup: GroupDetail | null;
}

const initialState: GroupState = {
  currentGroup: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<GroupDetail>) => {
      state.currentGroup = action.payload;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      groupApi.endpoints.getGroupDetail.matchFulfilled,
      (state, action) => {
        state.currentGroup = action.payload.data;
      },
    );
  },
});

export const selectCurrentGroup = (state: RootState) =>
  state.group.currentGroup;
export const { setCurrentGroup, clearCurrentGroup } = groupSlice.actions;
export default groupSlice.reducer;
