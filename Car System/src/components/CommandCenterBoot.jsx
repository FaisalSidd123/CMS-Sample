import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootLogs = [
  { text: 'APEX COMMAND ENVIRONMENT V9.4.2 [INITIALIZED]', delay: 100 },
  { text: 'SECURE CORE: CONNECTING TO MULTI-ROLE DIRECTORY...', delay: 300 },
  { text: 'AUTHENTICATING ROLES (CUSTOMER // AGENT // ADMIN)... SUCCESS', delay: 500 },
  { text: 'CACHING ACTIVE REAL-TIME INVENTORY (489 UNITS)... DONE', delay: 750 },
  { text: 'BOOTSTRAPPING RESERVATION ENGINE STACK... STANDBY', delay: 950 },
  { text: 'CRITICAL STATS INTEGRITY CHECK... 0 ERRORS FOUND', delay: 1150 },
  { text: 'APEX PLATFORM READY. DISPATCHING INTERFACE.', delay: 1350 }
];

export default function CommandCenterBoot({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let timeouts = [];

    bootLogs.forEach((log, index) => {
      const t = setTimeout(() => {
        setLogs((prev) => [...prev, log.text]);
        if (index === bootLogs.length - 1) {
          // Final delay before booting complete
          const doneT = setTimeout(() => {
            setIsDone(true);
            const exitT = setTimeout(() => {
              onComplete();
            }, 600); // Wait for AnimatePresence fade out
            timeouts.push(exitT);
          }, 400);
          timeouts.push(doneT);
        }
      }, log.delay);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black z-[9999] flex flex-col justify-between p-8 md:p-16 font-mono text-sm select-none"
        >
          {/* Scanline and noise */}
          <div className="absolute inset-0 pointer-events-none noise-overlay opacity-30" />
          <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-blue-900/5 to-transparent h-full animate-scanline" />

          {/* Terminal output */}
          <div className="flex flex-col gap-2 max-w-4xl text-emerald-400 text-glow-blue">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-emerald-500/60 font-sans">Apex System Boot Sequence</span>
            </div>
            
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-start"
              >
                <span className="text-emerald-500/40 mr-4 select-none">&gt;&gt;</span>
                <span className="text-emerald-400 font-mono tracking-tight break-all md:break-normal">{log}</span>
              </motion.div>
            ))}

            <div className="flex items-center mt-2">
              <span className="text-emerald-500/40 mr-4 select-none">&gt;&gt;</span>
              <span className="w-2 h-4 bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Footer of terminal */}
          <div className="flex justify-between items-center text-xs text-emerald-500/40 font-mono select-none">
            <span>SYS_LOC: CLUSTER_09_APEX</span>
            <span>SECURE TERMINAL ACTIVE</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
