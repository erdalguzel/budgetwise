"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Transaction, TransactionCategory } from "@/lib/types";
import { expenseCategories } from "@/lib/types";

interface SpendingPieChartCardProps {
  transactions: Transaction[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(240, 70%, 65%)", // Additional colors
  "hsl(300, 70%, 65%)",
  "hsl(30, 70%, 65%)",
];

export default function SpendingPieChartCard({ transactions }: SpendingPieChartCardProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const expenseData = React.useMemo(() => {
    const categoryMap = new Map<TransactionCategory, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      });
    
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);
  }, [transactions]);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>Loading chart...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Chart is loading</p>
        </CardContent>
      </Card>
    );
  }
  
  if (expenseData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>How your money is spent across categories.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No expense data available to display chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>How your money is spent across categories.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value)
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
