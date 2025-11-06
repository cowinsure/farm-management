/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import React from "react";
import PhotoCaptureModal from "./PhotoCaptureModal";

interface ImageUploadBlockProps {
  imageFile?: File | null;
  onCapture: (file: File | null) => void;
  title: string;
  fieldKey: string;
}

export const ImageUploadBlock: React.FC<ImageUploadBlockProps> = ({
  imageFile,
  onCapture,
  title,
  fieldKey,
}) => {
  const getPreviewUrl = (file: File) => URL.createObjectURL(file);

  return (
    <div
      className={`relative border-2 ${
        imageFile ? "border-green-600 bg-green-50" : "border bg-white"
      } rounded-md p-2 flex flex-col justify-between hover:border-green-300 group`}
    >
      {imageFile && (
        <button
          onClick={() => onCapture(null)}
          className="absolute top-2 right-2 text-white bg-red-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>
      )}

      <div className="flex-grow flex items-center justify-center">
        {imageFile ? (
          <img
            src={getPreviewUrl(imageFile)}
            alt={title}
            className="w-full h-60 object-contain"
          />
        ) : (
          <PhotoCaptureModal
            onPhotoCapture={(file) => onCapture(file)}
            triggerText={`Capture ${title}`}
            title={`Take ${title}`}
          />
        )}
      </div>
      <div
        className={`text-white font-semibold text-center custom-hover ${
          imageFile ? "bg-green-600" : "bg-gray-400"
        } rounded mt-3 py-1`}
      >
        {title}
      </div>
    </div>
  );
};
