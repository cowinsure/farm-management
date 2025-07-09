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

export function RecordVaccinationScheduleDialog({ open, onOpenChange, onSuccess }: RecordVaccinationScheduleDialogProps) {
  const { toast } = useToast()
  const [assets, setAssets] = useState<{ id: number; name: string }[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [form, setForm] = useState({
    asset_id: "",
    vaccine_id: "",
    treatment_date: "",
    remarks: "",
  })
  const [submitting, setSubmitting] = useState(false)

  // Fetch assets when dialog opens
  useEffect(() => {
    if (open) {
      setLoadingAssets(true)
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
      fetch("http://127.0.0.1:8000/api/lms/assets-service", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const list = data?.data?.list || data?.list || []
          setAssets(list.map((a: any) => ({ id: a.id, name: a.name || a.asset_ref_id || `Asset ${a.id}` })))
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
      const res = await fetch("http://127.0.0.1:8000/api/lms/vaccination-schedule-service", {
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
                    <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              <Input type="datetime-local" name="treatment_date" value={form.treatment_date} onChange={handleChange} required />
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