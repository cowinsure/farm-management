import React from "react";

interface SectionHeadingProps {
  sectionTitle: string;
  description: string;
  icon?: React.ReactNode;
  marginBottom?: string;
}

const SectionHeading = ({
  sectionTitle,
  description,
  icon,
  marginBottom = "14",
}: SectionHeadingProps) => {
  return (
    <div
      className={`mb-${marginBottom}`}
      data-aos="fade-zoom-in"
      data-aos-delay="200"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-2xl text-green-700">{icon}</span>}
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-700">{sectionTitle}</h1>
      </div>
      <p className="text-sm md:text-base font-medium text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default SectionHeading;
