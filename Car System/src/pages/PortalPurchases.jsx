import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../hooks/useMockData';
import { TableSkeleton } from '../components/Skeletons';
import { 
  History, 
  Search, 
  ArrowUpRight, 
  Calendar,
  X,
  Check,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function PortalPurchases() {
  const navigate = useNavigate();
  const { data: purchasesList, isLoading } = useMockData('purchaseHistory');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Sorting logic
  const handleSort = (list) => {
    if (!list) return [];
    return [...list].sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      if (sortBy === 'date-asc') return new Date(a.purchaseDate) - new Date(b.purchaseDate);
      
      const priceA = parseInt(a.finalPrice.replace(/[$,]/g, '')) || 0;
      const priceB = parseInt(b.finalPrice.replace(/[$,]/g, '')) || 0;
      
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'price-asc') return priceA - priceB;
      return 0;
    });
  };

  // Filter logic
  const filteredPurchases = handleSort(
    purchasesList?.filter(item => 
      item.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8 text-left relative">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block mb-1">// Ledger registry</span>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-charcoal uppercase">
          Purchase History
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Review invoices, execution dates, and specifications of your previously acquired vehicles.
        </p>
      </div>

      {/* Search & Sort Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white border border-border-hairline p-4 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by vehicle name or reference ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-light-bg border border-border-hairline rounded-sm pl-9 pr-4 py-2.5 text-xs outline-hidden focus:border-brand-red transition-all text-charcoal placeholder:text-neutral-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400 font-semibold uppercase font-mono text-[10px]">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-border-hairline px-3 py-2 text-xs text-charcoal outline-hidden focus:border-brand-red cursor-pointer"
          >
            <option value="date-desc">Newest Purchase</option>
            <option value="date-asc">Oldest Purchase</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
          </select>
        </div>

      </div>

      {/* Purchases Grid Table */}
      {isLoading ? (
        <TableSkeleton rows={3} cols={5} />
      ) : filteredPurchases && filteredPurchases.length > 0 ? (
        <div className="bg-white border border-border-hairline shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-border-hairline text-[10px] font-mono text-neutral-400 uppercase tracking-widest select-none">
                  <th className="py-4 px-6 font-semibold">Vehicle</th>
                  <th className="py-4 px-6 font-semibold">Purchase ID</th>
                  <th className="py-4 px-6 font-semibold">Purchase Date</th>
                  <th className="py-4 px-6 font-semibold">Final Price</th>
                  <th className="py-4 px-6 font-semibold">Delivery Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-xs">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-neutral-50/50 transition-colors">
                    
                    {/* Vehicle */}
                    <td className="py-4 px-6 font-medium text-charcoal flex items-center gap-3">
                      <div className="w-12 h-8 bg-neutral-100 rounded-sm overflow-hidden shrink-0">
                        <img
                          src={purchase.vehicleDetails.image}
                          alt={purchase.vehicleName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-display font-bold uppercase tracking-wider text-[11px] text-charcoal">
                        {purchase.vehicleName}
                      </span>
                    </td>

                    {/* ID */}
                    <td className="py-4 px-6 font-mono text-neutral-400 font-bold uppercase">
                      {purchase.id}
                    </td>

                    {/* Purchase Date */}
                    <td className="py-4 px-6 text-neutral-500 font-mono">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>

                    {/* Final Price */}
                    <td className="py-4 px-6 text-brand-red font-display font-bold">
                      {purchase.finalPrice}
                    </td>

                    {/* Delivery Date */}
                    <td className="py-4 px-6 text-neutral-500 font-mono">
                      {new Date(purchase.deliveryDate).toLocaleDateString()}
                    </td>

                    {/* View Summary Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedPurchase(purchase)}
                        className="p-2 border border-neutral-200 hover:border-brand-red hover:bg-brand-red/5 text-charcoal hover:text-brand-red transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                      >
                        <span className="text-[9px] font-mono uppercase tracking-widest font-bold">Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border border-border-hairline bg-white p-16 text-center text-neutral-400 font-sans text-xs">
          No purchase records match your search query.
        </div>
      )}

      {/* SLIDE-OUT PURCHASE DETAILS DRAWER */}
      <AnimatePresence>
        {selectedPurchase && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-40" 
              onClick={() => setSelectedPurchase(null)}
            />

            {/* Slide drawer container */}
            <div className="fixed top-0 right-0 w-full sm:w-[480px] h-full bg-white z-50 shadow-2xl p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-border-hairline mb-8">
                  <div>
                    <span className="text-[9px] font-mono text-brand-red uppercase tracking-widest block">Reference Ledger</span>
                    <h3 className="font-display font-extrabold text-sm uppercase text-charcoal mt-1">
                      Purchase Summary
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedPurchase(null)}
                    className="text-neutral-400 hover:text-brand-red p-1 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Body Details */}
                <div className="space-y-8 text-left">
                  
                  {/* Vehicle details */}
                  <div className="flex items-center gap-4 border border-neutral-100 p-4 rounded-xs">
                    <div className="w-24 h-16 bg-neutral-100 rounded-sm overflow-hidden shrink-0">
                      <img
                        src={selectedPurchase.vehicleDetails.image}
                        alt={selectedPurchase.vehicleName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-xs uppercase text-charcoal">{selectedPurchase.vehicleName}</h4>
                      <span className="text-[10px] font-mono text-neutral-400 block mt-1">
                        Year: {selectedPurchase.vehicleDetails.year} • Type: {selectedPurchase.vehicleDetails.type}
                      </span>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-4 border-b border-border-hairline pb-6 text-xs">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Final Transaction price</span>
                      <span className="font-display font-black text-brand-red text-md">{selectedPurchase.finalPrice}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Acquisition Reference ID</span>
                      <span className="font-mono font-bold text-charcoal uppercase">{selectedPurchase.id}</span>
                    </div>
                  </div>

                  {/* Vertical Completed Stages Timeline */}
                  <div>
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-charcoal mb-6 block">
                      Operations History Timeline
                    </span>

                    <div className="relative pl-8 flex flex-col gap-6">
                      {/* Vertical connector line */}
                      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-brand-red" />
                      
                      {selectedPurchase.stageHistory.map((history) => (
                        <div key={history.stage} className="relative flex flex-col gap-1">
                          
                          {/* Point */}
                          <span className="absolute left-[-27px] top-0 w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center border border-brand-red shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>

                          <div className="flex items-baseline gap-2">
                            <span className="text-[11px] font-display font-bold uppercase tracking-wider text-charcoal">
                              {history.stage}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400">
                              {new Date(history.date).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                            {history.note}
                          </p>

                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* CTAs */}
              <div className="pt-6 border-t border-border-hairline mt-8 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setSelectedPurchase(null);
                    navigate('/');
                  }}
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-3.5 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Browse Similar Vehicles</span>
                </button>
              </div>

            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
