
import { getTransactionsAction, getBudgetGoalsAction } from "@/lib/actions";
import { getCalculatedKeyMetrics, getCategorySpending } from "@/lib/data";
import IncomeExpenseTrendChart from "@/components/reports/IncomeExpenseTrendChart";
import ReportSummaryMetrics from "@/components/reports/ReportSummaryMetrics";
import SpendingPieChartCard from "@/components/dashboard/charts/SpendingPieChartCard";
import CategorySpendingBarChartCard from "@/components/dashboard/charts/CategorySpendingBarChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReportsPage() {
  const transactions = await getTransactionsAction();
  const budgetGoals = await getBudgetGoalsAction();

  const overallMetrics = getCalculatedKeyMetrics(transactions);
  const categorySpendingData = getCategorySpending(transactions, budgetGoals);

  // Prepare data for IncomeExpenseTrendChart
  // Group transactions by month
  const monthlyDataMap = new Map<string, { month: string; income: number; expenses: number; net: number }>();

  transactions.forEach(t => {
    const monthYear = t.date.substring(0, 7); // YYYY-MM
    if (!monthlyDataMap.has(monthYear)) {
      monthlyDataMap.set(monthYear, { month: monthYear, income: 0, expenses: 0, net: 0 });
    }
    const currentMonthData = monthlyDataMap.get(monthYear)!;
    if (t.type === 'income') {
      currentMonthData.income += t.amount;
    } else {
      currentMonthData.expenses += t.amount;
    }
    currentMonthData.net = currentMonthData.income - currentMonthData.expenses;
  });

  const incomeExpenseTrendData = Array.from(monthlyDataMap.values()).sort((a, b) => a.month.localeCompare(b.month));


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page provides a detailed analysis of your financial activity, trends, and budget performance.</p>
        </CardContent>
      </Card>

      <ReportSummaryMetrics metrics={overallMetrics} />

      <IncomeExpenseTrendChart data={incomeExpenseTrendData} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SpendingPieChartCard transactions={transactions} />
        </div>
        <div className="lg:col-span-3">
          <CategorySpendingBarChartCard data={categorySpendingData} />
        </div>
      </div>
      
      {/* Placeholder for future reports if needed */}
      {/*
      <Card>
        <CardHeader>
          <CardTitle>Additional Report Section</CardTitle>
        </CardHeader>
        <CardContent>
          <p>More reports can be added here, e.g., Net Worth Trend, Savings Rate, etc.</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
