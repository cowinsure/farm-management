"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Send, QrCode, ChevronDown, Logs } from "lucide-react";
import gsap from "gsap";
import { useLocalization } from "@/context/LocalizationContext";

interface Cow {
  id: string;
  identifier: string;
  avatar: string;
}

interface Vaccine {
  id: string;
  name: string;
}

interface ScheduleVaccinationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ScheduleVaccinationDialog: React.FC<ScheduleVaccinationDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, locale, setLocale } = useLocalization();
  const [selectedCows, setSelectedCows] = useState<Cow[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedVaccine, setSelectedVaccine] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const availableCows: Cow[] = [
    {
      id: "1",
      identifier: "Cow 001",
      avatar: "🐄",
    },
    {
      id: "2",
      identifier: "Cow 002",
      avatar: "🐄",
    },
    {
      id: "3",
      identifier: "Cow 003",
      avatar: "🐄",
    },
    {
      id: "4",
      identifier: "Cow 004",
      avatar: "🐄",
    },
  ];

  const vaccines: Vaccine[] = [
    {
      id: "1",
      name: "BQ Vaccine",
    },
    {
      id: "2",
      name: "HS Vaccine",
    },
    {
      id: "3",
      name: "Anthrax Vaccine",
    },
    {
      id: "4",
      name: "Brucellosis Vaccine",
    },
    {
      id: "5",
      name: "Rabies Vaccine",
    },
  ];

  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out" }
    );

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      }
    );

    return () => {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.2,
      });
    };
  }, [isOpen]);

  const handleRemoveCow = (cowId: string) => {
    gsap.to(`[data-cow-id="${cowId}"]`, {
      opacity: 0,
      x: 20,
      duration: 0.2,
      onComplete: () => {
        setSelectedCows(selectedCows.filter((cow) => cow.id !== cowId));
      },
    });
  };

  const handleCloseDialog = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
    });
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  const handleSelectCow = (cow: Cow) => {
    const isCowSelected = selectedCows.some((c) => c.id === cow.id);

    if (isCowSelected) {
      handleRemoveCow(cow.id);
    } else {
      const newCows = [...selectedCows, cow];
      setSelectedCows(newCows);

      setTimeout(() => {
        gsap.fromTo(
          `[data-cow-id="${cow.id}"]`,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
        );
      }, 0);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={handleCloseDialog}
      />

      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 overflow-auto max-h-[90vh]">
          <button
            onClick={handleCloseDialog}
            className="absolute z-10 top-6 right-6 p-1 hover:bg-gray-300 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X size={24} className="text-red-600" />
          </button>

          <div ref={contentRef}>
            <h1 className="form-section text-3xl font-bold text-gray-900 mb-8">
              Schedule Vaccination
            </h1>

            <div className="form-section mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Cows
              </h2>

              <div ref={dropdownRef} className="flex flex-row relative mb-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-[65%] flex items-center justify-between px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-green-500 transition-all hover:bg-green-50 focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <Logs size={20} className="text-gray-600" />
                    <span className="text-gray-600">
                      {selectedCows.length === 0
                        ? "Select a cow..."
                        : `${selectedCows.length} cow${
                            selectedCows.length !== 1 ? "s" : ""
                          } selected`}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-600 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute w-[65%] top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="max-h-48 overflow-y-auto">
                      {availableCows.map((cow) => {
                        const isSelected = selectedCows.some(
                          (c) => c.id === cow.id
                        );
                        return (
                          <button
                            key={cow.id}
                            onClick={() => handleSelectCow(cow)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                              isSelected ? "bg-green-50" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <div
                              className={`w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-sm text-white font-bold`}
                            >
                              {cow.avatar}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500">
                                {cow.identifier}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Scan QR Button */}
                <button className="w-[30%] flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                  <QrCode size={20} />
                  Scan QR
                </button>
              </div>
              {/* Selected Cows */}
              <div className="space-y-3 mt-4">
                {selectedCows.map((cow) => (
                  <div
                    key={cow.id}
                    data-cow-id={cow.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-green-300 rounded-full flex items-center justify-center text-xl text-white font-bold`}
                      >
                        {cow.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {cow.identifier}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCow(cow.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove cow"
                    >
                      <X size={20} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Choose Vaccine Section */}
            <div className="form-section mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Vaccine
              </h2>
              <div className="space-y-3">
                {vaccines.map((vaccine) => (
                  <label
                    key={vaccine.id}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <input
                      type="radio"
                      name="vaccine"
                      value={vaccine.id}
                      checked={selectedVaccine === vaccine.id}
                      onChange={(e) => setSelectedVaccine(e.target.value)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">
                        {vaccine.name}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedule Date Section */}
            <div className="form-section mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Schedule Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Schedule Button */}
            <button
              onClick={onSuccess}
              className="form-section w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all hover:shadow-lg active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <Send size={20} />
                Schedule Vaccination
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleVaccinationDialog;
