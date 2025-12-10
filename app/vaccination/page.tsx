"use client";
import { useState, useEffect } from "react";
import { Calendar, Eye, Filter, Search, Syringe } from "lucide-react";
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
import AuthGuard from "@/components/auth-guard";
import { RecordVaccinationScheduleDialog } from "@/components/health/record-vaccination-schedule-dialog";
import ViewVaccinationModal from "@/components/health/viewVaccinationModalProps";
import Heading from "@/components/ui/Heading";
import SectionHeading from "@/helper/SectionHeading";
import { Toaster } from "sonner";
import { LuPawPrint } from "react-icons/lu";

const page = () => {
  const [vaccinationSearch, setVaccinationSearch] = useState("");
  const [vaccinationFilter, setVaccinationFilter] = useState("all");

  // Vaccination schedule state
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

  const [vaccinationDialogOpen, setVaccinationDialogOpen] = useState(false);

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

  const getVaccinationStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "due":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Due
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Overdue
          </Badge>
        );
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Complete
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex relative pb-10 lg:py-0">
        {" "}
        <main className="flex-1 lg:ml-0 lg:px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <SectionHeading
              sectionTitle="Vaccination Schedule "
              description="Add and manage your farms cattles vaccines"
            />
            <div className="hidden lg:flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setVaccinationDialogOpen(true)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Vaccination
              </Button>
            </div>
          </div>

          {/* Mobile card for scheduling */}
          <Card
            className="block lg:hidden animate__animated animate__fadeInRight border border-blue-200 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50
  shadow-none w-full"
            style={{ animationDelay: "0s" }}
          >
            <CardContent className="p-0.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg flex gap-2 items-center">
                  <img
                    src="/health-vaccination.png"
                    alt="vaccination image"
                    width={80}
                    className="rounded-lg drop-shadow-md scale-110"
                  />
                </div>
                <div className="p-2 w-full">
                  <div className="mb-2">
                    <h1 className="font-bold text-gray-700 text-lg">
                      Schedule Vaccination
                    </h1>
                    <p className="font-medium text-gray-500 text-sm">
                      Click to add vaccination schedule
                    </p>
                  </div>
                  <div className="flex items-center gap-2 *:w-[50%]">
                    {/* Btn for mobile */}
                    <button
                      className="bg-blue-950 rounded-lg py-2 px-2 flex items-center justify-center gap-2 font-semibold text-white lg:hidden"
                      onClick={() => setVaccinationDialogOpen(true)}
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="mt-6 lg:mt-0 mb-6 lg:mb-8 border lg:border-none rounded-lg lg:rounded-none p-4 lg:p-0 bg-blue-50 lg:bg-transparent">
            <Heading heading="Quick Stats" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 lg:mb-8">
              {/* Total Vaccinations */}
              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <LuPawPrint className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-right text-purple-600">
                        {vaccinationSummary.Total}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="hidden md:inline-block">Total</span>{" "}
                        Vaccinations
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Due Vaccinations */}
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
                        <span className="hidden md:inline-block">Due</span>{" "}
                        Vaccines
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <RecordVaccinationScheduleDialog
            open={vaccinationDialogOpen}
            onOpenChange={setVaccinationDialogOpen}
            onSuccess={() => {
              setCurrentVaccinationPage(1); // Optionally refresh or reset page
            }}
          />

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
                  <CardTitle className="flex items-center text-lg lg:text-xl">
                    <Syringe className="w-5 h-5 mr-2 text-blue-600" />
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
                      <Select
                        value={vaccinationFilter}
                        onValueChange={setVaccinationFilter}
                      >
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
                {/* 🌿 MOBILE CARD VIEW */}
                <div className="lg:hidden space-y-4">
                  {filteredVaccinations.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 italic">
                      No vaccinations found.
                    </div>
                  ) : (
                    filteredVaccinations.map((vaccination) => {
                      // Color bar according to your status colors
                      let statusColor = "bg-gray-300";
                      switch (vaccination.status?.toLowerCase()) {
                        case "due":
                          statusColor = "bg-yellow-500";
                          break;
                        case "complete":
                          statusColor = "bg-green-500";
                          break;
                        case "overdue":
                          statusColor = "bg-red-500";
                          break;
                      }

                      return (
                        <Card
                          key={vaccination.id}
                          className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 overflow-hidden animate__animated animate__fadeInUp"
                        >
                          {/* Status Bar */}
                          <div
                            className={`absolute top-0 left-0 w-full h-1 ${statusColor}`}
                          />

                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {vaccination.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Ref ID: {vaccination.reference_id}
                              </p>
                            </div>
                            <span
                              className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${
                                vaccination.status === "Due"
                                  ? "bg-yellow-100 text-yellow-900"
                                  : vaccination.status === "Complete"
                                  ? "bg-green-100 text-green-900"
                                  : "bg-red-100 text-red-900"
                              }`}
                            >
                              {vaccination.status}
                            </span>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-400 uppercase text-xs">
                                Vaccine
                              </span>
                              <p className="font-medium text-gray-700">
                                {vaccination.vaccine_name || "—"}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-xs">
                                Due Date
                              </span>
                              <p className="font-medium text-gray-700">
                                {vaccination.due_date || "—"}
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-green-500 hover:text-white transition-all duration-300"
                              onClick={() => {
                                setSelectedVaccination(vaccination);
                                setIsVaccinationDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>

                {/* 🌿 DESKTOP TABLE VIEW (Unchanged) */}
                <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="w-full animate__animated animate__fadeInUp">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            Name
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            Reference ID
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            Vaccine
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            Status
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            Due Date
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                            Actions
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

                {/* Pagination (Untouched) */}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCurrentVaccinationPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentVaccinationPage === 1}
                  >
                    Prev
                  </Button>
                  <span className="text-sm">
                    Page {currentVaccinationPage} of{" "}
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
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Toaster position="top-center" richColors />
      </div>
    </AuthGuard>
  );
};

export default page;
