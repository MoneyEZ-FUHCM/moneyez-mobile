import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: { isLoading: false, isShowSplash: false },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setShowSplash: (state, action) => {
      state.isShowSplash = action.payload;
    },
  },
});

export const { setLoading, setShowSplash } = loadingSlice.actions;
export default loadingSlice.reducer;
