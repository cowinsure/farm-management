"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Heart,
  Plus,
  Search,
  PawPrint,
  AlertTriangle,
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
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth-guard";
import ViewAnimalModal from "@/components/Livestock/ViewAnimalModal";
import Heading from "@/components/ui/Heading";
import SectionHeading from "@/helper/SectionHeading";
import { MobileOverlay } from "@/components/mobile-overlay";
import { MobileOverlayPro } from "@/components/MobileOverlayPro";

export default function LivestockInventory() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [breedFilter, setBreedFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [sick, setSick] = useState(0);
  const [quarantine, setQuarantine] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<any | null>(null);

  const router = useRouter();

  useEffect(() => {
    console.log("Page:", page, "PageSize:", pageSize);
    setLoading(true);
    setError(null);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    console.log("Access token:", token);
    // Calculate start_record for 1-based pagination: 1, 11, 21, ...
    const startRecord = (page - 1) * pageSize + 1;
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/assets-service?start_record=${startRecord}&page_size=${pageSize}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    )
      .then(async (res: Response) => {
        if (!res.ok) {
          const text = await res.text();
          console.log(text);
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: any) => {
        console.log("Fetched data:", data);
        setAnimals(data.data.list);
        const newTotal =
          typeof data.data.summary.Total === "number"
            ? data.data.summary.Total
            : 0;
        setTotal(newTotal);
        setActive(data.data.summary.Active);
        setSick(data.data.summary.Sick);
        setQuarantine(data.data.summary.Quarantine);
        // If the current page is now out of range, reset to last valid page
        const lastPage =
          pageSize > 0 ? Math.max(1, Math.ceil(newTotal / pageSize)) : 1;
        if (page > lastPage) setPage(lastPage);
      })
      .catch((err: any) => {
        setError("Failed to fetch data: " + err.message);
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  const handleLogout = () => {
    logout();
  };

  const filteredAnimals = (Array.isArray(animals) ? animals : []).filter(
    (animal) => {
      const matchesSearch =
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.reference_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        animal.current_status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesBreed =
        breedFilter === "all" ||
        animal.asset_type?.toLowerCase() === breedFilter.toLowerCase();
      const matchesGender =
        genderFilter === "all" ||
        (animal.gender
          ? animal.gender.toLowerCase() === genderFilter.toLowerCase()
          : false);
      return matchesSearch && matchesStatus && matchesBreed && matchesGender;
    }
  );

  console.log(filteredAnimals);
  console.log(selectedAnimal);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "sick":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Sick
          </Badge>
        );
      case "quarantine":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Quarantine
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Helper to map animal to modal format
  const mapAnimalForModal = (animal: any) => ({
    id: animal.reference_id,
    name: animal.name,
    breed: animal.asset_type,
    age: animal.age_in_months ? String(animal.age_in_months) : "",
    gender: animal.gender,
    weight: animal.weight_kg ? String(animal.weight_kg) : "",
    status: animal.current_status,
    location: animal.special_mark,
  });

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex relative pb-10 lg:py-0">
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 lg:px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <SectionHeading
              sectionTitle="Livestock Inventory"
              description="Add and manage your cattles"
            />
            <Button
              onClick={() => {
                router.push("/livestock/add_cow");
              }}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto hidden lg:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Animal
            </Button>
          </div>

          {/* Register cow btn is here for mobile devices */}
          <Card
            className="block lg:hidden animate__animated animate__fadeInRight border border-green-200 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50
  mb-5 shadow-none"
            style={{ animationDelay: "0s" }}
          >
            <CardContent className="p-0.5">
              <div className="flex items-center justify-between space-x-3">
                <div className="p-1 rounded-lg flex gap-2 items-center">
                  <img
                    src="/placeholder-removebg.png"
                    alt="cow image"
                    width={70}
                    className="rounded-lg drop-shadow-md"
                  />
                  <div>
                    <h1 className="font-bold text-gray-700 text-lg">
                      Register cow
                    </h1>
                    <p className="font-medium text-gray-500 text-sm">
                      Click to add new cow
                    </p>
                  </div>
                </div>
                <div>
                  <div className="pr-2">
                    {/* Btn for mobile */}
                    <button
                      onClick={() => {
                        router.push("/livestock/add_cow");
                      }}
                      className="bg-green-950 rounded-lg py-2 px-2 flex items-center gap-1 font-semibold text-white lg:hidden"
                    >
                      <Plus className="w-5 h-5" />
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="mt-6 lg:mt-0 mb-6 lg:mb-8 border lg:border-none rounded-lg lg:rounded-none p-4 lg:p-0 bg-green-50 lg:bg-transparent">
            <Heading heading="Quick Stats" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 lg:mb-8">
              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-3">
                    <div className="p-2 rounded-lg">
                      {/* <Users className="w-6 h-6 text-green-600" /> */}
                      <PawPrint className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-right text-green-600">
                        {total}
                      </div>
                      <div className="text-sm text-gray-600">Total Animals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0.25s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-3">
                    <div className="p-2 rounded-lg">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-right text-blue-600">
                        {active}
                      </div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="animate__animated animate__fadeInRight col-span-2 lg:col-span-1"
                style={{ animationDelay: "0.5s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-3">
                    <div className="p-2 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-right text-red-600">
                        {sick}
                      </div>
                      <div className="text-sm text-gray-600">Sick</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Animal Registry */}
          <Card className="animate__animated animate__fadeIn">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">
                Animal Registry
              </CardTitle>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex justify-between w-full">
                  <p className="text-sm text-gray-600">
                    Showing {filteredAnimals ? filteredAnimals.length : 0} of{" "}
                    {total} animals
                  </p>

                  {/* Filter btn for mobile devices */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex lg:hidden items-center justify-center gap-2 px-3 py-2 border rounded-lg text-gray-700 bg-white shadow-sm active:scale-95 transition -mt-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 4h18M6 10h12M9 16h6"
                      />
                    </svg>
                    <span className="text-sm font-medium">Filter</span>
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="w-full lg:w-auto space-y-3 xl:space-y-0 xl:flex gap-3">
                  {/* Search Bar */}
                  <div className="relative w-full xl:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search animals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  {/* Filter Controls (desktop only) */}
                  <div className="hidden lg:flex gap-2 lg:gap-2">
                    {" "}
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      {" "}
                      <SelectTrigger className="w-full lg:w-32">
                        {" "}
                        <SelectValue placeholder="All Status" />{" "}
                      </SelectTrigger>{" "}
                      <SelectContent>
                        {" "}
                        <SelectItem value="all">All Status</SelectItem>{" "}
                        <SelectItem value="active">Active</SelectItem>{" "}
                        <SelectItem value="sick">Sick</SelectItem>{" "}
                        <SelectItem value="quarantine">Quarantine</SelectItem>{" "}
                      </SelectContent>{" "}
                    </Select>{" "}
                    <Select value={breedFilter} onValueChange={setBreedFilter}>
                      {" "}
                      <SelectTrigger className="w-full lg:w-32">
                        {" "}
                        <SelectValue placeholder="All Types" />{" "}
                      </SelectTrigger>{" "}
                      <SelectContent>
                        {" "}
                        <SelectItem value="all">All Types</SelectItem>{" "}
                        <SelectItem value="cow">Cow</SelectItem>{" "}
                        {/* Add more asset types as needed */}{" "}
                      </SelectContent>{" "}
                    </Select>{" "}
                    <Select
                      value={genderFilter}
                      onValueChange={setGenderFilter}
                    >
                      {" "}
                      <SelectTrigger className="w-full lg:w-32">
                        {" "}
                        <SelectValue placeholder="All Genders" />{" "}
                      </SelectTrigger>{" "}
                      <SelectContent>
                        {" "}
                        <SelectItem value="all">All Genders</SelectItem>{" "}
                        <SelectItem value="male">Male</SelectItem>{" "}
                        <SelectItem value="female">Female</SelectItem>{" "}
                      </SelectContent>{" "}
                    </Select>{" "}
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
                    {(filteredAnimals || []).map((animal) => {
                      let statusColor = "bg-gray-200";
                      switch (animal.current_status?.toLowerCase()) {
                        case "active":
                          statusColor = "bg-green-500";
                          break;
                        case "sick":
                          statusColor = "bg-red-500";
                          break;
                        case "quarantine":
                          statusColor = "bg-orange-500";
                          break;
                      }

                      return (
                        <Card
                          key={animal.reference_id}
                          className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 overflow-hidden"
                        >
                          {/* Status Bar */}
                          <div
                            className={`absolute top-0 left-0 w-full h-1 ${statusColor}`}
                          />

                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {animal.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {animal.reference_id}
                              </p>
                            </div>
                            <div>{getStatusBadge(animal.current_status)}</div>
                          </div>

                          {/* Details Section */}
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-gray-400 uppercase text-xs">
                                Type
                              </span>
                              <p className="font-medium text-gray-700">
                                {animal.asset_type}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-xs">
                                Age (months)
                              </span>
                              <p className="font-medium text-gray-700">
                                {animal.age_in_months}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-xs">
                                Weight (kg)
                              </span>
                              <p className="font-medium text-gray-700">
                                {animal.weight_kg}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400 uppercase text-xs">
                                Gender
                              </span>
                              <p className="font-medium text-gray-700">
                                {animal.gender}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-green-500 hover:text-white transition-all duration-300"
                              onClick={() => {
                                setSelectedAnimal(mapAnimalForModal(animal));
                                setViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })}

                    {filteredAnimals.length === 0 && (
                      <div className="text-center py-10 text-gray-400 italic">
                        No animals found.
                      </div>
                    )}
                  </div>

                  {/* Desktop Table View */}
                  <div
                    className="hidden lg:block overflow-x-auto"
                    style={{ maxHeight: 300, overflowY: "auto" }}
                  >
                    <table className="w-full animate__animated animate__fadeInUp">
                      <thead>
                        <tr className="border-b border-gray-200 text-sm">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">
                            ID
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">
                            Name
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">
                            Type
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">
                            Age (months)
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">
                            Weight (kg)
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-gray-600">
                            Status
                          </th>
                          {/* <th className="text-center py-3 px-4 font-medium text-gray-600">Location</th> */}
                          <th className="text-center py-3 px-4 font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredAnimals || []).map((animal) => (
                          <tr
                            key={animal.reference_id}
                            className="border-b border-gray-100 hover:bg-gray-50 text-sm"
                          >
                            <td className="text-left py-3 px-4 font-medium">
                              {animal.reference_id}
                            </td>
                            <td className="text-center py-3 px-4">
                              {animal.name}
                            </td>
                            <td className="text-center py-3 px-4">
                              {animal.asset_type}
                            </td>
                            <td className="text-center py-3 px-4">
                              {animal.age_in_months}
                            </td>
                            <td className="text-center py-3 px-4">
                              {animal.weight_kg}
                            </td>
                            <td className="text-center py-3 px-4">
                              {getStatusBadge(animal.current_status)}
                            </td>
                            {/* <td className="text-center py-3 px-4">{animal.special_mark}</td> */}
                            <td className="text-center py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 border hover:bg-green-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all duration-300 ease-in-out active:scale-90"
                                  onClick={() => {
                                    setSelectedAnimal(animal);
                                    setViewModalOpen(true);
                                  }}
                                >
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
                        {filteredAnimals.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center py-10 text-gray-500"
                            >
                              No animals found.
                            </td>
                          </tr>
                        )}
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
                      Page {page} of{" "}
                      {pageSize > 0 && total > 0
                        ? Math.max(1, Math.ceil(total / pageSize))
                        : 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const lastPage =
                          pageSize > 0 && total > 0
                            ? Math.max(1, Math.ceil(total / pageSize))
                            : 1;
                        if (page < lastPage) setPage(page + 1);
                      }}
                      disabled={
                        page >=
                        (pageSize > 0 && total > 0
                          ? Math.max(1, Math.ceil(total / pageSize))
                          : 1)
                      }
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
      <ViewAnimalModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        cattle={selectedAnimal}
      />

      {/* Mobile Filter Overlay */}
      <MobileOverlayPro
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filters</h2>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cow">Cow</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end">
            <Button
              onClick={() => setSidebarOpen(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </MobileOverlayPro>
    </AuthGuard>
  );
}
