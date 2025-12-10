"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocalization } from "@/context/LocalizationContext";
import AssetSelection from "@/components/AssetSelection";

interface WeightTrackingData {
  animalId: string;
  animalType: string;
  weight: string;
  date: string;
  notes: string;
}

interface Asset {
  id: number;
  name: string;
  reference_id: string;
  img: string;
  breed: string;
  age: number;
}

interface WeightTrackingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function WeightTrackingDialog({
  open,
  onClose,
}: WeightTrackingDialogProps) {
  const { t, locale, setLocale } = useLocalization();
  const { toast } = useToast();
  const [formData, setFormData] = useState<WeightTrackingData>({
    animalId: "",
    animalType: "",
    weight: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [selectedAssetId, setSelectedAssetId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing weight logs or initialize empty array
    const existingLogs = JSON.parse(localStorage.getItem("weightLogs") || "[]");

    // Add new log to array
    const newLogs = [...existingLogs, formData];

    // Save to localStorage
    localStorage.setItem("weightLogs", JSON.stringify(newLogs));

    // Dispatch custom event to update weight logs immediately
    window.dispatchEvent(new Event("weightLogUpdated"));

    // Show success toast
    toast({
      title: "Success",
      description: "Weight has been recorded successfully",
    });

    // Reset form and close dialog
    setFormData({
      animalId: "",
      animalType: "",
      weight: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("record")} {t("weight")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <AssetSelection
              value={selectedAssetId}
              onChange={setSelectedAssetId}
              onAssetSelect={(asset) => {
                setFormData({
                  ...formData,
                  animalId: asset ? asset.reference_id : "",
                  animalType: asset ? asset.breed : "",
                });
              }}
              label={t("animal_id")}
              showQrScan={true}
              showMuzzleSearch={true}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="weight" className="text-sm font-medium">{t("weight")}</label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 500 kg"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">{t("date")}</label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">{t("notes")}</label>
              <Textarea
                id="notes"
                placeholder={t("addtional_notes")}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button variant="default" type="submit">
              {t("record")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
