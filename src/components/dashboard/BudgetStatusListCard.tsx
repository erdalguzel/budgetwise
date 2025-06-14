"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CategorySpending } from "@/lib/types";

interface BudgetStatusListCardProps {
  data: CategorySpending[];
}

export default function BudgetStatusListCard({ data }: BudgetStatusListCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const budgetItems = data.filter(item => item.budgeted != null && item.budgeted > 0);

  if (budgetItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Status</CardTitle>
          <CardDescription>Track your progress towards budget goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active budgets to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
        <CardDescription>Track your progress towards budget goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgetItems.map((item) => {
          const progress = item.budgeted ? Math.min((item.spent / item.budgeted) * 100, 100) : 0;
          const remaining = item.budgeted ? item.budgeted - item.spent : 0;
          const overspent = item.spent > (item.budgeted ?? 0);

          return (
            <div key={item.category}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.category}</span>
                <span className={`text-sm font-medium ${overspent ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {formatCurrency(item.spent)} / {formatCurrency(item.budgeted!)}
                </span>
              </div>
              <Progress value={progress} className={overspent ? "[&>div]:bg-destructive" : ""} aria-label={`${item.category} budget progress`} />
              <p className={`text-xs mt-1 ${overspent ? 'text-destructive' : 'text-muted-foreground'}`}>
                {overspent
                  ? `${formatCurrency(Math.abs(remaining))} over budget`
                  : `${formatCurrency(remaining)} remaining`}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
