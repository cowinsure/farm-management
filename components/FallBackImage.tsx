"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholderSrc?: string; // Optional custom placeholder
}

const FallbackImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  placeholderSrc = "/placeholder.png",
}: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
    } else {
      setImgSrc(placeholderSrc);
    }
  }, [src, placeholderSrc]);

  const handleError = () => setImgSrc(placeholderSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized
    />
  );
};

export default FallbackImage;
