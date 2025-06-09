"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCategories, useCreateExpense } from "@/hooks/queries/use-expenses";
import { toast } from "@/hooks/use-toast";
import { ExpenseCategory } from "@/lib/api/expenses";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  payment_method: z.enum([
    "CASH",
    "CARD",
    "BANK_TRANSFER",
    "MOBILE_BANKING",
    "OTHER",
  ]),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
  receipt: z.any().optional(),
});

export function ExpenseForm() {
  const { data: categories } = useCategories();
  const createExpense = useCreateExpense();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      payment_method: "CASH",
      reference_number: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedCategory = categories?.find(
      (cat: ExpenseCategory) => cat.id.toString() === values.category
    );

    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a valid category",
        variant: "destructive",
      });
      return;
    }

    createExpense.mutate(
      {
        description: values.description,
        amount: parseFloat(values.amount),
        category: parseInt(values.category),
        category_name: selectedCategory.name,
        category_color: selectedCategory.color,
        payment_method: values.payment_method,
        reference_number: values.reference_number || "",
        notes: values.notes || "",
        receipt: values.receipt,
        status: "PENDING",
        date: format(new Date(), "yyyy-MM-dd"),
      },
      {
        onSuccess: () => {
          form.reset();
          toast({
            title: "Success",
            description: "Expense created successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to create expense",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Add New Expense</CardTitle>
            <CardDescription className="text-emerald-100">
              Record a new expense transaction
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter expense description"
                        className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category: ExpenseCategory) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="CARD">Card</SelectItem>
                        <SelectItem value="BANK_TRANSFER">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="MOBILE_BANKING">
                          Mobile Banking
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter reference number"
                        className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes"
                        className="h-24 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-colors resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl h-12"
              disabled={createExpense.isPending}
            >
              {createExpense.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Expense"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
