"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { MobileOverlay } from "@/components/mobile-overlay"

// Sample data for transactions
const transactions = [
  {
    id: "T001",
    date: "2024-05-28",
    type: "Income",
    category: "Milk Sales",
    amount: 875,
    description: "Daily milk collection - Dairy Co-op",
  },
  {
    id: "T002",
    date: "2024-05-28",
    type: "Expense",
    category: "Feed",
    amount: -395,
    description: "Hay and concentrate purchase",
  },
  {
    id: "T003",
    date: "2024-05-27",
    type: "Income",
    category: "Animal Sales",
    amount: 2500,
    description: "Bull calf sale to neighbor farm",
  },
  {
    id: "T004",
    date: "2024-05-26",
    type: "Expense",
    category: "Veterinary",
    amount: -150,
    description: "Vaccination and health check",
  },
  {
    id: "T005",
    date: "2024-05-25",
    type: "Expense",
    category: "Equipment",
    amount: -1200,
    description: "Milking equipment maintenance",
  },
  {
    id: "T006",
    date: "2024-05-24",
    type: "Income",
    category: "Milk Sales",
    amount: 820,
    description: "Daily milk collection - Dairy Co-op",
  },
]

// Sample data for expense breakdown
const expenseBreakdown = [
  { category: "Feed", amount: 8450, percentage: 45, color: "bg-blue-500" },
  { category: "Veterinary", amount: 2200, percentage: 12, color: "bg-red-500" },
  { category: "Labor", amount: 3800, percentage: 20, color: "bg-green-500" },
  { category: "Equipment", amount: 1850, percentage: 10, color: "bg-yellow-500" },
  { category: "Utilities", amount: 1200, percentage: 6, color: "bg-purple-500" },
  { category: "Other", amount: 1300, percentage: 7, color: "bg-gray-500" },
]

export default function FinancialManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
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
    return isNegative ? `-$${absAmount.toLocaleString()}` : `+$${absAmount.toLocaleString()}`
  }

  const totalExpenses = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm lg:text-lg">14</span>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">LivestockPro ERP</h1>
              <p className="text-xs lg:text-sm text-gray-600">Farm Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-xs">
                3
              </span>
            </div>
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs lg:text-sm">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-20 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <nav className="p-4 space-y-2 pt-20 lg:pt-4">
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/livestock"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span>Livestock Inventory</span>
            </Link>
            <Link
              href="/health"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Heart className="w-5 h-5" />
              <span>Health & Vaccination</span>
            </Link>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <TrendingUp className="w-5 h-5" />
              <span>Breeding & Reproduction</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Zap className="w-5 h-5" />
              <span>Production Tracking</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Financial Management</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <TrendingUp className="w-5 h-5" />
              <span>Reports & Analytics</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Settings className="w-5 h-5" />
              <span>Farm Settings</span>
            </div>
          </nav>
        </aside>

        <MobileOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-4 lg:p-6 pt-16 lg:pt-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Financial Management</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Income
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">$12,450</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Monthly Revenue</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">$8,200</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Monthly Expenses</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">$4,250</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Net Profit</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">34%</CardTitle>
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
                    {filteredTransactions.map((transaction) => (
                      <Card key={transaction.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{transaction.category}</h3>
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
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
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
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
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
                          <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2 text-sm">{transaction.date}</td>
                            <td className="py-3 px-2">{getTransactionBadge(transaction.type)}</td>
                            <td className="py-3 px-2 text-sm">{transaction.category}</td>
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
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Breakdown */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenseBreakdown.map((expense) => (
                    <div key={expense.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                        <span className="text-sm font-semibold text-gray-900">${expense.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={expense.percentage} className="flex-1 h-2" />
                        <span className="text-xs text-gray-500 w-8">{expense.percentage}%</span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">Total Expenses:</span>
                      <span className="text-lg font-bold text-red-600">${totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
