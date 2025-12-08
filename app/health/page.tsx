"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Edit,
  Eye,
  Filter,
  Heart,
  Plus,
  Search,
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
import { useEffect } from "react";
import { RecordHealthIssueDialog } from "@/components/health/record-health-issue-dialog";
import ViewHealthModal from "@/components/health/viewHealthModalProps";
import Heading from "@/components/ui/Heading";
import HealthRecordUpdateModal from "@/components/health/HealthRecordUpdateModal";
import { GrUpdate } from "react-icons/gr";
import { Toaster } from "sonner";
import { LuPawPrint } from "react-icons/lu";
import { TiWarningOutline } from "react-icons/ti";
import { useLocalization } from "@/context/LocalizationContext";
import SectionHeading from "@/helper/SectionHeading";
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

export default function HealthRecords() {
  const { t, locale, setLocale } = useLocalization();
  const [healthSearch, setHealthSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

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
            <SectionHeading
              sectionTitle="Health Records"
              description="Manage your cattles health records"
            />
            <div className="hidden lg:flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setRecordDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("record_health_issue")}
              </Button>
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
                    src="/Breeding-removebg-preview.png"
                    alt="cow image"
                    width={80}
                    className="rounded-lg drop-shadow-md scale-110"
                  />
                </div>
                <div className="p-2 w-full">
                  <div className="mb-2">
                    <h1 className="font-bold text-gray-700 text-lg">
                      Record health issue
                    </h1>
                    <p className="font-medium text-gray-500 text-sm">
                      Click to add details
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Btn for mobile */}
                    <button
                      className=" bg-emerald-700 rounded-lg py-2 px-2 flex items-center justify-center gap-2 font-semibold text-white lg:hidden w-full"
                      onClick={() => setRecordDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Health
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <RecordHealthIssueDialog
            open={recordDialogOpen}
            onOpenChange={setRecordDialogOpen}
            onSuccess={() => {
              setCurrentPage(1); // Optionally reset to first page
            }}
          />

          {/* Summary Cards */}
          <div className="mt-6 lg:mt-0 mb-6 lg:mb-8 border lg:border-none rounded-lg lg:rounded-none p-4 lg:p-0 bg-green-50 lg:bg-transparent">
            <Heading heading="Quick Stats" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 lg:mb-8">
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
                        <span className="hidden md:inline-block">Total</span>{" "}
                        Animals
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
                      <div className="text-sm text-gray-600">Sick Animals</div>
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
                        Critical{" "}
                        <span className="hidden md:inline-flex">Animals</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {/* Health Records */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle className="flex items-center text-lg lg:text-xl">
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

                      <div className="flex gap-2 z-30">
                        <Select
                          value={healthFilter}
                          onValueChange={setHealthFilter}
                        >
                          <SelectTrigger className="w-full sm:w-28">
                            <SelectValue placeholder={t("all_status")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {t("all_status")}
                            </SelectItem>
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
                  {/* 🌿 MOBILE CARD VIEW */}
                  <div className="lg:hidden space-y-4">
                    {healthRecords.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 italic">
                        No health records found.
                      </div>
                    ) : (
                      healthRecords.map((record) => {
                        // Status bar color mapping
                        let statusColor = "bg-red-500";
                        const st = (record.status_name || "").toLowerCase();

                        if (st === "healthy") statusColor = "bg-green-500";
                        else if (st === "under treatment")
                          statusColor = "bg-yellow-500";
                        else if (st === "complete") statusColor = "bg-blue-500";

                        return (
                          <Card
                            key={record.id}
                            className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 overflow-hidden animate__animated animate__fadeInUp"
                          >
                            {/* Top Status Bar */}
                            <div
                              className={`absolute top-0 left-0 w-full h-1 ${statusColor}`}
                            />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-bold text-lg text-gray-800">
                                  {record.asset_ref_id}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Health Status
                                </p>
                              </div>

                              {/* Using your existing badge method */}
                              <div>
                                {getHealthStatusBadge(record.status_name)}
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Condition
                                </span>
                                <p className="font-medium text-gray-700">
                                  {record.condition_name || "—"}
                                </p>
                              </div>

                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Date
                                </span>
                                <p className="font-medium text-gray-700">
                                  {new Date().toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 border-gray-300 hover:bg-green-500 hover:text-white transition-all"
                                onClick={() => {
                                  setViewRecord(record);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                title="Update health status"
                                className="h-8 w-8 p-0 border-gray-300 hover:bg-blue-500 hover:text-white transition-all"
                                onClick={() => handleHealthRecrodStatus(record)}
                              >
                                <GrUpdate className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>

                  {/* 🌿 DESKTOP TABLE (UNCHANGED) */}
                  <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
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
                                <div className="font-medium text-sm">
                                  {record.asset_ref_id}
                                </div>
                              </td>

                              <td className="py-3 px-2 text-sm">
                                {record.condition_name}
                              </td>

                              <td className="py-3 px-2 text-sm">
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
                                    className="h-7 w-7 p-0 border hover:bg-green-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all"
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
                                    className="h-7 w-7 p-0 border hover:bg-blue-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all"
                                    onClick={() => {
                                      handleHealthRecrodStatus(record);
                                    }}
                                    title="Update health status"
                                  >
                                    <GrUpdate className="h-3 w-3" />
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
          </div>
        </main>
        <Toaster position="top-center" richColors />
      </div>
    </AuthGuard>
  );
}
