"use client";

import { useState } from "react";
import {
  Calendar,
  Edit,
  Eye,
  Filter,
  Heart,
  Plus,
  Search,
  Syringe,
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
import Link from "next/link";
import { MobileOverlay } from "@/components/mobile-overlay";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth-guard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { RecordHealthIssueDialog } from "@/components/health/record-health-issue-dialog";
import { RecordVaccinationScheduleDialog } from "@/components/health/record-vaccination-schedule-dialog";
import ViewVaccinationModal from "@/components/health/viewVaccinationModalProps";
import ViewHealthModal from "@/components/health/viewHealthModalProps";
import Heading from "@/components/ui/Heading";
import HealthRecordUpdateModal from "@/components/health/HealthRecordUpdateModal";
import { GrUpdate } from "react-icons/gr";
import { Toaster } from "sonner";
import { LuPawPrint } from "react-icons/lu";
import { TiWarningOutline } from "react-icons/ti";
import { useLocalization } from "@/context/LocalizationContext";
// Add type for health record
export interface HealthRecord {
  id: number;
  remarks: string;
  asset_id: number;
  symptoms: string;
  is_active: boolean;
  treatment: string;
  created_at: string;
  created_by: number;
  modified_at: string | null;
  modified_by: number | null;
  severity_id: number;
  status_name: string;
  asset_ref_id: string;
  condition_id: number;
  veterinarian: string;
  severity_name: string;
  condition_name: string;
  treatment_date: string;
  current_status_id: number;
}

// export interface HealthStatusChangeData {
//   id: number;
//   asset_ref_id: string;
//   status_name: string;
//   current_status_id: number;
//   remarks: string;
// }

export default function HealthVaccination() {
  const { t, locale, setLocale } = useLocalization();
  const [vaccinationSearch, setVaccinationSearch] = useState("");
  const [healthSearch, setHealthSearch] = useState("");
  const [vaccinationFilter, setVaccinationFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  // Vaccination schedule state (move above filteredVaccinations)
  const [vaccinationSchedules, setVaccinationSchedules] = useState<any[]>([]);
  const [vaccinationSummary, setVaccinationSummary] = useState({
    Due: 0,
    Total: 0,
  });
  const [selectedVaccination, setSelectedVaccination] = useState<any | null>(
    null
  );
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = useState(false);

  // Pagination state for vaccination schedules
  const [currentVaccinationPage, setCurrentVaccinationPage] = useState(1);
  const [vaccinationPageSize] = useState(10);
  const [vaccinationTotal, setVaccinationTotal] = useState(0);
  const [vaccinationDue, setVaccinationDue] = useState(0);

  // Use API-driven vaccinationSchedules for the table
  const filteredVaccinations = vaccinationSchedules.filter((vaccination) => {
    const matchesSearch =
      vaccination.name
        ?.toLowerCase()
        .includes(vaccinationSearch.toLowerCase()) ||
      vaccination.vaccine_name
        ?.toLowerCase()
        .includes(vaccinationSearch.toLowerCase());
    const matchesFilter =
      vaccinationFilter === "all" ||
      vaccination.status?.toLowerCase() === vaccinationFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Remove static healthRecords and summary values
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [summary, setSummary] = useState({
    Total: 0,
    Critical: 0,
    Sick: 0,
    Due: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewRecord, setViewRecord] = useState<HealthRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [vaccinationDialogOpen, setVaccinationDialogOpen] = useState(false);
  const [isHealthRecordModal, setIsHealthRecordModal] = useState(false);
  const [selectedRecordData, setSelectedRecordData] = useState<
    HealthRecord | undefined
  >(undefined);

  useEffect(() => {
    async function fetchHealthRecords() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/lms/health-record-service/?start_record=${
            (currentPage - 1) * pageSize + 1
          }&page_size=${pageSize}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          // console.log(data.data.summary);

          setHealthRecords(data.data.list);
          setSummary(data.data.summary);
          setTotalRecords(data.data.summary.Total);
        }
      } catch (e) {
        // handle error
      }
    }
    fetchHealthRecords();
  }, [currentPage, pageSize, isHealthRecordModal]);

  useEffect(() => {
    async function fetchVaccinationSchedules() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;
        const start_record =
          (currentVaccinationPage - 1) * vaccinationPageSize + 1;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/vaccination-schedule-service?start_record=${start_record}&page_size=${vaccinationPageSize}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setVaccinationSchedules(data.data.list);
          setVaccinationSummary(data.data.summary);
          setVaccinationTotal(data.data.summary.Total);
          setVaccinationDue(data.data.summary.Due);
        }
      } catch (e) {
        // handle error
      }
    }
    fetchVaccinationSchedules();
  }, [currentVaccinationPage, vaccinationPageSize]);

  const getVaccinationStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "due":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {t("due")}
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {t("overdue")}
          </Badge>
        );
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t("complete")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getHealthStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t("healthy")}
          </Badge>
        );
      case "under treatment":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            {t("under_treatment")}
          </Badge>
        );
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t("complete")}
          </Badge>
        );
      case "sick":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {t("sick")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleHealthRecrodStatus = (record: HealthRecord) => {
    setSelectedRecordData(record);
    setIsHealthRecordModal(true);
  };

  const handleUpdate = (updatedRecord: HealthRecord) => {
    console.log(updatedRecord);
    setHealthRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === updatedRecord.id
          ? { ...record, ...updatedRecord } // <-- merge in case structure differs
          : record
      )
    );
  };

  console.log(summary);
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex relative pb-10 lg:py-0">
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 lg:px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Heading heading="Health & Vaccination" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setVaccinationDialogOpen(true)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t("schedule_vaccination")}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setRecordDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("record_health_issue")}
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
            {/* Total animals */}
            <Card
              className="animate__animated animate__fadeInRight"
              style={{ animationDelay: "0s" }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-2">
                  <LuPawPrint className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-right text-purple-600">
                      {summary.Total}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("total_animals")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Due Vaccination */}
            <Card
              className="animate__animated animate__fadeInRight"
              style={{ animationDelay: "0s" }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-2">
                  <Syringe className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-right text-blue-600">
                      {vaccinationDue}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("due_vaccinations")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Sick animals */}
            <Card
              className="animate__animated animate__fadeInRight"
              style={{ animationDelay: "0.25s" }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-2">
                  <Heart className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-right text-red-600">
                      {summary.Sick > 0 ? summary.Sick : 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("sick_animals")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Critical Animals */}
            <Card
              className="animate__animated animate__fadeInRight"
              style={{ animationDelay: "0.25s" }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-2">
                  <TiWarningOutline className="w-8 h-8 text-amber-600" />
                  <div>
                    <div className="text-2xl font-bold text-right text-amber-600">
                      {summary.Critical > 0 ? summary.Critical : 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("critical_animals")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TriangleAlert className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{summary.Critical}</div>
                <div className="text-sm text-gray-600">Critical Animals</div>
              </div>
            </div>
          </CardContent>
        </Card> */}

            {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{summary.Critical}</CardTitle>
                  <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">Critical Animals</div>
                </CardContent>
              </Card> */}

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

          <ViewVaccinationModal
            open={isVaccinationDialogOpen}
            onOpenChange={setIsVaccinationDialogOpen}
            schedule={
              selectedVaccination
                ? {
                    id: selectedVaccination.id,
                    animalId: selectedVaccination.reference_id,
                    animalName: selectedVaccination.name,
                    vaccine: selectedVaccination.vaccine_name,
                    dueDate: selectedVaccination.due_date,
                    status: selectedVaccination.status,
                    notes: selectedVaccination.remarks || undefined,
                  }
                : null
            }
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {/* Vaccination Schedule */}
            <Card className="animate__animated animate__fadeIn">
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <CardTitle className="flex items-center">
                    <Syringe className="w-5 h-5 mr-2 text-blue-600" />
                    {t("vaccination_schedule")}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder={t("search_vaccination_schedule")}
                        value={vaccinationSearch}
                        onChange={(e) => setVaccinationSearch(e.target.value)}
                        className="pl-10 w-full sm:w-48"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={vaccinationFilter}
                        onValueChange={setVaccinationFilter}
                      >
                        <SelectTrigger className="w-full sm:w-28">
                          <SelectValue placeholder={t("all_status")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("all_status")}</SelectItem>
                          <SelectItem value="due">{t("due")}</SelectItem>
                          <SelectItem value="overdue">
                            {t("overdue")}
                          </SelectItem>
                          <SelectItem value="complete">
                            {t("complete")}
                          </SelectItem>
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
                    <table className="w-full animate__animated animate__fadeInUp">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("name")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("reference_id")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("vaccine")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("status")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("due_date")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVaccinations.map((vaccination) => (
                          <tr
                            key={vaccination.id}
                            className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                          >
                            <td className="py-3 px-2">{vaccination.name}</td>
                            <td className="py-3 px-2">
                              {vaccination.reference_id}
                            </td>
                            <td className="py-3 px-2">
                              {vaccination.vaccine_name}
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-flex items-center justify-center font-semibold rounded-full text-sm px-3 py-1 ${
                                  vaccination.status === "Due"
                                    ? "bg-yellow-100 text-yellow-900"
                                    : vaccination.status === "Complete"
                                    ? "bg-green-100 text-green-900"
                                    : "bg-red-100 text-red-900"
                                }`}
                              >
                                {vaccination.status}
                              </span>
                            </td>

                            <td className="py-3 px-2">
                              {vaccination.due_date || "-"}
                            </td>
                            <td className="py-3 px-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 border hover:bg-green-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all duration-300 ease-in-out active:scale-90"
                                onClick={() => {
                                  setSelectedVaccination(vaccination);
                                  setIsVaccinationDialogOpen(true);
                                }}
                              >
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCurrentVaccinationPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentVaccinationPage === 1}
                  >
                    {t("previous")}
                  </Button>
                  <span className="text-sm">
                    {t("page")} {currentVaccinationPage} {t("of")}{" "}
                    {Math.ceil(vaccinationTotal / vaccinationPageSize) || 1}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentVaccinationPage((p) => p + 1)}
                    disabled={
                      currentVaccinationPage * vaccinationPageSize >=
                      vaccinationTotal
                    }
                  >
                    {t("next")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Health Records */}
            <Card
            // className="animate__animated animate__fadeIn"
            // style={{ animationDelay: "0.5s" }}
            >
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    {t("health_records")}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder={t("search_health_records")}
                        value={healthSearch}
                        onChange={(e) => setHealthSearch(e.target.value)}
                        className="pl-10 w-full sm:w-48"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={healthFilter}
                        onValueChange={setHealthFilter}
                      >
                        <SelectTrigger className="w-full sm:w-28">
                          <SelectValue placeholder={t("all_status")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("all_status")}</SelectItem>
                          <SelectItem value="healthy">
                            {t("healthy")}
                          </SelectItem>
                          <SelectItem value={t("under_treatment")}>
                            {t("under_treatment")}
                          </SelectItem>
                          <SelectItem value="complete">
                            {t("complete")}
                          </SelectItem>
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
                    <table className="w-full animate__animated animate__fadeInUp">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("reference_id")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("type")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("date")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("status")}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            {t("actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {healthRecords.map((record) => (
                          <tr
                            key={record.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-2">
                              <div>
                                <div className="font-medium text-sm">
                                  {record.asset_ref_id}
                                </div>
                                {/* <div className="text-xs text-gray-500">
                                  {record.asset_id}
                                </div> */}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {record.condition_name}
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {/* {record.treatment_date} */}
                              {new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="py-3 px-2">
                              {getHealthStatusBadge(record.status_name)}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 border hover:bg-green-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all duration-300 ease-in-out active:scale-90"
                                  onClick={() => {
                                    setViewRecord(record);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 border hover:bg-blue-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all duration-300 ease-in-out active:scale-90"
                                  onClick={() => {
                                    handleHealthRecrodStatus(record);
                                  }}
                                  title="Update health status"
                                >
                                  <GrUpdate className="h-3 w-3" />
                                </Button>
                                {/* <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3" />
                                  </Button> */}
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    {t("previous")}
                  </Button>
                  <span className="text-sm">
                    {t("page")} {currentPage} {t("of")}{" "}
                    {Math.ceil(totalRecords / pageSize) || 1}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage * pageSize >= totalRecords}
                  >
                    {t("next")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Dialog */}
          <ViewHealthModal
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            record={
              viewRecord
                ? {
                    id: String(viewRecord.id),
                    animalId: String(viewRecord.asset_id),
                    animalName: viewRecord.asset_ref_id,
                    checkupType: viewRecord.condition_name,
                    date: viewRecord.treatment_date || viewRecord.created_at,
                    status: viewRecord.status_name,
                    notes: viewRecord.remarks || undefined,
                  }
                : null
            }
          />
          {isHealthRecordModal && (
            <HealthRecordUpdateModal
              closeModal={() => setIsHealthRecordModal(false)}
              data={selectedRecordData}
              onUpdate={handleUpdate}
            />
          )}
        </main>
        <Toaster position="top-center" richColors />
      </div>
    </AuthGuard>
  );
}
