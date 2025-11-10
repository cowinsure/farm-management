"use client";

import { useCowRegistration } from "@/context/CowRegistrationContext";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import logo from "../../../public/logo-03.png";
import { unauthorized, useRouter } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { TbArrowBadgeRightFilled } from "react-icons/tb";

import Link from "next/link";

import { toast } from "sonner";
import StepOne, {
  StepOneRef,
} from "@/components/Livestock/AssetRegistration/StepOne";
import StepTwo, {
  StepTwoRef,
} from "@/components/Livestock/AssetRegistration/StepTwo";
import StepFour, {
  StepFourRef,
} from "@/components/Livestock/AssetRegistration/StepFour";
import ModalGeneral from "@/modal/DialogGeneral";
import MuzzleGuidlines from "@/components/Livestock/MuzzleGuidlines";
import { Stepper } from "@/helper/Stepper";
import SectionHeading from "@/helper/SectionHeading";

const steps = ["Muzzel Detection", "Cow Details", "Attachments"];

export default function StepForm() {
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { data, reset } = useCowRegistration();

  const [locationError, setLocationError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isGuidanceModal, setIsGuidanceModal] = useState(false);
  const stepOneRef = useRef<StepOneRef>(null);
  const stepFourRef = useRef<StepFourRef>(null);
  const stepTwoRef = useRef<StepTwoRef>(null);

  useEffect(() => {
    const showModal = () => setIsGuidanceModal(true);
    const timer = setTimeout(showModal, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    setLocationError(null);
    // Check geolocation permission and get location
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    if (stepFourRef.current && !stepFourRef.current.validateFields()) {
      // Validation failed, do NOT submit, maybe show a toast or just return
      toast.error("Please fix errors before submitting.");
      return;
    }

    setIsLoading(true); // Show loading spinner
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const formData = new FormData();

        console.log(latitude, longitude, "lat long");

        // Assuming `data` is an object with key-value pairs
        Object.keys(data).forEach((key: string) => {
          formData.append(key, data[key as keyof typeof data] as string);
        });
        formData.append("latitude", String(latitude));
        formData.append("longitude", String(longitude));

        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }

        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-asset/`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          const result = await response.json();

          if (response.ok) {
            setSuccessMessage("Form submitted successfully!");
          } else if (response.status === 400) {
            setErrorMessage(result.data.message);
          } else if (response.status === 401) {
            setSessionExpired(true);
            console.log(unauthorized);
            // Show session expired dialog
          } else {
            throw new Error(result.message || "Failed to submit form");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error(
            `Something went wrong. Please try again.\nError: ${error}`
          );
        } finally {
          setIsLoading(false); // Hide loading spinner
        }
      },
      (error) => {
        toast.error(`Error getting location: ${error.message}`);
        setIsLoading(false);
        setLocationError(
          "Unable to retrieve your location. Please allow location access and try again."
        );
      }
    );
  };

  const handleNext = () => {
    const isStepOneValid = stepOneRef.current?.validateFields();
    // const isStepOneValid = true

    if (isStepOneValid) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((s) => s + 1);
    }

    const isStepTwoValid = stepTwoRef.current?.validateFields();
    // const isStepTwoValid = false

    if (isStepTwoValid) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((s) => s + 1);
    }
  };
  const handlePrev = () => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentStep - 1);
      return newSet;
    });
    setCurrentStep((s) => s - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne ref={stepOneRef} />;
      case 1:
        return <StepTwo ref={stepTwoRef} />;
      case 2:
        return <StepFour ref={stepFourRef} />;
      default:
        return null;
    }
  };
  return (
    <div className="md:px-6">
      <div className="">
        <SectionHeading
          marginBottom="4"
          sectionTitle="Add Cattle Details"
          description="Add detailed information about the animal"
        />
      </div>

      {/* Step content */}
      <div className="px-24 md:px-20 pt-5 pb-4 bg-white rounded-t-lg">
        {/* Step bar container */}
        <Stepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>
      <div className="overflow-y-auto h-[70vh] flex flex-col items-center bg-white rounded-b-lg mb-5 py-7 p-4">
        {renderStep()}
        <div className="h-full flex items-end">
          {currentStep === 0 && (
            <button
              onClick={() => setIsGuidanceModal(true)}
              className="text-green-600 font-bold underline hover:text-green-800 custom-hover hover:underline-offset-2 cursor-pointer md:mt-6"
            >
              View Guidelines
            </button>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div
        className={`flex ${
          currentStep === 0 ? "justify-end" : "justify-between"
        }`}
      >
        {currentStep !== 0 && (
          <button
            onClick={handlePrev}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${
              currentStep === 0
                ? "hidden"
                : "block border cursor-pointer hover:bg-gray-200 border-green-600 text-green-800 font-semibold"
            }`}
          >
            <IoIosArrowBack /> Prev
          </button>
        )}
        {currentStep === steps.length - 1 ? (
          <button
            onClick={() => {
              handleSubmit();
            }}
            className="bg-green-800 text-white hover:bg-green-900 cursor-pointer font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1 "
          >
            <FaCircleCheck className="text-green-400" />
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length + 1}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-1 ${
              currentStep === steps.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-800 text-white hover:bg-green-900 cursor-pointer font-semibold"
            }`}
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
            <IoIosArrowForward className="font-bold" />
          </button>
        )}
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-green-500 font-medium">
            Submitting, please wait...
          </p>
        </div>
      )}

      {/* Success Message Dialog */}
      {/* {successMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
                    <p>{successMessage}</p>
                </div>
            )} */}

      <ModalGeneral
        isOpen={sessionExpired}
        onClose={() => {
          setSessionExpired(false);
        }}
      >
        <div className="text-black text-center flex flex-col items-center p-5">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            className="h-auto "
            priority
          />
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
            <p>Your session has expired. Please log in again.</p>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken"); // Clear token
                router.push("/auth/login"); // Redirect to login page
              }}
              className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Login Again
            </button>
          </div>
        </div>
      </ModalGeneral>

      <ModalGeneral
        isOpen={errorMessage != ""}
        onClose={() => {
          setErrorMessage("");
        }}
      >
        <div className="text-black text-center flex flex-col items-center p-5">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            className="h-auto "
            priority
          />
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
            <p>{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage(""); // Clear error message
              }}
              className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </ModalGeneral>

      <ModalGeneral
        isOpen={successMessage != null}
        onClose={() => {
          setSuccessMessage(null);
        }}
      >
        <div className="text-black  text-center flex flex-col items-center p-5">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            className="h-auto "
            priority
          />

          {/* Show location error if any */}
          {locationError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
              <p>{locationError}</p>
            </div>
          )}
          {/* Success Message Dialog */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
              <p>{successMessage}</p>
              <button
                onClick={() => {
                  setSuccessMessage(null);
                  // clearInsuranceApplication()
                  reset();
                  setCurrentStep(0); // Clear error message
                  router.push("/farmer");
                  // onClose()
                }}
                className="mt-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              >
                ok
              </button>
            </div>
          )}
        </div>
      </ModalGeneral>

      {/* Muzzle Guideline */}
      <ModalGeneral
        isOpen={isGuidanceModal}
        onClose={() => setIsGuidanceModal(false)}
      >
        <MuzzleGuidlines close={() => setIsGuidanceModal(false)} />
      </ModalGeneral>
    </div>
  );
}
