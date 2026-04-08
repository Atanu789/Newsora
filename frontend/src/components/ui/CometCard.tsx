'use client';

import { useMemo, useState } from 'react';

type CometCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function CometCard({ children, className = '' }: CometCardProps) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');

  const style = useMemo(
    () => ({
      transform,
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 200ms ease'
    }),
    [transform]
  );

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 12;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.01)`);
  };

  const onLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div className="[perspective:1200px]">
      <div
        className={`rounded-2xl border border-zinc-200/90 bg-panel shadow-[0_10px_28px_rgba(0,0,0,0.08)] dark:border-zinc-800 ${className}`}
        style={style}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </div>
    </div>
  );
}
