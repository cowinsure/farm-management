import React, { useState } from 'react';
import PhotoCaptureModal from '@/helper/PhotoCaptureModal';
import { useCowRegistration } from '@/context/CowRegistrationContext';

const StepFour: React.FC = () => {
    const { data, updateStep, validateStep, reset } = useCowRegistration();

    const [images, setImages] = useState({
        special_mark: null as File | null,
       
        left_side_image: null as File | null,
        right_side_image: null as File | null,
        challan_paper: null as File | null,
        vet_certificate: null as File | null,
        chairman_certificate: null as File | null,
        image_with_owner: null as File | null,
    });

    const updateImage = (key: keyof typeof images, file: File | null) => {
        setImages((prev) => ({ ...prev, [key]: file }));
        updateStep({
            [key]: file,
        });
    };
    React.useEffect(() => {
        if (data) {
            setImages({
                left_side_image: data.left_side_image || null,
                right_side_image: data.right_side_image || null,
                image_with_owner: data.image_with_owner || null,
                special_mark: data.special_mark || null,
                challan_paper: data.challan_paper || null,
                chairman_certificate: data.chairman_certificate || null,
                vet_certificate: data.vet_certificate || null,
            });
        }
    }, [data]);

    const handlePhotoCapture = (file: File, property: string, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
        setImage(file);
        updateStep({
            [property]: file,
        });
        console.log("Photo captured:", file);
    };

    const getPreviewUrl = (file: File | null): string | null => {
        return file ? URL.createObjectURL(file) : null;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">Upload Images</h2>
            <p className="mb-6 text-gray-600">Capture and upload required images for animal registration</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Right Side Image Card */}
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-green-600">📷</span>
                  <span className="font-bold">Right Side Image</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Capture the right side view of the animal</div>
                <PhotoCaptureModal
                  onPhotoCapture={(file) => updateImage("right_side_image", file)}
                  triggerText="Capture Right Side"
                  title="Take Side Image"
                />
                {images.right_side_image && (
                  <div className="mt-3">
                    <img
                      src={getPreviewUrl(images.right_side_image)!}
                      alt="Right Side Image"
                      className="w-full h-32 object-cover border rounded mb-2"
                    />
                    <div className="flex items-center text-green-600 text-sm">
                      <span className="mr-1">✔️</span>
                      Image captured
                      <button
                        className="ml-auto text-red-600 hover:underline"
                        onClick={() => updateImage("right_side_image", null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Left Side Image Card */}
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-green-600">📷</span>
                  <span className="font-bold">Left Side Image</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Capture the left side view of the animal</div>
                <PhotoCaptureModal
                  onPhotoCapture={(file) => updateImage("left_side_image", file)}
                  triggerText="Capture Left Side"
                  title="Take Left Side Image"
                />
                {images.left_side_image && (
                  <div className="mt-3">
                    <img
                      src={getPreviewUrl(images.left_side_image)!}
                      alt="Left Side Image"
                      className="w-full h-32 object-cover border rounded mb-2"
                    />
                    <div className="flex items-center text-green-600 text-sm">
                      <span className="mr-1">✔️</span>
                      Image captured
                      <button
                        className="ml-auto text-red-600 hover:underline"
                        onClick={() => updateImage("left_side_image", null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Owner & Animal Image Card */}
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-green-600">📷</span>
                  <span className="font-bold">Owner & Animal Image</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Capture image with the owner and animal</div>
                <PhotoCaptureModal
                  onPhotoCapture={(file) => updateImage("image_with_owner", file)}
                  triggerText="Capture Owner & Animal"
                  title="Take Owner & Cow Image"
                />
                {images.image_with_owner && (
                  <div className="mt-3">
                    <img
                      src={getPreviewUrl(images.image_with_owner)!}
                      alt="Owner & Animal Image"
                      className="w-full h-32 object-cover border rounded mb-2"
                    />
                    <div className="flex items-center text-green-600 text-sm">
                      <span className="mr-1">✔️</span>
                      Image captured
                      <button
                        className="ml-auto text-red-600 hover:underline"
                        onClick={() => updateImage("image_with_owner", null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Birthmark Image Card */}
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-green-600">📷</span>
                  <span className="font-bold">Birthmark Image</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Capture any distinctive marks or birthmarks</div>
                <PhotoCaptureModal
                  onPhotoCapture={(file) => updateImage("special_mark", file)}
                  triggerText="Capture Birthmark"
                  title="Take Birthmark Image"
                />
                {images.special_mark && (
                  <div className="mt-3">
                    <img
                      src={getPreviewUrl(images.special_mark)!}
                      alt="Birthmark Image"
                      className="w-full h-32 object-cover border rounded mb-2"
                    />
                    <div className="flex items-center text-green-600 text-sm">
                      <span className="mr-1">✔️</span>
                      Image captured
                      <button
                        className="ml-auto text-red-600 hover:underline"
                        onClick={() => updateImage("special_mark", null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Challan Paper Card */}
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-green-600">📷</span>
                  <span className="font-bold">Challan Paper</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Capture the challan or receipt document</div>
                <PhotoCaptureModal
                  onPhotoCapture={(file) => updateImage("challan_paper", file)}
                  triggerText="Capture Challan"
                  title="Take Challan Paper Image"
                />
                {images.challan_paper && (
                  <div className="mt-3">
                    <img
                      src={getPreviewUrl(images.challan_paper)!}
                      alt="Challan Paper"
                      className="w-full h-32 object-cover border rounded mb-2"
                    />
                    <div className="flex items-center text-green-600 text-sm">
                      <span className="mr-1">✔️</span>
                      Image captured
                      <button
                        className="ml-auto text-red-600 hover:underline"
                        onClick={() => updateImage("challan_paper", null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chairman Certificate Card */}
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-green-600">📷</span>
                  <span className="font-bold">Chairman Certificate</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Capture the chairman certificate document</div>
                <PhotoCaptureModal
                  onPhotoCapture={(file) => updateImage("chairman_certificate", file)}
                  triggerText="Capture Certificate"
                  title="Take Chairman Certificate Image"
                />
                {images.chairman_certificate && (
                  <div className="mt-3">
                    <img
                      src={getPreviewUrl(images.chairman_certificate)!}
                      alt="Chairman Certificate"
                      className="w-full h-32 object-cover border rounded mb-2"
                    />
                    <div className="flex items-center text-green-600 text-sm">
                      <span className="mr-1">✔️</span>
                      Image captured
                      <button
                        className="ml-auto text-red-600 hover:underline"
                        onClick={() => updateImage("chairman_certificate", null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Vet Certificate Card */}
              <div className="border rounded-lg shadow p-4 bg-white">
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-green-600">📷</span>
                  <span className="font-bold">Vet Certificate</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Capture the vet certificate document</div>
                <PhotoCaptureModal
                  onPhotoCapture={(file) => updateImage("vet_certificate", file)}
                  triggerText="Capture Vet Certificate"
                  title="Capture Vet Certificate Image"
                />
                {images.vet_certificate && (
                  <div className="mt-3">
                    <img
                      src={getPreviewUrl(images.vet_certificate)!}
                      alt="Vet Certificate"
                      className="w-full h-32 object-cover border rounded mb-2"
                    />
                    <div className="flex items-center text-green-600 text-sm">
                      <span className="mr-1">✔️</span>
                      Image captured
                      <button
                        className="ml-auto text-red-600 hover:underline"
                        onClick={() => updateImage("vet_certificate", null)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
    );
};

export default StepFour;