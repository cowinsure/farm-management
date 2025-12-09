import { Check } from "lucide-react";
import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  completedSteps: Set<number>;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  completedSteps,
}) => {
  const progressPercent =
    steps.length === 1 ? 100 : (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="relative w-[70%] my-5 mx-auto h-16">
      {/* Line background behind the steps */}
      <div className="absolute top-2 left-0 right-0 h-5 bg-gray-300 rounded-full z-0 px-1" />

      {/* Progress line */}
      <div
        className="absolute top-2 left-0 h-5 bg-gradient-to-r from-green-500 to-green-900 rounded-full z-10 transition-all duration-300 px-1"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Step circles and labels */}
      {steps.map((step, index) => {
        const isCurrent = index === currentStep;
        const isCompleted = completedSteps.has(index);

        // Calculate left position as a percentage of container width
        const leftPercent = (index / (steps.length - 1)) * 100;

        return (
          <div
            key={index}
            className="absolute top-0 flex flex-col items-center text-center z-50"
            style={{ left: `${leftPercent}%`, transform: "translateX(-50%)" }}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors custom-hover ${
                isCompleted ? "bg-green-400 text-white" : ""
              } ${
                isCurrent
                  ? "bg-green-100 text-green-800 font-bold scale-125 border-4 border-green-400"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {isCompleted ? (
                <Check
                  size={30}
                  className={`${
                    isCurrent ? "" : "bg-green-900 rounded-full w-9 h-9 p-1"
                  }`}
                />
              ) : (
                index + 1
              )}
            </div>
            <p
              className={`text-xs mt-2 ${
                isCurrent || isCompleted
                  ? "font-semibold text-gray-800"
                  : "text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
};
