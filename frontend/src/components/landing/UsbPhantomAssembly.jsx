import React, { useState, useEffect } from 'react';

/*
  Authentic Dark Hardware USB Flash Drive.
  Features:
  - Deep obsidian black casing (#050505) with dark zinc border
  - Polished silver USB Type-A connector with dual port cutouts & visible gold pins
  - Connector collar shield
  - Side grip ribs & specular edge highlight
  - Glowing cyber green status LED
  - Lanyard loop at the base
  - High-contrast cute expressive cartoon faces with yellow smile & lightning badge
*/
function HardwareUsbStick({ variant = 0 }) {
  return (
    <g style={{ filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.45))' }}>
      {/* 1. Metal USB Type-A Connector (Top) */}
      <rect
        x="-6"
        y="-20"
        width="12"
        height="11"
        rx="1.2"
        fill="#CBD5E1"
        stroke="#475569"
        strokeWidth="1.1"
      />
      {/* Center seam */}
      <line
        x1="0"
        y1="-20"
        x2="0"
        y2="-13"
        stroke="#94A3B8"
        strokeWidth="0.8"
        strokeDasharray="1.2 1"
      />
      {/* Signature Port Cutout 1 (Left) with gold contact pin inside */}
      <rect x="-4.4" y="-17.2" width="2.8" height="3.8" rx="0.5" fill="#000000" />
      <rect x="-3.9" y="-16.7" width="1.8" height="1.5" fill="#F59E0B" />
      {/* Signature Port Cutout 2 (Right) with gold contact pin inside */}
      <rect x="1.6" y="-17.2" width="2.8" height="3.8" rx="0.5" fill="#000000" />
      <rect x="2.1" y="-16.7" width="1.8" height="1.5" fill="#F59E0B" />
      {/* Connector Collar / Shield ridge */}
      <rect
        x="-7"
        y="-9.5"
        width="14"
        height="2.6"
        rx="0.6"
        fill="#475569"
        stroke="#1E293B"
        strokeWidth="0.6"
      />

      {/* 2. Deep Obsidian Black USB Body */}
      <rect
        x="-11"
        y="-7.5"
        width="22"
        height="30"
        rx="4.5"
        fill="#050505"
        stroke="#27272A"
        strokeWidth="1.3"
      />
      {/* Left specular bevel highlight */}
      <line
        x1="-8.5"
        y1="-3"
        x2="-8.5"
        y2="17"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Right side grip ribs */}
      <line x1="8.8" y1="-1" x2="10.2" y2="-1" stroke="#2E2E38" strokeWidth="1.1" />
      <line x1="8.8" y1="3" x2="10.2" y2="3" stroke="#2E2E38" strokeWidth="1.1" />
      <line x1="8.8" y1="7" x2="10.2" y2="7" stroke="#2E2E38" strokeWidth="1.1" />

      {/* 3. Lanyard Loop at Tail */}
      <rect
        x="-3.5"
        y="22"
        width="7"
        height="3.5"
        rx="1.6"
        fill="#1E1E24"
        stroke="#050505"
        strokeWidth="0.6"
      />
      <circle cx="0" cy="23.8" r="1.2" fill="#FDE047" />

      {/* 4. Glowing Cyber Status LED */}
      <circle cx="6.5" cy="16" r="1.3" fill="#10B981" />
      <circle cx="6.5" cy="16" r="0.6" fill="#6EE7B7" />

      {/* 5. Face Expressions */}
      {variant === 0 && (
        // Cheerful big eyes + smile
        <g>
          <circle cx="-4.2" cy="-0.5" r="2.8" fill="#FFFFFF" />
          <circle cx="4.2" cy="-0.5" r="2.8" fill="#FFFFFF" />
          <circle cx="-3.6" cy="-0.5" r="1.6" fill="#050505" />
          <circle cx="4.8" cy="-0.5" r="1.6" fill="#050505" />
          <circle cx="-4.4" cy="-1.4" r="0.8" fill="#FFFFFF" />
          <circle cx="4" cy="-1.4" r="0.8" fill="#FFFFFF" />
          <path
            d="M -3.8 5.5 Q 0 9.5 3.8 5.5"
            fill="none"
            stroke="#FDE047"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </g>
      )}

      {variant === 1 && (
        // Cool sunglasses
        <g>
          <rect
            x="-8.5"
            y="-3"
            width="17"
            height="5.5"
            rx="1.6"
            fill="#000000"
            stroke="#FDE047"
            strokeWidth="0.9"
          />
          <circle cx="-4" cy="-0.3" r="0.8" fill="#FDE047" />
          <circle cx="4" cy="-0.3" r="0.8" fill="#FDE047" />
          <path
            d="M -3.5 6.5 L 3.5 6.5"
            stroke="#FDE047"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {variant === 2 && (
        // Wink
        <g>
          <circle cx="-4.2" cy="-0.5" r="2.8" fill="#FFFFFF" />
          <circle cx="-3.6" cy="-0.5" r="1.6" fill="#050505" />
          <circle cx="-4.4" cy="-1.4" r="0.8" fill="#FFFFFF" />
          <path
            d="M 1.8 -0.5 Q 4.2 -2.8 6.8 -0.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M -3.5 6 Q 0 9 3.5 6"
            fill="none"
            stroke="#FDE047"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      )}

      {variant === 3 && (
        // Surprised :o
        <g>
          <circle cx="-4.2" cy="-0.5" r="2.9" fill="#FFFFFF" />
          <circle cx="4.2" cy="-0.5" r="2.9" fill="#FFFFFF" />
          <circle cx="-4" cy="-0.5" r="1.7" fill="#050505" />
          <circle cx="4.4" cy="-0.5" r="1.7" fill="#050505" />
          <ellipse
            cx="0"
            cy="6.8"
            rx="2.1"
            ry="2.8"
            fill="#FDE047"
            stroke="#050505"
            strokeWidth="0.4"
          />
        </g>
      )}

      {/* 6. Gold Lightning Bolt Hardware Badge */}
      <path
        d="M -0.3 11.5 L -1.6 14.5 H 1 L -0.5 18 L 2.5 13.8 H 0.4 Z"
        fill="#FDE047"
        stroke="#000"
        strokeWidth="0.3"
      />
    </g>
  );
}

/*
  Cute cartoon spiky virus bug.
  Red/purple malware monster with angry eyes and spikes.
*/
function CartoonVirus({ size = 22 }) {
  return (
    <g style={{ filter: 'drop-shadow(0 3px 4px rgba(220,38,38,0.4))' }}>
      {/* Spikes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = Math.cos(rad) * (size * 0.38);
        const y1 = Math.sin(rad) * (size * 0.38);
        const x2 = Math.cos(rad) * (size * 0.65);
        const y2 = Math.sin(rad) * (size * 0.65);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#EF4444"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}

      {/* Main Virus Core */}
      <circle cx="0" cy="0" r={size * 0.45} fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />

      {/* Angry Eyes */}
      <circle cx="-3.2" cy="-1.5" r="2.3" fill="#FFFFFF" />
      <circle cx="3.2" cy="-1.5" r="2.3" fill="#FFFFFF" />
      <circle cx="-2.3" cy="-1.2" r="1.3" fill="#111827" />
      <circle cx="4.1" cy="-1.2" r="1.3" fill="#111827" />

      {/* Slanted Angry Eyebrows */}
      <line x1="-5.5" y1="-4.5" x2="-1.5" y2="-3" stroke="#7F1D1D" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="5.5" y1="-4.5" x2="1.5" y2="-3" stroke="#7F1D1D" strokeWidth="1.4" strokeLinecap="round" />

      {/* Grumpy Jagged Mouth */}
      <path
        d="M -3.2 3.5 L -1 2 L 1 3.5 L 3.2 2"
        fill="none"
        stroke="#7F1D1D"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </g>
  );
}

/*
  Stroke-aligned tall letter geometry for PHANTOM.
*/
const STEP_Y = 38;
const LETTER_GAP = 46;
const START_X = 40;
const START_Y = 110; // Centered vertically in 360px height

const LETTER_DEFS = {
  P: {
    w: 68,
    usbs: [
      { x: 0, y: 0, r: 0 },
      { x: 0, y: STEP_Y, r: 0 },
      { x: 0, y: STEP_Y * 2, r: 0 },
      { x: 0, y: STEP_Y * 3, r: 0 },
      { x: 26, y: -8, r: 90 },
      { x: 52, y: -8, r: 90 },
      { x: 68, y: 14, r: 0 },
      { x: 68, y: 44, r: 0 },
      { x: 52, y: 66, r: 90 },
      { x: 26, y: 66, r: 90 },
    ],
  },
  H: {
    w: 72,
    usbs: [
      { x: 0, y: 0, r: 0 },
      { x: 0, y: STEP_Y, r: 0 },
      { x: 0, y: STEP_Y * 2, r: 0 },
      { x: 0, y: STEP_Y * 3, r: 0 },
      { x: 24, y: Math.round(STEP_Y * 1.5), r: 90 },
      { x: 48, y: Math.round(STEP_Y * 1.5), r: 90 },
      { x: 72, y: 0, r: 0 },
      { x: 72, y: STEP_Y, r: 0 },
      { x: 72, y: STEP_Y * 2, r: 0 },
      { x: 72, y: STEP_Y * 3, r: 0 },
    ],
  },
  A: {
    w: 80,
    usbs: [
      { x: 40, y: -4, r: 0 },
      { x: 28, y: 34, r: -18 },
      { x: 15, y: 72, r: -18 },
      { x: 2, y: 110, r: -18 },
      { x: 28, y: 74, r: 90 },
      { x: 52, y: 74, r: 90 },
      { x: 52, y: 34, r: 18 },
      { x: 65, y: 72, r: 18 },
      { x: 78, y: 110, r: 18 },
    ],
  },
  N: {
    w: 74,
    usbs: [
      { x: 0, y: 0, r: 0 },
      { x: 0, y: STEP_Y, r: 0 },
      { x: 0, y: STEP_Y * 2, r: 0 },
      { x: 0, y: STEP_Y * 3, r: 0 },
      { x: 18, y: 28, r: 32 },
      { x: 37, y: 58, r: 32 },
      { x: 56, y: 88, r: 32 },
      { x: 74, y: 0, r: 0 },
      { x: 74, y: STEP_Y, r: 0 },
      { x: 74, y: STEP_Y * 2, r: 0 },
      { x: 74, y: STEP_Y * 3, r: 0 },
    ],
  },
  T: {
    w: 76,
    usbs: [
      { x: 6, y: -8, r: 90 },
      { x: 38, y: -8, r: 90 },
      { x: 70, y: -8, r: 90 },
      { x: 38, y: 18, r: 0 },
      { x: 38, y: 52, r: 0 },
      { x: 38, y: 86, r: 0 },
      { x: 38, y: 116, r: 0 },
    ],
  },
  O: {
    w: 72,
    usbs: [
      { x: 24, y: -8, r: 90 },
      { x: 48, y: -8, r: 90 },
      { x: 6, y: 12, r: -38 },
      { x: 66, y: 12, r: 38 },
      { x: 0, y: 44, r: 0 },
      { x: 0, y: 74, r: 0 },
      { x: 72, y: 44, r: 0 },
      { x: 72, y: 74, r: 0 },
      { x: 6, y: 104, r: 38 },
      { x: 66, y: 104, r: -38 },
      { x: 24, y: 124, r: 90 },
      { x: 48, y: 124, r: 90 },
    ],
  },
  M: {
    w: 96,
    usbs: [
      { x: 0, y: 0, r: 0 },
      { x: 0, y: STEP_Y, r: 0 },
      { x: 0, y: STEP_Y * 2, r: 0 },
      { x: 0, y: STEP_Y * 3, r: 0 },
      { x: 22, y: 30, r: 34 },
      { x: 40, y: 64, r: 34 },
      { x: 56, y: 64, r: -34 },
      { x: 74, y: 30, r: -34 },
      { x: 96, y: 0, r: 0 },
      { x: 96, y: STEP_Y, r: 0 },
      { x: 96, y: STEP_Y * 2, r: 0 },
      { x: 96, y: STEP_Y * 3, r: 0 },
    ],
  },
};

const WORD = ['P', 'H', 'A', 'N', 'T', 'O', 'M'];

function generateUnits() {
  const units = [];
  let curX = START_X;

  WORD.forEach((letterChar, lIdx) => {
    const def = LETTER_DEFS[letterChar];
    def.usbs.forEach((u, uIdx) => {
      const idx = units.length;

      // STRICTLY IN PLAIN SPACE: x from 25 to 880 (NO text overlap)
      // TALL VERTICAL RANGE: y from 25 to 330 (deep vertical roaming)
      const cols = 10;
      const rows = 8;
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const baseX = 35 + (col / (cols - 1)) * 840;
      const baseY = 25 + (row / (rows - 1)) * 300;
      const jitterX = Math.sin(idx * 17.3 + 5.1) * 26;
      const jitterY = Math.cos(idx * 29.7 + 8.9) * 24;
      const jitterRot = Math.sin(idx * 47.1) * 50;

      const patrolStyle = idx % 4;
      const patrolDuration = (3.4 + (idx % 5) * 0.6).toFixed(1);
      const patrolDelay = ((idx * 0.22) % 1.6).toFixed(2);
      const hasShield = idx === 8 || idx === 24 || idx === 42 || idx === 58;

      units.push({
        id: idx,
        letter: letterChar,
        variant: (lIdx * 3 + uIdx) % 4,
        patrolStyle,
        patrolDuration,
        patrolDelay,
        hasShield,
        assembled: {
          x: curX + u.x,
          y: START_Y + u.y,
          r: u.r,
        },
        scattered: {
          x: Math.max(25, Math.min(885, Math.round(baseX + jitterX))),
          y: Math.max(20, Math.min(335, Math.round(baseY + jitterY))),
          r: Math.round(jitterRot),
        },
      });
    });
    curX += def.w + LETTER_GAP;
  });

  return units;
}

const ALL_UNITS = generateUnits();

// 4 animated malware bugs patrolling the plain space
const VIRUSES = [
  { id: 1, startX: 180, startY: 80, animClass: 'virusSweep1', size: 24 },
  { id: 2, startX: 420, startY: 280, animClass: 'virusSweep2', size: 22 },
  { id: 3, startX: 680, startY: 90, animClass: 'virusSweep3', size: 25 },
  { id: 4, startX: 820, startY: 240, animClass: 'virusSweep4', size: 21 },
];

export function UsbPhantomAssembly() {
  const [scrollY, setScrollY] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY : 0
  );
  const [manualToggle, setManualToggle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Assembled when user scrolls down > 20px OR if user clicked to toggle
  const isAssembled = scrollY > 20 || manualToggle;

  return (
    <div className="w-full flex justify-center lg:justify-end select-none">
      <style>{`
        /* SWEEPING UP & DOWN TRAVEL MOTIONS FOR USB SENTINELS (travels 60-80px vertically) */
        @keyframes usbTravelUpAndDown1 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(25px, -70px) rotate(24deg); }
          50% { transform: translate(-20px, 15px) rotate(-18deg); }
          75% { transform: translate(15px, 65px) rotate(18deg); }
        }
        @keyframes usbTravelUpAndDown2 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          30% { transform: translate(-28px, 68px) rotate(-28deg); }
          70% { transform: translate(24px, -62px) rotate(25deg); }
        }
        @keyframes usbTravelUpAndDown3 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          20% { transform: translate(22px, -55px) rotate(-22deg); }
          45% { transform: translate(-26px, 72px) rotate(30deg); }
          70% { transform: translate(-22px, -38px) rotate(-24deg); }
          85% { transform: translate(18px, 45px) rotate(20deg); }
        }
        @keyframes usbTravelUpAndDown4 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          35% { transform: translate(32px, 62px) rotate(32deg); }
          65% { transform: translate(-28px, -72px) rotate(-30deg); }
        }

        /* Virus patrol attack paths across the plain area */
        @keyframes virusFly1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          30% { transform: translate(35px, 75px) rotate(45deg) scale(1.1); }
          60% { transform: translate(-25px, 140px) rotate(-35deg) scale(0.9); }
          80% { transform: translate(20px, 50px) rotate(25deg) scale(1.05); }
        }
        @keyframes virusFly2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-45px, -90px) rotate(-55deg); }
          65% { transform: translate(35px, -35px) rotate(40deg); }
        }
        @keyframes virusFly3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          40% { transform: translate(-40px, 100px) rotate(-45deg) scale(1.15); }
          80% { transform: translate(30px, -45px) rotate(35deg) scale(0.95); }
        }
        @keyframes virusFly4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          40% { transform: translate(45px, -80px) rotate(50deg); }
          75% { transform: translate(-35px, -20px) rotate(-30deg); }
        }

        /* Electric zap & shield pulse */
        @keyframes zapFlicker {
          0%, 100% { opacity: 0.15; }
          45% { opacity: 0.95; }
          55% { opacity: 0.2; }
          65% { opacity: 1; }
        }
        @keyframes shieldPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>

      <div
        className="w-full max-w-[760px] cursor-pointer"
        onClick={() => setManualToggle((prev) => !prev)}
        title="Scroll or click to assemble PHANTOM"
      >
        <svg
          viewBox="0 0 920 360"
          className="w-full h-auto overflow-visible pointer-events-none"
          style={{ background: 'transparent' }}
        >
          {/* 1. Virus Defense Elements in Plain Space (Active before scroll) */}
          <g
            style={{
              opacity: isAssembled ? 0 : 1,
              transition: 'opacity 0.4s ease-out',
              pointerEvents: 'none',
            }}
          >
            {/* Virus 1 */}
            <g
              transform={`translate(${VIRUSES[0].startX}, ${VIRUSES[0].startY})`}
              style={{ animation: 'virusFly1 5.2s ease-in-out infinite' }}
            >
              <CartoonVirus size={VIRUSES[0].size} />
            </g>

            {/* Virus 2 */}
            <g
              transform={`translate(${VIRUSES[1].startX}, ${VIRUSES[1].startY})`}
              style={{ animation: 'virusFly2 5.8s ease-in-out infinite' }}
            >
              <CartoonVirus size={VIRUSES[1].size} />
            </g>

            {/* Virus 3 */}
            <g
              transform={`translate(${VIRUSES[2].startX}, ${VIRUSES[2].startY})`}
              style={{ animation: 'virusFly3 5.4s ease-in-out infinite' }}
            >
              <CartoonVirus size={VIRUSES[2].size} />
            </g>

            {/* Virus 4 */}
            <g
              transform={`translate(${VIRUSES[3].startX}, ${VIRUSES[3].startY})`}
              style={{ animation: 'virusFly4 5s ease-in-out infinite' }}
            >
              <CartoonVirus size={VIRUSES[3].size} />
            </g>

            {/* Defense Zaps between sentinels and viruses */}
            <path
              d="M 210 95 L 235 106 L 225 120 L 250 130"
              fill="none"
              stroke="#050505"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'zapFlicker 1.8s infinite' }}
            />
            <path
              d="M 210 95 L 235 106 L 225 120 L 250 130"
              fill="none"
              stroke="#FDE047"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'zapFlicker 1.8s infinite' }}
            />

            <path
              d="M 660 105 L 635 116 L 642 128 L 618 138"
              fill="none"
              stroke="#050505"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'zapFlicker 2.2s infinite 0.6s' }}
            />
            <path
              d="M 660 105 L 635 116 L 642 128 L 618 138"
              fill="none"
              stroke="#FDE047"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'zapFlicker 2.2s infinite 0.6s' }}
            />
          </g>

          {/* 2. The 71 USB Sentinels Roaming Up and Down in the Plain Space */}
          {ALL_UNITS.map((u) => {
            const pos = isAssembled ? u.assembled : u.scattered;

            const delay = isAssembled
              ? `${(u.id * 0.012).toFixed(3)}s`
              : `${((ALL_UNITS.length - 1 - u.id) * 0.008).toFixed(3)}s`;

            const patrolAnims = [
              'usbTravelUpAndDown1',
              'usbTravelUpAndDown2',
              'usbTravelUpAndDown3',
              'usbTravelUpAndDown4',
            ];
            const patrolAnim = patrolAnims[u.patrolStyle];

            return (
              <g
                key={u.id}
                style={{
                  // Outer transform: Handles smooth transition between scattered and assembled
                  transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg)`,
                  transition: `transform 0.85s cubic-bezier(0.34, 1.52, 0.64, 1) ${delay}`,
                  transformOrigin: '0 0',
                }}
              >
                {/* Inner transform: Plays real UP & DOWN sweeping travel movements before scroll */}
                <g
                  style={{
                    animation: isAssembled
                      ? 'none'
                      : `${patrolAnim} ${u.patrolDuration}s ease-in-out infinite ${u.patrolDelay}s`,
                    transformOrigin: '0 0',
                  }}
                >
                  {/* Emerald Shield Bubble on select defending sentinels */}
                  {u.hasShield && !isAssembled && (
                    <circle
                      cx="0"
                      cy="4"
                      r="26"
                      fill="rgba(16, 185, 129, 0.12)"
                      stroke="#10B981"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      style={{
                        animation: 'shieldPulse 2.4s ease-in-out infinite',
                        transformOrigin: '0 4px',
                      }}
                    />
                  )}

                  <HardwareUsbStick variant={u.variant} />
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
export default UsbPhantomAssembly;
