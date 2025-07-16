import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import UploadVideo from "@/helper/UploadVedio"
import { Camera } from "lucide-react"

interface RecordVaccinationScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Dummy data for vaccines
const vaccines = [
  { id: 1, name: "FMD Vaccine" },
  { id: 2, name: "Brucellosis" },
  { id: 3, name: "Anthrax" },
  { id: 4, name: "Rabies" },
]
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzU2NTY5NiwianRpIjoiNzViZThkMjYtNGMwZC00YTc4LWEzM2ItMjAyODU4OGVkZmU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDc1NjU2OTYsImNzcmYiOiI2Y2VjNWM1Mi0xMDJkLTRmYjUtOTE3NS1lNzZkZTBkMDM3YTYifQ.n5moEixJyO4eaXpYI8yG6Qnjf3jjBrWA7W19gW_4h8c"
interface MuzzleResponse {
  geo_location: string;
  matched_id: string;
  msg: string;
  segmentation_image: string;
}

export function RecordVaccinationScheduleDialog({ open, onOpenChange, onSuccess }: RecordVaccinationScheduleDialogProps) {
  const { toast } = useToast()
  const [assets, setAssets] = useState<{ id: number; name: string; reference_id: string }[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [form, setForm] = useState({
    asset_id: "",
    vaccine_id: "",
    due_date: "",
    remarks: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [vaccines, setVaccines] = useState<{ id: number; name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [muzzleResponse, setMuzzleResponse] = useState<MuzzleResponse | null>(null);
  const [erromuzzleResponse, setErroMuzzleResponse] = useState<MuzzleResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);




  // Fetch vaccines from the API when dialog opens
  useEffect(() => {
    if (open) {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/vaccine-service`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.data) setVaccines(data.data);
          else setVaccines([]);
        })
        .catch(() => setVaccines([]));
    }
  }, [open]);

  // Fetch assets when dialog opens
  useEffect(() => {
    if (open) {
      setLoadingAssets(true)
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/assets-service`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const list = data?.data?.list || data?.list || []
          setAssets(list.map((a: any) => ({
            id: a.id,
            name: a.name || a.asset_ref_id || `Asset ${a.id}`,
            reference_id: a.reference_id
          })))
        })
        .catch(() => setAssets([]))
        .finally(() => setLoadingAssets(false))
    }
  }, [open])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle select changes
  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value })
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
      const payload = {
        ...form,
        asset_id: Number(form.asset_id),
        vaccine_id: Number(form.vaccine_id),
      }
      console.log(payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/vaccination-schedule-service/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.status === "success") {
        toast({ title: "Success", description: data.message || "Vaccination scheduled successfully" })
        onOpenChange(false)
        if (onSuccess) onSuccess()
        setForm({
          asset_id: "",
          vaccine_id: "",
          treatment_date: "",
          remarks: "",
        })
      } else {
        throw new Error(data.message || "Failed to schedule vaccination")
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to schedule vaccination" })
    } finally {
      setSubmitting(false)
    }
  }

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
      const response = await fetch("https://ai.insurecow.com/claim", {
        method: "POST",
        body: formData,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Vaccination</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Asset</label>
              <Select value={form.asset_id} onValueChange={(v) => handleSelect("asset_id", v)} disabled={loadingAssets}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingAssets ? "Loading..." : "Select asset"} />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>{a.reference_id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
                <div>
              <label className="block text-sm font-medium mb-1">Muzzel Verification (optional)</label>
              <UploadVideo onVideoCapture={(file) => {
                console.log("Captured video file:", file);
                setSelectedFile(file);

              }} />

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
            <div>
              <label className="block text-sm font-medium mb-1">Vaccine</label>
              <Select value={form.vaccine_id} onValueChange={(v) => handleSelect("vaccine_id", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vaccine" />
                </SelectTrigger>
                <SelectContent>
                  {vaccines.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Treatment Date</label>
              <Input type="datetime-local" name="due_date" value={form.due_date} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <Input name="remarks" value={form.remarks} onChange={handleChange} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Submitting..." : "Submit"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 