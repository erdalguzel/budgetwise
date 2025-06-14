"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addTransactionAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { allTransactionCategories, expenseCategories, incomeCategories, type TransactionCategory } from "@/lib/types";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  date: z.date({ required_error: "Date is required."}),
});

type QuickAddFormValues = z.infer<typeof formSchema>;

interface QuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickAddDialog({ open, onOpenChange }: QuickAddDialogProps) {
  const { toast } = useToast();
  const [transactionType, setTransactionType] = React.useState<'income' | 'expense'>('expense');
  
  const form = useForm<QuickAddFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date(),
    },
  });

  React.useEffect(() => {
    form.setValue('type', transactionType);
    form.setValue('category', ''); // Reset category when type changes
  }, [transactionType, form]);

  const onSubmit = async (data: QuickAddFormValues) => {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("amount", data.amount.toString());
    formData.append("type", data.type);
    formData.append("category", data.category);
    formData.append("date", format(data.date, "yyyy-MM-dd"));

    const result = await addTransactionAction(formData);

    if (result.success) {
      toast({
        title: "Success!",
        description: `Transaction "${data.description}" added.`,
      });
      form.reset();
      onOpenChange(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof result.error === 'string' ? result.error : "Failed to add transaction.",
      });
    }
  };
  
  const currentCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Quick Add Transaction</DialogTitle>
          <DialogDescription>
            Quickly add a new income or expense to your records.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(value: 'income' | 'expense') => {
                    field.onChange(value);
                    setTransactionType(value);
                  }}
                  className="col-span-3 flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="r-expense" />
                    <Label htmlFor="r-expense">Expense</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="r-income" />
                    <Label htmlFor="r-income">Income</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              {...form.register("description")}
              className="col-span-3"
              aria-invalid={form.formState.errors.description ? "true" : "false"}
            />
            {form.formState.errors.description && (
              <p role="alert" className="col-span-4 text-right text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...form.register("amount")}
              className="col-span-3"
              aria-invalid={form.formState.errors.amount ? "true" : "false"}
            />
             {form.formState.errors.amount && (
              <p role="alert" className="col-span-4 text-right text-sm text-destructive">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.category && (
              <p role="alert" className="col-span-4 text-right text-sm text-destructive">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
             {form.formState.errors.date && (
              <p role="alert" className="col-span-4 text-right text-sm text-destructive">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
