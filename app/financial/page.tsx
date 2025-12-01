"use client";

import React, { useState, useEffect } from "react";
import {
  Edit,
  Eye,
  Search,
  CreditCard,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth-guard";
import ViewTransactionModal from "@/components/Finance/modal/ViewTransactionModal";
import FinancialModal from "@/components/Finance/modal/FinancialModal";
import { GrMoney } from "react-icons/gr";
import { FaPercent } from "react-icons/fa";
import Heading from "@/components/ui/Heading";
import { useLocalization } from "@/context/LocalizationContext";
import SectionHeading from "@/helper/SectionHeading";

export default function FinancialManagement() {
  const { t, setLocale, locale } = useLocalization();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const [summary, setSummary] = useState<any>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/gls/income-expense-service`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          start_record: (page - 1) * pageSize + 1,
          page_size: pageSize,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTransactions(Array.isArray(data.data.list) ? data.data.list : null);
        setSummary(data.data.summary);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  useEffect(() => {
    console.log("calling expense breakdown API");

    // ... your other fetches ...

    // Fetch expense breakdown
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gls/income-expense-breakdown-service/`,
        {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.data.list);
          setExpenseBreakdown(data.data.list);
          setExpenseSummary(data.data.summary ?? null);
        })
        .catch(() => {
          setExpenseBreakdown([]);
          setExpenseSummary(null);
        });
    } catch (error) {
      console.log("Error fetching expense breakdown:", error);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((transaction) => {
        const matchesSearch =
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.txn_head.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
          typeFilter === "all" ||
          transaction.type.toLowerCase() === typeFilter.toLowerCase();
        return matchesSearch && matchesType;
      })
    : [];

  const getTransactionBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "income":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t("income")}
          </Badge>
        );
      case "expense":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {t("expense")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    return isNegative
      ? `-৳${absAmount.toLocaleString()}`
      : `+৳${absAmount.toLocaleString()}`;
  };

  // Expense breakdown is not available from API, so hide that section or show a placeholder

  // Helper to map API transaction to modal format
  const mapTransactionForModal = (transaction: any) => ({
    id: transaction.voucher_no,
    type: transaction.type,
    category: transaction.txn_head,
    amount: transaction.amount,
    date: transaction.date,
    description: transaction.description,
  });

  return (
    <AuthGuard requireAuth={true}>
      <div className="relative pb-10 lg:py-0 ">
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 lg:px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <SectionHeading
              sectionTitle="Financial Management"
              description="Manage your farms finances"
            />
            <div className="hidden lg:flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <FinancialModal type="income" />
              <FinancialModal type="expense" />
            </div>
          </div>

          {/* Breeding and Reproduction btn is here for mobile devices */}
          <Card
            className="block lg:hidden animate__animated animate__fadeInRight border border-green-200 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50
           shadow-none w-full"
            style={{ animationDelay: "0s" }}
          >
            <CardContent className="p-0.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg flex gap-2 items-center">
                  <img
                    src="/Financial.png"
                    alt="cow image"
                    width={80}
                    className="rounded-lg drop-shadow-md scale-150"
                  />
                </div>
                <div className="p-2 w-full">
                  <div className="mb-2">
                    <h1 className="font-bold text-gray-700 text-lg">
                      Add income & expences
                    </h1>
                    <p className="font-medium text-gray-500 text-sm">
                      Click to add details
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Btn for mobile */}
                    <div className="w-[50%]">
                      <FinancialModal type="income" />
                    </div>
                    <div className="w-[50%]">
                      <FinancialModal type="expense" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="mt-6 lg:mt-0 mb-6 lg:mb-8 border lg:border-none rounded-lg lg:rounded-none p-4 lg:p-0 bg-green-50 lg:bg-transparent">
            <Heading heading="Quick Stats" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8">
              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-3xl font-extrabold text-green-600">
                      ৳
                    </span>

                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {summary &&
                      summary["Monthly Revenue"] !== undefined &&
                      summary["Monthly Revenue"] !== null
                        ? `৳${summary["Monthly Revenue"].toLocaleString()}`
                        : "-"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("monthly_revenue")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0.25s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <CreditCard className="w-8 h-8 text-red-600" />

                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {summary &&
                      summary["Monthly Expense"] !== undefined &&
                      summary["Monthly Expense"] !== null
                        ? `৳${summary["Monthly Expense"].toLocaleString()}`
                        : "-"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("monthly_expense")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0.5s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <GrMoney className="w-8 h-8 text-blue-600" />

                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {summary &&
                      summary["Net Profit"] !== undefined &&
                      summary["Net Profit"] !== null
                        ? `৳${summary["Net Profit"].toLocaleString()}`
                        : "-"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("net_profit")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0.75s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="rounded-full flex items-center justify-center">
                      <FaPercent className="w-6 h-6 text-purple-600 font-bold" />
                    </div>

                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {summary &&
                      summary["Profit Margin"] !== undefined &&
                      summary["Profit Margin"] !== null ? (
                        <div>
                          {summary["Profit Margin"]}
                          <small className="text-xs">%</small>
                        </div>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("profit_margin")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Recent Transactions */}
            <div className="xl:col-span-2">
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle className="flex items-center text-lg lg:text-xl">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      {t("recent_transactions")}
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder={t("search_transactions")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-48"
                        />
                      </div>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("all_types")}</SelectItem>
                          <SelectItem value="income">{t("income")}</SelectItem>
                          <SelectItem value="expense">
                            {t("expense")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("loading")}
                      </div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("no_transactions")}
                      </div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <Card key={transaction.voucher_no} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {transaction.txn_head}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {transaction.date}
                              </p>
                            </div>
                            <div className="text-right">
                              {getTransactionBadge(transaction.type)}
                              <p
                                className={`font-bold text-3xl mt-1 ${
                                  transaction.amount > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {transaction.description}
                          </p>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedTransaction(
                                  mapTransactionForModal(transaction)
                                );
                                setViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>

                  {/* Desktop Table View */}
                  <div
                    className="hidden lg:block overflow-x-auto"
                    style={{ maxHeight: 300, overflowY: "auto" }}
                  >
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("loading")}
                      </div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("no_transactions")}
                      </div>
                    ) : (
                      <table className="w-full animate__animated animate__fadeInUp">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("date")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("type")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("category")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("amount")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("description")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransactions.map((transaction) => (
                            <tr
                              key={transaction.voucher_no}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-2 text-sm">
                                {transaction.date}
                              </td>
                              <td className="py-3 px-2">
                                {getTransactionBadge(transaction.type)}
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {transaction.txn_head}
                              </td>
                              <td
                                className={`py-3 px-2 font-semibold text-sm ${
                                  transaction.type === "Income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.type === "Income"
                                  ? formatCurrency(transaction.amount)
                                  : "-" +
                                    formatCurrency(transaction.amount).replace(
                                      "+",
                                      ""
                                    )}
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {transaction.description}
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 border hover:bg-green-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all duration-300 ease-in-out active:scale-90"
                                    onClick={() => {
                                      setSelectedTransaction(
                                        mapTransactionForModal(transaction)
                                      );
                                      setViewModalOpen(true);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  {/* <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button> */}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  {/* Pagination Controls */}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      variant="outline"
                    >
                      {t("previous")}
                    </Button>
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={
                        loading || filteredTransactions.length < pageSize
                      }
                      variant="outline"
                    >
                      {t("next")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Breakdown - hidden or placeholder since not in API */}
            <div>
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-gray-500 text-center py-8">Expense breakdown data not available.</div>
                </CardContent>
              </Card> */}
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <CreditCard className="w-5 h-5 mr-2 text-red-600" />
                    {t("expense_breakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(expenseBreakdown) &&
                    expenseBreakdown.length > 0 ? (
                      expenseBreakdown.map((expense, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {expense.txn_head}
                            </span>
                            <span className="text-sm text-gray-600">
                              {formatCurrency(expense.amount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${expense.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            {expense.percentage}%
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center py-8">
                        {t("no_expense_breakdown")}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {t("total_expenses")}:
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {expenseSummary &&
                        expenseSummary.Total_Expenses !== undefined &&
                        expenseSummary.Total_Expenses !== null
                          ? formatCurrency(expenseSummary.Total_Expenses)
                          : "-"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      {/* Place modal at root of component */}
      <ViewTransactionModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        transaction={selectedTransaction}
      />
    </AuthGuard>
  );
}
