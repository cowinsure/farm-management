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

interface RecordHealthIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Dummy data for dropdowns
const conditions = [
  { id: 1, name: "Mastitis" },
  { id: 2, name: "Foot Rot" },
]
const severities = [
  { id: 1, name: "Mild" },
  { id: 2, name: "Moderate" },
  { id: 3, name: "Severe" },
]
const statuses = [
  { id: 1, name: "Healthy" },
  { id: 2, name: "Under Treatment" },
  { id: 3, name: "Complete" },
  { id: 4, name: "Critical" },
]

export function RecordHealthIssueDialog({ open, onOpenChange, onSuccess }: RecordHealthIssueDialogProps) {
  const { toast } = useToast()
  const [assets, setAssets] = useState<{ id: number; name: string }[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
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
          // Assume data.list or data.data.list
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
      const by_user_id = typeof window !== "undefined" ? Number(localStorage.getItem("user_id")) || 1001 : 1001
      const payload = {
        ...form,
        condition_id: Number(form.condition_id),
        severity_id: Number(form.severity_id),
        asset_id: Number(form.asset_id),
        current_status_id: Number(form.current_status_id),
        by_user_id,
      }
      const res = await fetch("http://127.0.0.1:8000/api/lms/health-record-service/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.status === "success") {
        toast({ title: "Success", description: data.message || "Health record inserted successfully" })
        onOpenChange(false)
        if (onSuccess) onSuccess()
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
        })
      } else {
        throw new Error(data.message || "Failed to insert health record")
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to insert health record" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Health Issue</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <Select value={form.condition_id} onValueChange={(v) => handleSelect("condition_id", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <Select value={form.severity_id} onValueChange={(v) => handleSelect("severity_id", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Symptoms</label>
              <Input name="symptoms" value={form.symptoms} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Treatment</label>
              <Input name="treatment" value={form.treatment} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Treatment Date</label>
              <Input type="datetime-local" name="treatment_date" value={form.treatment_date} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Veterinarian</label>
              <Input name="veterinarian" value={form.veterinarian} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <Input name="remarks" value={form.remarks} onChange={handleChange} />
            </div>
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
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={form.current_status_id} onValueChange={(v) => handleSelect("current_status_id", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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