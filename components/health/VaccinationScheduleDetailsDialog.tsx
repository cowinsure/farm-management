import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface VaccinationScheduleRecord {
  id: number
  name: string
  color: string
  status: string
  due_date: string | null
  weight_kg: number
  completed_at: string | null
  is_completed: boolean
  reference_id: string
  vaccine_name: string
  age_in_months: number
}

interface VaccinationScheduleDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: VaccinationScheduleRecord | null
}

export default function VaccinationScheduleDetailsDialog({ open, onOpenChange, record }: VaccinationScheduleDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vaccination Schedule Details</DialogTitle>
        </DialogHeader>
        {record && (
          <div className="space-y-2 text-sm">
            <div><b>ID:</b> {record.id}</div>
            <div><b>Name:</b> {record.name}</div>
            <div><b>Reference ID:</b> {record.reference_id}</div>
            <div><b>Vaccine:</b> {record.vaccine_name}</div>
            <div><b>Status:</b> {record.status}</div>
            <div><b>Due Date:</b> {record.due_date || "-"}</div>
            <div><b>Completed At:</b> {record.completed_at || "-"}</div>
            <div><b>Is Completed:</b> {record.is_completed ? "Yes" : "No"}</div>
            <div><b>Weight (kg):</b> {record.weight_kg}</div>
            <div><b>Color:</b> {record.color}</div>
            <div><b>Age (months):</b> {record.age_in_months}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 