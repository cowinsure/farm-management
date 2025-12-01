"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { Upload, Camera, RotateCcw, RefreshCw, X, Check } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalization } from "@/context/LocalizationContext";

interface PhotoCaptureModalProps {
  onPhotoCapture?: (file: File) => void;
  triggerText?: string;
  title?: string;
}

export default function PhotoCaptureModal({
  onPhotoCapture,
  triggerText,
  title,
}: PhotoCaptureModalProps) {
  const { t } = useLocalization();
  const effectiveTriggerText = triggerText || t("take_photo");
  const effectiveTitle = title || t("take_a_photo");
  const [open, setOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [cameraReady, setCameraReady] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleFile(file);
      } else {
        alert(t("please_upload_image_file"));
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  // Process the selected file
  const handleFile = (file: File) => {
    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setCapturedPhoto(imageUrl);

    if (onPhotoCapture) {
      onPhotoCapture(file);
    }
  };

  // Reset photo and go back to upload state
  const resetPhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
    }
    setCapturedPhoto(null);
    setSelectedFile(null);
  };

  // Initialize camera
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
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
          };
        }
        setFacingMode("environment");
        return;
      } catch (err) {
        console.log("Back camera failed, trying front camera", err);
      }

      // If back camera fails, try front camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
      setFacingMode("user");
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(t("camera_access_error"));
    }
  };

  // Open camera
  const openCamera = async () => {
    setCameraMode(true);
  };

  // Initialize camera when entering camera mode
  useEffect(() => {
    if (cameraMode && open) {
      initializeCamera();
    }

    return () => {
      // Clean up when component unmounts or camera mode changes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraMode, open]);

  // Switch camera
  const switchCamera = async () => {
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setCameraReady(false);

    // Toggle facing mode
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);

    // Restart camera with new facing mode
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (error) {
      console.error("Error switching camera:", error);
      alert(t("switch_camera_error"));
    }
  };

  // Take photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    setIsTakingPhoto(true);

    // Set canvas dimensions to match video
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Draw the current video frame on the canvas
    const context = canvasRef.current.getContext("2d");
    if (context) {
      // Flip horizontally if using front camera
      if (facingMode === "user") {
        context.translate(videoWidth, 0);
        context.scale(-1, 1);
      }

      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

      // Convert to blob
      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedPhoto(imageUrl);

            const file = new File([blob], "captured-photo.jpg", {
              type: "image/jpeg",
            });
            setSelectedFile(file);

            if (onPhotoCapture) {
              onPhotoCapture(file);
            }

            // Stop camera stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop());
            }

            setCameraMode(false);
            setIsTakingPhoto(false);
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  // Cancel camera
  const cancelCamera = () => {
    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setCameraMode(false);
  };

  // Add a function to clear canvas
  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      // Reset canvas dimensions
      canvasRef.current.width = 0;
      canvasRef.current.height = 0;
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset all states when closing
      cancelCamera();
      resetPhoto();
      setCameraMode(false);
      setCameraReady(false);
      setIsTakingPhoto(false);
      setDragActive(false);
      setSelectedFile(null);
      setFacingMode("environment");
      clearCanvas(); // Add canvas clearing
    }
  };

  // Update the cleanup effect
  useEffect(() => {
    if (!open) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraMode(false);
      clearCanvas(); // Add canvas clearing
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      clearCanvas(); // Add canvas clearing on unmount
    };
  }, [open]);

  // Clean up captured photo URL when component unmounts
  useEffect(() => {
    // setCapturedPhoto(null)
    return () => {
      if (capturedPhoto) {
        URL.revokeObjectURL(capturedPhoto);
      }
    };
  }, [capturedPhoto]);

  const renderContent = () => (
    <div className="w-full space-y-4">
      {cameraMode ? (
        <div className="w-full space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ minHeight: "300px" }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto"
                  style={{
                    transform: facingMode === "user" ? "scaleX(-1)" : "none",
                  }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Alignment guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 relative">
                    <div className="w-full h-full rounded-full border-4 border-dashed border-white/50"></div>
                  </div>
                </div>

                {/* Camera status indicator */}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={cameraReady ? "default" : "secondary"}
                    className="bg-black/50 text-white"
                  >
                    {cameraReady ? t("ready") : t("initializing")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera controls */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={takePhoto}
              disabled={!cameraReady || isTakingPhoto}
              className="w-full"
              size="lg"
            >
              {isTakingPhoto ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t("processing")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {t("take_photo")}
                </div>
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={switchCamera}
                variant="outline"
                disabled={isTakingPhoto}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t("switch_camera")}
              </Button>

              <Button
                onClick={cancelCamera}
                variant="outline"
                disabled={isTakingPhoto}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                {t("cancel")}
              </Button>
            </div>
          </div>
        </div>
      ) : capturedPhoto ? (
        <div className="w-full space-y-4 max-h-[70vh] overflow-y-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={capturedPhoto || "/placeholder.svg"}
                  className="w-full h-auto rounded-lg"
                  alt="Captured"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    {t("captured")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 sticky bottom-0 bg-background pt-2">
            <Button onClick={resetPhoto} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("retry")}
            </Button>

            <Button onClick={() => setOpen(false)} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              {t("done")}
            </Button>
          </div>
        </div>
      ) : (
        <Card className="border  border-dashed">
          <CardContent className="">
            <div
              className={` rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {t("upload_or_capture_image")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("drag_and_drop_here")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload-modal")?.click()
                    }
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {t("select_image")}
                  </Button>
                  <Button
                    onClick={openCamera}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    {t("use_camera")}
                  </Button>
                  <input
                    id="file-upload-modal"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {t("supported_formats")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            {effectiveTriggerText}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{effectiveTitle}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{renderContent()}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {effectiveTriggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{effectiveTitle}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
