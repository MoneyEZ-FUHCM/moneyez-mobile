import { UserInfo } from "./user.types";

export interface CreateGroupPayload {
  bankAccountNumber: any;
  bankName: any;
  name: string;
  description: string;
  currentBalance: number;
  accountBankId: string;
  image: string;
}
export interface GroupMember {
  transactionCount: unknown;
  totalContribution: any;
  groupId: string;
  userId: string;
  contributionPercentage: number;
  role: string;
  status: string;
  userInfo: UserInfo;
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}
export interface GroupDetail {
  id: string;
  name: string;
  nameUnsign: string;
  description: string;
  currentBalance: number;
  status: string;
  visibility: string;
  imageUrl: string;
  isGoalActive: boolean;
  totalIncome: number;
  totalExpense: number;
  groupMembers: any[];
}

export interface GroupLogs {
  groupId: string;
  changedBy: string;
  changeDescription: string;
  action: "CREATED" | "UPDATED" | "DELETED";
  imageUrl: string;
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export type GroupLogsList = GroupLogs[];

export interface MemberLogs {
  groupId: string;
  changeDescription: string;
  action: "CREATED" | "UPDATED" | "DELETED";
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate?: string | null;
  updatedBy?: string | null;
  isDeleted: boolean;
}

export type MemberLogsList = MemberLogs[];

export interface QrData {
  groupId: string;
  qrCode: string;
}
