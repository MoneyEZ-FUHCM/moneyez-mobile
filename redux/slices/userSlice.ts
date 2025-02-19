import authApi from "@/services/auth";
import { UserInfo } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserState {
  userInfo: UserInfo | null;
  email: string | null;
}

const initialState: UserState = {
  userInfo: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getInfoUser.matchFulfilled,
      (state, action) => {
        state.userInfo = action.payload.data;
      },
    );
  },
});

export const selectUserInfo = (state: RootState) => state.user.userInfo;

export const { clearUserInfo, setEmail, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
