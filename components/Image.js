import React from "react";
import ProgressiveImage from "react-progressive-image";

export default function Image(props) {
  const { src, placeholder, ...attrs } = props;
  return (
    <ProgressiveImage src={src} placeholder={placeholder}>
      {src => <img src={src} {...attrs} />}
    </ProgressiveImage>
  );
}
