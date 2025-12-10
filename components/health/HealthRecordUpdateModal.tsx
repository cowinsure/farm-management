"use client";

import { HealthRecord } from "@/app/health/page";
import { Heart, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input"; // Add if you use custom styled input
import { Button } from "../ui/button";
import { IoCheckmarkCircle } from "react-icons/io5";
import { toast } from "sonner";
import VetSelection from "../VetSelection";

interface HealthRecordModalProps {
  closeModal: () => void;
  data: any;
  onUpdate?: (updatedData: HealthRecord) => void;
}

interface HealthStatus {
  id: number;
  name: string;
  asset_status_id: number;
}

const HealthRecordUpdateModal = ({
  closeModal,
  data,
  onUpdate,
}: HealthRecordModalProps) => {
  const [allHealthStatus, setAllHealthStatus] = useState<HealthStatus[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    data.status_name || ""
  );
  const [remarks, setRemarks] = useState<string>(data.remarks || "");
  const [selectedVet, setSelectedVet] = useState<string>("");

  // Fetch all health statuses
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fetchStatuses = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/health-status-service/?start_record=1&page_size=10`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const result = await response.json();
        setAllHealthStatus(result.data || []);
      } catch (error) {
        console.error("Failed to fetch health statuses:", error);
      }
    };

    fetchStatuses();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getHealthStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Healthy
          </Badge>
        );
      case "under treatment":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Under Treatment
          </Badge>
        );
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Complete
          </Badge>
        );
      case "sick":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Sick
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleHealthStatusChange = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      // Find the current_status_id from the selected status name
      const selectedStatusObj = allHealthStatus.find(
        (status) => status.name === selectedStatus
      );
      //   console.log(selectedStatusObj);

      if (!selectedStatusObj) {
        console.error("Selected status not found.");
        return;
      }

      const payload = {
        current_status_id: selectedStatusObj.id,
        // remarks: remarks,
        id: data.id,
      };

      console.log(payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/health-record-status-history-service/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update health record");
      }

      const updatedData = await response.json();
      // console.log("Update successful:", updatedData);

      if (onUpdate) {
        console.log("Calling onUpdate with:", updatedData);
        onUpdate(updatedData.data);
      }
      if (updatedData.data.id) {
        toast.success("Status sucessfully changed");
        closeModal();
      }
    } catch (error) {
      console.error("Error during update:", error);
      // Optionally show error toast
    }
  };

  console.log(selectedStatus);
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80 overflow-hidden"
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-lg border bg-background p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <h1>Change Health Status</h1>
          </div>
          <button
            onClick={closeModal}
            className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Record Info */}
        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-800">
            {data.asset_ref_id?.toUpperCase()}
          </p>
          {getHealthStatusBadge(data.status_name)}
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Status Select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Change Health Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {allHealthStatus.map((status) => (
                  <SelectItem key={status.name} value={status.name}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vet Selection */}
          <div className="flex flex-col gap-2">
            <VetSelection
              value={selectedVet}
              onChange={(value) => setSelectedVet(value as string)}
              label="Select Veterinarian"
              placeholder="Select vet..."
            />
          </div>

          {/* Remarks Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              className="border rounded-md p-3 hover:cursor-not-allowed"
              disabled
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleHealthStatusChange}
              className="bg-green-700 hover:bg-green-800"
            >
              <IoCheckmarkCircle />
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthRecordUpdateModal;
