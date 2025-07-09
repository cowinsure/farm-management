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
  LogOut,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect } from "react"
import { RecordHealthIssueDialog } from "@/components/health/record-health-issue-dialog"
import { RecordVaccinationScheduleDialog } from "@/components/health/record-vaccination-schedule-dialog"
import VaccinationScheduleDetailsDialog from "@/components/health/VaccinationScheduleDetailsDialog"

// Add type for health record
interface HealthRecord {
  id: number
  remarks: string
  asset_id: number
  symptoms: string
  is_active: boolean
  treatment: string
  created_at: string
  created_by: number
  modified_at: string | null
  modified_by: number | null
  severity_id: number
  status_name: string
  asset_ref_id: string
  condition_id: number
  veterinarian: string
  severity_name: string
  condition_name: string
  treatment_date: string
  current_status_id: number
}

export default function HealthVaccination() {
  const [vaccinationSearch, setVaccinationSearch] = useState("")
  const [healthSearch, setHealthSearch] = useState("")
  const [vaccinationFilter, setVaccinationFilter] = useState("all")
  const [healthFilter, setHealthFilter] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()

  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  // Vaccination schedule state (move above filteredVaccinations)
  const [vaccinationSchedules, setVaccinationSchedules] = useState<any[]>([])
  const [vaccinationSummary, setVaccinationSummary] = useState({ Due: 0, Total: 0 })
  const [selectedVaccination, setSelectedVaccination] = useState<any | null>(null)
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = useState(false)

  // Pagination state for vaccination schedules
  const [currentVaccinationPage, setCurrentVaccinationPage] = useState(1)
  const [vaccinationPageSize] = useState(10)
  const [vaccinationTotal, setVaccinationTotal] = useState(0)
  const [vaccinationDue, setVaccinationDue] = useState(0)

  // Use API-driven vaccinationSchedules for the table
  const filteredVaccinations = vaccinationSchedules.filter((vaccination) => {
    const matchesSearch =
      (vaccination.name?.toLowerCase().includes(vaccinationSearch.toLowerCase()) ||
        vaccination.vaccine_name?.toLowerCase().includes(vaccinationSearch.toLowerCase()))
    const matchesFilter =
      vaccinationFilter === "all" || (vaccination.status?.toLowerCase() === vaccinationFilter.toLowerCase())
    return matchesSearch && matchesFilter
  })

  // Remove static healthRecords and summary values
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [summary, setSummary] = useState({ Total: 0, Critical: 0  , Sick:0 , Due: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)
  const [viewRecord, setViewRecord] = useState<HealthRecord | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [recordDialogOpen, setRecordDialogOpen] = useState(false)
  const [vaccinationDialogOpen, setVaccinationDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchHealthRecords() {
      try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        const res = await fetch(
          `http://127.0.0.1:8000/api/lms/health-record-service/?start_record=${(currentPage - 1) * pageSize + 1}&page_size=${pageSize}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        )
        const data = await res.json()
        if (data.status === "success") {
          setHealthRecords(data.data.list)
          setSummary(data.data.summary)
          setTotalRecords(data.data.summary.Total)
        }
      } catch (e) {
        // handle error
      }
    }
    fetchHealthRecords()
  }, [currentPage, pageSize])

  useEffect(() => {
    async function fetchVaccinationSchedules() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        const start_record = (currentVaccinationPage - 1) * vaccinationPageSize + 1;
        const res = await fetch(`http://127.0.0.1:8000/api/lms/vaccination-schedule-service?start_record=${start_record}&page_size=${vaccinationPageSize}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          })
        const data = await res.json()
        if (data.status === "success") {
          setVaccinationSchedules(data.data.list)
          setVaccinationSummary(data.data.summary)
          setVaccinationTotal(data.data.summary.Total)
          setVaccinationDue(data.data.summary.Due)
        }
      } catch (e) {
        // handle error
      }
    }
    fetchVaccinationSchedules()
  }, [currentVaccinationPage, vaccinationPageSize])

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
    <AuthGuard requireAuth={true}>
   

        <div className="flex">



          {/* Main Content */}
          <main className="flex-1 lg:ml-0 p-4 lg:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Health & Vaccination</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setVaccinationDialogOpen(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Vaccination
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => setRecordDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Health Issue
                </Button>
              </div>
            </div>
            <RecordVaccinationScheduleDialog
              open={vaccinationDialogOpen}
              onOpenChange={setVaccinationDialogOpen}
              onSuccess={() => {
                setCurrentPage(1); // Optionally refresh or reset page
              }}
            />
            <RecordHealthIssueDialog
              open={recordDialogOpen}
              onOpenChange={setRecordDialogOpen}
              onSuccess={() => {
                setCurrentPage(1); // Optionally reset to first page
              }}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{vaccinationDue}</CardTitle>
                  <Syringe className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">Due Vaccinations</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{summary.Sick}</CardTitle>
                  <Heart className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">Sick Animals</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{summary.Critical}</CardTitle>
                  <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">Critical Animals</div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">85</CardTitle>
                  <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">Healthy Animals</div>
                </CardContent>
              </Card> */}

              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {summary.Total > 0 ? `${Math.round(((summary.Total - summary.Critical) / summary.Total) * 100)}%` : "0%"}
                  </CardTitle>
                  <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">Health Rate</div>
                </CardContent>
              </Card> */}
            </div>

            {/* Vaccination Schedule (API-driven) Table */}
          
            <VaccinationScheduleDetailsDialog
              open={isVaccinationDialogOpen}
              onOpenChange={setIsVaccinationDialogOpen}
              record={selectedVaccination}
            />

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
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Name</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Reference ID</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Vaccine</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Status</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Due Date</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVaccinations.map((vaccination) => (
                          <tr key={vaccination.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2">{vaccination.name}</td>
                            <td className="py-3 px-2">{vaccination.reference_id}</td>
                            <td className="py-3 px-2">{vaccination.vaccine_name}</td>
                            <td className="py-3 px-2">{vaccination.status}</td>
                            <td className="py-3 px-2">{vaccination.due_date || '-'}</td>
                            <td className="py-3 px-2">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setSelectedVaccination(vaccination); setIsVaccinationDialogOpen(true); }}>
                                <Eye className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Pagination Controls for Vaccination Schedule */}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => setCurrentVaccinationPage((p) => Math.max(1, p - 1))} disabled={currentVaccinationPage === 1}>
                    Prev
                  </Button>
                  <span className="text-sm">Page {currentVaccinationPage} of {Math.ceil(vaccinationTotal / vaccinationPageSize) || 1}</span>
                  <Button size="sm" variant="outline" onClick={() => setCurrentVaccinationPage((p) => p + 1)} disabled={currentVaccinationPage * vaccinationPageSize >= vaccinationTotal}>
                    Next
                  </Button>
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
                          {healthRecords.map((record) => (
                            <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-2">
                                <div>
                                  <div className="font-medium text-sm">{record.asset_ref_id}</div>
                                  <div className="text-xs text-gray-500">{record.asset_id}</div>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-sm">{record.condition_name}</td>
                              <td className="py-3 px-2 text-sm">{record.treatment_date || record.created_at}</td>
                              <td className="py-3 px-2">{getHealthStatusBadge(record.status_name)}</td>
                              <td className="py-3 px-2">
                                <div className="flex items-center space-x-1">
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setViewRecord(record); setIsDialogOpen(true); }}>
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600 hover:text-red-700">
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
                    {/* Pagination Controls */}
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Prev
              </Button>
              <span className="text-sm">Page {currentPage} of {Math.ceil(totalRecords / pageSize) || 1}</span>
              <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage * pageSize >= totalRecords}>
                Next
              </Button>
            </div>
                </CardContent>
              </Card>
            </div>
          
            {/* View Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Health Record Details</DialogTitle>
                </DialogHeader>
                {viewRecord && (
                  <div className="space-y-2 text-sm">
                    <div><b>Animal Ref:</b> {viewRecord.asset_ref_id}</div>
                    <div><b>Animal ID:</b> {viewRecord.asset_id}</div>
                    <div><b>Condition:</b> {viewRecord.condition_name}</div>
                    <div><b>Severity:</b> {viewRecord.severity_name}</div>
                    <div><b>Status:</b> {viewRecord.status_name}</div>
                    <div><b>Symptoms:</b> {viewRecord.symptoms}</div>
                    <div><b>Treatment:</b> {viewRecord.treatment}</div>
                    <div><b>Veterinarian:</b> {viewRecord.veterinarian}</div>
                    <div><b>Remarks:</b> {viewRecord.remarks}</div>
                    <div><b>Treatment Date:</b> {viewRecord.treatment_date}</div>
                    <div><b>Created At:</b> {viewRecord.created_at}</div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </main>
        </div>
   
    </AuthGuard>
  )
}
