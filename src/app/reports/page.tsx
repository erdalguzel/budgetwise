import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Detailed financial reports and visualizations will be available here.</p>
          <p className="mt-4">This includes:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Income vs. Expense trends over time</li>
            <li>Spending by category analysis</li>
            <li>Net worth tracking (if applicable)</li>
            <li>Customizable report generation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
