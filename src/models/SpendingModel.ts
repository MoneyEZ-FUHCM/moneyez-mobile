export interface SpendingModel {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  paymentMethod?: string;
  location?: string;
  tags?: string[];
  receipt?: string; // URL to receipt image
  isRecurring?: boolean;
  recurringDetails?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SpendingFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
  paymentMethod?: string;
  location?: string;
  tags?: string[];
  receipt?: string;
  isRecurring?: boolean;
  recurringDetails?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: string;
  };
}

export const createEmptySpendingFormData = (): SpendingFormData => ({
  amount: 0,
  description: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: '',
  location: '',
  tags: [],
  receipt: '',
  isRecurring: false,
});
