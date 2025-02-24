import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, fallbackSrc, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} ${props.loading === 'lazy' ? 'blur-up' : ''}`}
      onError={() => setImgSrc(fallbackSrc)}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback; 