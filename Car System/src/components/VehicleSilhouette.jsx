import React from 'react';

export default function VehicleSilhouette({ className = '', id = 'vehicle-silhouette', glowColor = '#0066FF' }) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`} id={id}>
      <svg
        viewBox="0 0 800 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,102,255,0.25)]"
      >
        <defs>
          {/* Chrome & Silver Gradients for luxury feel */}
          <linearGradient id="bodyGradient" x1="80" y1="140" x2="700" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#111111" />
            <stop offset="15%" stopColor="#333333" />
            <stop offset="50%" stopColor="#888888" />
            <stop offset="65%" stopColor="#CCCCCC" />
            <stop offset="85%" stopColor="#333333" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>

          <linearGradient id="wheelGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#444" />
            <stop offset="50%" stopColor="#111" />
            <stop offset="100%" stopColor="#222" />
          </linearGradient>

          <radialGradient id="underGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Underglow (pulsating studio light) */}
        <ellipse
          cx="400"
          cy="205"
          rx="320"
          ry="25"
          fill="url(#underGlow)"
          className="animate-pulse-slow"
        />

        {/* Technical Grid/Laser Lines beneath the car */}
        <line x1="60" y1="205" x2="740" y2="205" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="80" y1="210" x2="720" y2="210" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

        {/* Main Car Body Profile */}
        <path
          d="M 80 190 
             C 85 185, 95 174, 105 171
             C 120 168, 160 162, 200 156
             C 240 150, 280 135, 310 115
             C 340 95, 380 90, 430 90
             C 480 90, 525 95, 570 120
             C 610 140, 640 142, 675 142
             C 690 142, 698 138, 702 142
             C 705 145, 706 150, 706 155
             C 706 165, 702 180, 695 186
             C 685 190, 675 190, 670 190
             C 668 180, 665 174, 660 168
             C 650 156, 625 152, 610 152
             C 595 152, 572 156, 560 168
             C 555 174, 552 180, 550 190
             L 270 190
             C 268 180, 265 174, 260 168
             C 250 156, 225 152, 210 152
             C 195 152, 172 156, 160 168
             C 155 174, 152 180, 150 190
             L 80 190 Z"
          fill="url(#bodyGradient)"
          stroke="#444444"
          strokeWidth="1.5"
        />

        {/* Cabin Window Outline & Pillars */}
        <path
          d="M 315 117 
             C 340 98, 380 94, 430 94
             C 475 94, 515 98, 555 120
             C 530 120, 480 120, 430 120
             C 380 120, 340 120, 315 117 Z"
          fill="#0a0a0a"
          stroke="#666666"
          strokeWidth="1"
        />
        <path
          d="M 432 94 L 432 120"
          stroke="#333333"
          strokeWidth="1.5"
        />

        {/* Headlight LED Glow Trace (Electric Blue) */}
        <path
          d="M 98 172 C 105 171, 115 172, 120 174"
          stroke={glowColor}
          strokeWidth="2.5"
          filter="url(#neonGlow)"
          strokeLinecap="round"
        />

        {/* Taillight LED Laser Trace (Electric Red/Violet) */}
        <path
          d="M 703 145 C 700 148, 696 150, 692 150"
          stroke="#FF0055"
          strokeWidth="2"
          filter="url(#neonGlow)"
          strokeLinecap="round"
        />

        {/* Aerodynamic Body Crease Highlights */}
        <path
          d="M 130 170 C 180 165, 230 160, 280 156"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        <path
          d="M 305 145 C 380 145, 480 148, 550 140"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <path
          d="M 570 128 C 610 135, 640 140, 670 142"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {/* Rear Wheel Assembly */}
        <g id="rear-wheel">
          {/* Wheel Arch Inner shadow */}
          <path
             d="M 552 190 C 554 182, 557 175, 563 170 C 574 158, 597 154, 608 154 C 620 154, 644 158, 656 170 C 662 175, 665 182, 667 190"
             stroke="#222"
             strokeWidth="2"
             fill="none"
          />
          {/* Tire */}
          <circle cx="610" cy="190" r="36" fill="#0d0d0d" stroke="#222" strokeWidth="4" />
          <circle cx="610" cy="190" r="32" fill="url(#wheelGradient)" />
          {/* Alloy Spokes (Technical Geometric star pattern) */}
          <circle cx="610" cy="190" r="22" stroke="#555555" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 610 158 L 610 222 M 578 190 L 642 190 M 587 167 L 633 213 M 587 213 L 633 167" stroke="#888888" strokeWidth="1.5" />
          <circle cx="610" cy="190" r="10" fill="#111111" stroke="#888888" strokeWidth="1.5" />
          {/* Accent Hub Ring */}
          <circle cx="610" cy="190" r="5" fill={glowColor} />
        </g>

        {/* Front Wheel Assembly */}
        <g id="front-wheel">
          {/* Wheel Arch Inner shadow */}
          <path
             d="M 152 190 C 154 182, 157 175, 163 170 C 174 158, 197 154, 208 154 C 220 154, 244 158, 256 170 C 262 175, 265 182, 267 190"
             stroke="#222"
             strokeWidth="2"
             fill="none"
          />
          {/* Tire */}
          <circle cx="210" cy="190" r="36" fill="#0d0d0d" stroke="#222" strokeWidth="4" />
          <circle cx="210" cy="190" r="32" fill="url(#wheelGradient)" />
          {/* Alloy Spokes */}
          <circle cx="210" cy="190" r="22" stroke="#555555" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 210 158 L 210 222 M 178 190 L 242 190 M 187 167 L 233 213 M 187 213 L 233 167" stroke="#888888" strokeWidth="1.5" />
          <circle cx="210" cy="190" r="10" fill="#111111" stroke="#888888" strokeWidth="1.5" />
          {/* Accent Hub Ring */}
          <circle cx="210" cy="190" r="5" fill={glowColor} />
        </g>
      </svg>
    </div>
  );
}
