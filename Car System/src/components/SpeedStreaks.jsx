import React, { useEffect, useRef } from 'react';

export default function SpeedStreaks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Speed streaks state
    const particles = [];
    const maxParticles = 60;

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 80 + 40, // 40px to 120px
        speed: Math.random() * 8 + 4,
        opacity: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.8 ? '#0066FF' : '#ffffff', // 20% blue, 80% white
      });
    }

    // Handle window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Global variable/callback for sections to modify intensity
    window.setStreakIntensity = (targetIntensity) => {
      currentIntensity = targetIntensity;
    };

    let currentIntensity = 1.0;
    let targetIntensity = 1.0;

    // Scroll listener to auto-adjust based on scroll page coordinates if not manually set
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = scrollY / docHeight;

      // Map scroll progress to sections:
      // Hero (0 to 15% scroll) -> intensity 1.0
      // Mid (15% to 75% scroll) -> intensity 0.08 (near invisible)
      // CTA (75% to 92% scroll) -> intensity 1.0
      // Footer (92% to 100% scroll) -> intensity 0.02 (dimmed)
      if (scrollPercent < 0.15) {
        targetIntensity = 1.0;
      } else if (scrollPercent < 0.75) {
        targetIntensity = 0.08;
      } else if (scrollPercent < 0.92) {
        targetIntensity = 1.0;
      } else {
        targetIntensity = 0.02;
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Check system preferences for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animation loop
    const animate = () => {
      // Smoothly interpolate current intensity to target intensity
      currentIntensity += (targetIntensity - currentIntensity) * 0.05;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move particle left to right at speed scaled by intensity (only if motion is allowed)
        if (!prefersReducedMotion) {
          p.x += p.speed * (0.2 + currentIntensity * 1.8);
        }

        // Wrap around
        if (p.x - p.length > width) {
          p.x = -p.length;
          p.y = Math.random() * height;
          p.speed = Math.random() * 8 + 4;
          p.length = Math.random() * 80 + 40;
        }

        // Draw horizontal line with fading edges
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x + p.length, p.y);
        const finalOpacity = p.opacity * Math.min(currentIntensity * 1.5, 1);

        if (p.color === '#0066FF') {
          gradient.addColorStop(0, 'rgba(0, 102, 255, 0)');
          gradient.addColorStop(0.5, `rgba(0, 102, 255, ${finalOpacity})`);
          gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${finalOpacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length, p.y);
        ctx.stroke();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Draw once for reduced motion, or run loop
    if (prefersReducedMotion) {
      animate();
    } else {
      animate();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 noise-overlay"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
