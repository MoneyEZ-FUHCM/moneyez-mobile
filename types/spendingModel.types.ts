import { PERIOD_UNIT } from "@/enums/globals";
import { BaseResponse } from "./system.types";

export interface SpendingModel {
  spendingModelId: string;
  name: string;
  description: string;
  isTemplate: boolean;
  periodUnit: PERIOD_UNIT;
  periodValue: number;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
}

// export interface UserSpendingModel {
//   id: string;
//   spendingModelId: string;
//   name: string;
//   description: string;
//   isTemplate: boolean;
//   periodUnit: PERIOD_UNIT;
//   periodValue: number;
//   startDate: string;
//   endDate: string;
//   isDeleted: boolean;
//   totalIncome?: number;
//   totalExpense?: number;
// }

export interface UserSpendingModel {
  id: string;
  modelId: string;
  modelName: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  spendingModelId?: string;
}

export interface SpendingModelHistoryState {
  spendingModelsByYear: Array<{
    year: string;
    userSpendingModels: UserSpendingModel[];
  }>;
  filters: { id: string; label: string }[];
  activeFilter: string;
  isLoading: boolean;
  error: any;
}

export interface UserSpendingModelRequest {
  spendingModelId: string;
  periodUnit: number;
  periodValue: number;
  startDate: string;
}

export interface SpendingModelMap {
  id: string;
  name: string;
  nameUnsign: string;
  description: string;
  isTemplate: boolean;
  spendingModelCategories: [];
  createdDate: string;
  createdBy: string | null;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export type UserSpendingModelApiResponse = BaseResponse<UserSpendingModel>;
