import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  hiddenTabbar: boolean;
}

const initialState: UserState = {
  hiddenTabbar: false,
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setHiddenTabbar: (state, action) => {
      state.hiddenTabbar = action.payload;
    },
  },
});

export const { setHiddenTabbar } = tabSlice.actions;
export default tabSlice.reducer;
