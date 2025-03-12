import { TRANSACTION_STATUS } from "@/enums/globals";
import { TransactionType } from "./invidual.types";

export interface Transaction {
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
