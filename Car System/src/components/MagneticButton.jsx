import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className = '', onClick, roleColorClass = 'text-customer border-customer/20 hover:border-customer/50' }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for the translation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for magnetic pull
  const springConfig = { damping: 15, elastic: 0.1, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Get mouse position relative to button center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Pull intensity factor (adjust to change range of motion)
    const pullFactor = 0.25; 
    x.set(deltaX * pullFactor);
    y.set(deltaY * pullFactor);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={`relative px-6 py-3.5 rounded-none font-display font-bold text-sm tracking-wider uppercase border transition-colors duration-300 z-10 cursor-pointer overflow-hidden group ${roleColorClass} ${className}`}
    >
      {/* Glow highlight background */}
      <span className="absolute inset-0 w-full h-full bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Interactive text shift */}
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {children}
      </span>
    </motion.button>
  );
}
