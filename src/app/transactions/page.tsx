import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Transaction management features will be implemented here.</p>
          <p className="mt-4">This includes:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Full list of transactions with filtering and sorting</li>
            <li>Ability to add, edit, and delete transactions</li>
            <li>Transaction categorization tools</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
