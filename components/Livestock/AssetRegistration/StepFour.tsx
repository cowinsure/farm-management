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
            <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
            <div className="flex flex-col gap-4 justify-start w-auto">


            <div className="flex lg:flex-col flex-col gap-1 items-start">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage("right_side_image", file)}
                        triggerText="Capture right side Image"
                        title="Take Side Image"
                    />
                    {images.right_side_image && (
                        <div className="mt-2 mb-4">
                            <h3 className="text-center text-sm font-medium">Right Side Image</h3>
                            <img
                                src={getPreviewUrl(images.right_side_image)!}
                                alt="Side Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>
                {/* Side Image */}
                <div className="flex lg:flex-col flex-col gap-1 items-start">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage( "left_side_image",file)}
                        triggerText="Capture left Side Image"
                        title="Take Left Side Image"
                    />
                    {images.left_side_image && (
                        <div className="mt-2 mb-4">
                            <h3 className="text-center text-sm font-medium">Left Side Image</h3>
                            <img
                                src={getPreviewUrl(images.left_side_image)!}
                                alt="Side Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Owner and Cow Image */}
                <div className="flex lg:flex-col flex-col gap-3 items-start">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage( "image_with_owner", file)}
                        triggerText="Capture Owner & Cow Image"
                        title="Take Owner & Cow Image"
                    />
                    {images.image_with_owner && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Owner & Cow Image</h3>
                            <img
                                src={getPreviewUrl(images.image_with_owner)!}
                                alt="Owner and Cow Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Birthmark Image */}
                <div className="flex lg:flex-col flex-col gap-3 items-start">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage("special_mark", file)}
                        triggerText="Capture Birthmark Image"
                        title="Take Birthmark Image"
                    />
                    {images.special_mark && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Birthmark Image</h3>
                            <img
                                src={getPreviewUrl(images.special_mark)!}
                                alt="Birthmark Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Challan Image */}
                <div className="flex lg:flex-col flex-col gap-3 items-start">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage( "challan_paper", file)}
                        triggerText="Capture Challan Image"
                        title="Take Challan Paper Image"
                    />
                    {images.challan_paper && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Challan Image</h3>
                            <img
                                src={getPreviewUrl(images.challan_paper)!}
                                alt="Challan Image"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Chairman Certificate Image */}
                <div className="flex lg:flex-col flex-col gap-3 items-start">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage("chairman_certificate", file)}
                        triggerText="Capture Chairman Certificate"
                        title="Take Chairman Certificate Image"
                    />
                    {images.chairman_certificate && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Chairman Certificate</h3>
                            <img
                                src={getPreviewUrl(images.chairman_certificate)!}
                                alt="Chairman Certificate"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>
                <div className="flex lg:flex-col flex-col gap-3 items-start">
                    <PhotoCaptureModal
                        onPhotoCapture={(file) => updateImage("vet_certificate", file)}
                        triggerText="Capture Vet Certificate"
                        title="Capture Vet Certificate Image"
                    />
                    {images.vet_certificate && (
                        <div className="mt-4">
                            <h3 className="text-center text-sm font-medium">Vet Certificate</h3>
                            <img
                                src={getPreviewUrl(images.vet_certificate)!}
                                alt="Vet Certificate"
                                className="w-32 h-32 object-cover border rounded"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepFour;