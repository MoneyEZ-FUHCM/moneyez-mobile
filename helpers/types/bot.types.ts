export interface ChatMessageHistory {
  chatHistoryId: string;
  type: number;
  message: string;
  id: string;
  createdDate: string;
  createdBy: string | null;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface Message {
  id: string;
  message: string;
  type: number;
  createdAt: string;
}

export type ChatMessageHistoryList = ChatMessageHistory[];
