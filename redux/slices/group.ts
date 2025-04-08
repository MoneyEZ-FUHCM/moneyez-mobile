import authApi from "@/services/auth";
import { UserInfo } from "@/types/user.types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GroupState {
  groupInfo: UserInfo | null;
  email: string | null;
}

const initialState: GroupState = {
  groupInfo: null,
  email: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    clearGroupInfo: (state) => {
      state.groupInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getInfoUser.matchFulfilled,
      (state, action) => {
        state.groupInfo = action.payload.data;
      },
    );
  },
});

export const { clearGroupInfo: clearUserInfo } = groupSlice.actions;
export default groupSlice.reducer;
