import { RootState } from "../store";

export const selectOtpCode = (state: RootState) => state.system.otpCode;
export const selectImageView = (state: RootState) =>
  state.system.isShowImageView;
export const selectIsBotThinking = (state: RootState) =>
  state.system.isThinking;
