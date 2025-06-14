
"use server";

import { z } from "zod";
import { getBudgetInsights } from "@/ai/flows/budget-insights";
import type { BudgetInsightsInput, BudgetInsightsOutput } from "@/ai/flows/budget-insights";
import type { Transaction, BudgetGoal, TransactionCategory } from "./types";
import { revalidatePath } from "next/cache";

// Mock database for transactions and budget goals
// In a real app, this would be a database like Firestore, Supabase, etc.
let transactionsStore: Transaction[] = [
  { id: '1', date: '2024-07-01', description: 'Salary', amount: 3000, type: 'income', category: 'Salary' },
  { id: '2', date: '2024-07-01', description: 'Rent', amount: 1200, type: 'expense', category: 'Housing' },
  { id: '3', date: '2024-07-02', description: 'Groceries at SuperMart', amount: 75.50, type: 'expense', category: 'Groceries' },
  { id: '4', date: '2024-07-03', description: 'Dinner with Friends', amount: 55.00, type: 'expense', category: 'Dining Out' },
  { id: '5', date: '2024-07-04', description: 'Movie Tickets', amount: 25.00, type: 'expense', category: 'Entertainment' },
];
let budgetGoalsStore: BudgetGoal[] = [
  { id: 'b1', category: 'Groceries', amount: 300 },
  { id: 'b2', category: 'Housing', amount: 1200 },
];

const transactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required") as z.ZodType<TransactionCategory>,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export async function addTransactionAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsedData = transactionSchema.safeParse({
      ...data,
      amount: parseFloat(data.amount as string),
    });

    if (!parsedData.success) {
      // Convert ZodError to a more user-friendly format if needed
      const errors = parsedData.error.flatten().fieldErrors;
      const errorMessages = Object.values(errors).flat().join(", ");
      return { success: false, error: errorMessages || "Invalid input." };
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...parsedData.data,
    };

    transactionsStore.push(newTransaction);
    revalidatePath("/"); 
    revalidatePath("/transactions");
    revalidatePath("/budgets"); // Budgets page also uses transactions
    return { success: true, transaction: newTransaction };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function editTransactionAction(transactionId: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsedData = transactionSchema.safeParse({
      ...data,
      amount: parseFloat(data.amount as string),
    });

    if (!parsedData.success) {
      const errors = parsedData.error.flatten().fieldErrors;
      const errorMessages = Object.values(errors).flat().join(", ");
      return { success: false, error: errorMessages || "Invalid input." };
    }

    const transactionIndex = transactionsStore.findIndex(t => t.id === transactionId);
    if (transactionIndex === -1) {
      return { success: false, error: "Transaction not found." };
    }

    transactionsStore[transactionIndex] = {
      ...transactionsStore[transactionIndex],
      ...parsedData.data,
    };
    
    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/budgets");
    return { success: true, transaction: transactionsStore[transactionIndex] };
  } catch (error) {
    console.error("Error editing transaction:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteTransactionAction(transactionId: string) {
  try {
    const initialLength = transactionsStore.length;
    transactionsStore = transactionsStore.filter(t => t.id !== transactionId);

    if (transactionsStore.length === initialLength) {
      return { success: false, error: "Transaction not found or already deleted." };
    }
    
    revalidatePath("/");
    revalidatePath("/transactions");
    revalidatePath("/budgets");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}


export async function getTransactionsAction(): Promise<Transaction[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve([...transactionsStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export async function getBudgetGoalsAction(): Promise<BudgetGoal[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve([...budgetGoalsStore]);
}

export async function setBudgetGoalAction(formData: FormData) {
  try {
    const category = formData.get('category') as TransactionCategory;
    const amount = parseFloat(formData.get('amount') as string);

    if (!category || isNaN(amount) || amount < 0) {
      return { success: false, error: "Invalid category or amount." };
    }

    const existingGoalIndex = budgetGoalsStore.findIndex(g => g.category === category);
    if (existingGoalIndex > -1) {
      budgetGoalsStore[existingGoalIndex].amount = amount;
    } else {
      budgetGoalsStore.push({ id: Date.now().toString(), category, amount });
    }
    
    revalidatePath("/");
    revalidatePath("/budgets");
    return { success: true };
  } catch (error) {
    console.error("Error setting budget goal:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}


const aiInsightsSchema = z.object({
  transactions: z.string().min(1, "Transactions data is required."),
  budgetGoals: z.string().min(1, "Budget goals data is required."),
  timeline: z.string().min(1, "Timeline is required."),
});

export async function getAiInsightsAction(
  input: BudgetInsightsInput
): Promise<{ success: boolean; data?: BudgetInsightsOutput; error?: string }> {
  try {
    const parsedInput = aiInsightsSchema.safeParse(input);
    if (!parsedInput.success) {
      return { success: false, error: "Invalid input for AI insights." };
    }

    const insights = await getBudgetInsights(parsedInput.data);
    return { success: true, data: insights };
  } catch (error) {
    console.error("Error getting AI insights:", error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while fetching AI insights.";
    return { success: false, error: errorMessage };
  }
}
