'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

type Location = {
  lat: string;
  long: string;
};

type CowRegistrationData = {
  owner: string;
  asset_type: string;
  breed: string;
  color: string;
  age_in_months: string;
  weight_kg: string;
  height: string;
  vaccination_status: string;
  last_vaccination_date: string;
  deworming_status: string;
  last_deworming_date: string;
  health_issues: string;
  pregnancy_status: string;
  remarks: string;
  last_date_of_calving: string;
  purchase_date: string;
  purchase_from: string;
  purchase_amount: string;
  // purchase_bill?: File | null;
  // created_by: string;
  // updated_by: string;
  // created_at: string;
  // updated_at: string;
  is_active: boolean;
  reference_id: string;
  special_mark?: File | null;
  muzzle_video?: File | null;
  left_side_image?: File | null;
  right_side_image?: File | null;
  challan_paper?: File | null;
  vet_certificate?: File | null;
  chairman_certificate?: File | null;
  image_with_owner?: File | null;
  // location: Location;
};

type CowRegistrationContextType = {
  data: CowRegistrationData;
  updateStep: (stepData: Partial<CowRegistrationData>) => void;
  validateStep: (stepFields: (keyof CowRegistrationData)[]) => boolean;
  reset: () => void;
};

const defaultData: CowRegistrationData = {
  owner: "",
  asset_type: "",
  breed: "",
  color: "",
  age_in_months: "",
  weight_kg: "",
  height: "",
  vaccination_status: "",
  last_vaccination_date: "",
  deworming_status: "",
  last_deworming_date: "",
  special_mark: null,
  health_issues: "",
  pregnancy_status: "",
  last_date_of_calving: "",
  purchase_date: "",
  purchase_from: "",
  purchase_amount: "",
  // created_by: "",
  // updated_by: "",
  // created_at: "",
  // updated_at: "",
  is_active: true,
  remarks: "",
  reference_id: Math.random().toExponential(), // Generate a random reference ID
  muzzle_video: null,
  left_side_image: null,
  right_side_image: null,
  challan_paper: null,
  vet_certificate: null,
  chairman_certificate: null,
  image_with_owner: null,
};

const CowRegistrationContext = createContext<CowRegistrationContextType | undefined>(undefined);

export const CowRegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CowRegistrationData>(defaultData);
  console.log(data, "data from context");


  

  const updateStep = (stepData: Partial<CowRegistrationData>) => {
    setData(prev => ({
      ...prev,
      ...stepData,
   
    }));
  };

  const validateStep = (stepFields: (keyof CowRegistrationData)[]) => {
    return stepFields.every(field => {
      // if (field === "location") {
      //   return data.location.lat !== "" && data.location.long !== "";
      // }
      const value = data[field];
      return typeof value === "boolean" || (typeof value === "string" && value.trim() !== "");
    });
  };

  const reset = () => setData(defaultData);

  return (
    <CowRegistrationContext.Provider value={{ data, updateStep, validateStep, reset }}>
      {children}
    </CowRegistrationContext.Provider>
  );
};

export const useCowRegistration = (): CowRegistrationContextType => {
  const context = useContext(CowRegistrationContext);
  if (!context) {
    throw new Error("useCowRegistration must be used within CowRegistrationProvider");
  }
  return context;
};
