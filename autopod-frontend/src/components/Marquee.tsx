import React from 'react';

interface MarqueeProps {
  items: React.ReactNode[];
  speed?: number; // seconds for one loop
}

const Marquee: React.FC<MarqueeProps> = ({ items, speed = 30 }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap relative">
      <div
        className="flex gap-8 will-change-transform"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="opacity-80 hover:opacity-100 transition-opacity">
            {item}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;

