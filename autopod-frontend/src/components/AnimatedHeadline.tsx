import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

interface AnimatedHeadlineProps {
  lines: (string | JSX.Element)[];
  className?: string;
}

const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({ lines, className = '' }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parts = el.querySelectorAll('[data-line]');
    gsap.fromTo(parts, { yPercent: 110, opacity: 0 }, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
    });
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {lines.map((l, i) => (
        <div key={i} className="overflow-hidden">
          <div data-line>{l}</div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedHeadline;

