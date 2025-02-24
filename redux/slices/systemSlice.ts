import { createSlice } from "@reduxjs/toolkit";

interface SystemState {
  otpCode: string;
}

const initialState: SystemState = {
  otpCode: "",
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setOtpCode: (state, action) => {
      state.otpCode = action.payload;
    },
  },
});

export const { setOtpCode } = systemSlice.actions;
export default systemSlice.reducer;
