import { CHATBOT_CONNECTION } from "@/enums/globals";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  otpCode: string;
  status: CHATBOT_CONNECTION;
  isShowImageView: boolean;
  isThinking: boolean;
  hasUnreadNotification: boolean;
  newNotifications: any[];
}

const initialState: NotificationState = {
  otpCode: "",
  status: CHATBOT_CONNECTION.CONNECTING,
  isShowImageView: false,
  isThinking: false,
  hasUnreadNotification: false,
  newNotifications: [],
};

const notificationSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    addNewNotification: (state, action: PayloadAction<any>) => {
      const exists = state.newNotifications?.some(
        (notice) => notice.id === action.payload.id,
      );
      if (!exists) {
        state.newNotifications = [action.payload, ...state.newNotifications];
        state.hasUnreadNotification = true;
      }
    },
    clearNewNotifications: (state) => {
      state.newNotifications = [];
    },
  },
});

export const { addNewNotification, clearNewNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
