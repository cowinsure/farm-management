"use client";

import { useLocalization } from "@/context/LocalizationContext";
import React from "react";

const LocalizationToggle: React.FC = () => {
  const { locale, setLocale } = useLocalization();
  const isBN = locale === "bn";

  const toggleLocale = () => {
    setLocale(isBN ? "en" : "bn");
  };

  return (
    <button
      title="Change language"
      onClick={toggleLocale}
      className={`
        relative w-14 h-6 rounded-full flex items-center
        transition-colors duration-300 cursor-pointer
        ${isBN ? "bg-blue-100" : "bg-gray-300"}
      `}
    >
      {/* Sliding Circle */}
      <span
        className={`
          absolute w-7 h-7 bg-sky-200 rounded-full shadow
          transition-all duration-300
          ${isBN ? "translate-x-7" : "translate-x-0"}
        `}
      />

      {/* Labels */}
      <span
        className={`absolute left-1.5  transition-opacity duration-300
        ${
          isBN ? "opacity-40 text-[10px]" : "opacity-100 font-bold text-[14px]"
        }`}
      >
        EN
      </span>

      <span
        className={`absolute right-1  transition-opacity duration-300
        ${
          isBN
            ? "opacity-100 font-bold text-[14px] text-blue-800"
            : "opacity-40 text-[10px]"
        }`}
      >
        BN
      </span>
    </button>
  );
};

export default LocalizationToggle;
