
"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

interface MonthlyData {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  net: number;
}

interface IncomeExpenseTrendChartProps {
  data: MonthlyData[];
}

export default function IncomeExpenseTrendChart({ data }: IncomeExpenseTrendChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      // Format month for display, e.g., "Jan 2024"
      displayMonth: format(new Date(item.month + '-02'), "MMM yyyy"), // Adding -02 to avoid timezone issues with day 1
    }));
  }, [data]);

  const formatCurrencyForAxis = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };
  
  const formatCurrencyForTooltip = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };


  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expense Trend</CardTitle>
          <CardDescription>Loading chart...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Chart is loading</p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expense Trend</CardTitle>
          <CardDescription>Tracks your monthly income, expenses, and net cash flow over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No transaction data available to display trend chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs. Expense Trend</CardTitle>
        <CardDescription>Tracks your monthly income, expenses, and net cash flow over time.</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="displayMonth" 
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
              tickFormatter={formatCurrencyForAxis}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))', 
                borderRadius: 'var(--radius)' 
              }}
              formatter={formatCurrencyForTooltip}
            />
            <Legend wrapperStyle={{fontSize: "12px"}} />
            <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Income" dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Expenses" dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="net" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Net Flow" dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

