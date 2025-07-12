'use client'

import { useCowRegistration } from "@/context/CowRegistrationContext";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


interface FormData {
  hasDisease: boolean;
  isPregnant: boolean;
  asset_type: string;
  gender: string;
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
}

interface Breed {
  id: number;
  name: string;
  description: string | null;
}

interface Color {
  id: number;
  name: string;
  description: string | null;
}

interface VaccinationStatus {
  id: number;
  name: string;
  description: string | null;
}


interface DewormingStatus {
  id: number;
  name: string;
  description: string | null;
}

interface AssetType {
  id: number;
  name: string;
}

export default function StepTwo() {
  const { data, updateStep, validateStep, reset } = useCowRegistration();

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [vaccinationStatuses, setVaccinationStatuses] = useState<VaccinationStatus[]>([]);
  const [dewormingStatuses, setDewormingStatuses] = useState<DewormingStatus[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);

  const [formData, setFormData] = useState<FormData>({
    hasDisease: false,
    isPregnant: false,
    gender: "",
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
    health_issues: "",
    pregnancy_status: "",
    remarks: "",
    last_date_of_calving: "",
    purchase_date: "",
    purchase_from: "",
    purchase_amount: "",
  });

  // Fetch asset types from the API
  useEffect(() => {
    const fetchAssetTypes = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/assets-type/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Asset types fetched successfully:", result.data.results);
          setAssetTypes(result.data.results); // Update the assetTypes state with API data
        } else {
          console.error("Failed to fetch asset types:", result);
        }
      } catch (error) {
        console.error("Error fetching asset types:", error);
      }
    };

    fetchAssetTypes();
  }, []);

  // Fetch breeds from the API
  useEffect(() => {
    const fetchBreeds = async () => {
      const accessToken = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/breeds/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Breeds fetched successfully:", result.data.results);
          setBreeds(result.data.results); // Update the breeds state with API data
        } else {
          console.error("Failed to fetch breeds:", result);
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };



    fetchBreeds();
  }, []);

  // Fetch colors from the API
  useEffect(() => {
    const fetchColors = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Colors fetched successfully:", result.data.results);
          setColors(result.data.results);
        } else {
          console.error("Failed to fetch colors:", result);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);


  // Fetch vaccination statuses from the API
  useEffect(() => {
    const fetchVaccinationStatuses = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vaccination-status/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Vaccination statuses fetched successfully:", result.data.results);
          setVaccinationStatuses(result.data.results); // Update the vaccinationStatuses state with API data
        } else {
          console.error("Failed to fetch vaccination statuses:", result);
        }
      } catch (error) {
        console.error("Error fetching vaccination statuses:", error);
      }
    };

    fetchVaccinationStatuses();
  }, []);

  // Fetch deworming statuses from the API
  useEffect(() => {
    const fetchDewormingStatuses = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deworming-status/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Deworming statuses fetched successfully:", result.data.results);
          setDewormingStatuses(result.data.results); // Update the dewormingStatuses state with API data
        } else {
          console.error("Failed to fetch deworming statuses:", result);
        }
      } catch (error) {
        console.error("Error fetching deworming statuses:", error);
      }
    };

    fetchDewormingStatuses();
  }, []);

  console.log(formData, "form data from step two");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    updateStep({
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    updateStep({
      [name]: value,
    });
  };

  // Fetch data from the API on component mount
  useEffect(() => {
    if (data) {
      setFormData((prevData) => ({
        ...prevData,
        ...data,
      }));
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Animal Details</h2>
        <p className="text-gray-600">Provide detailed information about the animal</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset_type">Asset Type</Label>
              <Select value={formData.asset_type} onValueChange={(value) => handleSelectChange("asset_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age_in_months">Age (Months)</Label>
              <Input
                type="number"
                id="age_in_months"
                name="age_in_months"
                value={formData.age_in_months}
                onChange={handleInputChange}
                placeholder="Enter age in months"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Select value={formData.breed} onValueChange={(value) => handleSelectChange("breed", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Breed" />
                </SelectTrigger>
                <SelectContent>
                  {breeds.map((breed) => (
                    <SelectItem key={breed.id} value={String(breed.id)}>
                      {breed.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={String(color.id)}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                type="number"
                id="weight_kg"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleInputChange}
                placeholder="Enter weight in kg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (feet)</Label>
              <Input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Enter height in feet"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Purchase Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_amount">Purchase Amount</Label>
              <Input
                type="number"
                id="purchase_amount"
                name="purchase_amount"
                value={formData.purchase_amount}
                onChange={handleInputChange}
                placeholder="Enter purchase amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_from">Purchase From</Label>
              <Input
                type="text"
                id="purchase_from"
                name="purchase_from"
                value={formData.purchase_from}
                onChange={handleInputChange}
                placeholder="Enter seller name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                type="date"
                id="purchase_date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Health Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vaccination_status">Vaccination Status</Label>
              <Select value={formData.vaccination_status} onValueChange={(value) => handleSelectChange("vaccination_status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Vaccination Status" />
                </SelectTrigger>
                <SelectContent>
                  {vaccinationStatuses.map((status) => (
                    <SelectItem key={status.id} value={String(status.id)}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_vaccination_date">Last Vaccination Date</Label>
              <Input
                type="date"
                id="last_vaccination_date"
                name="last_vaccination_date"
                value={formData.last_vaccination_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deworming_status">Deworming Status</Label>
              <Select value={formData.deworming_status} onValueChange={(value) => handleSelectChange("deworming_status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Deworming Status" />
                </SelectTrigger>
                <SelectContent>
                  {dewormingStatuses.map((status) => (
                    <SelectItem key={status.id} value={String(status.id)}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_deworming_date">Last Deworming Date</Label>
              <Input
                type="date"
                id="last_deworming_date"
                name="last_deworming_date"
                value={formData.last_deworming_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hasDisease">Has Disease?</Label>
              <Select value={String(formData.hasDisease)} onValueChange={(value) => handleSelectChange("hasDisease", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.hasDisease && (
            <div className="space-y-2">
              <Label htmlFor="health_issues">Disease Name</Label>
              <Input
                type="text"
                id="health_issues"
                name="health_issues"
                value={formData.health_issues}
                onChange={handleInputChange}
                placeholder="Enter disease name"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pregnancy Information (Female Only) */}
      {formData.gender === "female" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pregnancy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isPregnant">Is Pregnant?</Label>
                <Select value={String(formData.isPregnant)} onValueChange={(value) => handleSelectChange("isPregnant", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.isPregnant && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pregnancy_status">Pregnancy Status</Label>
                    <Input
                      type="text"
                      id="pregnancy_status"
                      name="pregnancy_status"
                      value={formData.pregnancy_status}
                      onChange={handleInputChange}
                      placeholder="Enter pregnancy stage"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_date_of_calving">Date of Last Calving</Label>
                    <Input
                      type="date"
                      id="last_date_of_calving"
                      name="last_date_of_calving"
                      value={formData.last_date_of_calving}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}