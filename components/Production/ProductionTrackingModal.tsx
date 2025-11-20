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

interface RecordProductionTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormDataProps {
  asset_id: string;
  production_type_id: string;
  quantity: string;
  date: string;
}

export function RecordProductionTrackingModal({
  open,
  onOpenChange,
  onSuccess,
}: RecordProductionTrackingModalProps) {
  const { t, locale, setLocale } = useLocalization();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isAnimals, setAnimals] = useState<any[]>([]);
  const [productionType, setProductionType] = useState<any[]>([]);

  // State to handle form values
  const [formData, setFormData] = useState<FormDataProps>({
    asset_id: "",
    production_type_id: "",
    quantity: "",
    date: "",
  });

  //   useEffect for get asset list
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

  // useEffect for production type
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/production-type-service/?page_size=10&start_record=1`,
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
        setProductionType(data.data);
      })
      .catch((err: any) => {
        console.error("Fetch error:", err);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      production_type_id: formData.production_type_id,
      quantity: formData.quantity,
      date: formData.date,
      asset_id: formData.asset_id,
    };

    console.log("Payload", payload);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lms/production-record-service/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Optionally close the form or perform any other actions
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(data.message || "Failed to submit the form");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit the form",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCattle = isAnimals.find(
    (animal) => animal.id === formData.asset_id
  );

  const selectedProductionType = productionType.find(
    (product) => product.type_name === formData.production_type_id
  );

  console.log(isAnimals);

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
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("animal_id")}
                </label>
                <Select
                  value={formData.asset_id?.toString() || ""}
                  onValueChange={(value) =>
                    handleSelectChange("asset_id", Number(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("select_cattle_id")}>
                      {selectedCattle?.reference_id}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {isAnimals.map((animal) => (
                      <SelectItem value={animal.id.toString()} key={animal.id}>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <img
                            src={"/placeholder.png"}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          {animal.reference_id}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Production Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("production_type")}
                </label>
                <Select
                  value={formData.production_type_id}
                  onValueChange={(value) =>
                    handleSelectChange("production_type_id", Number(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("select_type")}>
                      {selectedProductionType?.type_name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {productionType.map((type) => (
                      <SelectItem value={type.id} key={type.id}>
                        {type.type_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("quantity")}
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 25 liters"
                  className="w-full"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("date")}
                </label>
                <Input
                  type="date"
                  className="w-full"
                  name="date"
                  value={formData.date}
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
