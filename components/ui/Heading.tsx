import React from "react";
interface HeadingProps {
  heading: string;
}
const Heading = ({ heading }: HeadingProps) => {
  return (
    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 animate__animated animate__fadeIn">{heading}</h2>
  );
};

export default Heading;
