import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchFilter({ inventory = [], onSearch }) {
  // Dropdown states
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedModel, setSelectedModel] = useState('All Models');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [selectedBodyType, setSelectedBodyType] = useState('All Body Types');

  // Dynamically compute dropdown options based on inventory data
  const brands = ['All Brands', ...new Set(inventory.map((car) => car.brand))];
  
  // Dynamically filter models based on selected brand
  const models = [
    'All Models',
    ...new Set(
      inventory
        .filter((car) => selectedBrand === 'All Brands' || car.brand === selectedBrand)
        .map((car) => car.name)
    )
  ];

  const years = [
    'All Years',
    ...new Set(inventory.map((car) => car.year.toString()))
  ].sort((a, b) => b - a);

  const bodyTypes = [
    'All Body Types',
    ...new Set(inventory.map((car) => car.type))
  ];

  const priceRanges = [
    'All Prices',
    'Under $50,000',
    '$50,000 - $80,000',
    '$80,000 - $120,000',
    '$120,000+'
  ];

  // Reset model selection when brand changes
  useEffect(() => {
    setSelectedModel('All Models');
  }, [selectedBrand]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        brand: selectedBrand,
        model: selectedModel,
        year: selectedYear,
        price: selectedPrice,
        bodyType: selectedBodyType
      });
    }
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-10"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border-hairline p-6 md:p-8 shadow-xl flex flex-col gap-6"
      >
        <div className="flex items-center gap-2 border-b border-border-hairline pb-4">
          <Search className="w-5 h-5 text-brand-red" />
          <span className="font-display font-bold text-xs uppercase tracking-widest text-charcoal">
            Find Your Vehicle
          </span>
        </div>

        {/* Dropdown Layout Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Brand select */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all cursor-pointer"
            >
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Model select */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all cursor-pointer"
            >
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Year select */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all cursor-pointer"
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Price Select */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Price Range</label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="bg-white border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all cursor-pointer"
            >
              {priceRanges.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Body Type Select */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Body Type</label>
            <select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              className="bg-white border border-border-hairline px-3 py-2.5 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all cursor-pointer col-span-2 md:col-span-1"
            >
              {bodyTypes.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>

        </div>

        {/* Search Submit Button */}
        <div className="flex justify-end pt-2 border-t border-border-hairline">
          <button
            type="submit"
            className="w-full md:w-auto bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest px-10 py-3.5 flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer"
          >
            <span>Search Directory</span>
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
