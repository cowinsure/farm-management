"use client";

import DropdownField from "@/components/DropDownField";
import InputField from "@/components/InputField";
import { useCowRegistration } from "@/context/CowRegistrationContext";
import { useLocalization } from "@/context/LocalizationContext";
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
  const { t, locale, setLocale } = useLocalization();
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
    if (!formData.asset_type)
      newErrors.asset_type = `${t("asset_type_required")}`;
    if (!formData.gender) newErrors.gender = `${t("gender_required")}`;
    if (!formData.breed) newErrors.breed = `{${t("breed_required")}}`;
    if (!formData.color) newErrors.color = `{${t("color_required")}}`;
    if (!formData.age_in_months)
      newErrors.age_in_months = `{${t("age_required")}}`;
    if (!formData.weight_kg) newErrors.weight_kg = `${t("weight_required")}`;
    if (!formData.height) newErrors.height = `${t("height_required")}`;

    // 💰 Purchase Information
    if (!formData.purchase_amount)
      newErrors.purchase_amount = `${t("purchase_amount_required")}`;
    if (!formData.purchase_from)
      newErrors.purchase_from = `${t("purchase_from_required")}`;
    if (!formData.purchase_date)
      newErrors.purchase_date = `${t("purchase_date_required")}`;

    // 💉 Vaccination Information
    if (!formData.vaccination_status)
      newErrors.vaccination_status = `${t("vaccination_status_required")}`;
    if (!formData.last_vaccination_date)
      newErrors.last_vaccination_date = `${t(
        "last_vaccination_date_required"
      )}`;
    if (!formData.deworming_status)
      newErrors.deworming_status = `${t("deworming_status_required")}`;
    if (!formData.last_deworming_date)
      newErrors.last_deworming_date = `${t("last_deworming_date_required")}`;

    // 🧬 Health Information
    if (formData.hasDisease === "true" && !formData.health_issues)
      newErrors.health_issues = `${t("specify_disease_name")}`;

    // 🤰 Pregnancy Information (only for females)
    if (formData.gender === "female" && formData.isPregnant === true) {
      if (!formData.pregnancy_status)
        newErrors.pregnancy_status = `${t("pregnancy_status_required")}`;
      if (!formData.last_date_of_calving)
        newErrors.last_date_of_calving = `${t("last_calving_date_required")}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({ validateFields }));

  return (
    <div className="w-full lg:w-[90%] mx-auto">
      <SectionHeading
        marginBottom="8"
        sectionTitle={t("add_cattle_details")}
        description={t("add_detailed_cattle_info")}
      />

      <div className="flex flex-col gap-5 *:p-4" data-aos="zoom-in">
        {/* Basic */}
        <div className=" rounded-lg bg-gray-50">
          <h1 className="font-bold text-xl text-green-600 mb-8 md:mb-0">
            {t("basic_information")}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            <DropdownField
              label={t("asset_type")}
              id="asset_type"
              name="asset_type"
              value={formData.asset_type}
              onChange={handleInputChange}
              options={assetTypes.map((a) => ({ value: a.id, label: a.name }))}
              error={errors.asset_type}
            />

            <InputField
              id="age"
              label={t("age_month")}
              name="age_in_months"
              onChange={handleInputChange}
              value={formData.age_in_months}
              placeholder={t("enter_age")}
              type="number"
              error={errors.age_in_months}
            />

            <DropdownField
              label={t("gender")}
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={[
                { value: "male", label: `${t("male")}` },
                { value: "female", label: `${t("female")}` },
              ]}
              error={errors.gender}
            />

            <DropdownField
              label={t("cattle_breed")}
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              options={breeds.map((b) => ({ value: b.id, label: b.name }))}
              error={errors.breed}
            />

            <DropdownField
              label={t("cattle_color")}
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              options={colors.map((c) => ({ value: c.id, label: c.name }))}
              error={errors.color}
            />

            <InputField
              id="weight"
              label={t("weight")}
              name="weight_kg"
              onChange={handleInputChange}
              value={formData.weight_kg}
              placeholder={t("enter_weight")}
              type="text"
              error={errors.weight_kg}
            />

            <InputField
              id="height"
              label={t("height")}
              name="height"
              onChange={handleInputChange}
              value={formData.height}
              placeholder={t("enter_height")}
              type="text"
              error={errors.height}
            />
          </div>
        </div>

        {/* Purchase */}
        <div className=" rounded-lg bg-gray-50">
          <h1 className="font-bold text-xl text-green-600 mb-8 md:mb-0">
            {t("purchase_information")}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            <InputField
              id="purchase_amount"
              label={t("purchase_amount")}
              type="text"
              name="purchase_amount"
              value={formData.purchase_amount}
              onChange={handleInputChange}
              placeholder={t("purchase_amount")}
              error={errors.purchase_amount}
            />
            <InputField
              label={t("purchase_from")}
              type="text"
              id="purchase_from"
              name="purchase_from"
              value={formData.purchase_from}
              onChange={handleInputChange}
              placeholder={t("purchase_from")}
              error={errors.purchase_from}
            />
            <div className="relative w-full">
              <InputField
                label={t("purchase_date")}
                type="date"
                id="purchase_date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleInputChange}
                placeholder={t("purchase_date")}
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
            {t("vaccination_information")}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            <DropdownField
              label={t("vaccination_status")}
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
                label={t("last_vaccination_date")}
                type="date"
                id="last_vaccination_date"
                name="last_vaccination_date"
                value={formData.last_vaccination_date}
                onChange={handleInputChange}
                placeholder={t("last_vaccination_date")}
              />
              <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
                <MdOutlineCalendarToday className="text-lg" />
              </div>
            </div>

            <DropdownField
              label={t("deworming_status")}
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
                label={t("last_deworming_date")}
                type="date"
                id="last_deworming_date"
                name="last_deworming_date"
                value={formData.last_deworming_date}
                onChange={handleInputChange}
                placeholder={t("last_deworming_date")}
              />
              <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
                <MdOutlineCalendarToday className="text-lg" />
              </div>
            </div>

            <DropdownField
              label={t("has_disease")}
              id="hasDisease"
              name="hasDisease"
              value={String(formData.hasDisease)}
              onChange={handleInputChange}
              options={[
                { value: "true", label: `${t("yes")}` },
                { value: "false", label: `${t("no")}` },
              ]}
              error={errors.hasDisease}
            />

            {formData.hasDisease === "true" && (
              <InputField
                label={t("disease_name")}
                id="diseases_name"
                type="text"
                name="health_issues"
                value={formData.health_issues}
                onChange={handleInputChange}
                placeholder={t("enter_disease_name")}
                error={errors.health_issues}
              />
            )}

            {formData.gender === "female" && (
              <>
                <DropdownField
                  label={t("is_pregnant")}
                  id="isPregnant"
                  name="isPregnant"
                  value={String(formData.isPregnant)}
                  onChange={handleInputChange}
                  options={[
                    { value: "true", label: `${t("yes")}` },
                    { value: "false", label: `${t("no")}` },
                  ]}
                  error={errors.isPregnant}
                />

                {formData.isPregnant && (
                  <>
                    <InputField
                      label={t("pregnancy_status")}
                      id=""
                      type="text"
                      name="pregnancy_status"
                      value={formData.pregnancy_status}
                      onChange={handleInputChange}
                      placeholder={t("enter_pregnancy_stage")}
                      error={errors.pregnancy_status}
                    />

                    <div className="relative w-full">
                      <InputField
                        label={t("last_calving_date")}
                        id=""
                        type="date"
                        name="last_date_of_calving"
                        value={formData.last_date_of_calving}
                        onChange={handleInputChange}
                        placeholder="t(enter_last_calving_date)"
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
