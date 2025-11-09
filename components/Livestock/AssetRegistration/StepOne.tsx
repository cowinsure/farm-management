"use client";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import Image from "next/image";
import { useCowRegistration } from "@/context/CowRegistrationContext";

import logo from "../../../public/logo-03.png";

import { toast } from "sonner";
import UploadVideo from "@/helper/UploadVedio";
import ModalGeneral from "@/modal/DialogGeneral";
import CowIdentificationLoader from "@/components/loader/cow-identification-loader";

// Define an interface for the response data
interface ResponseData {
  animal_name: string;
  registration_id: string;
  geo_location: string;
  date: string;
  no_of_frames: number;
  image_url: string;
  msg: string;
}

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzU2NTY5NiwianRpIjoiNzViZThkMjYtNGMwZC00YTc4LWEzM2ItMjAyODU4OGVkZmU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDc1NjU2OTYsImNzcmYiOiI2Y2VjNWM1Mi0xMDJkLTRmYjUtOTE3NS1lNzZkZTBkMDM3YTYifQ.n5moEixJyO4eaXpYI8yG6Qnjf3jjBrWA7W19gW_4h8c";

export type StepOneRef = {
  validateFields: () => boolean;
};

export const StepOne = forwardRef<StepOneRef>((props, ref) => {
  StepOne.displayName = "StepOne";
  // const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalErrorOpen, setErrorModalOpen] = useState(false);
  const { data, updateStep } = useCowRegistration();
  const [responseData, setResponseData] = useState<ResponseData | null>(null); // Use the interface for state
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [accessToken, setAccessToken] = useState(jwt);

  // Validation logic
  const validateFields = () => {
    if (!selectedFile) {
      toast.error("Please upload a muzzle video before proceeding.");
      return false;
    }
    return true;
  };

  // Expose validate method to parent
  useImperativeHandle(ref, () => ({
    validateFields,
  }));

  const handleVideoUpload = async (file: File) => {
    setModalOpen(false);

    console.log("Video file captured:", file);

    const formData = new FormData();
    formData.append("video", file); // Append the video file to the form data

    //  try {
    //     const response = await fetch("https://ai.insurecow.com/test", {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         // Authorization: `Bearer ${accessToken}`,
    //       },
    //     });

    //     const result = await response.json();

    //     if (response.ok) {
    //       setAccessToken(result.data.results)
    //       localStorage.setItem('ai_access_token',result.data.results)
    //       console.log("Asset types fetched successfully:", result.data.results);
    //       // setAssetTypes(result.data.results); // Update the assetTypes state with API data
    //     } else {
    //       console.error("Failed to fetch asset types:", result);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching asset types:", error);
    //   }

    console.log(accessToken);

    try {
      setIsUploading(true);
      // const response = await fetch("https://rd1wmswr9eqhqh-8000.proxy.runpod.net/register", {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_AI}/register`,
        {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // 3.110.218.87:8000

      // console.log(await response.json());

      if (response.status === 400) {
        const data = await response.json();
        setErrorModalOpen(true);
        console.error("Error 400:", data.msg);
        setResponseData(data);
        // toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 401) {
        const data = await response.json();

        console.error("Error 401:", data.msg);
        toast.error(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 200) {
        const data: ResponseData = await response.json(); // Use the interface for type safety
        console.log("API Response:", data);
        setResponseData(data);
        setModalOpen(true);
        updateStep({
          reference_id: data.registration_id,
        }); // Save the response data to state
        // toast.error(data.msg);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Something went wrong: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (data?.muzzle_video) {
      setSelectedFile(data.muzzle_video);
    }
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold mb-4">Muzzle Detection</h2>
      <div className="md:w-[60%] mx-auto">
        <div className="w-full flex flex-col justify-center items-center">
          <UploadVideo
            onVideoCapture={(file) => {
              updateStep({
                muzzle_video: file,
              });
              setSelectedFile(file); // Save the selected file to state
            }}
          />

          {selectedFile && (
            <button
              onClick={() => {
                if (selectedFile) {
                  handleVideoUpload(selectedFile); // Call the upload function when the video is captured
                } else {
                  toast.error("Please select a video file before uploading.");
                }
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded"
            >
              {isUploading ? "Uploading..." : "Register Cow"}
            </button>
          )}
        </div>
        <div className=" lg:w-1/2 w-full text-start flex flex-col justify-start items-center">
          <ModalGeneral
            isOpen={isModalOpen}
            onClose={() => {
              setModalOpen(false);
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
              <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">
                    Muzzel Registration Result
                  </h3>
                  <p>
                    <strong>Animal Name:</strong> {responseData?.animal_name}
                  </p>
                  <p>
                    <strong>Registration ID:</strong>{" "}
                    {responseData?.registration_id}
                  </p>
                  {/* <p><strong>Geo Location:</strong> {responseData?.geo_location}</p> */}
                  {/* <p><strong>Date:</strong> {responseData?.date}</p> */}
                  {/* <p><strong>No. of Frames:</strong> {responseData?.no_of_frames}</p> */}
                  {/* <p><strong>Image:</strong></p> */}
                  {/* <Image src={`data:image/jpeg;base64,${responseData.image_url}`} alt="Cow Muzzle" className="mt-2 rounded shadow-md" /> */}
                  <p>
                    <strong>Message:</strong> {responseData?.msg}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalOpen(false); // Clear error message
                  }}
                  className="mt-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                >
                  Close
                </button>
              </div>
            </div>
          </ModalGeneral>

          <ModalGeneral
            isOpen={isModalErrorOpen}
            onClose={() => {
              setErrorModalOpen(false);
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
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">
                    Registration Result
                  </h3>
                  <p>
                    <strong>Animal Name:</strong> {responseData?.animal_name}
                  </p>
                  <p>
                    <strong>Registration ID:</strong>{" "}
                    {responseData?.registration_id}
                  </p>
                  {/* <p><strong>Geo Location:</strong> {responseData?.geo_location}</p> */}
                  {/* <p><strong>Date:</strong> {responseData?.date}</p> */}
                  {/* <p><strong>No. of Frames:</strong> {responseData?.no_of_frames}</p> */}
                  {/* <p><strong>Image:</strong></p> */}
                  {/* <Image src={`data:image/jpeg;base64,${responseData.image_url}`} alt="Cow Muzzle" className="mt-2 rounded shadow-md" /> */}
                  <p>
                    <strong>Message:</strong> {responseData?.msg}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setErrorModalOpen(false); // Clear error message
                  }}
                  className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </ModalGeneral>

          <ModalGeneral isOpen={isUploading} onClose={() => {}}>
            <CowIdentificationLoader />
          </ModalGeneral>
          {/* {isUploading && (
               <CowIdentificationLoader />

          )} */}
        </div>
      </div>
    </div>
  );
});
export default StepOne;
