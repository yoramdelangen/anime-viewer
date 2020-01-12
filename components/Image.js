import React from "react";
import ProgressiveImage from "react-progressive-image";

export const SIMKL_URL = "https://simkl.in";

export default function Image(props) {
  const { src, placeholder, ...attrs } = props;

  const checkSource = src => {
    if (src.includes("http") || src.startsWith("/images/")) {
      return src;
    }

    if (!src.startsWith("/")) {
      src = "/" + src;
    }

    return SIMKL_URL + src;
  };

  return (
    <ProgressiveImage
      src={checkSource(src)}
      placeholder={checkSource(placeholder || "/images/vid.svg")}
    >
      {src => <img src={src} {...attrs} />}
    </ProgressiveImage>
  );
}
