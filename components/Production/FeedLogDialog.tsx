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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocalization } from "@/context/LocalizationContext";

const feedTypes = ["Hay", "Concentrate", "Silage", "Grain", "Pellets"];

interface FeedLogData {
  feedType: string;
  quantity: string;
  cost: string;
  date: string;
  supplier: string;
  notes: string;
}

interface FeedLogDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FeedLogDialog({ open, onClose }: FeedLogDialogProps) {
  const { t, locale, setLocale } = useLocalization();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeedLogData>({
    feedType: "",
    quantity: "",
    cost: "",
    date: new Date().toISOString().split("T")[0],
    supplier: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing feed logs or initialize empty array
    const existingLogs = JSON.parse(localStorage.getItem("feedLogs") || "[]");

    // Add new log to array
    const newLogs = [...existingLogs, formData];

    // Save to localStorage
    localStorage.setItem("feedLogs", JSON.stringify(newLogs));

    // Dispatch custom event to update feed logs immediately
    window.dispatchEvent(new Event("feedLogUpdated"));

    // Show success toast
    toast({
      title: "Success",
      description: "Feed log has been recorded successfully",
    });

    // Reset form and close dialog
    setFormData({
      feedType: "",
      quantity: "",
      cost: "",
      date: new Date().toISOString().split("T")[0],
      supplier: "",
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("add_feed_log")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="feedType">{t("feed_type")}</label>
                <Select
                  value={formData.feedType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, feedType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    {feedTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="quantity">{t("quantity")}</label>
                <Input
                  id="quantity"
                  placeholder="e.g., 250 kg"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="cost">{t("cost")}</label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
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

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="supplier">{t("supplier")}</label>
                <Input
                  id="supplier"
                  placeholder={t("supplier_example")}
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
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
