"use client"

import { useState } from "react"
import {
  Bell,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Heart,
  Home,
  Plus,
  Search,
  Settings,
  Syringe,
  TrendingUp,
  Trash2,
  Users,
  Zap,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MobileOverlay } from "@/components/mobile-overlay"

// Sample data for vaccinations
const vaccinations = [
  {
    id: "V001",
    animal: "Bella",
    animalId: "COW001",
    vaccine: "FMD Vaccine",
    dueDate: "2024-06-15",
    status: "Due",
  },
  {
    id: "V002",
    animal: "Daisy",
    animalId: "COW002",
    vaccine: "Brucellosis",
    dueDate: "2024-06-10",
    status: "Overdue",
  },
  {
    id: "V003",
    animal: "Thunder",
    animalId: "COW003",
    vaccine: "Anthrax",
    dueDate: "2024-06-20",
    status: "Due",
  },
  {
    id: "V004",
    animal: "Max",
    animalId: "COW004",
    vaccine: "Rabies",
    dueDate: "2024-05-30",
    status: "Complete",
  },
]

// Sample data for health records
const healthRecords = [
  {
    id: "H001",
    animal: "Bella",
    animalId: "COW001",
    type: "Routine Checkup",
    date: "2024-05-28",
    status: "Healthy",
  },
  {
    id: "H002",
    animal: "Luna",
    animalId: "COW003",
    type: "Sick Visit",
    date: "2024-05-26",
    status: "Under Treatment",
  },
  {
    id: "H003",
    animal: "Thunder",
    animalId: "COW002",
    type: "Routine Checkup",
    date: "2024-05-25",
    status: "Healthy",
  },
  {
    id: "H004",
    animal: "Daisy",
    animalId: "COW004",
    type: "Emergency Visit",
    date: "2024-05-24",
    status: "Complete",
  },
]

export default function HealthVaccination() {
  const [vaccinationSearch, setVaccinationSearch] = useState("")
  const [healthSearch, setHealthSearch] = useState("")
  const [vaccinationFilter, setVaccinationFilter] = useState("all")
  const [healthFilter, setHealthFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredVaccinations = vaccinations.filter((vaccination) => {
    const matchesSearch =
      vaccination.animal.toLowerCase().includes(vaccinationSearch.toLowerCase()) ||
      vaccination.vaccine.toLowerCase().includes(vaccinationSearch.toLowerCase())
    const matchesFilter =
      vaccinationFilter === "all" || vaccination.status.toLowerCase() === vaccinationFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const filteredHealthRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.animal.toLowerCase().includes(healthSearch.toLowerCase()) ||
      record.type.toLowerCase().includes(healthSearch.toLowerCase())
    const matchesFilter = healthFilter === "all" || record.status.toLowerCase() === healthFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getVaccinationStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "due":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Due</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      case "complete":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Complete</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getHealthStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
      case "under treatment":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Under Treatment</Badge>
      case "complete":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Complete</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

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

      <div className="flex">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white">
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
          <nav className="p-4 space-y-2">
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
            <div className="flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Health & Vaccination</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <TrendingUp className="w-5 h-5" />
              <span>Breeding & Reproduction</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Zap className="w-5 h-5" />
              <span>Production Tracking</span>
            </div>
            <Link
              href="/financial"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <DollarSign className="w-5 h-5" />
              <span>Financial Management</span>
            </Link>
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
        <main className="flex-1 lg:ml-0 p-4 lg:p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Health & Vaccination</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Vaccination
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Record Health Issue
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">12</CardTitle>
                <Syringe className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Due Vaccinations</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">3</CardTitle>
                <Heart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Sick Animals</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">85</CardTitle>
                <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Healthy Animals</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">96%</CardTitle>
                <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Health Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            {/* Vaccination Schedule */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <CardTitle className="flex items-center">
                    <Syringe className="w-5 h-5 mr-2" />
                    Vaccination Schedule
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search vaccinations..."
                        value={vaccinationSearch}
                        onChange={(e) => setVaccinationSearch(e.target.value)}
                        className="pl-10 w-full sm:w-48"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={vaccinationFilter} onValueChange={setVaccinationFilter}>
                        <SelectTrigger className="w-full sm:w-28">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="due">Due</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Animal</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Vaccine</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Due Date</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Status</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVaccinations.map((vaccination) => (
                          <tr key={vaccination.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2">
                              <div>
                                <div className="font-medium text-sm">{vaccination.animal}</div>
                                <div className="text-xs text-gray-500">{vaccination.animalId}</div>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-sm">{vaccination.vaccine}</td>
                            <td className="py-3 px-2 text-sm">{vaccination.dueDate}</td>
                            <td className="py-3 px-2">{getVaccinationStatusBadge(vaccination.status)}</td>
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
                </div>
              </CardContent>
            </Card>

            {/* Health Records */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Health Records
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search health..."
                        value={healthSearch}
                        onChange={(e) => setHealthSearch(e.target.value)}
                        className="pl-10 w-full sm:w-48"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={healthFilter} onValueChange={setHealthFilter}>
                        <SelectTrigger className="w-full sm:w-28">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="under treatment">Under Treatment</SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Animal</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Type</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Date</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Status</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHealthRecords.map((record) => (
                          <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2">
                              <div>
                                <div className="font-medium text-sm">{record.animal}</div>
                                <div className="text-xs text-gray-500">{record.animalId}</div>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-sm">{record.type}</td>
                            <td className="py-3 px-2 text-sm">{record.date}</td>
                            <td className="py-3 px-2">{getHealthStatusBadge(record.status)}</td>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
