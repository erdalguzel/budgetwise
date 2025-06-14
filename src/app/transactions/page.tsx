
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  FilterX,
} from "lucide-react";
import { format, isValid } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  getTransactionsAction,
  deleteTransactionAction,
} from "@/lib/actions";
import type { Transaction, TransactionCategory } from "@/lib/types";
import { allTransactionCategories } from "@/lib/types";
import EditTransactionDialog from "@/components/transactions/EditTransactionDialog";

type SortConfig = {
  key: keyof Transaction | null;
  direction: "ascending" | "descending";
};

const ALL_CATEGORIES_VALUE = "_all_categories_";
const ALL_TYPES_VALUE = "_all_types_";

export default function TransactionsPage() {
  const { toast } = useToast();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES_VALUE);
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES_VALUE);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "descending",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const transactions = await getTransactionsAction();
      setAllTransactions(transactions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load transactions.",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredAndSortedTransactions = useMemo(() => {
    let transactions = [...allTransactions];

    if (searchTerm) {
      transactions = transactions.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter && categoryFilter !== ALL_CATEGORIES_VALUE) {
      transactions = transactions.filter((t) => t.category === categoryFilter);
    }
    if (typeFilter && typeFilter !== ALL_TYPES_VALUE) {
      transactions = transactions.filter((t) => t.type === typeFilter);
    }
    if (startDateFilter) {
      transactions = transactions.filter(
        (t) => new Date(t.date) >= startDateFilter
      );
    }
    if (endDateFilter) {
      // Add 1 day to endDate to make it inclusive
      const inclusiveEndDate = new Date(endDateFilter);
      inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
      transactions = transactions.filter(
        (t) => new Date(t.date) < inclusiveEndDate
      );
    }

    if (sortConfig.key) {
      transactions.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (sortConfig.key === 'date') {
          comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
        }
         else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortConfig.direction === "ascending" ? comparison : -comparison;
      });
    }

    return transactions;
  }, [
    allTransactions,
    searchTerm,
    categoryFilter,
    typeFilter,
    startDateFilter,
    endDateFilter,
    sortConfig,
  ]);

  const requestSort = (key: keyof Transaction) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    const result = await deleteTransactionAction(transactionToDelete.id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Transaction deleted successfully.",
      });
      fetchTransactions(); // Re-fetch transactions
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to delete transaction.",
      });
    }
    setIsDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(ALL_CATEGORIES_VALUE);
    setTypeFilter(ALL_TYPES_VALUE);
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const formatDate = (dateString: string) => {
     const date = new Date(dateString);
     return isValid(date) ? format(date, "MM/dd/yyyy") : 'Invalid Date';
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Transactions</CardTitle>
          <CardDescription>
            View, filter, sort, edit, or delete your transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4 md:flex md:items-end md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <div className="grid grid-cols-2 md:flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES_VALUE}>All Categories</SelectItem>
                {allTransactionCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_VALUE}>All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            </div>

            <div className="grid grid-cols-2 md:flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDateFilter ? format(startDateFilter, "PPP") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDateFilter}
                  onSelect={setStartDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDateFilter ? format(endDateFilter, "PPP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDateFilter}
                  onSelect={setEndDateFilter}
                  initialFocus
                  disabled={(date) => startDateFilter ? date < startDateFilter : false}
                />
              </PopoverContent>
            </Popover>
            </div>
             <Button onClick={clearFilters} variant="outline" className="w-full md:w-auto">
              <FilterX className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading transactions...</p>
          ) : filteredAndSortedTransactions.length > 0 ? (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => requestSort("description")}
                  >
                    Description{" "}
                    {sortConfig.key === "description" && (
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => requestSort("category")}
                  >
                    Category{" "}
                    {sortConfig.key === "category" && (
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted"
                    onClick={() => requestSort("amount")}
                  >
                    Amount{" "}
                    {sortConfig.key === "amount" && (
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted hidden md:table-cell"
                    onClick={() => requestSort("date")}
                  >
                    Date{" "}
                    {sortConfig.key === "date" && (
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted hidden md:table-cell"
                    onClick={() => requestSort("type")}
                  >
                    Type{" "}
                    {sortConfig.key === "type" && (
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    )}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className={`text-right font-mono ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {formatDate(transaction.date)}
                    </TableCell>
                     <TableCell className="text-right hidden md:table-cell capitalize">
                      {transaction.type}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No transactions found. Try adjusting your filters.
            </p>
          )}
        </CardContent>
      </Card>

      {transactionToEdit && (
        <EditTransactionDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          transaction={transactionToEdit}
          onTransactionEdited={() => {
            fetchTransactions(); // Refresh list after edit
            setIsEditModalOpen(false);
            setTransactionToEdit(null);
          }}
        />
      )}

      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction: <br />
              <strong>{transactionToDelete?.description}</strong> ({formatCurrency(transactionToDelete?.amount || 0, transactionToDelete?.type || 'expense')}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
