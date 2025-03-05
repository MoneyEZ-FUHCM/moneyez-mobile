// @types/spendingModel.types.ts
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

export interface UserSpendingModel {
  id: string;
  spendingModelId: string;
  name: string;
  description: string;
  isTemplate: boolean;
  periodUnit: PERIOD_UNIT;
  periodValue: number;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  totalIncome?: number;
  totalExpense?: number;
}

export type UserSpendingModelApiResponse = BaseResponse<UserSpendingModel>;
