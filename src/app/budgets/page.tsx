"use client"; // For form interaction

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { expenseCategories, type TransactionCategory } from "@/lib/types";
import { setBudgetGoalAction, getBudgetGoalsAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import type { BudgetGoal } from "@/lib/types";
import { Progress } from "@/components/ui/progress"; // Assuming transactions are needed for progress
import { getTransactionsAction } from "@/lib/actions";
import type { Transaction } from "@/lib/types";

const budgetFormSchema = z.object({
  category: z.string().min(1, "Category is required") as z.ZodType<TransactionCategory>,
  amount: z.coerce.number().min(0, "Amount must be non-negative"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export default function BudgetsPage() {
  const { toast } = useToast();
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // For calculating progress
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: expenseCategories[0],
      amount: 0,
    },
  });

  const fetchBudgetsAndTransactions = async () => {
    setIsLoading(true);
    try {
      const [goals, trans] = await Promise.all([getBudgetGoalsAction(), getTransactionsAction()]);
      setBudgetGoals(goals);
      setTransactions(trans);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load data." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBudgetsAndTransactions();
  }, []);

  const onSubmit = async (data: BudgetFormValues) => {
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("amount", data.amount.toString());

    const result = await setBudgetGoalAction(formData);
    if (result.success) {
      toast({ title: "Success", description: `Budget for ${data.category} updated.` });
      fetchBudgetsAndTransactions(); // Re-fetch to update list
      form.reset({ category: expenseCategories[0], amount: 0 });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  const calculateSpentAmount = (category: TransactionCategory): number => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Monthly Budgets</CardTitle>
          <CardDescription>Define your spending limits for each category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => form.setValue('category', value as TransactionCategory)} defaultValue={form.getValues('category')}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">Budget Amount ($)</Label>
              <Input id="amount" type="number" step="0.01" {...form.register("amount")} />
              {form.formState.errors.amount && <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>}
            </div>
            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">Set Budget</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Budget Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading budgets...</p> :
            budgetGoals.length > 0 ? (
            <div className="space-y-4">
              {budgetGoals.map(goal => {
                const spent = calculateSpentAmount(goal.category);
                const progress = goal.amount > 0 ? Math.min((spent / goal.amount) * 100, 100) : 0;
                const isOverBudget = spent > goal.amount;
                return (
                  <div key={goal.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{goal.category}</span>
                      <span className={`font-medium ${isOverBudget ? 'text-destructive' : ''}`}>
                        {formatCurrency(spent)} / {formatCurrency(goal.amount)}
                      </span>
                    </div>
                    <Progress value={progress} className={isOverBudget ? "[&>div]:bg-destructive" : ""} />
                    <p className={`text-xs mt-1 ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {isOverBudget 
                        ? `${formatCurrency(spent - goal.amount)} over budget` 
                        : `${formatCurrency(goal.amount - spent)} remaining`}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No budget goals set yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
