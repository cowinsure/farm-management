"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, Camera, ArrowLeft, RotateCcw, Square, RefreshCw } from "lucide-react"
// import { useCowRegistration } from "@/context/CowRegistrationContext";

export default function UploadVedioForSearch({ onVideoCapture }: { onVideoCapture?: (file: File) => void }) {
    // const {data, updateStep, validateStep, reset } = useCowRegistration();
 
  const [dragActive, setDragActive] = useState(false)
  const [cameraMode, setCameraMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [cameraReady, setCameraReady] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("video/")) {
        handleFile(file)
      } else {
        alert("Please upload a video file")
      }
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  // Process the selected file
  const handleFile = (file: File) => {
    setSelectedFile(file)
    const videoUrl = URL.createObjectURL(file)
    setRecordedVideo(videoUrl)

    if (onVideoCapture) {
      onVideoCapture(file)
      // console.log("vedioref");
          
      // updateStep({
      //   muzzle_video: file,
      // });
    }
  }
  // useEffect(() => {
  //   if (data?.muzzle_video) {
  //     setSelectedFile(data.muzzle_video);

  //     // Create a video URL and set it to the recordedVideo state
  //     const videoUrl = URL.createObjectURL(data.muzzle_video);
  //     setRecordedVideo(videoUrl);

  //     // Clean up the object URL when the component unmounts
  //     return () => {
  //       URL.revokeObjectURL(videoUrl);
  //     };
  //   }
  // }, [data]);


  // Reset video and go back to upload state
  const resetVideo = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo)
    }
    setRecordedVideo(null)
    setSelectedFile(null)
  }

  // Try different camera configurations
  const initializeCamera = async () => {
    try {
      // Try to get the back camera first (environment)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        })

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true)
          }
        }
        setFacingMode("environment")
        return
      } catch (err) {
        console.log("Back camera failed, trying front camera")
      }

      // If back camera fails, try front camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true)
        }
      }
      setFacingMode("user")
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  // Open camera
  const openCamera = async () => {
    setCameraMode(true)
    // We'll initialize the camera after the component renders
  }

  // Initialize camera when entering camera mode
  useEffect(() => {
    if (cameraMode) {
      initializeCamera()
    }

    return () => {
      // Clean up when component unmounts or camera mode changes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraMode])

  // Switch camera
  const switchCamera = async () => {
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    setCameraReady(false)

    // Toggle facing mode
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)

    // Restart camera with new facing mode
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      })

      streamRef.current = newStream
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true)
        }
      }
    } catch (error) {
      console.error("Error switching camera:", error)
      alert("Could not switch camera. Please check permissions.")
    }
  }

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return

    const mediaRecorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" })
      const videoUrl = URL.createObjectURL(blob)
      setRecordedVideo(videoUrl)

      const file = new File([blob], "recorded-video.mp4", { type: "video/mp4" })
      setSelectedFile(file)

      if (onVideoCapture) {
        onVideoCapture(file)
      }

      chunksRef.current = []
      setCameraMode(false)
    }

    // Start timer
    setRecordingTime(0)
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    mediaRecorder.start()
    setIsRecording(true)
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Cancel camera/recording
  const cancelCamera = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    setCameraMode(false)
    setRecordingTime(0)
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo)
      }
    }
  }, [recordedVideo])

  if (cameraMode) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-4">
          <button onClick={cancelCamera} className="flex items-center text-emerald-500">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-lg">Back to Home</span>
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-2">Search Your Cow</h1>
        <p className="text-gray-600 mb-6">
          Upload a clear video of your cow's muzzle for our system to get its unique pattern.
        </p>

        <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
          <div className="relative bg-black" style={{ minHeight: "300px" }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />

            {/* Alignment guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Text at the top of the guide */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-200 bg-opacity-70 px-4 py-2 rounded text-center z-10">
                <p className="text-emerald-600 font-medium">Align cow's muzzle with the outline</p>
              </div>

              {/* Circular outline */}
              <div className="w-64 h-48 relative">
                <div className="w-full h-full rounded-full border-4 border-dashed border-emerald-500"></div>

                {/* Left eye/nostril */}
                <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-20 border-2 border-emerald-500 rounded-full"></div>

                {/* Right eye/nostril */}
                <div className="absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-12 h-20 border-2 border-emerald-500 rounded-full"></div>
              </div>
            </div>

            {/* Timer */}
            <div className="absolute bottom-2 left-2 text-white px-2 py-1 rounded text-lg font-mono">
              {formatTime(recordingTime)}
            </div>
          </div>

          {/* Camera controls */}
          <div className="flex flex-col">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center justify-center py-4 ${
                isRecording ? "bg-gray-500" : "bg-red-500"
              } text-white font-medium`}
              disabled={!cameraReady}
            >
              {isRecording ? (
                <>
                  <Square className="h-5 w-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-white mr-2"></div>
                  Start Recording
                </>
              )}
            </button>

            <button
              onClick={switchCamera}
              className="flex items-center justify-center py-4 bg-gray-200 text-gray-700 font-medium"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Switch Camera
            </button>

            <button
              onClick={cancelCamera}
              className="flex items-center justify-center py-4 bg-white text-gray-700 font-medium border-t border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
{/* 
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded">
          Register Cow
        </button> */}
      </div>
    )
  }

  return (
    <div className="w-full">
      {recordedVideo ? (
        <div className="mb-4">
          <div className="relative border rounded-md overflow-hidden">
            <video src={recordedVideo} className="w-full h-auto" controls />
          </div>

          {/* Retry button */}
          <button
            onClick={resetVideo}
            className="w-full mt-4 mb-4 py-3 border border-emerald-600 text-emerald-600 font-medium rounded flex items-center justify-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Retry
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-10 text-center mb-4 ${
            dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <Upload className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-lg font-medium">Drag and drop your video here</p>
            <p className="text-sm text-gray-500">Or use one of the options below</p>

            <div className="flex gap-4 mt-2">
              <button
                className="px-4 py-2 border border-emerald-500 text-emerald-600 rounded hover:bg-emerald-50"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Select Video
              </button>
              <button
                className="px-4 py-2 border border-emerald-500 text-emerald-600 rounded hover:bg-emerald-50 flex items-center"
                onClick={openCamera}
              >
                <Camera className="h-4 w-4 mr-2" /> Use Camera
              </button>
              <input id="file-upload" type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Supported formats: MP4, AVI, MOV, MKV, FLV, MPEG, WMV (Max 15 seconds)
          </p>
        </div>
      )}

      {/* <button
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded"
        onClick={() => {
          if (selectedFile && onVideoCapture) {
            onVideoCapture(selectedFile)
          }
        }}
      >
        Register Cow
      </button> */}
    </div>
  )
}
