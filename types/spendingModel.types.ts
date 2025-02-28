// @types/spendingModel.types.ts
import { PeriodUnit } from "@/enums/globals";
import { BaseResponse } from "./system.types";

export interface SpendingModel {
  spendingModelId: string;
  name: string;
  description: string;
  isTemplate: boolean;
  periodUnit: PeriodUnit;
  periodValue: number;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  income?: number;
  expense?: number;
}

export interface UserSpendingModel {
  id: string;
  spendingModelId: string;
  name: string;
  description: string;
  isTemplate: boolean;
  periodUnit: PeriodUnit;
  periodValue: number;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  totalIncome?: number;
  totalExpense?: number;
}

export interface SpendingModelMetaData {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserSpendingModelResponseData {
  data: SpendingModel[];
  metaData: SpendingModelMetaData;
}

export type UserSpendingModelApiResponse = BaseResponse<UserSpendingModelResponseData>;
