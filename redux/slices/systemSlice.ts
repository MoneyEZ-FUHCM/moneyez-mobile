import { CHATBOT_CONNECTION } from "@/enums/globals";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SystemState {
  otpCode: string;
  status: CHATBOT_CONNECTION;
  isShowImageView: boolean;
  isThinking: boolean;
  hasUnreadNotification: boolean;
}

const initialState: SystemState = {
  otpCode: "",
  status: CHATBOT_CONNECTION.CONNECTING,
  isShowImageView: false,
  isThinking: false,
  hasUnreadNotification: false,
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
    setImageView: (state, action) => {
      state.isShowImageView = action.payload;
    },
    setIsThinking: (state, action) => {
      state.isThinking = action.payload;
    },
    setHasUnreadNotification: (state, action: PayloadAction<boolean>) => {
      state.hasUnreadNotification = action.payload;
    },
  },
});

export const {
  setOtpCode,
  setConnectionStatus,
  setImageView,
  setIsThinking,
  setHasUnreadNotification,
} = systemSlice.actions;

export default systemSlice.reducer;
