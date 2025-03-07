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
