'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

type NewsPreviewImageProps = {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  priority?: boolean;
};

function buildFallback(category?: string) {
  const text = encodeURIComponent(category || 'News');
  return `https://placehold.co/960x540/1f2937/f8fafc?text=${text}`;
}

export function NewsPreviewImage({ src, alt, category, className = '', priority = false }: NewsPreviewImageProps) {
  const fallback = useMemo(() => buildFallback(category), [category]);
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={960}
      height={540}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 768px"
      className={`h-full w-full object-cover ${className}`}
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
    />
  );
}
