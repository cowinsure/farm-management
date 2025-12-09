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

interface BirthTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormDataProps {
  asset_id: string;
 
  birthdate: string;
  expecting_date: string;
  gender?: string;
  birth_weight?: string;
}


export function BirthTrackingModal({
  open,
  onOpenChange,
  onSuccess,
}: BirthTrackingModalProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isAnimals, setAnimals] = useState<any[]>([]);
  // (no remote production types needed for birth tracking)

  // State to handle form values
  const [formData, setFormData] = useState<FormDataProps>({
    asset_id: "",
    birthdate: "",
    expecting_date: "",
    gender: "",
    birth_weight: "",
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

    // Basic validation
    if (!formData.asset_id) {
      toast({ title: "Validation", description: "Please select an animal" });
      return;
    }
    if (!formData.birthdate) {
      toast({ title: "Validation", description: "Please provide birth date" });
      return;
    }

    setSubmitting(true);

    const payload = {
      asset_id: formData.asset_id,
      birthdate: formData.birthdate,
      expecting_date: formData.expecting_date,
      gender: formData.gender,
      birth_weight: formData.birth_weight,
    };

    // Save to localStorage immediately for development/offline purposes
    try {
      if (typeof window === "undefined") throw new Error("No window");

      let existing: any[] = [];
      try {
        const raw = localStorage.getItem("birthlogs");
        existing = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(existing)) existing = [];
      } catch (parseErr) {
        // If parsing fails, reset to empty array to avoid blocking saves
        console.warn("Failed to parse birthlogs, resetting to empty array", parseErr);
        existing = [];
      }

      const newLog = {
        id: Date.now().toString(),
        ...payload,
        reference_id: selectedCattle?.reference_id || null,
        created_at: new Date().toISOString(),
      };

      const newLogs = [...existing, newLog];
      localStorage.setItem("birthlogs", JSON.stringify(newLogs));

      // Dispatch a custom event with detail so other parts can react and receive the new entry
      window.dispatchEvent(new CustomEvent("birthLogUpdated", { detail: newLog }));

      // Clear form state after successful save
      setFormData({
        asset_id: "",
        birthdate: "",
        expecting_date: "",
        gender: "",
        birth_weight: "",
      });

      // Show success toast for every submission
      toast({ title: "Success", description: "Birth record saved locally" });

      // Close dialog and notify parent
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (storageErr: any) {
      console.error("Could not save to localStorage:", storageErr);
      toast({ title: "Warning", description: "Could not save locally." });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCattle = isAnimals.find(
    (animal) => String(animal.id) === formData.asset_id
  );

  console.log(isAnimals);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Birth</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5">
              {/* Animal ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Animal ID
                </label>
                <Select
                  value={formData.asset_id?.toString() || ""}
                  onValueChange={(value) =>
                    handleSelectChange("asset_id", String(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Cattle">
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

             

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium mb-1">Birth Date</label>
                <Input
                  type="date"
                  className="w-full"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => handleSelectChange("gender", String(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Weight (span full width) */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Birth Weight</label>
                <Input
                  type="text"
                  placeholder="e.g., 35 kg"
                  className="w-full"
                  name="birth_weight"
                  value={formData.birth_weight}
                  onChange={handleInputChange}
                />
              </div>
             
            </div>



            {/* Submit and Cancel Buttons */}
            <DialogFooter className="">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-[20%]">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 text-white w-[40%]"
              >
                {submitting ? "Submitting" : "Record"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
