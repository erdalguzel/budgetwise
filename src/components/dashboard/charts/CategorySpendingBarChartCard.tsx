"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CategorySpending } from "@/lib/types";

interface CategorySpendingBarChartCardProps {
  data: CategorySpending[];
}

export default function CategorySpendingBarChartCard({ data }: CategorySpendingBarChartCardProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chartData = React.useMemo(() => {
    return data
      .filter(item => item.spent > 0 || (item.budgeted && item.budgeted > 0)) // Show categories with spending or budget
      .map(item => ({
        name: item.category,
        Spent: item.spent,
        Budget: item.budgeted ?? 0, 
      }))
      .slice(0, 7); // Limit to top 7 categories for clarity
  }, [data]);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending vs. Budget</CardTitle>
          <CardDescription>Loading chart...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
           <p className="text-muted-foreground">Chart is loading</p>
        </CardContent>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
     return (
      <Card>
        <CardHeader>
          <CardTitle>Spending vs. Budget</CardTitle>
          <CardDescription>Track your spending against set budgets per category.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available to display chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending vs. Budget</CardTitle>
        <CardDescription>Track your spending against set budgets per category.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent)/0.3)' }}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value)
              }
            />
            <Legend wrapperStyle={{fontSize: "12px"}} />
            <Bar dataKey="Spent" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Budget" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
