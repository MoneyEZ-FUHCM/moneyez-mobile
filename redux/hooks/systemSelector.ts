import { RootState } from "../store";

export const selectOtpCode = (state: RootState) => state.system.otpCode;
