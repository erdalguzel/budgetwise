import type { Transaction, BudgetGoal, TransactionCategory } from './types';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-07-01', description: 'Salary Deposit', amount: 3000, type: 'income', category: 'Salary' },
  { id: '2', date: '2024-07-01', description: 'Rent Payment', amount: 1200, type: 'expense', category: 'Housing' },
  { id: '3', date: '2024-07-02', description: 'Groceries at SuperMart', amount: 75.50, type: 'expense', category: 'Groceries' },
  { id: '4', date: '2024-07-03', description: 'Dinner with Friends', amount: 55.00, type: 'expense', category: 'Dining Out' },
  { id: '5', date: '2024-07-04', description: 'Movie Tickets', amount: 25.00, type: 'expense', category: 'Entertainment' },
  { id: '6', date: '2024-07-05', description: 'Gasoline for Car', amount: 40.00, type: 'expense', category: 'Transport' },
  { id: '7', date: '2024-07-08', description: 'Electricity Bill', amount: 85.20, type: 'expense', category: 'Utilities' },
  { id: '8', date: '2024-07-10', description: 'Online Course Subscription', amount: 20.00, type: 'expense', category: 'Other Expense' },
  { id: '9', date: '2024-07-12', description: 'Freelance Project Payment', amount: 500, type: 'income', category: 'Freelance' },
  { id: '10', date: '2024-07-15', description: 'New T-shirt', amount: 30.00, type: 'expense', category: 'Shopping' },
];

export const mockBudgetGoals: BudgetGoal[] = [
  { id: 'b1', category: 'Groceries', amount: 300 },
  { id: 'b2', category: 'Dining Out', amount: 150 },
  { id: 'b3', category: 'Entertainment', amount: 100 },
  { id: 'b4', category: 'Transport', amount: 100 },
  { id: 'b5', category: 'Shopping', amount: 200 },
  { id: 'b6', category: 'Utilities', amount: 150 },
  { id: 'b7', category: 'Housing', amount: 1200 },
];

export const getCalculatedKeyMetrics = (transactions: Transaction[]): { totalIncome: number; totalExpenses: number; netBalance: number } => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, netBalance };
};

export const getCategorySpending = (transactions: Transaction[], budgetGoals: BudgetGoal[]): Array<{ category: TransactionCategory, spent: number, budget: number | null }> => {
  const spendingMap = new Map<TransactionCategory, number>();

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      spendingMap.set(t.category, (spendingMap.get(t.category) || 0) + t.amount);
    });

  const allCategories = new Set<TransactionCategory>([
    ...budgetGoals.map(b => b.category),
    ...Array.from(spendingMap.keys())
  ]);
  
  return Array.from(allCategories).map(category => {
    const budgetGoal = budgetGoals.find(b => b.category === category);
    return {
      category,
      spent: spendingMap.get(category) || 0,
      budget: budgetGoal ? budgetGoal.amount : null,
    };
  }).sort((a,b) => (b.budget ?? 0) - (a.budget ?? 0) || b.spent - a.spent);
};
