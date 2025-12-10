"use client";

import AuthGuard from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/Heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Edit,
  Eye,
  Heart,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaPercent } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { LuMilk } from "react-icons/lu";
import { TbMeat, TbMoodKid } from "react-icons/tb";
import { Toaster } from "sonner";
import { BreedingTrackingModal } from "@/components/Breeding/BreedingTrackingModal";
import { BreedingStatusUpdateDialog } from "@/components/Breeding/BreedingStatusUpdateDialog";
import { PencilIcon } from "lucide-react";
import { BirthTrackingModal } from "@/components/Breeding/BirthTrackingModal";
import SectionHeading from "@/helper/SectionHeading";
import { useLocalization } from "@/context/LocalizationContext";
import { MobileOverlayPro } from "@/components/MobileOverlayPro";

const BreedingReproduction = () => {
  const { t, locale, setLocale } = useLocalization();
  const loading = false;
  const [isBirthModalOpen, setBirthModalOpen] = useState(false);
  const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);
  const [breedingRecords, setBreedingRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [birthLogs, setBirthLogs] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load breeding records from localStorage
  useEffect(() => {
    const loadBreedingRecords = () => {
      const records = JSON.parse(localStorage.getItem("breedingLogs") || "[]");
      setBreedingRecords(records);
    };
    loadBreedingRecords();
    window.addEventListener("breedingLogUpdated", loadBreedingRecords);
    return () => {
      window.removeEventListener("breedingLogUpdated", loadBreedingRecords);
    };
  }, []);

  // Load birth logs from localStorage and listen for birthLogUpdated events
  useEffect(() => {
    const loadBirthLogs = () => {
      try {
        const raw = localStorage.getItem("birthlogs");
        const parsed = raw ? JSON.parse(raw) : [];
        // show newest first
        setBirthLogs(Array.isArray(parsed) ? parsed.slice().reverse() : []);
      } catch (err) {
        console.warn("Failed to parse birthlogs from localStorage", err);
        setBirthLogs([]);
      }
    };

    // handler for CustomEvent('birthLogUpdated') dispatched by the modal
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce?.detail) {
        // prepend the new record so newest appear first
        setBirthLogs((prev) => [ce.detail, ...prev]);
      } else {
        // fallback: reload from storage
        loadBirthLogs();
      }
    };

    // initial load
    loadBirthLogs();
    window.addEventListener("birthLogUpdated", handler as EventListener);
    return () =>
      window.removeEventListener("birthLogUpdated", handler as EventListener);
  }, []);

  return (
    <AuthGuard requireAuth={true}>
      <div className="relative pb-10 lg:py-0 ">
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 lg:px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <SectionHeading
              sectionTitle={t("breeding_reproduction")}
              description={t("manage_reproductive_numbers")}
            />
            <div className="lg:flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto hidden">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setIsBreedingModalOpen(true)}
              >
                <Heart className="w-4 h-4 mr-2" />
                {t("record_breeding")}
              </Button>

              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => setBirthModalOpen(true)}
              >
                <TbMoodKid className="w-4 h-4 mr-2" />
                {t("record_birth")}
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
                    <h1 className="font-bold text-gray-700 text-">
                      Record breeding & reproduction
                    </h1>
                    <p className="font-medium text-gray-500 text-sm">
                      Click to add details
                    </p>
                  </div>
                  <div className="flex items-center gap-2 *:w-[50%]">
                    {/* Btn for mobile */}
                    <button
                      className="bg-green-950 rounded-lg py-2 px-2 flex items-center justify-center gap-2 font-semibold text-white lg:hidden"
                      onClick={() => setIsBreedingModalOpen(true)}
                    >
                      <Heart className="w-5 h-5" />
                      Breeding
                    </button>

                    <button
                      className=" bg-emerald-700 rounded-lg py-2 px-2 flex items-center justify-center gap-2 font-semibold text-white lg:hidden"
                      onClick={() => setBirthModalOpen(true)}
                    >
                      <TbMoodKid className="w-5 h-5" />
                      Calving
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="mt-6 lg:mt-0 mb-6 lg:mb-8 border lg:border-none rounded-lg lg:rounded-none p-4 lg:p-0 bg-green-50 lg:bg-transparent">
            <Heading heading="Quick Stats" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 lg:mb-8">
              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-3xl font-extrabold text-blue-600">
                      <Heart className="w-8 h-8" />
                    </span>

                  <div>
                    <div className="text-2xl font-bold text-right text-blue-600">
                      15
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("pregnant_animals")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0.25s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <TbMoodKid className="w-10 h-10 text-pink-600" />

                  <div>
                    <div className="text-2xl font-bold text-right text-pink-600">
                      8
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("expected_births")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0.5s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Calendar className="w-8 h-8 text-orange-600" />

                  <div>
                    <div className="text-2xl font-bold text-right text-orange-600">
                      23
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("total_births")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: "0.75s" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="rounded-full flex items-center justify-center">
                      <FaPercent className="w-6 h-6 text-purple-600 font-bold" />
                    </div>

                  <div>
                    <div className="text-2xl font-bold text-right text-purple-600">
                      89
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("success_rate")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            {/* Breeding records */}
            <div className="xl:col-span-2">

              
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
                    <CardTitle className="flex items-center text-lg lg:text-xl">
                      <Heart className="w-5 h-5 mr-2 text-blue-600" />
                      {t("active_breeding_records")}
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                      <div className="flex justify-between w-full">

                        {/* Filter btn for mobile devices */}
                        <div className="">
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
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder={t("search_animals")}
                          onChange={(e) => console.log(e)}
                          className="pl-10 w-full sm:w-48"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder={t("all_status")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("all_status")}</SelectItem>
                          <SelectItem value="pending">
                            {t("pending")}
                          </SelectItem>
                          <SelectItem value="confirmed">
                            {t("confirmed")}
                          </SelectItem>
                          <SelectItem value="failed">{t("failed")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* 🌿 Mobile Card View for Breeding Records */}
                  <div className="lg:hidden space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading...
                      </div>
                    ) : breedingRecords.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 italic">
                        No breeding records found.
                      </div>
                    ) : (
                      breedingRecords.map((breeding, idx) => {
                        // 🟢 Determine color based on breeding type
                        let typeColor = "bg-gray-200";
                        switch (breeding.type?.toLowerCase()) {
                          case "natural":
                            typeColor = "bg-green-500";
                            break;
                          case "artificial":
                            typeColor = "bg-blue-500";
                            break;
                          case "failed":
                            typeColor = "bg-red-500";
                            break;
                        }

                        return (
                          <Card
                            key={idx}
                            className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 overflow-hidden"
                          >
                            {/* Status Bar */}
                            <div
                              className={`absolute top-0 left-0 w-full h-1 ${typeColor}`}
                            />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-bold text-lg text-gray-800">
                                  {breeding.cowId}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {breeding.date}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                  {breeding.type}
                                </span>
                                <p
                                  className={`font-bold text-xl mt-1 ${
                                    breeding.amount > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {breeding.amount}
                                </p>
                              </div>
                            </div>

                            {/* Details Section */}
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Bull ID
                                </span>
                                <p className="font-medium text-gray-700">
                                  {breeding.bullId || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Method
                                </span>
                                <p className="font-medium text-gray-700 capitalize">
                                  {breeding.method || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Result
                                </span>
                                <p className="font-medium text-gray-700 capitalize">
                                  {breeding.result || "Pending"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Remarks
                                </span>
                                <p className="font-medium text-gray-700">
                                  {breeding.remarks || "—"}
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
                                  setSelectedRecord(breeding);
                                  setIsStatusDialogOpen(true);
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

                  {/* Desktop Table View */}
                  <div
                    className="hidden lg:block overflow-x-auto"
                    style={{ maxHeight: 375, overflowY: "auto" }}
                  >
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("loading")}...
                      </div>
                    ) : breedingRecords.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("no_breeding_records_found")}
                      </div>
                    ) : (
                      <table className="w-full animate__animated animate__fadeInUp">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("animal_id")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("breeding_method")}
                            </th>
                            {/* <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Breeding Date
                            </th> */}
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("expected_date")}
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
                          {breedingRecords.map((record, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-2 font-semibold">
                                {record.cowId || record.asset_id}
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {record.breedingMethod ||
                                  record.production_type_id}
                              </td>
                              {/* <td className="py-3 px-2 text-sm">
                                {record.breedingDate
                                  ? new Date(record.breedingDate).toLocaleDateString()
                                  : record.date
                                  ? new Date(record.date).toLocaleDateString()
                                  : "-"}
                              </td> */}
                              <td className="py-3 px-2 text-sm">
                                {record.expectedCalvingDate
                                  ? new Date(
                                      record.expectedCalvingDate
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="py-3 px-2">
                                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100">
                                  {record.pregnancyStatus || "Pending"}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <button
                                  className="inline-flex items-center px-2 py-1 border rounded text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                                  onClick={() => {
                                    setSelectedRecord(record);
                                    setIsStatusDialogOpen(true);
                                  }}
                                >
                                  <PencilIcon className="w-4 h-4 mr-1" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {/* <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={
                        loading || filteredTransactions.length < pageSize
                      }
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            </div>

            {/* Recent birth records */}
            <div className="xl:col-span-2">
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
                    <CardTitle className="flex items-center text-lg lg:text-xl">
                      <TbMoodKid className="w-5 h-5 mr-2 text-pink-600" />
                      {t("recent_births")}
                    </CardTitle>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                      {/* Left: Info text + Mobile Filter Button */}
                      <div className="flex justify-between w-full">
                        {/* <p className="text-sm text-gray-600">
                          See all the records here
                        </p> */}

                        {/* Filter button for mobile */}
                        <div className="">
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
                      </div>

                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder={t("search_animals")}
                          value={""}
                          onChange={(e) => console.log(e)}
                          className="pl-10 w-full sm:w-48"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder={t("all_types")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("all_types")}</SelectItem>
                          <SelectItem value="income">{t("income")}</SelectItem>
                          <SelectItem value="expense">
                            {t("expense")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* 🌸 Mobile Card View for Birth Records */}
                  <div className="lg:hidden space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading...
                      </div>
                    ) : birthLogs.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 italic">
                        No birth records found.
                      </div>
                    ) : (
                      birthLogs.map((log, idx) => {
                        // 🟣 Optional: Set color based on gender (or type)
                        let genderColor = "bg-gray-200";
                        switch (log.gender?.toLowerCase()) {
                          case "male":
                            genderColor = "bg-blue-500";
                            break;
                          case "female":
                            genderColor = "bg-pink-500";
                            break;
                        }

                        return (
                          <Card
                            key={idx}
                            className="relative p-4 rounded-xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 overflow-hidden"
                          >
                            {/* Status Bar */}
                            <div
                              className={`absolute top-0 left-0 w-full h-1 ${genderColor}`}
                            />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-bold text-lg text-gray-800">
                                  {log.reference_id || log.asset_id || "-"}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {log.birthdate
                                    ? new Date(
                                        log.birthdate
                                      ).toLocaleDateString()
                                    : "-"}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                  {log.gender || "-"}
                                </span>
                                <p
                                  className={`font-bold text-xl mt-1 ${
                                    log.birth_weight > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {log.birth_weight || "-"} kg
                                </p>
                              </div>
                            </div>

                            {/* Details Section */}
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Mother ID
                                </span>
                                <p className="font-medium text-gray-700">
                                  {log.mother_id || "-"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Father ID
                                </span>
                                <p className="font-medium text-gray-700">
                                  {log.father_id || "-"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Recorded At
                                </span>
                                <p className="font-medium text-gray-700">
                                  {log.created_at
                                    ? new Date(log.created_at).toLocaleString()
                                    : "-"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400 uppercase text-xs">
                                  Remarks
                                </span>
                                <p className="font-medium text-gray-700">
                                  {log.remarks || "-"}
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
                                  setSelectedRecord(log);
                                  setIsStatusDialogOpen(true);
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

                  {/* Desktop Table View */}
                  <div
                    className="hidden lg:block overflow-x-auto"
                    style={{ maxHeight: 375, overflowY: "auto" }}
                  >
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("loading")}
                      </div>
                    ) : birthLogs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {t("no_births_found")}
                      </div>
                    ) : (
                      <table className="w-full animate__animated animate__fadeInUp">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("animal_id")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("birth_date")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("gender")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("weight")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("recorded_at")}
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              {t("actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {birthLogs.map((record, idx) => (
                            <tr
                              key={record.id || idx}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-2 flex flex-col">
                                <span className="font-semibold">
                                  {record.reference_id ||
                                    record.asset_id ||
                                    "-"}
                                </span>
                                {record.asset_id && !record.reference_id ? (
                                  <small className="text-xs text-gray-500">
                                    {record.asset_id}
                                  </small>
                                ) : null}
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {record.birthdate
                                  ? new Date(
                                      record.birthdate
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {record.gender || "-"}
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {record.birth_weight || "-"}
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {record.created_at
                                  ? new Date(record.created_at).toLocaleString()
                                  : "-"}
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 border"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {/* <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={
                        loading || filteredTransactions.length < pageSize
                      }
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <BirthTrackingModal
          open={isBirthModalOpen}
          onOpenChange={setBirthModalOpen}
          onSuccess={() => {
            setBirthModalOpen(false);
          }}
        />

        <BreedingTrackingModal
          open={isBreedingModalOpen}
          onOpenChange={setIsBreedingModalOpen}
          onSuccess={() => {
            setIsBreedingModalOpen(false);
          }}
        />
        {selectedRecord && (
          <BreedingStatusUpdateDialog
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
            record={selectedRecord}
          />
        )}
        <Toaster richColors />
      </div>

      {/* Mobile Filter Overlay */}
      <MobileOverlayPro
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filters</h2>

          <Select>
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
};

export default BreedingReproduction;
