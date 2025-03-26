import { MaterialIcons } from "@expo/vector-icons";

export interface FinancialGoal {
  id: string;
  userId: string;
  subcategoryId: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  name: string;
  targetAmount: number;
  currentAmount: number;
  status: number;
  deadline: string;
  subcategoryIcon: string;
}

export interface PersonalTransactionFinancialGoals {
  userId: string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  userSpendingModelId: string;
  subcategoryId: string;
  transactionDate: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  subcategoryName: string;
  subcategoryIcon: string;
  images: string[];
  insertType: "MANUAL" | "AUTO";
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate?: string | null;
  updatedBy?: string | null;
  isDeleted: boolean;
}

export type PersonalTransactionFinancialGoalsList =
  PersonalTransactionFinancialGoals[];

export interface PersonalLimitBudgetSubcate {
  limitBudget: number;
  subcategoryId: string;
  subcategoryName: string;
}
