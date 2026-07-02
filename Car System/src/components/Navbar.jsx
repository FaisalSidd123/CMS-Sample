import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Phone } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll height to trigger background blend
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Inventory', href: '#inventory' },
    { label: 'About Us', href: '#about-us' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-xs border-b border-border-hairline py-4' 
            : 'bg-transparent py-6 text-white'
        }`}
      >
        <div className="max-w-none w-full px-6 md:px-16 flex justify-between items-center relative">
          
          {/* Dealership Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-1.5 font-display font-extrabold tracking-widest text-lg md:text-xl uppercase">
              <span className={isScrolled ? 'text-charcoal' : 'text-white'}>Vanguard</span>
              <span className="text-brand-red">Motors</span>
            </a>
          </div>

          {/* Desktop Navigation Links (Viewport Centralized) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-charcoal/70 hover:text-brand-red' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-6">
            <button className={`p-1.5 transition-colors cursor-pointer ${
              isScrolled ? 'text-charcoal hover:text-brand-red' : 'text-white/80 hover:text-white'
            }`}>
              <Search className="w-4.5 h-4.5" />
            </button>
            <a
              href="#contact"
              className="bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors duration-300"
            >
              Get In Touch
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button className={`p-1.5 ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
              <Search className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 transition-colors cursor-pointer ${
                isScrolled ? 'text-charcoal hover:text-brand-red' : 'text-white hover:text-brand-red'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-2xl p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-10">
                  <span className="font-display font-extrabold tracking-widest text-lg text-charcoal uppercase">
                    Vanguard <span className="text-brand-red">Motors</span>
                  </span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-charcoal hover:text-brand-red"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 font-display font-bold text-sm uppercase tracking-widest">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-charcoal/80 hover:text-brand-red transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-wider py-3.5 transition-colors"
                >
                  Get In Touch
                </a>
                <div className="flex items-center gap-2 justify-center text-xs text-neutral-500 font-medium">
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>+1 (800) 555-0199</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
