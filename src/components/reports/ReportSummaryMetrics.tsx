
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale } from "lucide-react"; // Scale for balance
import type { KeyMetrics } from "@/lib/types";

interface ReportSummaryMetricsProps {
  metrics: KeyMetrics;
}

const iconProps = {
  className: "h-5 w-5 text-muted-foreground",
};

export default function ReportSummaryMetrics({ metrics }: ReportSummaryMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">Overall Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
                 <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-md">
                        <TrendingUp {...iconProps} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Income</p>
                        <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(metrics.totalIncome)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                     <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-md">
                        <TrendingDown {...iconProps} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Expenses</p>
                        <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                            {formatCurrency(metrics.totalExpenses)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-md ${metrics.netBalance >= 0 ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-orange-100 dark:bg-orange-900/50'}`}>
                        <Scale {...iconProps} className={`${metrics.netBalance >= 0 ? 'text-primary' : 'text-orange-500 dark:text-orange-400'}`} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Net Balance</p>
                        <p className={`text-xl font-semibold ${metrics.netBalance >= 0 ? 'text-primary' : 'text-orange-500 dark:text-orange-400'}`}>
                            {formatCurrency(metrics.netBalance)}
                        </p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
