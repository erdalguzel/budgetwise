export type TransactionCategory =
  | 'Groceries'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Dining Out'
  | 'Shopping'
  | 'Housing'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gifts'
  | 'Other Income'
  | 'Other Expense';

export const expenseCategories: TransactionCategory[] = [
  'Groceries',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Dining Out',
  'Shopping',
  'Housing',
  'Other Expense',
];

export const incomeCategories: TransactionCategory[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Gifts',
  'Other Income',
];

export const allTransactionCategories: TransactionCategory[] = [...expenseCategories, ...incomeCategories];

export interface Transaction {
  id: string;
  date: string; // ISO string e.g. "2024-07-15"
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
}

export interface BudgetGoal {
  id: string;
  category: TransactionCategory; // Should only be expense categories
  amount: number; // The budgeted amount for the month
}

export interface KeyMetrics {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export interface CategorySpending {
  category: TransactionCategory;
  spent: number;
  budgeted?: number;
}

export interface ChartColorMapping {
  [key: string]: string; // categoryName: cssVariableForColor (e.g. var(--chart-1))
}
