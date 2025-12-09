"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";


const animalTypes = ["Cow", "Bull", "Calf", "Heifer", "Steer"];

interface WeightTrackingData {
  animalId: string;
  animalType: string;
  weight: string;
  date: string;
  notes: string;
}

interface Animal {
  id: number;
  reference_id: string;
  asset_type: string;
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
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [formData, setFormData] = useState<WeightTrackingData>({
    animalId: "",
    animalType: "",
    weight: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Fetch animals from API
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/assets-service?start_record=1&page_size=10`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    )
      .then(async (res: Response) => {
        if (!res.ok) {
          const text = await res.text();
          console.log(text);
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: any) => {
        setAnimals(data.data.list);
      })
      .catch((err: any) => {
        console.error("Fetch error:", err);
      });
  }, []);

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
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="animalId">{t("animal_id")}</label>
                <Select
                  value={formData.animalId}
                  onValueChange={(value) => {
                    const selectedAnimal = animals?.find(
                      (animal: Animal) => animal.id.toString() === value
                    );
                    setFormData({
                      ...formData,
                      animalId: value,
                      animalType: selectedAnimal?.asset_type || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_cattle_id")} />
                  </SelectTrigger>
                  <SelectContent className="w-screen max-w-md">
                    {animals?.map((animal: Animal) => (
                      <SelectItem
                        value={animal.reference_id.toString()}
                        key={animal.id}
                      >
                        <div className="flex items-center gap-2 cursor-pointer w-full min-w-0">
                          <img
                            src={"/placeholder.png"}
                            alt=""
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <span
                            className="truncate text-sm"
                            title={animal.reference_id}
                          >
                            {animal.reference_id}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="grid gap-2">
                <label htmlFor="animalType">{t("type")}</label>
                <Input
                  id="animalType"
                  value={formData.animalType}
                  readOnly
                  placeholder="Auto-filled based on selection"
                />
              </div> */}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="weight">{t("weight")}</label>
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
                <label htmlFor="date">{t("date")}</label>
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
              <label htmlFor="notes">{t("notes")}</label>
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
