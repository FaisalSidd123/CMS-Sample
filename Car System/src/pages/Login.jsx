import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('client'); // 'client' or 'agent'
  const [email, setEmail] = useState('alexander@vanguard.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate authentication processing latency
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'agent') {
        navigate('/agent');
      } else {
        navigate('/portal');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-light-bg flex text-charcoal">
      
      {/* 1. LEFT PANEL: Split Screen Brand Backdrop (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-3/5 bg-charcoal relative overflow-hidden items-center justify-center">
        
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"
            alt="Vanguard Brand Car"
            className="w-full h-full object-cover opacity-35 filter grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/20" />
        </div>

        {/* Brand overlays */}
        <div className="relative z-10 max-w-lg text-left px-12 space-y-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-[10px] text-white/50 hover:text-white transition-colors font-mono uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Catalog</span>
          </Link>
          
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest block font-bold">// Vanguard Hub</span>
            <h1 className="font-display font-extrabold text-white text-3xl md:text-4xl uppercase tracking-wider leading-tight">
              Discerning Procurement <br />
              <span className="text-brand-red">Simplified.</span>
            </h1>
          </div>

          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Access secure transaction records, monitor holds in the operational pipeline, and manage registered documentation folders.
          </p>
        </div>

        {/* Footer info */}
        <span className="absolute bottom-8 left-12 font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
          © 2026 Vanguard Motors Corp.
        </span>

      </div>

      {/* 2. RIGHT PANEL: Login Form Area (Full width on mobile) */}
      <div className="w-full lg:w-2/5 bg-white flex flex-col justify-center items-center p-8 md:p-16 relative">
        
        {/* Mobile top-right escape key */}
        <Link 
          to="/"
          className="absolute top-8 left-8 lg:hidden inline-flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Catalog</span>
        </Link>

        <div className="w-full max-w-sm space-y-6 text-left">
          
          {/* Logo & welcoming text */}
          <div className="space-y-1">
            <Link to="/" className="inline-block font-display font-extrabold tracking-widest text-md uppercase text-charcoal">
              Vanguard <span className="text-brand-red">Motors</span>
            </Link>
            <h2 className="text-xl font-display font-extrabold uppercase text-charcoal tracking-wide mt-2">
              Workspace Access
            </h2>
            <p className="text-xs text-neutral-400 font-sans">
              Authenticate details to enter your sandbox account.
            </p>
          </div>

          {/* Role selector tab */}
          <div className="flex border-b border-neutral-100 gap-6 select-none pt-2">
            <button
              type="button"
              onClick={() => {
                setRole('client');
                setEmail('alexander@vanguard.com');
              }}
              className={`pb-2.5 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                role === 'client' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
              }`}
            >
              Client Account
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('agent');
                setEmail('sarah.connor@vanguardmotors.com');
              }}
              className={`pb-2.5 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                role === 'agent' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-400 hover:text-charcoal'
              }`}
            >
              Sales Console
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email input node */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                placeholder="alexander@vanguard.com"
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-3 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
              />
            </div>

            {/* Password input node */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span>Password</span>
                </label>
                <span className="text-[9px] font-mono text-neutral-400 hover:text-brand-red cursor-pointer transition-colors">
                  Forgot Password?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border border-border-hairline px-3.5 py-3 text-xs text-charcoal outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
              />
            </div>

            {/* Remember me toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="w-4.5 h-4.5 border border-border-hairline text-brand-red focus:ring-brand-red cursor-pointer"
              />
              <label htmlFor="remember" className="text-[10px] text-neutral-500 uppercase font-semibold font-mono tracking-wider cursor-pointer select-none">
                Remember authentication node
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-widest py-4 mt-2 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validating credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Sandbox Tip */}
          <div className="bg-light-bg border border-border-hairline p-3 text-[10px] text-neutral-500 font-sans leading-relaxed">
            <span className="font-semibold text-charcoal block mb-0.5">Sandbox Mode Active</span>
            Form validation accepts any input value. Submit credentials to enter the customer portal.
          </div>

        </div>

      </div>

    </div>
  );
}
