"use client"

import { useState, useEffect } from "react"
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
  LogOut,
  PawPrint
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MobileOverlay } from "@/components/mobile-overlay"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { AuthGuard } from "@/components/auth-guard"
import ViewAnimalModal from "@/components/Livestock/ViewAnimalModal"

export default function LivestockInventory() {
  const [animals, setAnimals] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [breedFilter, setBreedFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [Active,setActive] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState<any | null>(null)

  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    setError(null)
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    fetch(`http://127.0.0.1:8000/api/lms/assets-service?start_record=${(page-1)*pageSize+1}&page_size=${pageSize}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        setAnimals(data.data.list)
        setTotal(data.data.summary.Total)
        setActive(data.data.summary.Active)
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false))
  }, [page, pageSize])

  const handleLogout = () => {
    logout()
  }

  const filteredAnimals = animals?.filter((animal) => {
    const matchesSearch =
      animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || animal.current_status?.toLowerCase() === statusFilter.toLowerCase()
    const matchesBreed = breedFilter === "all" || animal.asset_type?.toLowerCase() === breedFilter.toLowerCase()
    const matchesGender = genderFilter === "all" || (animal.gender ? animal.gender.toLowerCase() === genderFilter.toLowerCase() : false)
    return matchesSearch && matchesStatus && matchesBreed && matchesGender
  })

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
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

  // Helper to map animal to modal format
  const mapAnimalForModal = (animal: any) => ({
    id: animal.reference_id,
    name: animal.name,
    breed: animal.asset_type,
    age: animal.age_in_months ? String(animal.age_in_months) : '',
    gender: animal.gender,
    weight: animal.weight_kg ? String(animal.weight_kg) : '',
    status: animal.current_status,
    location: animal.special_mark,
  })

  return (
    <AuthGuard requireAuth={true}>
    
     

        <div className="flex relative">
    



          {/* Main Content */}
          <main className="flex-1 lg:ml-0 px-4">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Livestock Inventory</h2>
              <Button onClick={
                () => {
              router.push("/livestock/add_cow")
                }
              } className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Animal
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg lg:text-xl font-medium text-gray-600">{total}</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xs lg:text-sm text-gray-600">Total Animals</div>
                </CardContent>
              </Card> */}
              <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                {/* <Users className="w-6 h-6 text-green-600" /> */}
                <PawPrint className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{total}</div>
                <div className="text-sm text-gray-600">Total Animals</div>
              </div>
            </div>
          </CardContent>
        </Card>

              {/* You can add more summary cards here if needed */}
            </div>

            {/* Animal Registry */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Animal Registry</CardTitle>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {filteredAnimals.length} of {total} animals
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
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="cow">Cow</SelectItem>
                          {/* Add more asset types as needed */}
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
                {loading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : error ? (
                  <div className="text-center text-red-600 py-10">{error}</div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                      {filteredAnimals.map((animal) => (
                        <Card key={animal.reference_id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{animal.name}</h3>
                              <p className="text-sm text-gray-600">{animal.reference_id}</p>
                            </div>
                            {getStatusBadge(animal.current_status)}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <p className="font-medium">{animal.asset_type}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Age (months):</span>
                              <p className="font-medium">{animal.age_in_months}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Weight (kg):</span>
                              <p className="font-medium">{animal.weight_kg}</p>
                            </div>
                            {/* <div>
                              <span className="text-gray-500">Location:</span>
                              <p className="font-medium">{animal.special_mark}</p>
                            </div> */}
                          </div>
                          <div className="flex items-center justify-end space-x-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setSelectedAnimal(mapAnimalForModal(animal)); setViewModalOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {/* <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto" style={{ maxHeight: 500, overflowY: 'auto' }}>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Age (months)</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Weight (kg)</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                            {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th> */}
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAnimals.map((animal) => (
                            <tr key={animal.reference_id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{animal.reference_id}</td>
                              <td className="py-3 px-4">{animal.name}</td>
                              <td className="py-3 px-4">{animal.asset_type}</td>
                              <td className="py-3 px-4">{animal.age_in_months}</td>
                              <td className="py-3 px-4">{animal.weight_kg}</td>
                              <td className="py-3 px-4">{getStatusBadge(animal.current_status)}</td>
                              {/* <td className="py-3 px-4">{animal.special_mark}</td> */}
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setSelectedAnimal(mapAnimalForModal(animal)); setViewModalOpen(true); }}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {/* <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button> */}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span>
                        Page {page} of {Math.ceil(total / pageSize)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page * pageSize >= total}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
     
      {/* Place modal at root of component */}
      <ViewAnimalModal open={viewModalOpen} onOpenChange={setViewModalOpen} animal={selectedAnimal} />
    </AuthGuard>
  )
}
