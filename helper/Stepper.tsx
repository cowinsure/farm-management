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
    steps.length === 1
      ? 100
      : Math.max(18, (currentStep / (steps.length - 1)) * 100);
  return (
    <div className="relative w-full my-5 lg:w-[70%] ">
      {/* Line background behind the steps */}
      <div className="absolute top-3 left-0 right-0 h-5 bg-gray-300 rounded-full z-0 " />

      {/* Progress line */}
      <div
        className="absolute top-3 left-0 h-5 bg-gradient-to-r from-green-500 to-green-900 rounded-full z-10 transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Step circles and labels */}
      <div className="flex justify-between items-center relative z-20">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isCompleted = completedSteps.has(index);

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 text-center"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors custom-hover ${isCompleted && "bg-green-400 text-white"}
                ${
                  isCurrent
                    ? "bg-green-800 text-white scale-125 border-4 border-green-400"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {isCompleted ? <Check size={30}/> : index + 1}
              </div>
              <p
                className={`text-xs sm:text-sm mt-2 ${
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
    </div>
  );
};
