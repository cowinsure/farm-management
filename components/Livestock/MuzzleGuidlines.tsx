import React from "react";
import {
  MdOutlineAccessTime,
  MdPhoneIphone,
  MdCenterFocusStrong,
  MdLightbulbOutline,
  MdDoNotDisturbAlt,
} from "react-icons/md";

interface GuidlineProps {
  close: () => void;
}

const MuzzleGuidlines = ({ close }: GuidlineProps) => {
  const muzzleTechSteps = [
    {
      icon: MdOutlineAccessTime,
      title: "Keep it short",
      description:
        "Record a 15 second video. Make sure the video is short and clear.",
      shortDescription: "Record a 15 sec video",
    },
    {
      icon: MdPhoneIphone,
      title: "Stay steady",
      description:
        "Move slowly and avoid shaking. Hold the camera firmly for smooth footage.",
      shortDescription: "Move slowly and avoid shaking",
    },
    {
      icon: MdCenterFocusStrong,
      title: "Center the muzzle",
      description:
        "Align the cow’s muzzle inside the box. Ensure the muzzle is centered on-screen.",
      shortDescription: "Ensure the muzzle is centered on-screen",
    },
    {
      icon: MdLightbulbOutline,
      title: "Use good lighting",
      description:
        "Record in a well-lit area. Avoid dark environments for better recognition.",
      shortDescription: "Record in a well-lit area",
    },
    {
      icon: MdDoNotDisturbAlt,
      title: "Avoid distractions",
      description:
        "Keep the background clear. No people, animals, or clutter behind the cow.",
      shortDescription: "Keep the background clear",
    },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-center text-2xl font-extrabold text-green-800 mb-2">
        Muzzle Tech Recording Guide
      </h2>
      <p className="text-center sm:text-sm md:text-[16px] font-medium text-gray-500 mb-6">
        Following these steps is crucial to ensure accurate muzzle detection.{" "}
        <span className="hidden md:block">
          A clear, steady video with proper lighting and alignment helps the
          system identify the cow’s muzzle effectively, improving the
          reliability and success of the scan.
        </span>
      </p>

      <div className="space-y-3">
        {muzzleTechSteps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg"
          >
            <step.icon className="text-green-700 text-4xl mt-1" />
            <div className="h-full">
              <p className="font-semibold">{step.title}</p>
              <p className="font-medium text-gray-500">
                {step.shortDescription}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={close}
          className="bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-900 transition cursor-pointer"
        >
          Understood
        </button>
      </div>
    </div>
  );
};

export default MuzzleGuidlines;
