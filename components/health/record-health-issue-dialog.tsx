import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Image as ImageIcon, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import UploadVideo from "@/helper/UploadVedio";

interface RecordHealthIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Dummy data for dropdowns
const statuses = [
  { id: 1, name: "Healthy" },
  { id: 2, name: "Under Treatment" },
  { id: 3, name: "Complete" },
  { id: 4, name: "Critical" },
];
const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzU2NTY5NiwianRpIjoiNzViZThkMjYtNGMwZC00YTc4LWEzM2ItMjAyODU4OGVkZmU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDc1NjU2OTYsImNzcmYiOiI2Y2VjNWM1Mi0xMDJkLTRmYjUtOTE3NS1lNzZkZTBkMDM3YTYifQ.n5moEixJyO4eaXpYI8yG6Qnjf3jjBrWA7W19gW_4h8c";
interface MuzzleResponse {
  geo_location: string;
  matched_id: string;
  msg: string;
  segmentation_image: string;
}
export function RecordHealthIssueDialog({
  open,
  onOpenChange,
  onSuccess,
}: RecordHealthIssueDialogProps) {
  const { toast } = useToast();
  const [assets, setAssets] = useState<
    { id: number; name: string; reference_id: string }[]
  >([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isMuzzelModalOpen, setIsMuzzelModalOpen] = useState(false);
  const [muzzleResponse, setMuzzleResponse] = useState<MuzzleResponse | null>(
    null
  );
  const [erromuzzleResponse, setErroMuzzleResponse] =
    useState<MuzzleResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(
    null
  );
  const [conditions, setConditions] = useState<{ id: number; name: string }[]>(
    []
  );
  // Add severities state
  const [severities, setSeverities] = useState<{ id: number; name: string }[]>(
    []
  );

  const [form, setForm] = useState({
    condition_id: "",
    severity_id: "",
    symptoms: "",
    treatment: "",
    treatment_date: "",
    veterinarian: "",
    remarks: "",
    asset_id: "",
    current_status_id: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleVideoUpload = async (file: File) => {
    // setModalOpen(false)

    console.log("Video file captured:", file);

    const formData = new FormData();
    formData.append("video", file); // Append the video file to the form data
    // setFormData(prev => ({
    //   ...prev,
    //   claim_muzzle: file
    // }));

    try {
      setIsUploading(true);
      const response = await fetch(
        "https://gtbmh1115k5v44-8000.proxy.runpod.net/claim",
        {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      // 3.110.218.87:8000

      // console.log(await response.json());

      if (response.status === 400) {
        const data = await response.json();
        // setErrorModalOpen(true)
        console.error("Error 400:", data.msg);
        alert(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 401) {
        const data = await response.json();
        console.error("Error 401:", data.msg);
        alert(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 404) {
        const data = await response.json();
        setErroMuzzleResponse(data);
        console.error("Error 401:", data.msg);
        // alert(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 200) {
        const data: MuzzleResponse = await response.json(); // Use the interface for type safety
        console.log("API Response:", data);
        setMuzzleResponse(data);
        // setResponseData(data);
        // setModalOpen(true)
        // setFormData(prev => ({
        //   ...prev,
        //   reference_id: data.matched_id
        // })); // Save the response data to state
        // alert(data.msg);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Something went wrong: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch assets when dialog opens
  useEffect(() => {
    if (open) {
      setLoadingAssets(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/assets-service`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Assets data:", data);

          // Assume data.list or data.data.list
          const list = data?.data?.list || data?.list || [];
          setAssets(
            list.map((a: any) => ({
              id: a.id,
              name: a.name || a.asset_ref_id || `Asset ${a.id}`,
              reference_id: a.reference_id,
            }))
          );
        })
        .catch(() => setAssets([]))
        .finally(() => setLoadingAssets(false));
    }
  }, [open]);

  // Fetch medical conditions when dialog opens
  useEffect(() => {
    if (open) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/medical-condition-service`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data?.data) setConditions(data.data);
          else setConditions([]);
        })
        .catch(() => setConditions([]));
    }
  }, [open]);

  // Fetch severities from the API when dialog opens
  useEffect(() => {
    if (open) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/medical-condition-severity-service`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.data) setSeverities(data.data);
          else setSeverities([]);
        })
        .catch(() => setSeverities([]));
    }
  }, [open]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle select changes
  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      const by_user_id =
        typeof window !== "undefined"
          ? Number(localStorage.getItem("user_id")) || 1001
          : 1001;
      const payload = {
        ...form,
        condition_id: Number(form.condition_id),
        severity_id: Number(form.severity_id),
        asset_id: Number(form.asset_id),
        current_status_id: Number(form.current_status_id),
        by_user_id,
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/health-record-service/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        toast({
          title: "Success",
          description: data.message || "Health record inserted successfully",
        });
        onOpenChange(false);
        if (onSuccess) onSuccess();
        setForm({
          condition_id: "",
          severity_id: "",
          symptoms: "",
          treatment: "",
          treatment_date: "",
          veterinarian: "",
          remarks: "",
          asset_id: "",
          current_status_id: "",
        });
      } else {
        throw new Error(data.message || "Failed to insert health record");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to insert health record",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Health Issue</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Condition
              </label>
              <Select
                value={form.condition_id}
                onValueChange={(v) => handleSelect("condition_id", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <Select
                value={form.severity_id}
                onValueChange={(v) => handleSelect("severity_id", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Symptoms</label>
              <Input
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Treatment
              </label>
              <Input
                name="treatment"
                value={form.treatment}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Treatment Date
              </label>
              <Input
                type="datetime-local"
                name="treatment_date"
                value={form.treatment_date}
                onChange={handleChange}
                required
                className="w-full border border-red-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Veterinarian
              </label>
              <Input
                name="veterinarian"
                value={form.veterinarian}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <Input
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Asset</label>
              <Select
                value={form.asset_id}
                onValueChange={(v) => {
                  handleSelect("asset_id", v);
                  setSelectedAnimalId(v);
                  const animal = assets.find((a) => String(a.id) === v);
                  setSelectedReferenceId(animal ? animal.reference_id : null);
                }}
                disabled={loadingAssets}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={loadingAssets ? "Loading..." : "Select asset"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.reference_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-1">Muzzel Verification</label>
              <div className="flex flex-row relative">

              <Input  name="muzzel" value={form.asset_id} onChange={handleChange} disabled />
              <button
              type="button" className="absolute right-0 bottom-0 top-0 mx-2">
                <Camera className="h-6 w-6 text-gray-500" onClick={() => setIsMuzzelModalOpen(true)} /> 
              </button>
              </div>
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Muzzel Verification (optional)
              </label>
              <UploadVideo
                onVideoCapture={(file) => {
                  console.log("Captured video file:", file);
                  setSelectedFile(file);
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="text-green-700 w-full flex items-center gap-2 border border-green-700"
              onClick={() => {
                if (selectedFile) {
                  handleVideoUpload(selectedFile); // Call the upload function when the video is captured
                } else {
                  alert("Please select a video file before uploading.");
                }
              }}
            >
              <Camera className="h-5 w-5 text-green-600" />
              {isUploading ? "Uploading..." : "Upload Muzzle Video"}
              {/* {isUploading ? "Uploading..." : "Claim Cow"} */}
            </Button>

            {selectedReferenceId && muzzleResponse && (
              <div
                className={`p-3 rounded mb-2 flex flex-col items-start ${
                  selectedReferenceId === muzzleResponse.matched_id
                    ? "bg-green-100 border border-green-400 text-green-700"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
              >
                <div>
                  <span className="font-semibold">Selected Reference ID:</span>{" "}
                  {selectedReferenceId}
                </div>
                <div>
                  <span className="font-semibold">Muzzle Matched ID:</span>{" "}
                  {muzzleResponse.matched_id}
                </div>
                <div className="mt-1 font-medium">
                  {selectedReferenceId === muzzleResponse.matched_id
                    ? "✅ Asset matched!"
                    : "❌ Asset does not match!"}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={form.current_status_id}
                onValueChange={(v) => handleSelect("current_status_id", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Submitting..." : "Submit"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
