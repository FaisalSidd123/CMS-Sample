import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import useEmblaCarousel from 'embla-carousel-react';

// Icons
import {
  Compass,
  Cpu,
  Layers,
  Fuel,
  Search,
  CheckCircle,
  FileText,
  Truck,
  Users,
  Star,
  ChevronRight,
  ArrowRight,
  MapPin,
  Car,
  Image as ImageIcon
} from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import SearchFilter from './components/SearchFilter';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Integrated user inventory data
const inventory = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    name: "BMW 5 Series",
    year: 2022,
    price: "$45,000",
    mileage: "18,000 mi",
    fuel: "Petrol",
    transmission: "Automatic",
    type: "Sedan"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80",
    name: "Mercedes-Benz GLE",
    year: 2023,
    price: "$68,000",
    mileage: "9,500 mi",
    fuel: "Hybrid",
    transmission: "Automatic",
    type: "SUV"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80",
    name: "Porsche 911",
    year: 2021,
    price: "$112,000",
    mileage: "12,000 mi",
    fuel: "Petrol",
    transmission: "Manual",
    type: "Sports"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    name: "Audi Q7",
    year: 2022,
    price: "$58,500",
    mileage: "22,000 mi",
    fuel: "Diesel",
    transmission: "Automatic",
    type: "SUV"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    name: "Toyota Land Cruiser",
    year: 2023,
    price: "$82,000",
    mileage: "5,000 mi",
    fuel: "Petrol",
    transmission: "Automatic",
    type: "SUV"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    name: "Tesla Model S",
    year: 2023,
    price: "$89,000",
    mileage: "8,200 mi",
    fuel: "Electric",
    transmission: "Automatic",
    type: "Sedan"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    name: "Range Rover Sport",
    year: 2022,
    price: "$94,000",
    mileage: "15,000 mi",
    fuel: "Hybrid",
    transmission: "Automatic",
    type: "SUV"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
    name: "Honda Civic",
    year: 2023,
    price: "$28,000",
    mileage: "6,700 mi",
    fuel: "Petrol",
    transmission: "Automatic",
    type: "Sedan"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    name: "Ford Mustang GT",
    year: 2021,
    price: "$52,000",
    mileage: "20,000 mi",
    fuel: "Petrol",
    transmission: "Manual",
    type: "Sports"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&q=80",
    name: "Lexus RX 350",
    year: 2022,
    price: "$61,000",
    mileage: "13,400 mi",
    fuel: "Hybrid",
    transmission: "Automatic",
    type: "SUV"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800&q=80",
    name: "Chevrolet Camaro",
    year: 2021,
    price: "$44,000",
    mileage: "17,800 mi",
    fuel: "Petrol",
    transmission: "Manual",
    type: "Sports"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
    name: "Volkswagen Tiguan",
    year: 2023,
    price: "$36,500",
    mileage: "4,200 mi",
    fuel: "Petrol",
    transmission: "Automatic",
    type: "SUV"
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Marcus Vance',
    city: 'Los Angeles, CA',
    quote: 'The buying process was incredibly seamless. The paperwork was ready within minutes and the car was delivered to my doorstep in pristine condition.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sophia Laurent',
    city: 'Miami, FL',
    quote: 'Excellent client service. My representative walked me through the entire options package and kept me updated through every logistical stage.',
    rating: 5
  },
  {
    id: 3,
    name: 'David K. Stern',
    city: 'New York, NY',
    quote: 'Vanguard represents the next generation of dealership experience. Straightforward pricing, verified histories, and dedicated professionals.',
    rating: 5
  },
  {
    id: 4,
    name: 'Elena Rostova',
    city: 'Chicago, IL',
    quote: 'Their attention to detail and full vehicle verification documentation gave me absolute confidence in making my purchase remotely.',
    rating: 5
  }
];

export default function App() {
  const [activeInventory, setActiveInventory] = useState(inventory);
  const [showAll, setShowAll] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState('');
  
  // Section refs for GSAP ScrollTriggers
  const howItWorksRef = useRef(null);
  const aboutRef = useRef(null);
  const aboutImageRef = useRef(null);

  // Embla setup for testimonials
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  // Autoplay embla testimonials
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Synchronize ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 1. GSAP ScrollTrigger: SVG Connector drawing in "How It Works"
    const connector = document.getElementById('how-it-works-connector');
    if (connector) {
      const length = connector.getTotalLength ? connector.getTotalLength() : 500;
      gsap.set(connector, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(connector, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top center+=200',
          end: 'center center',
          scrub: 1.0
        }
      });
    }

    // 2. GSAP ScrollTrigger: About Section Image Parallax
    if (aboutImageRef.current) {
      gsap.fromTo(aboutImageRef.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Handle Dynamic Search/Filter submission
  const handleSearch = ({ brand, model, year, price, bodyType }) => {
    let filtered = inventory;

    if (brand !== 'All Brands') {
      filtered = filtered.filter(car => car.brand === brand);
    }
    if (model !== 'All Models') {
      filtered = filtered.filter(car => car.name === model);
    }
    if (year !== 'All Years') {
      filtered = filtered.filter(car => car.year.toString() === year);
    }
    if (bodyType !== 'All Body Types') {
      filtered = filtered.filter(car => car.type === bodyType);
    }
    if (price !== 'All Prices') {
      filtered = filtered.filter(car => {
        const val = parseInt(car.price.replace(/[$,]/g, '')) || 0;
        if (price === 'Under $50,000') return val < 50000;
        if (price === '$50,000 - $80,000') return val >= 50000 && val <= 80000;
        if (price === '$80,000 - $120,000') return val >= 80000 && val <= 120000;
        if (price === '$120,000+') return val >= 120000;
        return true;
      });
    }

    setActiveInventory(filtered);
    setShowAll(true); // Automatically expand results on filter submission

    // Setup toast notification
    setSearchFeedback(`Found ${filtered.length} matches`);
    setTimeout(() => setSearchFeedback(''), 3000);

    // Scroll to inventory section smoothly
    const element = document.getElementById('inventory');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Compute visible inventory slice based on showAll toggling
  const visibleCars = showAll ? activeInventory : activeInventory.slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-charcoal font-sans selection:bg-brand-red selection:text-white">
      
      {/* Sticky top navbar */}
      <Navbar />

      {/* 2. Hero Slider */}
      <HeroSlider />

      {/* 3. Search Filter Bar */}
      <SearchFilter inventory={inventory} onSearch={handleSearch} />

      {/* Search Feedback Toast */}
      <AnimatePresence>
        {searchFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-charcoal text-white text-xs font-mono uppercase tracking-widest px-6 py-4 border border-brand-red/30 shadow-2xl"
          >
            {searchFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 4: FEATURED INVENTORY CAR LISTING GRID */}
      <section id="inventory" className="py-24 max-w-7xl mx-auto px-6 md:px-12 bg-white">
        
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest mb-1">// Curated Selection</span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-charcoal">
            Featured Vehicles
          </h2>
          <div className="w-12 h-1 bg-brand-red mt-4" />
        </div>

        {/* Dynamic Empty State */}
        {visibleCars.length === 0 && (
          <div className="border border-border-hairline p-16 text-center text-neutral-400 font-sans my-8">
            No premium vehicles match your search criteria. Try adjusting the filter settings.
          </div>
        )}

        {/* Stagger reveal car listings */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {visibleCars.map((car) => (
              <motion.div
                layout
                key={car.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="premium-card flex flex-col justify-between h-full bg-white border border-border-hairline p-5"
              >
                <div>
                  {/* Image Container with Unsplash URL */}
                  <div className="aspect-16/9 w-full bg-light-bg overflow-hidden flex items-center justify-center relative mb-5 rounded-sm">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-400 select-none">
                        <ImageIcon className="w-8 h-8 stroke-[1.25]" />
                        <span className="text-[9px] font-mono uppercase tracking-widest">[ Empty Image Path ]</span>
                      </div>
                    )}
                    {/* Year Badge */}
                    <span className="absolute top-3 left-3 bg-charcoal text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1">
                      {car.year}
                    </span>
                  </div>

                  {/* Car Identity info */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="text-left">
                      <h3 className="font-display font-extrabold text-md text-charcoal uppercase leading-tight">
                        {car.name}
                      </h3>
                      <span className="text-xs font-medium text-neutral-400 font-mono tracking-wider block mt-1">
                        {car.mileage}
                      </span>
                    </div>
                    <span className="text-lg font-display font-black text-brand-red tracking-tight shrink-0">
                      {car.price}
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div className="w-full h-[1px] bg-border-hairline my-4" />

                  {/* Technical Specifications (aligned with Type, Transmission, Fuel) */}
                  <div className="grid grid-cols-3 gap-2 py-1 text-left">
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase">
                      <Car className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{car.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase justify-center">
                      <Layers className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase justify-end">
                      <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{car.fuel}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Detail Link */}
                <div className="mt-6 pt-4 border-t border-border-hairline flex items-center justify-between">
                  <a
                    href="#contact"
                    className="text-xs font-bold uppercase tracking-wider text-charcoal hover:text-brand-red flex items-center gap-1.5 group transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button Toggle (only shown when matches are greater than 6) */}
        {activeInventory.length > 6 && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="border-2 border-brand-red hover:bg-brand-red hover:text-white text-brand-red text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer"
            >
              {showAll ? 'Show Featured Only' : 'View All Inventory'}
            </button>
          </div>
        )}
      </section>

      {/* SECTION 5: WHY CHOOSE US (TRUST & DIFFERENTIATORS) */}
      <section className="py-24 border-t border-border-hairline bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            
            {/* Diff 1 */}
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              className="flex flex-col items-start text-left"
            >
              <div className="w-10 h-10 bg-brand-red/5 flex items-center justify-center text-brand-red mb-5 rounded-xs">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal mb-2">
                Verified Listings
              </h3>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                Every vehicle is subjected to a comprehensive 150-point inspection catalog before listing.
              </p>
            </motion.div>

            {/* Diff 2 */}
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              className="flex flex-col items-start text-left"
            >
              <div className="w-10 h-10 bg-brand-red/5 flex items-center justify-center text-brand-red mb-5 rounded-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal mb-2">
                Full Documentation
              </h3>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                Complete paperwork, title history profiles, and state registrations fully coordinated for you.
              </p>
            </motion.div>

            {/* Diff 3 */}
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              className="flex flex-col items-start text-left"
            >
              <div className="w-10 h-10 bg-brand-red/5 flex items-center justify-center text-brand-red mb-5 rounded-xs">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal mb-2">
                Doorstep Delivery
              </h3>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                We handle premium enclosed transportation, delivering your vehicle straight to your designated coordinates.
              </p>
            </motion.div>

            {/* Diff 4 */}
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              className="flex flex-col items-start text-left"
            >
              <div className="w-10 h-10 bg-brand-red/5 flex items-center justify-center text-brand-red mb-5 rounded-xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal mb-2">
                Dedicated Support
              </h3>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                A single personal advisor coordinates your financing, trade-in, and final delivery logistics.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* SECTION 6: HOW IT WORKS (SIMPLE 3-STEP BUYER JOURNEY) */}
      <section
        ref={howItWorksRef}
        id="how-it-works"
        className="py-24 bg-light-bg border-y border-border-hairline relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest mb-1">// Guided Process</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-charcoal">
              Buying Made Simple
            </h2>
            <p className="mt-4 text-xs text-neutral-500 font-sans">
              Our streamlined operational pipeline guarantees transparency and speed.
            </p>
          </div>

          {/* Steps Horizontal Row */}
          <div className="relative">
            {/* GSAP Scroll Triggered SVG connector line */}
            <div className="absolute left-[15%] right-[15%] top-6 h-0.5 z-0 hidden md:block">
              <svg className="w-full h-full overflow-visible">
                <line
                  id="how-it-works-connector"
                  x1="0%"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke="#C0392B"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-bold text-sm shadow-md mb-6">
                  01
                </div>
                <h3 className="font-display font-bold text-md uppercase text-charcoal mb-3">
                  Browse
                </h3>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-xs">
                  Query our inventory catalog, filter by specifications, and select your performance preferences.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-bold text-sm shadow-md mb-6">
                  02
                </div>
                <h3 className="font-display font-bold text-md uppercase text-charcoal mb-3">
                  Reserve
                </h3>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-xs">
                  Secure your chosen vehicle directly. Place a temporary lock and hold on the VIN record instantly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-bold text-sm shadow-md mb-6">
                  03
                </div>
                <h3 className="font-display font-bold text-md uppercase text-charcoal mb-3">
                  Receive
                </h3>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-xs">
                  Coordinate delivery details with your specialist, sign purchase logs, and take delivery at home.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7: ABOUT US (BRAND STORY) */}
      <section
        ref={aboutRef}
        id="about-us"
        className="py-24 md:py-32 bg-white max-w-7xl mx-auto px-6 md:px-12 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Parallax Image Frame */}
          <div className="relative h-[350px] md:h-[450px] bg-light-bg overflow-hidden flex items-center justify-center">
            
            {/* Understated parallax container */}
            <div ref={aboutImageRef} className="absolute inset-0 w-full h-[120%]">
              {/* Image to be added by user, displaying placeholder if empty */}
              <div className="w-full h-full bg-linear-to-br from-neutral-200 via-neutral-100 to-neutral-200 flex items-center justify-center relative">
                <div className="absolute inset-8 border border-neutral-400/20 flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="w-10 h-10 text-neutral-400 stroke-[1.25]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                    [ About Image URL Placeholder ]
                  </span>
                </div>
              </div>
            </div>

            {/* Frame border highlight */}
            <div className="absolute inset-6 border border-charcoal/5 pointer-events-none" />
          </div>

          {/* Right Column: Copy & Stats */}
          <div className="text-left">
            <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest mb-1">
              // Corporate Identity
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-charcoal mb-6">
              About Vanguard Motors
            </h2>
            
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-4">
              Founded on the principle of transparency, Vanguard Motors delivers an elite, personalized vehicle procurement service. We bypass traditional dealership friction, connecting discerning buyers with exceptional performance machinery.
            </p>
            
            <p className="text-xs text-neutral-600 font-sans leading-relaxed mb-10">
              Our inventory profiles represent curated, hand-inspected vehicles. Whether sourcing a track-focused GT series or a premium touring SUV, our global procurement team operates with engineering rigor.
            </p>

            {/* Monospace inline metrics */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-border-hairline pt-8">
              <div className="flex flex-col">
                <span className="font-display font-black text-xl text-charcoal">500+</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Vehicles Sold</span>
              </div>
              <div className="flex-1 border-r border-border-hairline h-8 max-w-[1px] hidden sm:block" />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl text-charcoal">8 Years</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">In Business</span>
              </div>
              <div className="flex-1 border-r border-border-hairline h-8 max-w-[1px] hidden sm:block" />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl text-charcoal">4 Cities</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Served</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 8: TESTIMONIALS (CUSTOMER CAROUSEL) */}
      <section className="py-24 bg-light-bg border-y border-border-hairline">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest mb-1">// Customer Reviews</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-charcoal">
              What Our Customers Say
            </h2>
          </div>

          {/* Testimonial Embla Carousel */}
          <div className="embla" ref={emblaRef}>
            <div className="embla-multi__container">
              {testimonials.map((t) => (
                <div className="embla-multi__slide" key={t.id}>
                  <div className="bg-white p-8 shadow-xs border border-border-hairline flex flex-col justify-between h-[220px] rounded-none">
                    
                    {/* Stars Badge & Info */}
                    <div>
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-brand-red text-brand-red" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-600 font-sans italic leading-relaxed text-left line-clamp-4">
                        "{t.quote}"
                      </p>
                    </div>

                    {/* Author Signature */}
                    <div className="flex justify-between items-center border-t border-border-hairline pt-4 mt-4">
                      <span className="text-xs font-display font-bold uppercase tracking-wider text-charcoal">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {t.city}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9: CTA BANNER */}
      <section
        className="relative py-32 bg-[#0F0F0F] text-white text-center overflow-hidden flex flex-col justify-center items-center px-6"
      >
        {/* Subtle vehicle outline background overlay */}
        <div className="absolute inset-0 w-full h-full opacity-10 bg-radial-gradient z-0 flex items-center justify-center">
          {/* Subtle sports car outline sketch/wireframe */}
          <svg viewBox="0 0 800 250" fill="none" className="w-[80%] max-w-4xl h-auto pointer-events-none select-none">
            <path
              d="M 80 190 C 85 185, 95 174, 105 171 C 120 168, 160 162, 200 156 C 240 150, 280 135, 310 115 C 340 95, 380 90, 430 90 C 480 90, 525 95, 570 120 C 610 140, 640 142, 675 142 L 706 155 C 706 165, 702 180, 695 186 C 685 190, 675 190, 670 190 L 550 190 L 270 190 L 80 190 Z"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest mb-3 block">
            // Procurement Node
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight leading-[1.1] mb-6">
            Your Next Car Is Waiting.
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm max-w-lg mx-auto font-sans leading-relaxed mb-8">
            Browse our full active inventory logs or connect directly with our dispatch advisors to place your holds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#inventory"
              className="w-full sm:w-auto bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-colors"
            >
              Browse Inventory
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto border border-white/20 hover:border-white hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 10: FOOTER */}
      <footer id="contact" className="bg-[#1A1A1A] text-white pt-20 pb-8 border-t border-neutral-800">
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-16">
          
          {/* Column 1: Logo & description */}
          <div>
            <span className="font-display font-extrabold tracking-widest text-lg uppercase block mb-4">
              Vanguard <span className="text-brand-red">Motors</span>
            </span>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-6">
              Curated luxury and performance vehicle procurement pipelines. Delivered straight to your coordinates.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="p-2 bg-neutral-800 hover:bg-brand-red transition-colors text-white flex items-center justify-center">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="p-2 bg-neutral-800 hover:bg-brand-red transition-colors text-white flex items-center justify-center">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="p-2 bg-neutral-800 hover:bg-brand-red transition-colors text-white flex items-center justify-center">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-5 text-neutral-300">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              <li><a href="#home" className="hover:text-brand-red transition-colors">Home</a></li>
              <li><a href="#inventory" className="hover:text-brand-red transition-colors">Inventory</a></li>
              <li><a href="#about-us" className="hover:text-brand-red transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-brand-red transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-5 text-neutral-300">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              <li><a href="#inventory" className="hover:text-brand-red transition-colors">Browse Cars</a></li>
              <li><a href="#inventory" className="hover:text-brand-red transition-colors">Reserve a Vehicle</a></li>
              <li><a href="#home" className="hover:text-brand-red transition-colors">Book Test Drive</a></li>
              <li><a href="#about-us" className="hover:text-brand-red transition-colors">Delivery Info</a></li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-5 text-neutral-300">
              Contact Info
            </h4>
            <ul className="flex flex-col gap-3 font-sans text-xs text-neutral-400">
              <li>
                <span className="font-mono text-[9px] uppercase tracking-wider block text-neutral-500 mb-0.5">Phone</span>
                <span>+1 (800) 555-0199</span>
              </li>
              <li>
                <span className="font-mono text-[9px] uppercase tracking-wider block text-neutral-500 mb-0.5">Email</span>
                <span>advisors@vanguardmotors.com</span>
              </li>
              <li>
                <span className="font-mono text-[9px] uppercase tracking-wider block text-neutral-500 mb-0.5">Address</span>
                <span>400 Vanguard Way, Suite 800<br />Miami, FL 33101</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          <span>© 2026 VANGUARD MOTORS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-brand-red transition-colors">Terms of Purchase</a>
          </div>
        </div>

      </footer>

    </div>
  );
}
