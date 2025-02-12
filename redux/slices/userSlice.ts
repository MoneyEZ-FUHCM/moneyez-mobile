import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userInfo: null;
  email: null;
}

const initialState: UserState = {
  userInfo: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<null>) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { setUserInfo, clearUserInfo, setEmail } = userSlice.actions;
export default userSlice.reducer;
