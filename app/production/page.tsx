"use client";
import { AuthGuard } from "@/components/auth-guard";
import { RecordProductionTrackingModal } from "@/components/Production/ProductionTrackingModal";
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
  CreditCard,
  Eye,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaPercent } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { IoDocuments } from "react-icons/io5";
import { LuMilk } from "react-icons/lu";
import { TbMeat } from "react-icons/tb";
import { toast, Toaster } from "sonner";
import { FeedLogDialog } from "@/components/Production/FeedLogDialog";

const ProductionTracking = () => {
  const [isRecordProductionModal, setRecordProductionModal] = useState(false);
  const [isFeedLogDialogOpen, setIsFeedLogDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productionRecords, setProductionRecords] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // useEffect(() => {
  //   setLoading(true);
  //   const token =
  //     typeof window !== "undefined"
  //       ? localStorage.getItem("access_token")
  //       : null;
  //   fetch(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/production-record-service/?start_record=1&page_size=10`,
  //     {
  //       headers: {
  //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //       },
  //     }
  //   )
  //     .then(async (res: Response) => {
  //       if (!res.ok) {
  //         const text = await res.text();
  //         console.log(text);
  //         throw new Error(text || `HTTP ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data: any) => {
  //       setProductionRecords(data.data);
  //       console.log("Fetched data:", data);
  //     })
  //     .catch((err: any) => {
  //       console.error("Fetch error:", err);
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  // const refreshDataTable = () => {
  //   setRecordProductionModal(false);
  //   toast.success("Data added successfully");
  // };

  //   Temporary Fake data

  const fetchData = async () => {
    setLoading(true);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/production-record-service/?start_record=1&page_size=10`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setProductionRecords(data.data);
      console.log("Fetched data:", data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshDataTable = () => {
    setRecordProductionModal(false);
    toast.success("Data added successfully");
    fetchData();
  };

  const recordsToShow = productionRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [feedLogs, setFeedLogs] = useState<any[]>([]);

  // Function to load feed logs from localStorage
  const loadFeedLogs = () => {
    const logs = localStorage.getItem('feedLogs');
    if (logs) {
      setFeedLogs(JSON.parse(logs));
    }
  };

  // Load feed logs initially and set up storage event listener
  useEffect(() => {
    loadFeedLogs(); // Initial load

    // Update when storage changes
    window.addEventListener('storage', loadFeedLogs);
    
    // Custom event listener for immediate updates
    const handleFeedLogUpdate = () => loadFeedLogs();
    window.addEventListener('feedLogUpdated', handleFeedLogUpdate);

    return () => {
      window.removeEventListener('storage', loadFeedLogs);
      window.removeEventListener('feedLogUpdated', handleFeedLogUpdate);
    };
  }, []);

  // console.log(productionRecords);
  return (
    <AuthGuard requireAuth={true}>
      <div className="relative py-16 lg:py-0 ">
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 lg:px-4">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Heading heading="Production Tracking" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setRecordProductionModal(true)}
              >
                <IoDocuments className="w-4 h-4 mr-2" />
                Record Production
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsFeedLogDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feed Log
              </Button>
            </div>
            <RecordProductionTrackingModal
              open={isRecordProductionModal}
              onOpenChange={setRecordProductionModal}
              onSuccess={refreshDataTable}
            />
          </div>

          {/* Summary Cards */}
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card
              className="animate__animated animate__fadeInRight"
              style={{ animationDelay: "0s" }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-3xl font-extrabold text-blue-600">
                    <LuMilk />
                  </span>

                  <div>
                    <div className="text-2xl font-bold text-right text-blue-600">
                      500 L
                    </div>
                    <div className="text-sm text-gray-600">Today's Milk</div>
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
                  <TrendingUp className="w-8 h-8 text-green-600" />

                  <div>
                    <div className="text-2xl font-bold text-right text-green-600">
                      5%
                    </div>
                    <div className="text-sm text-gray-600">Weekly Growth</div>
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
                  <TbMeat className="w-8 h-8 text-orange-600" />

                  <div>
                    <div className="text-2xl font-bold text-right text-orange-600">
                      16.5
                    </div>
                    <div className="text-sm text-gray-600">Avg L/animal</div>
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
                    <div className="text-sm text-gray-600">Quality Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-2">
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle className="flex items-center">
                      <LuMilk className="w-5 h-5 mr-2 text-blue-600" />
                      Daily Milk Production
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
                      <Select value={""}>
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
                    className=" lg:block overflow-x-auto"
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
                          {recordsToShow.map((record, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-2 flex flex-col">
                                <span className="font-semibold">
                                  {record.asset_ref_id}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-sm">
                                {record.quantity}
                              </td>
                              {/* <td className="py-3 px-2 text-sm">11.2 L</td>
                              <td className="py-3 px-2 text-sm font-semibold">
                                23.7 L
                              </td> */}
                              <td>{record.type_name}</td>
                              <td className="py-3 px-2">
                                <div className="flex items-center space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 border hover:bg-green-400 hover:text-white hover:scale-105 hover:-translate-y-1 hover:drop-shadow-xl transition-all duration-300 ease-in-out active:scale-90"
                                    // onClick={() => {
                                    //   setSelectedTransaction(
                                    //     mapTransactionForModal(transaction)
                                    //   );
                                    //   setViewModalOpen(true);
                                    // }}
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
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </Button>
                    <span>
                      Page {currentPage} of{" "}
                      {Math.ceil(productionRecords.length / pageSize)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={
                        currentPage * pageSize >= productionRecords.length
                      }
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Breakdown - hidden or placeholder since not in API */}
            <div>
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-2" />
                    Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-gray-500 text-center py-8">Expense breakdown data not available.</div>
                </CardContent>
              </Card> */}
              <Card className="animate__animated animate__fadeIn">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TbMeat className="w-5 h-5 mr-2 text-green-600" />
                    Feed Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedLogs.map((log, index) => (
                      <div key={index} className="space-y-2">
                        <div className="border rounded-md p-3 flex justify-between">
                          <div className="space-y-1">
                            <h1 className="font-semibold">{log.feedType}</h1>
                            <p className="text-sm font-medium text-gray-500">
                              {log.supplier}
                            </p>
                            <p className="text-sm font-medium text-gray-500">
                              {new Date(log.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className="font-semibold">
                              {log.quantity} KG
                            </span>
                            <span className="text-sm font-medium text-green-500">
                              ${log.cost}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Feed Cost:</span>
                      <span className="text-lg font-bold text-red-600">
                        ${feedLogs.reduce((total, log) => total + (parseFloat(log.cost) || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <FeedLogDialog 
          open={isFeedLogDialogOpen}
          onClose={() => setIsFeedLogDialogOpen(false)}
        />
        <Toaster richColors />
      </div>
    </AuthGuard>
  );
};

export default ProductionTracking;
