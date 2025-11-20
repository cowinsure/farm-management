import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocalization } from "@/context/LocalizationContext";

interface VaccinationScheduleRecord {
  id: number;
  name: string;
  color: string;
  status: string;
  due_date: string | null;
  weight_kg: number;
  completed_at: string | null;
  is_completed: boolean;
  reference_id: string;
  vaccine_name: string;
  age_in_months: number;
}

interface VaccinationScheduleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: VaccinationScheduleRecord | null;
}

export default function VaccinationScheduleDetailsDialog({
  open,
  onOpenChange,
  record,
}: VaccinationScheduleDetailsDialogProps) {
  const { t, locale, setLocale } = useLocalization();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("vaccination_schedule_details")}</DialogTitle>
        </DialogHeader>
        {record && (
          <div className="space-y-2 text-sm">
            <div>
              <b>{t("id")}:</b> {record.id}
            </div>
            <div>
              <b>{t("name")}:</b> {record.name}
            </div>
            <div>
              <b>{t("reference_id")}:</b> {record.reference_id}
            </div>
            <div>
              <b>{t("vaccine")}:</b> {record.vaccine_name}
            </div>
            <div>
              <b>{t("status")}:</b> {record.status}
            </div>
            <div>
              <b>{t("due_date")}:</b> {record.due_date || "-"}
            </div>
            <div>
              <b>{t("completed_at")}:</b> {record.completed_at || "-"}
            </div>
            <div>
              <b>{t("is_completed")}:</b>{" "}
              {record.is_completed ? t("yes") : t("no")}
            </div>
            <div>
              <b>{t("weight")}:</b> {record.weight_kg}
            </div>
            <div>
              <b>{t("color")}:</b> {record.color}
            </div>
            <div>
              <b>{t("age")}:</b> {record.age_in_months}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
