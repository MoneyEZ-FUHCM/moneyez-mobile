import { TRANSACTION_STATUS } from "@/enums/globals";
import { TransactionType } from "./invidual.types";

export interface Transaction {
  [x: string]: any;
  [x: string]: any;
  id: string;
  groupId: string | null;
  userId: string;
  amount: number;
  type: TransactionType;
  subcategoryId: string;
  transactionDate: string;
  description: string;
  status: TRANSACTION_STATUS;
  images: string[] | null;
  createdDate: string;
  createdBy: string | null;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface TransactionViewModel {
  id: string;
  subcategory: string;
  subCategoryName: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  time: string;
  icon: string;
  description: string;
  subcategoryIcon: string;
  transactionDate: string;
}

export interface TransactionViewModelDetail extends TransactionViewModel {
  subcategoryId: string;
}

export interface TransactionPayload {
  amount: number;
  description: string;
  images: string[];
  subcategoryId: string;
  transactionDate: string | Date;
  type: number;
}
export interface TransactionPreviewPayload extends TransactionPayload {
  subCategoryIcon: string;
  subCategoryName: string;
}

export interface TransactionsByDate {
  [date: string]: Transaction[];
}

export interface MarkedDates {
  [date: string]: {
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
  };
}

export interface GroupTransaction {
  groupId: string;
  userId: string;
  amount: number;
  type: number;
  transactionDate: string;
  description: string;
  images: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvalRequired: boolean;
  requestCode: string | null;
  insertType: "MANUAL" | "AUTO";
  avatarUrl: string;
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export type GroupTransactionList = GroupTransaction[];
export interface TransactionsByDate {
  [date: string]: Transaction[];
}

export interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
}
