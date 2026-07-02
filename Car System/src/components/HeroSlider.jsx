import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronRight, ArrowDown } from 'lucide-react';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80",
    headlineStart: "Find Your Perfect ",
    headlineHighlight: "Drive.",
    sub: "Curated Inventory  •  Personal Advisors  •  Premium Standards",
    tag: "CURATED SELECTION"
  },
  {
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
    headlineStart: "Built For The Road ",
    headlineHighlight: "Ahead.",
    sub: "High Performance  •  Dynamic Engineering  •  Refined Styling",
    tag: "ENGINEERING EXCELLENCE"
  },
  {
    url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1920&q=80",
    headlineStart: "Drive What You ",
    headlineHighlight: "Deserve.",
    sub: "Premium Vehicles  •  Verified Listings  •  Doorstep Delivery",
    tag: "LUXURY EXPERIENCE"
  },
  {
    url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80",
    headlineStart: "Your Next Chapter ",
    headlineHighlight: "Starts Here.",
    sub: "Diverse Inventory  •  Seamless Procurement  •  Global Delivery",
    tag: "Vanguard DIRECT"
  },
  {
    url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80",
    headlineStart: "Luxury Within ",
    headlineHighlight: "Reach.",
    sub: "Tailored Sedans  •  Sports Touring SUVs  •  Luxury Standards",
    tag: "PREMIUM STANDARD"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slideDuration = 5000;
  const imageRefs = useRef([]);
  const progressRef = useRef(null);

  // Set up the slide rotation and GSAP progress bar animation
  useEffect(() => {
    if (progressRef.current) {
      gsap.fromTo(progressRef.current, 
        { width: '0%' }, 
        { width: '100%', duration: slideDuration / 1000, ease: 'linear' }
      );
    }

    const timer = setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [current]);

  // Trigger Ken Burns pan/zoom on active slide using GSAP
  useEffect(() => {
    const activeImage = imageRefs.current[current];
    if (!activeImage) return;

    imageRefs.current.forEach((img) => {
      if (img) gsap.set(img, { scale: 1, x: 0 });
    });

    gsap.fromTo(activeImage, 
      { scale: 1, x: 0 },
      { 
        scale: 1.06, 
        x: -20, 
        duration: slideDuration / 1000, 
        ease: 'power1.out' 
      }
    );
  }, [current]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[100dvh] w-full bg-[#0F0F0F] text-white overflow-hidden flex flex-col justify-center items-start"
    >
      
      {/* Slide Images Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Slide Image */}
            <img
              ref={(el) => (imageRefs.current[idx] = el)}
              src={slide.url}
              alt={slide.headlineStart + slide.headlineHighlight}
              className="w-full h-full object-cover"
            />

            {/* Dark gradient overlay on the left half */}
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Content Overlay with responsive padding block clamping */}
      <div 
        className="relative z-10 w-full px-8 md:px-16 lg:px-24 flex items-center"
        style={{ paddingBlock: 'clamp(6rem, 12vh, 9rem)' }}
      >
        <div className="max-w-[640px] text-left">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`slide-content-${current}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-start"
            >
              
              {/* TIER 1: Eyebrow label */}
              <motion.div 
                variants={itemVariants} 
                className="flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.18em] text-brand-red uppercase font-semibold">
                  {slides[current].tag}
                </span>
              </motion.div>

              {/* TIER 2: Main headline with Bebas Neue pairing and key word colored */}
              <motion.h1
                variants={itemVariants}
                className="font-display-condensed leading-[1.05] tracking-[-0.01em] text-white uppercase text-left mt-4 select-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
              >
                {slides[current].headlineStart}
                <span className="text-brand-red">{slides[current].headlineHighlight}</span>
              </motion.h1>

              {/* TIER 3: Supporting line - single flowing line, muted weight & color */}
              <motion.p
                variants={itemVariants}
                className="text-white/75 font-sans tracking-wide leading-relaxed font-normal mt-6 max-w-[40ch]"
                style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}
              >
                {slides[current].sub}
              </motion.p>

              {/* Action Row */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-4 mt-8"
              >
                <a
                  href="#inventory"
                  className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-6 py-4 flex items-center gap-2 transition-colors duration-300"
                >
                  <span>Browse Inventory</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="border border-white/30 hover:border-white hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest px-6 py-4 transition-all duration-300"
                >
                  Book a Test Drive
                </a>
              </motion.div>

            </motion.div>
          </AnimatePresence>

          {/* Slide Progress Indicator Bar */}
          <div className="w-64 h-[2px] bg-white/10 mt-12 overflow-hidden relative">
            <div
              key={`progress-bar-${current}`}
              ref={progressRef}
              className="absolute left-0 top-0 h-full bg-brand-red"
            />
          </div>

        </div>
      </div>

      {/* Scroll Down Cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest select-none hidden md:flex">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-5 h-5 text-white/70" />
        </motion.div>
      </div>

    </section>
  );
}
