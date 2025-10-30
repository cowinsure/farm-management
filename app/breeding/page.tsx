"use client";

import { AuthGuard } from "@/components/auth-guard";
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
import { Calendar, Eye, Heart, Plus, Search, TrendingUp } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaPercent } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { LuMilk } from "react-icons/lu";
import { TbMeat, TbMoodKid } from "react-icons/tb";
import { Toaster } from "sonner";
import { BreedingTrackingModal } from "@/components/Breeding/BreedingTrackingModal";
import { BreedingStatusUpdateDialog } from "@/components/Breeding/BreedingStatusUpdateDialog";
import { PencilIcon } from "lucide-react";

const BreedingReproduction = () => {
  const loading = false;
  const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);
  const [breedingRecords, setBreedingRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

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

  return (
    <AuthGuard requireAuth={true}>
      <div className="relative py-16 lg:py-0 ">
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 lg:px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Heading heading="Breeding & Reproduction" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setIsBreedingModalOpen(true)}
              >
                <Heart className="w-4 h-4 mr-2" />
                Record Breeding
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                // onClick={() => setRecordDialogOpen(true)}
              >
                <TbMoodKid className="w-4 h-4 mr-2" />
                Record Birth
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
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
                      Pregnant Animals
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
                    <div className="text-sm text-gray-600">Expected Births</div>
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
                    <div className="text-sm text-gray-600">Total Births</div>
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
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-2">
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-blue-600" />
                      Active Breeding Records
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search animal..."
                          onChange={(e) => console.log(e)}
                          className="pl-10 w-full sm:w-48"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mobile Card View */}
                  {/* <div className="lg:hidden space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading...
                      </div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No transactions found.
                      </div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <Card key={transaction.voucher_no} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {transaction.txn_head}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {transaction.date}
                              </p>
                            </div>
                            <div className="text-right">
                              {getTransactionBadge(transaction.type)}
                              <p
                                className={`font-bold text-3xl mt-1 ${
                                  transaction.amount > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {transaction.description}
                          </p>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedTransaction(
                                  mapTransactionForModal(transaction)
                                );
                                setViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div> */}

                  {/* Desktop Table View */}
                  <div
                    className="hidden lg:block overflow-x-auto"
                    style={{ maxHeight: 375, overflowY: "auto" }}
                  >
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading...
                      </div>
                    ) : breedingRecords.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No breeding records found
                      </div>
                    ) : (
                      <table className="w-full animate__animated animate__fadeInUp">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Animal ID
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Breeding Method
                            </th>
                            {/* <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Breeding Date
                            </th> */}
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Expected Date
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Status
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Actions
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
                                {record.breedingMethod || record.production_type_id}
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
                                  ? new Date(record.expectedCalvingDate).toLocaleDateString()
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

            {/* Expense Breakdown - hidden or placeholder since not in API */}
            <div className="xl:col-span-2">
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle className="flex items-center">
                      <TbMoodKid className="w-5 h-5 mr-2 text-pink-600" />
                     Recent Births
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search animal..."
                          value={""}
                            onChange={(e) => console.log(e)}
                          className="pl-10 w-full sm:w-48"
                        />
                      </div>
                      <Select>
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
                  {/* <div className="lg:hidden space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading...
                      </div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No transactions found.
                      </div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <Card key={transaction.voucher_no} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {transaction.txn_head}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {transaction.date}
                              </p>
                            </div>
                            <div className="text-right">
                              {getTransactionBadge(transaction.type)}
                              <p
                                className={`font-bold text-3xl mt-1 ${
                                  transaction.amount > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {transaction.description}
                          </p>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedTransaction(
                                  mapTransactionForModal(transaction)
                                );
                                setViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div> */}

                  {/* Desktop Table View */}
                  <div
                    className="hidden lg:block overflow-x-auto"
                    style={{ maxHeight: 375, overflowY: "auto" }}
                  >
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading...
                      </div>
                    ) : [1, 2, 3, 4, 5, 6].length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No data found
                      </div>
                    ) : (
                      <table className="w-full animate__animated animate__fadeInUp">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Animal
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Quantity
                            </th>
                            {/* <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Evening
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Total
                            </th> */}
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Production
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {breedingRecords.map((record, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-2 flex flex-col">
                                <span className="font-semibold">
                                  {record.name}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {record.quantity}
                              </td>
                              {/* <td className="py-3 px-2 text-sm">11.2 L</td>
                              <td className="py-3 px-2 text-sm font-semibold">
                                23.7 L
                              </td> */}
                              <td>{record.farm}</td>
                              <td className="py-3 px-2">
                                <div className="flex items-center space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 border hover:bg-green-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all duration-300 ease-in-out active:scale-90"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  {/* <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button> */}
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
    </AuthGuard>
  );
};

export default BreedingReproduction;
