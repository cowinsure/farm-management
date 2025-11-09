"use client";

import InputField from "@/components/ui/InputField";
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
  >([]); // State for vaccination statuses
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
      if (!accessToken) {
        console.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/assets-type/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/breeds/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
            },
          }
        );

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/vaccination-status/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log(
            "Vaccination statuses fetched successfully:",
            result.data.results
          );
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/deworming-status/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log(
            "Deworming statuses fetched successfully:",
            result.data.results
          );
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update context
    updateStep({
      [name]: value,
    });

    // Clear the error for this field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  // Fetch data from the API on component mount
  useEffect(() => {
    if (data) {
      setFormData((prevData) => ({
        ...prevData,
        ...data, // Merge context data into local state
      }));
    }
  }, [data]);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.asset_type) newErrors.asset_type = "Asset Type is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.breed) newErrors.breed = "Breed is required";
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.age_in_months) newErrors.age_in_months = "Age is required";
    if (!formData.weight_kg) newErrors.weight_kg = "Weight is required";
    if (!formData.height) newErrors.height = "Height is required";
    if (!formData.purchase_amount)
      newErrors.purchase_amount = "Purchase amount is required";
    if (!formData.purchase_from)
      newErrors.purchase_from = "Purchase from is required";
    if (!formData.purchase_date)
      newErrors.purchase_date = "Purchase date is required";

    // Conditional fields
    if (formData.hasDisease === "true" && !formData.health_issues) {
      newErrors.health_issues = "Please specify the disease name";
    }

    if (formData.gender === "female" && formData.isPregnant === true) {
      if (!formData.pregnancy_status) {
        newErrors.pregnancy_status = "Pregnancy status is required";
      }
      if (!formData.last_date_of_calving) {
        newErrors.last_date_of_calving = "Last calving date is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    validateFields,
  }));

  return (
    <div className="w-full lg:w-[90%] mx-auto">
      <SectionHeading
        marginBottom="8"
        sectionTitle="Cattle Details"
        description="Add detailed information about the animal"
      />
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-8">
        <div className="">
              <label className="block mb-2" htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="Date of Birth"
                className="w-full p-2 border rounded"
              />
            </div>
      </div> */}

      {/* Input Fields */}
      <div className="flex flex-col gap-5 *:p-4" data-aos="zoom-in">
        {/* Basic */}
        <div className="border border-[#19A14B] rounded-lg bg-green-50">
          <h1 className="font-bold text-xl text-green-600 mb-8 md:mb-0">
            Basic Information
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            {/* Asset Type */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Asset Type
              </label>

              <select
                id="gender"
                name="asset_type"
                value={formData.asset_type}
                onChange={handleInputChange}
                required
                className={`appearance-none w-full border ${
                  errors.asset_type ? "border-red-600" : "border-gray-300"
                } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
              >
                <option value="">Select Asset Type</option>
                {assetTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.asset_type && (
                <p className="text-red-400 text-sm mt-1text-red-600 mt-1 font-medium">
                  {errors.asset_type}
                </p>
              )}

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
            </div>

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

            {/* Gender */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className={`appearance-none w-full border ${
                  errors.gender ? "border-red-600" : "border-gray-300"
                } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
              >
                <option value="" disabled className="text-sm text-gray-400">
                  Select gender
                </option>
                <option value="male" className="text-sm text-gray-700">
                  Male
                </option>
                <option value="female" className="text-sm text-gray-700">
                  Female
                </option>
              </select>

              {errors.gender && (
                <p className="text-red-400 text-sm mt-1text-red-600 mt-1 font-medium">
                  {errors.gender}
                </p>
              )}

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
            </div>

            {/* Breed */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Cattle Breed
              </label>

              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                required
                className={`appearance-none w-full border ${
                  errors.breed ? "border-red-600" : "border-gray-300"
                } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
              >
                <option value="" disabled>
                  Select Cattle Type
                </option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </select>
              {errors.breed && (
                <p className="text-red-400 text-sm mt-1text-red-600 mt-1 font-medium">
                  {errors.breed}
                </p>
              )}

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
            </div>

            {/* Color */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Cattle Color
              </label>

              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
                className={`appearance-none w-full border ${
                  errors.color ? "border-red-600" : "border-gray-300"
                } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
              >
                <option value="" disabled>
                  Select Cattle Color
                </option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
              {errors.color && (
                <p className="text-red-400 text-sm mt-1text-red-600 mt-1 font-medium">
                  {errors.color}
                </p>
              )}

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
            </div>

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
        <div className="border border-[#19A14B] rounded-lg bg-green-50">
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
        <div className="border border-[#19A14B] rounded-lg bg-green-50">
          <h1 className="font-bold text-xl text-green-600 mb-8 md:mb-0">
            Vaccination Information
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 md:p-6">
            {/*   Vaccination Status */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Vaccination Status
              </label>

              <select
                name="vaccination_status"
                value={formData.vaccination_status}
                onChange={handleInputChange}
                className={`appearance-none w-full border ${
                  errors.vaccination_status
                    ? "border-red-600"
                    : "border-gray-300"
                } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
              >
                <option value="" disabled>
                  Select Vaccination Status
                </option>
                {vaccinationStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
              {/* {errors.vaccination_status && (
                <p className="text-red-400 mt-1 font-medium text-sm">
                  {errors.vaccination_status}
                </p>
              )} */}
            </div>

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

            {/*  Deworming Status */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Deworming Status
              </label>

              <select
                name="deworming_status"
                value={formData.deworming_status}
                onChange={handleInputChange}
                className={`appearance-none w-full border ${
                  errors.deworming_status ? "border-red-600" : "border-gray-300"
                } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
              >
                <option value="" disabled>
                  Select Deworming Status
                </option>
                {dewormingStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
            </div>

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

            {/* Diseases */}
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="gender"
                className="mb-1 text-sm font-bold text-gray-600"
              >
                Has Disease?
              </label>

              <select
                name="hasDisease"
                value={String(formData.hasDisease)}
                onChange={handleInputChange}
                className={`appearance-none w-full border ${
                  errors.hasDisease ? "border-red-600" : "border-gray-300"
                } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                <IoMdArrowDropdown className="text-xl" />
              </div>
            </div>

            {/* Conditionally render the disease name input */}
            {formData.hasDisease === "true" && (
              <div>
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
              </div>
            )}

            {formData.gender === "female" && (
              <>
                {/*  Is Pregnant? */}
                <div className="relative w-full flex flex-col">
                  <label
                    htmlFor="gender"
                    className="mb-1 text-sm font-bold text-gray-600"
                  >
                    Is Pregnant?
                  </label>

                  <select
                    name="isPregnant"
                    value={String(formData.isPregnant)}
                    onChange={handleInputChange}
                    className={`appearance-none w-full border ${
                      errors.isPregnant ? "border-red-600" : "border-gray-300"
                    } bg-gray-50 rounded-md p-2 pr-10 font-semibold text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300 `}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>

                  {/* Custom dropdown icon */}
                  <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
                    <IoMdArrowDropdown className="text-xl" />
                  </div>
                </div>
                {formData.isPregnant && (
                  <>
                    <div className="">
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
                    </div>

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
