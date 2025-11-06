/* eslint-disable @next/next/no-img-element */
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useCowRegistration } from "@/context/CowRegistrationContext";
import SectionHeading from "@/helper/SectionHeading";
import { ImageUploadBlock } from "@/helper/ImageUploadBlock";


// export interface StepFourProps {
//   onNext: () => void;
// }

// 👇 Exposed methods for parent
export type StepFourRef = {
  validateFields: () => boolean;
};

const StepFour = forwardRef<StepFourRef>((props, ref) => {
  StepFour.displayName = "StepFour";

  const { data, updateStep } = useCowRegistration();

  // State to hold images
  const [images, setImages] = useState({
    special_mark: null as File | null,
    left_side_image: null as File | null,
    right_side_image: null as File | null,
    image_with_owner: null as File | null,
    vet_certificate: null as File | null,
    challan_paper: null as File | null,
    chairman_certificate: null as File | null,
  });

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // List of required fields
  const requiredFields = React.useMemo<(keyof typeof images)[]>(
    () => [
      "special_mark",
      "left_side_image",
      "right_side_image",
      "image_with_owner",
      "vet_certificate",
    ],
    []
  );

  // Update image and clear error if fixed
  const updateImage = (key: keyof typeof images, file: File | null) => {
    setImages((prev) => ({ ...prev, [key]: file }));
    updateStep({
      [key]: file,
    });

    // Clear error for this field if image now exists
    if (file && errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Initialize images from context data on mount or data change
  useEffect(() => {
    if (data) {
      setImages({
        special_mark: data.special_mark || null,
        left_side_image: data.left_side_image || null,
        right_side_image: data.right_side_image || null,
        image_with_owner: data.image_with_owner || null,
        vet_certificate: data.vet_certificate || null,
        challan_paper: data.challan_paper || null,
        chairman_certificate: data.chairman_certificate || null,
      });
    }
  }, [data]);

  // Expose validateFields method to parent via ref
  useImperativeHandle(ref, () => ({
    validateFields: () => {
      const newErrors: { [key: string]: string } = {};

      // Check required fields
      requiredFields.forEach((field) => {
        if (!images[field]) {
          newErrors[field] = "This field is required";
        }
      });

      setErrors(newErrors);

      // Return true if no errors
      return Object.keys(newErrors).length === 0;
    },
  }));

  return (
    <div className="lg:w-[90%] xl:w-[80%] mx-auto mt-8 p-4">
      <SectionHeading
        marginBottom="8"
        sectionTitle="Add Attachments"
        description="Provide the picture as instructed below and the documents"
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        data-aos="zoom-in"
      >
        <div>
          <ImageUploadBlock
            imageFile={images.right_side_image}
            onCapture={(file) => updateImage("right_side_image", file)}
            title="Right Side Image *"
            fieldKey="right_side_image"
          />
          {errors.right_side_image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.right_side_image}
            </p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.left_side_image}
            onCapture={(file) => updateImage("left_side_image", file)}
            title="Left Side Image *"
            fieldKey="left_side_image"
          />
          {errors.left_side_image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.left_side_image}
            </p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.image_with_owner}
            onCapture={(file) => updateImage("image_with_owner", file)}
            title="Owner & Cow Image *"
            fieldKey="image_with_owner"
          />
          {errors.image_with_owner && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image_with_owner}
            </p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.special_mark}
            onCapture={(file) => updateImage("special_mark", file)}
            title="Birthmark Image *"
            fieldKey="special_mark"
          />
          {errors.special_mark && (
            <p className="text-red-500 text-sm mt-1">{errors.special_mark}</p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.vet_certificate}
            onCapture={(file) => updateImage("vet_certificate", file)}
            title="Vet Certificate *"
            fieldKey="vet_certificate"
          />
          {errors.vet_certificate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.vet_certificate}
            </p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.challan_paper}
            onCapture={(file) => updateImage("challan_paper", file)}
            title="Challan Image (Optional)"
            fieldKey="challan_paper"
          />
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.chairman_certificate}
            onCapture={(file) => updateImage("chairman_certificate", file)}
            title="Chairman Certificate (Optional)"
            fieldKey="chairman_certificate"
          />
        </div>
      </div>

      {/* <button
        className="text-white bg-green-600 hover:bg-green-700 rounded-lg mt-6 px-6 py-2 font-semibold text-lg"
        onClick={() => {
          if (validateFields()) {
            props.onNext();
          }
        }}
      >
        Next
      </button> */}
    </div>
  );
});

export default StepFour;
