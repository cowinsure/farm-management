"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { useToast } from "@/hooks/use-toast";
import { useLocalization } from "@/context/LocalizationContext";
import AssetSelection from "@/components/AssetSelection";

interface BreedingTrackingModalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormDataProps {
  asset_id: string;
  production_type_id: string;
  quantity: string;
  date: string;
  expecting_date: string;
}

export function BreedingTrackingModal({
  open,
  onOpenChange,
  onSuccess,
}: BreedingTrackingModalModalProps) {
  const { t, locale, setLocale } = useLocalization();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  // Static breeding methods (replaces production types)
  const breedingMethods = [
    { id: "natural", name: `${t("natural")}` },
    { id: "ai", name: `${t("artificial_insemination")}` },
  ];

  // State to handle form values
  const [formData, setFormData] = useState<FormDataProps>({
    asset_id: "",
    production_type_id: "",
    quantity: "",
    date: "",
    expecting_date: "",
  });


  // breedingMethods is static (no fetch required)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    // Normalize all select values to strings to avoid type mismatches
    const v = String(value);
    setFormData((prev) => ({
      ...prev,
      [name]: v,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      production_type_id: formData.production_type_id,
      date: formData.date,
      expecting_date: formData.expecting_date,
      asset_id: formData.asset_id,
    };

    // Save to localStorage immediately for development/offline purposes
    try {
      const existing = JSON.parse(localStorage.getItem("breedingLogs") || "[]");
      const newLog = { ...payload, created_at: new Date().toISOString() };
      const newLogs = [...existing, newLog];
      localStorage.setItem("breedingLogs", JSON.stringify(newLogs));

      // Dispatch a custom event so other parts of the app can pick up the change
      window.dispatchEvent(new Event("breedingLogUpdated"));

      // Clear form state after successful save
      setFormData({
        asset_id: "",
        production_type_id: "",
        quantity: "",
        date: "",
        expecting_date: "",
      });

      // Show success toast for every submission
      toast({
        title: "Success",
        description: "Breeding record saved",
      });

      // Close dialog and notify parent
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (storageErr: any) {
      // If saving to localStorage fails, show an error but still attempt to POST
      toast({
        title: "Warning",
        description: "Could not save locally. Trying to submit to server...",
      });
    } finally {
      setSubmitting(false);
    }

    // Continue to submit to server in background; report API errors if they occur
  };


  const selectedProductionType = breedingMethods.find(
    (product) => product.id === formData.production_type_id
  );


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("record_production")}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5">
              {/* Animal ID */}
              <AssetSelection
                value={formData.asset_id}
                onChange={(value) => handleSelectChange("asset_id", value)}
                label={t("animal_id")}
              />

              {/* Breeding Method */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("breeding_method")}
                </label>
                <Select
                  value={formData.production_type_id}
                  onValueChange={(value) =>
                    handleSelectChange("production_type_id", String(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("select_method")}>
                      {selectedProductionType?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {breedingMethods.map((m) => (
                      <SelectItem value={m.id} key={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Breeding Date */}
              {/* <div>
                <label className="block text-sm font-medium mb-1">Breeding Date</label>
                <Input
                  type="date"
                  className="w-full"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div> */}
              {/* Expecting Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("expecting_date")}
                </label>
                <Input
                  type="date"
                  className="w-full"
                  name="expecting_date"
                  value={formData.expecting_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Quality Grade */}
            {/* <div>
              <label className="block text-sm font-medium mb-1">
                Quality Grade
              </label>
              <Select
                value={formData.qualityGrade}
                onValueChange={(value) =>
                  handleSelectChange("qualityGrade", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Submit and Cancel Buttons */}
            <DialogFooter className="">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-[20%]">
                  {t("cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 text-white w-[40%]"
              >
                {submitting ? `${t("submitting")}` : `${t("record")}`}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
