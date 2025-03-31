import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  mainTabHidden: boolean;
  groupTabHidden: boolean;
  groupRoutes: any;
}

const initialState: TabState = {
  mainTabHidden: false,
  groupTabHidden: false,
  groupRoutes: ["group-home", "transaction", "member", "group-setting"],
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setMainTabHidden: (state, action: PayloadAction<boolean>) => {
      state.mainTabHidden = action.payload;
    },
    setGroupTabHidden: (state, action: PayloadAction<boolean>) => {
      state.groupTabHidden = action.payload;
    },
  },
});

export const { setMainTabHidden, setGroupTabHidden } = tabSlice.actions;
export default tabSlice.reducer;
