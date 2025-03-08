export interface BudgetCategory {
  categoryName: string;
  totalSpent: number;
  plannedPercentage: number;
  actualPercentage: number;
}

export interface UserSpendingChart {
  categories: BudgetCategory[];
  totalSpent: number;
  startDate: string;
  endDate: string;
}

interface Subcategory {
  name: string;
  nameUnsign: string;
  description: string;
  code: string;
  icon: string;
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface Category {
  category: any;
  name: string;
  nameUnsign: string;
  description: string;
  code: string;
  icon: string;
  type: "EXPENSE" | "INCOME";
  subcategories: Subcategory[];
}
