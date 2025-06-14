import KeyMetricsCards from "@/components/dashboard/KeyMetricsCards";
import SpendingPieChartCard from "@/components/dashboard/charts/SpendingPieChartCard";
import CategorySpendingBarChartCard from "@/components/dashboard/charts/CategorySpendingBarChartCard";
import BudgetStatusListCard from "@/components/dashboard/BudgetStatusListCard";
import AiAssistantCard from "@/components/dashboard/AiAssistantCard";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import { getTransactionsAction, getBudgetGoalsAction } from "@/lib/actions";
import { getCalculatedKeyMetrics, getCategorySpending } from "@/lib/data";

export default async function DashboardPage() {
  // Fetch data using Server Actions
  const transactions = await getTransactionsAction();
  const budgetGoals = await getBudgetGoalsAction();

  // Calculate derived data
  const keyMetrics = getCalculatedKeyMetrics(transactions);
  const categorySpendingData = getCategorySpending(transactions, budgetGoals);

  return (
    <div className="space-y-6">
      <KeyMetricsCards metrics={keyMetrics} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
           <SpendingPieChartCard transactions={transactions} />
        </div>
        <div className="lg:col-span-2">
          <CategorySpendingBarChartCard data={categorySpendingData} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactionsCard transactions={transactions} />
        </div>
        <div className="lg:col-span-1">
          <BudgetStatusListCard data={categorySpendingData} />
        </div>
      </div>
      
      <div>
        <AiAssistantCard transactions={transactions} budgetGoals={budgetGoals} />
      </div>

    </div>
  );
}
