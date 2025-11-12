import React from "react";
interface HeadingProps {
  heading: string;
  className?: string;
}
const Heading = ({ heading, className }: HeadingProps) => {
  return (
    <h2
      className={`text-xl lg:text-3xl text-green-800 block lg:hidden tracking-wide animate__animated animate__fadeIn mb-2 font-semibold ${className}`}
    >
      {heading}
    </h2>
  );
};

export default Heading;
