"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import type { KeyMetrics } from "@/lib/types";

interface KeyMetricsCardsProps {
  metrics: KeyMetrics;
}

const iconProps = {
  className: "h-6 w-6 text-muted-foreground",
};

export default function KeyMetricsCards({ metrics }: KeyMetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp {...iconProps} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            This month's earnings
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown {...iconProps} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(metrics.totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            This month's spending
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <Wallet {...iconProps} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatCurrency(metrics.netBalance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Your current financial standing
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
