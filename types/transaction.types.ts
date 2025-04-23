import { TRANSACTION_STATUS } from "@/enums/globals";
import { TransactionType } from "./invidual.types";

export interface Transaction {
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

export interface GroupTransaction {
  note: string;
  bankTransactionDate: string;
  accountBankNumber: string;
  accountBankName: string;
  groupId: string;
  userId: string;
  amount: number;
  type: string;
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

export interface TransactionsReportMonthlyData {
  month: string;
  amount: number;
}

export interface TransactionsReportYearlyData {
  year: number;
  type: number;
  total: number;
  average: number;
  monthlyData: TransactionsReportMonthlyData[];
}

export interface TransactionsReportCategoryItem {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
}

export interface TransactionsReportCategoryYear {
  year: number;
  type: number;
  total: number;
  categories: TransactionsReportCategoryItem[];
}

export interface TransactionsReportAllTime {
  income: number;
  expense: number;
  total: number;
  initialBalance: number;
  cumulation: number;
}

export interface TransactionsReportCategoryItem {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
  color?: string;
}

export interface TransactionsReportCategoryAllTime {
  type: number;
  total: number;
  categories: TransactionsReportCategoryItem[];
}

export interface TransactionsReportMonthlyBalance {
  month: string;
  balance: number;
}

export interface TransactionsReportYearlyBalance {
  year: number;
  balances: TransactionsReportMonthlyBalance[];
}
