"use client";

import DropdownField from "@/components/DropDownField";
import InputField from "@/components/InputField";
import { useCowRegistration } from "@/context/CowRegistrationContext";
import SectionHeading from "@/helper/SectionHeading";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCalendarToday } from "react-icons/md";

interface FormData {
  hasDisease: string | boolean;
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

export type StepTwoRef = {
  validateFields: () => boolean;
};

const StepTwo = forwardRef<StepTwoRef>((props, ref) => {
  const { data, updateStep } = useCowRegistration();

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [vaccinationStatuses, setVaccinationStatuses] = useState<
    VaccinationStatus[]
  >([]);
  const [dewormingStatuses, setDewormingStatuses] = useState<DewormingStatus[]>(
    []
  );
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch asset types from the API
  useEffect(() => {
    const fetchAssetTypes = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return console.error("Access token missing");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/assets-type/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const result = await response.json();
        if (response.ok) setAssetTypes(result.data.results);
      } catch (error) {
        console.error("Error fetching asset types:", error);
      }
    };
    fetchAssetTypes();
  }, []);

  // Fetch breeds
  useEffect(() => {
    const fetchBreeds = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/breeds/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const result = await response.json();
        if (response.ok) setBreeds(result.data.results);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };
    fetchBreeds();
  }, []);

  // Fetch colors
  useEffect(() => {
    const fetchColors = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/colors/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const result = await response.json();
        if (response.ok) setColors(result.data.results);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    fetchColors();
  }, []);

  // Fetch vaccination statuses
  useEffect(() => {
    const fetchVaccinationStatuses = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/vaccination-status/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const result = await response.json();
        if (response.ok) setVaccinationStatuses(result.data.results);
      } catch (error) {
        console.error("Error fetching vaccination statuses:", error);
      }
    };
    fetchVaccinationStatuses();
  }, []);

  // Fetch deworming statuses
  useEffect(() => {
    const fetchDewormingStatuses = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/deworming-status/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const result = await response.json();
        if (response.ok) setDewormingStatuses(result.data.results);
      } catch (error) {
        console.error("Error fetching deworming statuses:", error);
      }
    };
    fetchDewormingStatuses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    updateStep({ [name]: value });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  useEffect(() => {
    if (data) setFormData((prev) => ({ ...prev, ...data }));
  }, [data]);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    // 🐮 Basic Information
    if (!formData.asset_type) newErrors.asset_type = "Asset Type is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.breed) newErrors.breed = "Breed is required";
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.age_in_months) newErrors.age_in_months = "Age is required";
    if (!formData.weight_kg) newErrors.weight_kg = "Weight is required";
    if (!formData.height) newErrors.height = "Height is required";

    // 💰 Purchase Information
    if (!formData.purchase_amount)
      newErrors.purchase_amount = "Purchase amount is required";
    if (!formData.purchase_from)
      newErrors.purchase_from = "Purchase from is required";
    if (!formData.purchase_date)
      newErrors.purchase_date = "Purchase date is required";

    // 💉 Vaccination Information
    if (!formData.vaccination_status)
      newErrors.vaccination_status = "Vaccination status is required";
    if (!formData.last_vaccination_date)
      newErrors.last_vaccination_date = "Last vaccination date is required";
    if (!formData.deworming_status)
      newErrors.deworming_status = "Deworming status is required";
    if (!formData.last_deworming_date)
      newErrors.last_deworming_date = "Last deworming date is required";

    // 🧬 Health Information
    if (formData.hasDisease === "true" && !formData.health_issues)
      newErrors.health_issues = "Please specify the disease name";

    // 🤰 Pregnancy Information (only for females)
    if (formData.gender === "female" && formData.isPregnant === true) {
      if (!formData.pregnancy_status)
        newErrors.pregnancy_status = "Pregnancy status is required";
      if (!formData.last_date_of_calving)
        newErrors.last_date_of_calving = "Last calving date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({ validateFields }));

  return (
    <div className="w-full lg:w-[90%] mx-auto">
      <SectionHeading
        marginBottom="8"
        sectionTitle="Add Cattle Details"
        description="Add all the informations about the cattle"
      />

      <div className="flex flex-col gap-5 *:p-4" data-aos="zoom-in">
        {/* Basic */}
        <div className=" rounded-lg bg-gray-50">
          <h1 className="font-bold text-xl text-green-600 mb-8 md:mb-0">
            Basic Information
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            <DropdownField
              label="Asset Type"
              id="asset_type"
              name="asset_type"
              value={formData.asset_type}
              onChange={handleInputChange}
              options={assetTypes.map((a) => ({ value: a.id, label: a.name }))}
              error={errors.asset_type}
            />

            <InputField
              id="age"
              label="Age in Month"
              name="age_in_months"
              onChange={handleInputChange}
              value={formData.age_in_months}
              placeholder="Enter age"
              type="number"
              error={errors.age_in_months}
            />

            <DropdownField
              label="Gender"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              error={errors.gender}
            />

            <DropdownField
              label="Cattle Breed"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              options={breeds.map((b) => ({ value: b.id, label: b.name }))}
              error={errors.breed}
            />

            <DropdownField
              label="Cattle Color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              options={colors.map((c) => ({ value: c.id, label: c.name }))}
              error={errors.color}
            />

            <InputField
              id="weight"
              label="Weight in Kg"
              name="weight_kg"
              onChange={handleInputChange}
              value={formData.weight_kg}
              placeholder="Enter weight"
              type="text"
              error={errors.weight_kg}
            />

            <InputField
              id="height"
              label="Height in feet"
              name="height"
              onChange={handleInputChange}
              value={formData.height}
              placeholder="Enter Height"
              type="text"
              error={errors.height}
            />
          </div>
        </div>

        {/* Purchase */}
        <div className=" rounded-lg bg-gray-50">
          <h1 className="font-bold text-xl text-green-600 mb-8 md:mb-0">
            Purchase Information
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            <InputField
              id="purchase_amount"
              label="Purchase Amount"
              type="text"
              name="purchase_amount"
              value={formData.purchase_amount}
              onChange={handleInputChange}
              placeholder="Purchase Amount"
              error={errors.purchase_amount}
            />
            <InputField
              label="Purchase From"
              type="text"
              id="purchase_from"
              name="purchase_from"
              value={formData.purchase_from}
              onChange={handleInputChange}
              placeholder="Purchase From"
              error={errors.purchase_from}
            />
            <div className="relative w-full">
              <InputField
                label="Purchase Date"
                type="date"
                id="purchase_date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleInputChange}
                placeholder="Purchase Date"
                error={errors.purchase_date}
              />
              <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
                <MdOutlineCalendarToday className="text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Vaccination */}
        <div className=" rounded-lg bg-gray-50">
          <h1 className="font-bold text-xl text-green-600 mb-8 md:mb-0">
            Vaccination Information
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            <DropdownField
              label="Vaccination Status"
              id="vaccination_status"
              name="vaccination_status"
              value={formData.vaccination_status}
              onChange={handleInputChange}
              options={vaccinationStatuses.map((v) => ({
                value: v.id,
                label: v.name,
              }))}
              error={errors.vaccination_status}
            />

            <div className="relative w-full">
              <InputField
                label="Last Vaccinated Date"
                type="date"
                id="last_vaccination_date"
                name="last_vaccination_date"
                value={formData.last_vaccination_date}
                onChange={handleInputChange}
                placeholder="Date of Birth"
              />
              <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
                <MdOutlineCalendarToday className="text-lg" />
              </div>
            </div>

            <DropdownField
              label="Deworming Status"
              id="deworming_status"
              name="deworming_status"
              value={formData.deworming_status}
              onChange={handleInputChange}
              options={dewormingStatuses.map((d) => ({
                value: d.id,
                label: d.name,
              }))}
              error={errors.deworming_status}
            />

            <div className="relative w-full">
              <InputField
                label="Last Deworming Date"
                type="date"
                id="last_deworming_date"
                name="last_deworming_date"
                value={formData.last_deworming_date}
                onChange={handleInputChange}
                placeholder="Last Dewormed Date"
              />
              <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
                <MdOutlineCalendarToday className="text-lg" />
              </div>
            </div>

            <DropdownField
              label="Has Disease?"
              id="hasDisease"
              name="hasDisease"
              value={String(formData.hasDisease)}
              onChange={handleInputChange}
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              error={errors.hasDisease}
            />

            {formData.hasDisease === "true" && (
              <InputField
                label="Disease Name"
                id="diseases_name"
                type="text"
                name="health_issues"
                value={formData.health_issues}
                onChange={handleInputChange}
                placeholder="Disease Name"
                error={errors.health_issues}
              />
            )}

            {formData.gender === "female" && (
              <>
                <DropdownField
                  label="Is Pregnant?"
                  id="isPregnant"
                  name="isPregnant"
                  value={String(formData.isPregnant)}
                  onChange={handleInputChange}
                  options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                  error={errors.isPregnant}
                />

                {formData.isPregnant && (
                  <>
                    <InputField
                      label="Pregnancy Status"
                      id=""
                      type="text"
                      name="pregnancy_status"
                      value={formData.pregnancy_status}
                      onChange={handleInputChange}
                      placeholder="Pregnancy Stage"
                      error={errors.pregnancy_status}
                    />

                    <div className="relative w-full">
                      <InputField
                        label="Date of Last Calving"
                        id=""
                        type="date"
                        name="last_date_of_calving"
                        value={formData.last_date_of_calving}
                        onChange={handleInputChange}
                        placeholder="Date of Last Calving"
                        error={errors.last_date_of_calving}
                      />
                      <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
                        <MdOutlineCalendarToday className="text-lg" />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
StepTwo.displayName = "StepTwo";

export default StepTwo;
