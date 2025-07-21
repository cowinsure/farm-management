'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from '@/public/Logo-03.png';
import { useRouter } from 'next/navigation';
import UploadVideo from "@/helper/UploadVedio";
import ModalGeneral from "@/modal/DialogGeneral";
import CowIdentificationLoader from "@/components/loader/cow-identification-loader";
import { useCowRegistration } from "@/context/CowRegistrationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


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


const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NzU2NTY5NiwianRpIjoiNzViZThkMjYtNGMwZC00YTc4LWEzM2ItMjAyODU4OGVkZmU4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDc1NjU2OTYsImNzcmYiOiI2Y2VjNWM1Mi0xMDJkLTRmYjUtOTE3NS1lNzZkZTBkMDM3YTYifQ.n5moEixJyO4eaXpYI8yG6Qnjf3jjBrWA7W19gW_4h8c"

export default function StepOne() {
  const router = useRouter()
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalErrorOpen, setErrorModalOpen] = useState(false);
  const { data, updateStep, validateStep, reset } = useCowRegistration();
  const [responseData, setResponseData] = useState<ResponseData | null>(null); // Use the interface for state
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [accessToken, setAccessToken] = useState(jwt)

  const handleVideoUpload = async (file: File) => {
    setModalOpen(false)

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
      const response = await fetch("https://ai.insurecow.com/register", {
        method: "POST",
        body: formData,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // 3.110.218.87:8000

      // console.log(await response.json());


      if (response.status === 400) {
        const data = await response.json();
        setErrorModalOpen(true)
        console.error("Error 400:", data.msg);
        setResponseData(data);
        // alert(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 401) {
        const data = await response.json();

        console.error("Error 401:", data.msg);
        alert(`Error: ${data.msg}`);
        return;
      }

      if (response.status === 200) {
        const data: ResponseData = await response.json(); // Use the interface for type safety
        console.log("API Response:", data);
        setResponseData(data);
        setModalOpen(true)
        updateStep({
          reference_id: data.registration_id,
        }); // Save the response data to state
        // alert(data.msg);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Something went wrong: " + error);
    } finally {
      setIsUploading(false);
    }
  };



  useEffect(() => {
    if (data?.muzzle_video) {
      setSelectedFile(data.muzzle_video);
    }
  }, [data]);
  // Add an empty dependency array to ensure it runs only once
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-1/2 w-full flex flex-col items-center p-6">
          <CardHeader className="w-full">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Muzzle Detection</CardTitle>
            <p className="text-gray-600 mb-4">Upload a short video of the cow's muzzle for identification.</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center gap-4">
            <UploadVideo
              onVideoCapture={(file) => {
                updateStep({ muzzle_video: file });
                setSelectedFile(file);
              }}
            />
            <Button

              onClick={() => {
                if (selectedFile) {
                  handleVideoUpload(selectedFile);
                } else {
                  alert("Please select a video file before uploading.");
                }
              }}
              className="w-full p-6 bg-green-600 hover:bg-green-700"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Register Cow"}
            </Button>
          </CardContent>
        </Card>
        <Card className="lg:w-1/2 w-full flex flex-col items-center p-6 bg-green-50 border-green-200">
          <CardHeader className="w-full">
            <CardTitle className="text-2xl font-bold text-green-800 mb-2 text-center">Guideline for using Muzzle Tech</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <ul className="list-disc text-md pl-5 mt-2 text-green-900 space-y-1">
              <li>Take a 3-second video slowly.</li>
              <li>Move the camera steadily without shaking.</li>
              <li>Ensure the cow's muzzle is placed inside the box on the screen.</li>
              <li>Make sure there is adequate lighting for better detection.</li>
              <li>Keep the background clear of distractions.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <ModalGeneral isOpen={isModalOpen} onClose={() => { setModalOpen(false) }}>
        <div className='text-black text-center flex flex-col items-center p-5'>
          <Image
            src={logo}
            alt="Logo"
            width={120}
            height={120}
            className="h-auto mb-2"
            priority
          />
          <Card className="w-full max-w-md bg-green-100 border-green-300 text-green-700 mt-4">
            <CardContent className="p-4">
              <div className="bg-gray-100 rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold mb-2">Muzzle Registration Result</h3>
                <p><strong>Animal Name:</strong> {responseData?.animal_name}</p>
                <p><strong>Registration ID:</strong> {responseData?.registration_id}</p>
                <p><strong>Message:</strong> {responseData?.msg}</p>
              </div>
              <Button
                onClick={() => setModalOpen(false)}
                className="mt-4 w-full bg-green-500 hover:bg-green-600"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      </ModalGeneral>

      {/* Error Modal */}
      <ModalGeneral isOpen={isModalErrorOpen} onClose={() => { setErrorModalOpen(false) }}>
        <div className='text-black text-center flex flex-col items-center p-5'>
          <Image
            src={logo}
            alt="Logo"
            width={120}
            height={120}
            className="h-auto mb-2"
            priority
          />
          <Card className="w-full max-w-md bg-red-100 border-red-300 text-red-700 mt-4">
            <CardContent className="p-4">
              <div className="bg-gray-100 rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold mb-2">Registration Result</h3>
                <p><strong>Animal Name:</strong> {responseData?.animal_name}</p>
                <p><strong>Registration ID:</strong> {responseData?.registration_id}</p>
                <p><strong>Message:</strong> {responseData?.msg}</p>
              </div>
              <Button
                onClick={() => setErrorModalOpen(false)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      </ModalGeneral>

      {/* Loader Modal */}
      <ModalGeneral isOpen={isUploading} onClose={() => { }}>
        <div className="max-h-[80vh] overflow-y-auto p-4 flex items-center justify-center">
          <CowIdentificationLoader />
        </div>
      </ModalGeneral>
    </div>
  );
}