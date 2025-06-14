"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  limit?: number;
}

export default function RecentTransactionsCard({ transactions, limit = 5 }: RecentTransactionsCardProps) {
  const recentTransactions = transactions.slice(0, limit);

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities.</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/transactions">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize whitespace-nowrap">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.amount, transaction.type)}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">No recent transactions.</p>
        )}
      </CardContent>
    </Card>
  );
}
