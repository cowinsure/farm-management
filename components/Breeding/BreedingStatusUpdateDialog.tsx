"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useLocalization } from "@/context/LocalizationContext";
import VetSelection from "@/components/VetSelection";
import { ImageUploadBlock } from "@/helper/ImageUploadBlock";

interface BreedingStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: any;
}

export function BreedingStatusUpdateDialog({
  open,
  onOpenChange,
  record,
}: BreedingStatusUpdateDialogProps) {
  const { t, locale, setLocale } = useLocalization();
  const [status, setStatus] = useState("");
  const [confirmationDate, setConfirmationDate] = useState("");
  const [confirmationMethod, setConfirmationMethod] = useState("");
  const [expectedCalvingDate, setExpectedCalvingDate] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File | null>(null);

  const handleSubmit = () => {
    const updatedRecord = {
      ...record,
      pregnancyStatus: status,
      confirmationDate,
      confirmationMethod,
      expectedCalvingDate,
      veterinarian,
      notes,
      attachments,
      updatedAt: new Date().toISOString(),
    };

    // Get existing records
    const records = JSON.parse(localStorage.getItem("breedingLogs") || "[]");

    // Update the specific record
    const updatedRecords = records?.map((r: any) =>
      r.cowId === record.cowId && r.breedingDate === record.breedingDate
        ? updatedRecord
        : r
    );

    // Save back to localStorage
    localStorage.setItem("breedingLogs", JSON.stringify(updatedRecords));

    // Trigger update event
    window.dispatchEvent(new Event("breedingLogUpdated"));

    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("update_breeding_status")}</DialogTitle>
          <div className="text-sm text-muted-foreground">{record?.cowId}</div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("breeding_outcome")}
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("select_outcome")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pregnancy Confirmed">
                  {t("pregnancy_confirmed")}
                </SelectItem>
                <SelectItem value="Breeding Failed">
                  {t("breeding_failed")}
                </SelectItem>
                <SelectItem value="Birth Completed">
                  {t("birth_completed")}
                </SelectItem>
                <SelectItem value="Under Monitoring">
                  {t("under_monitoring")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status !== "Pregnancy Confirmed" && (
            <>
              <div className="space-y-2">
                <VetSelection
                  value={veterinarian}
                  onChange={(value) => setVeterinarian(value as string)}
                  label={t("veterinarian")}
                  placeholder="Select Veterinarian"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Attachments")} (optional)
                </label>
                <ImageUploadBlock
                  imageFile={attachments}
                  onCapture={setAttachments}
                  title="Upload Attachment"
                  fieldKey="attachment"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("notes")}</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("additional_observations")}
                />
              </div>
            </>
          )}

          {status === "Pregnancy Confirmed" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {t("confirmation_date")}
                  </label>
                  <Input
                    type="date"
                    value={confirmationDate}
                    onChange={(e) => setConfirmationDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("confirmation_method")}
                  </label>
                  <Select
                    value={confirmationMethod}
                    onValueChange={setConfirmationMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("ultrasound")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ultrasound">
                        {t("ultrasound")}
                      </SelectItem>
                      <SelectItem value="Blood Test">
                        {t("blood_test")}
                      </SelectItem>
                      <SelectItem value="Visual">{t("visual")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("expected_calving_date")}
                  </label>
                  <Input
                    type="date"
                    value={expectedCalvingDate}
                    onChange={(e) => setExpectedCalvingDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div>
                  <VetSelection
                    value={veterinarian}
                    onChange={(value) => setVeterinarian(value as string)}
                    label={t("veterinarian")}
                    placeholder="Select Veterinarian"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("Attachments")} (optional)
                </label>
                <ImageUploadBlock
                  imageFile={attachments}
                  onCapture={setAttachments}
                  title="Upload Attachment"
                  fieldKey="attachment"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">{t("notes")}</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("additional_observations")}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            {t("update_status")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
