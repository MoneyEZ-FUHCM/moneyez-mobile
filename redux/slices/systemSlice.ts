import { CHATBOT_CONNECTION } from "@/enums/globals";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SystemState {
  otpCode: string;
  status: CHATBOT_CONNECTION;
}

const initialState: SystemState = {
  otpCode: "",
  status: CHATBOT_CONNECTION.CONNECTING,
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setOtpCode: (state, action) => {
      state.otpCode = action.payload;
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<SystemState["status"]>,
    ) => {
      state.status = action.payload;
    },
  },
});

export const { setOtpCode, setConnectionStatus } = systemSlice.actions;
export default systemSlice.reducer;
