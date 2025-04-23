export interface RecurringTransaction {
  id: string;
  userId: string;
  subcategoryId: string;
  type: number;
  tags: string;
  amount: number;
  frequencyType: number;
  interval: number;
  startDate: string;
  endDate: string | null;
  description: string;
  status: number;
  subcategoryName: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface RecurringTransactionFormValues {
  subcategoryId: string;
  amount: string;
  frequencyType: number;
  interval: string;
  startDate: Date;
  description: string;
  tags: string;
}

export interface RecurringTransactionPayload {
  id?: string;
  subcategoryId: string;
  amount: number;
  frequencyType: number;
  interval: number;
  startDate: string;
  description?: string;
  tags?: string;
}
