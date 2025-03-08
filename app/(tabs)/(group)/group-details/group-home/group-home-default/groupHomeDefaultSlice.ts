import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
  groupId: string | null;
}

const initialState: GroupState = {
  groupId: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroupId(state, action: PayloadAction<string>) {
      state.groupId = action.payload;
    },
  },
});

export const { setGroupId } = groupSlice.actions;
export default groupSlice.reducer;
