"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  DollarSign,
  Edit,
  Eye,
  Heart,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  Trash2,
  Users,
  Zap,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { MobileOverlay } from "@/components/mobile-overlay"
import { useAuth } from "@/hooks/useAuth"
import { AuthGuard } from "@/components/auth-guard"
import ViewTransactionModal from "@/components/Finance/modal/ViewTransactionModal"
import FinancialModal from "@/components/Finance/modal/FinancialModal"

export default function FinancialManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [transactions, setTransactions] = useState<any[]>([])
  const [summary, setSummary] = useState<any>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([])
  const [expenseSummary, setExpenseSummary] = useState<any>({})

  useEffect(() => {
    setLoading(true)
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    fetch(`http://127.0.0.1:8000/api/gls/income-expense-service`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        start_record: (page - 1) * pageSize + 1,
        page_size: pageSize,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.data.list)
        
        setSummary(data.data.summary)
      })
      .finally(() => setLoading(false))
  }, [page, pageSize])

  useEffect(() => {
    console.log("calling expense breakdown API");
    
    // ... your other fetches ...

    // Fetch expense breakdown
    try {
       const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    fetch("http://127.0.0.1:8000/api/gls/income-expense-breakdown-service/", {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
     
    })
      .then((res) => res.json()
   
    
    )
      .then((data) => {
        console.log(data.data.list);
        setExpenseBreakdown(data.data.list)
        
        setExpenseSummary(data.data.summary)
      })
      .catch(() => {
        setExpenseBreakdown([])
        setExpenseSummary({})
      })
    } catch (error) {
      console.log("Error fetching expense breakdown:", error);
      
    }
   
  }, [])

  const handleLogout = () => {
    logout()
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.txn_head.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type.toLowerCase() === typeFilter.toLowerCase()
    return matchesSearch && matchesType
  })

  const getTransactionBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "income":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Income</Badge>
      case "expense":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expense</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0
    const absAmount = Math.abs(amount)
    return isNegative ? `-৳${absAmount.toLocaleString()}` : `+৳${absAmount.toLocaleString()}`
  }

  // Expense breakdown is not available from API, so hide that section or show a placeholder

  // Helper to map API transaction to modal format
  const mapTransactionForModal = (transaction: any) => ({
    id: transaction.voucher_no,
    type: transaction.type,
    category: transaction.txn_head,
    amount: transaction.amount,
    date: transaction.date,
    description: transaction.description,
  })

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 px-4 ">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Financial Management</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <FinancialModal type="income" />
              <FinancialModal type="expense" />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">
                  {summary["Monthly Revenue"] !== undefined ? `৳${summary["Monthly Revenue"].toLocaleString()}` : "-"}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Monthly Revenue</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">
                  {summary["Monthly Expense"] !== undefined ? `৳${summary["Monthly Expense"].toLocaleString()}` : "-"}
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Monthly Expenses</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">
                  {summary["Net Profit"] !== undefined ? `৳${summary["Net Profit"].toLocaleString()}` : "-"}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Net Profit</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">
                  {summary["Profit Margin"] !== undefined ? `${summary["Profit Margin"]}%` : "-"}
                </CardTitle>
                <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Profit Margin</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Recent Transactions */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Recent Transactions
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search transactions..."
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
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No transactions found.</div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <Card key={transaction.voucher_no} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{transaction.txn_head}</h3>
                              <p className="text-sm text-gray-600">{transaction.date}</p>
                            </div>
                            <div className="text-right">
                              {getTransactionBadge(transaction.type)}
                              <p
                                className={`font-bold text-lg mt-1 ${
                                  transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{transaction.description}</p>
                          <div className="flex items-center justify-end space-x-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setSelectedTransaction(mapTransactionForModal(transaction)); setViewModalOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No transactions found.</div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Date</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Type</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Category</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Amount</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Description</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransactions.map((transaction) => (
                            <tr key={transaction.voucher_no} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-2 text-sm">{transaction.date}</td>
                              <td className="py-3 px-2">{getTransactionBadge(transaction.type)}</td>
                              <td className="py-3 px-2 text-sm">{transaction.txn_head}</td>
                              <td
                                className={`py-3 px-2 font-semibold text-sm ${
                                  transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {formatCurrency(transaction.amount)}
                              </td>
                              <td className="py-3 px-2 text-sm">{transaction.description}</td>
                              <td className="py-3 px-2">
                                <div className="flex items-center space-x-1">
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setSelectedTransaction(mapTransactionForModal(transaction)); setViewModalOpen(true); }}>
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
                    <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading} variant="outline">
                      Previous
                    </Button>
                    <Button onClick={() => setPage((p) => p + 1)} disabled={loading || filteredTransactions.length < pageSize} variant="outline">
                      Next
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
               <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseBreakdown.map((expense, index) => (
                
                <div key={index} className="space-y-2">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{expense.txn_head}</span>
                    <span className="text-sm text-gray-600">${expense.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${expense.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">{expense.percentage}%</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Expenses:</span>
                <span className="text-lg font-bold text-red-600">{expenseSummary.Total_Expenses}</span>
              </div>
            </div>
          </CardContent>
        </Card>
              
            </div>
          </div>
        </main>
      </div>
      {/* Place modal at root of component */}
      <ViewTransactionModal open={viewModalOpen} onOpenChange={setViewModalOpen} transaction={selectedTransaction} />
    </AuthGuard>
  )
}
