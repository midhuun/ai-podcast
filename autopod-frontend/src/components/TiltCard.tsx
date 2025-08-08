import React, { useRef, useEffect } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const TiltCard: React.FC<TiltCardProps> = ({ maxTilt = 10, className = '', children, ...rest }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      const rx = clamp((0.5 - py) * maxTilt * 2, -maxTilt, maxTilt);
      const ry = clamp((px - 0.5) * maxTilt * 2, -maxTilt, maxTilt);
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onLeave = () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [maxTilt]);

  return (
    <div ref={ref} className={`transition-transform duration-200 will-change-transform ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default TiltCard;

