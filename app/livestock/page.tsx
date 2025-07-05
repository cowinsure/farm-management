"use client"

import { useState } from "react"
import {
  Bell,
  Edit,
  Eye,
  Heart,
  Home,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  Users,
  DollarSign,
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

// Sample data for animals
const animals = [
  {
    id: "COW001",
    name: "Bella",
    breed: "Holstein",
    age: "3 years",
    weight: "650 kg",
    status: "Active",
    location: "Pen A1",
  },
  {
    id: "COW002",
    name: "Thunder",
    breed: "Angus",
    age: "5 years",
    weight: "800 kg",
    status: "Active",
    location: "Pen B2",
  },
  {
    id: "COW003",
    name: "Daisy",
    breed: "Jersey",
    age: "2 years",
    weight: "450 kg",
    status: "Sick",
    location: "Isolation",
  },
  {
    id: "COW004",
    name: "Max",
    breed: "Holstein",
    age: "4 years",
    weight: "720 kg",
    status: "Active",
    location: "Pen A2",
  },
  {
    id: "COW005",
    name: "Luna",
    breed: "Jersey",
    age: "1 year",
    weight: "380 kg",
    status: "Quarantine",
    location: "Quarantine Block",
  },
]

export default function LivestockInventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [breedFilter, setBreedFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || animal.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesBreed = breedFilter === "all" || animal.breed.toLowerCase() === breedFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesBreed
  })

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "sick":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Sick</Badge>
      case "quarantine":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Quarantine</Badge>
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
            <div className="flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
              <Users className="w-5 h-5" />
              <span className="font-medium">Livestock Inventory</span>
            </div>
            <Link
              href="/health"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
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
        <main className="flex-1 lg:ml-0 p-4 lg:p-6 pt-16 lg:pt-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Livestock Inventory</h2>
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Animal
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">247</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Total Animals</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">232</CardTitle>
                <Heart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Active</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">8</CardTitle>
                <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Sick</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">7</CardTitle>
                <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs lg:text-sm text-gray-600">Quarantine</div>
              </CardContent>
            </Card>
          </div>

          {/* Animal Registry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Animal Registry</CardTitle>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredAnimals.length} of {animals.length} animals
                </p>

                {/* Search and Filters */}
                <div className="w-full lg:w-auto space-y-3 lg:space-y-0">
                  {/* Search Bar */}
                  <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search animals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>

                  {/* Filter Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex gap-2 lg:gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full lg:w-32">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={breedFilter} onValueChange={setBreedFilter}>
                      <SelectTrigger className="w-full lg:w-32">
                        <SelectValue placeholder="All Breeds" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Breeds</SelectItem>
                        <SelectItem value="holstein">Holstein</SelectItem>
                        <SelectItem value="angus">Angus</SelectItem>
                        <SelectItem value="jersey">Jersey</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger className="w-full lg:w-32">
                        <SelectValue placeholder="All Genders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredAnimals.map((animal) => (
                  <Card key={animal.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{animal.name}</h3>
                        <p className="text-sm text-gray-600">{animal.id}</p>
                      </div>
                      {getStatusBadge(animal.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Breed:</span>
                        <p className="font-medium">{animal.breed}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Age:</span>
                        <p className="font-medium">{animal.age}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <p className="font-medium">{animal.weight}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium">{animal.location}</p>
                      </div>
                    </div>
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
                      <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Breed</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Age</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Weight</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnimals.map((animal) => (
                      <tr key={animal.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{animal.id}</td>
                        <td className="py-3 px-4">{animal.name}</td>
                        <td className="py-3 px-4">{animal.breed}</td>
                        <td className="py-3 px-4">{animal.age}</td>
                        <td className="py-3 px-4">{animal.weight}</td>
                        <td className="py-3 px-4">{getStatusBadge(animal.status)}</td>
                        <td className="py-3 px-4">{animal.location}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
