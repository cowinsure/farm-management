// components/ui/InputField.tsx

import clsx from "clsx";
import { read } from "fs";
import React from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  id: string;
  name: string;
  value?: string | number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  max?: string;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = "",
  maxLength,
  readOnly = false,
  error,
}) => {
  return (
    <div className="relative">
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className="mb-1 text-sm font-semibold text-gray-700 tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          className={clsx(
            "p-2 border border-gray-300 bg-gray-50 rounded-md font-medium text-gray-500",
            "focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50",
            "hover:bg-green-50 hover:border-green-300",
            type === "date" &&
              "appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0",
            error ? "border-red-600" : "border-gray-300"
          )}
        />
      </div>
      {error && (
        <p className="text-red-400 mt-1 font-medium text-sm absolute">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
