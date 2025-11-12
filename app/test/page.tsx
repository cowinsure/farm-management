"use client";
import ScheduleVaccinationDialog from "@/components/health/schedule-vaccination-dialog";
import React, { useState } from "react";

export default function test() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeAll = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Schedule Vacination</button>
      <ScheduleVaccinationDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={closeAll}
      />
    </div>
  );
}
