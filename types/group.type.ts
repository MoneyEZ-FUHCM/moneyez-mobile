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
  groupMembers: any[];
}
