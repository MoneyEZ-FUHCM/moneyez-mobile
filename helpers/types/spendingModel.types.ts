import { PERIOD_UNIT } from "@/helpers/enums/globals";
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
  status: string;
  id: string;
  modelId: string;
  name: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  spendingModelId?: string;
  isDeleted: boolean;
}

export interface SpendingModelCategory {
  spendingModelId: string;
  categoryId: string;
  percentageAmount: number;
  category: {
    name: string;
    nameUnsign: string;
    description: string;
    code: string;
    icon: string;
    type: string;
    isSaving: boolean;
    id: string;
  };
}

export interface SpendingModelData {
  id: string;
  name: string;
  nameUnsign: string;
  description: string;
  isTemplate: boolean;
  spendingModelCategories: SpendingModelCategory[];
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
