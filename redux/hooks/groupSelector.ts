import { RootState } from "../store";

export const selectGroupDetail = (state: RootState) => state.group.currentGroup;
