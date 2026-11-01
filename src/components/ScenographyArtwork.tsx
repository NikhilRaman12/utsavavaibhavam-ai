import React, { useState } from 'react';

export interface ScenographyPreset {
  id: string;
  title: string;
  category: string;
  defaultCaption: string;
  defaultLightingCue: string;
  aspectRatio: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
}

export const SCENOGRAPHY_PRESETS: ScenographyPreset[] = [
  {
    id: 'kumbakonam-mandapam',
    title: 'Kumbakonam Teakwood Mandapam, Oonjal & Kuthuvilakku',
    category: 'Kumbakonam Vivaham',
    defaultCaption:
      'Carved Chettinad/Tanjore teak pillars, banana stem (Vazhai Maram) arches, brass Oonjal swing, and Swamimalai Kuthuvilakku lamps.',
    defaultLightingCue:
      'Auspicious morning sunlight + 108 lit brass Kuthuvilakku oil lamps + Nadaswaram acoustic resonance.',
    aspectRatio: '16:9',
    primaryHex: '#7C2D12',
    secondaryHex: '#B45309',
    accentHex: '#FDE047',
  },
  {
    id: 'mandap-courtyard',
    title: 'Lakeside Sandstone Mandap & Lotus Urlis',
    category: 'Heritage Shaadi',
    defaultCaption: 'Four-pillar carved sandstone Mandap with suspended marigold & mogra garlands over reflection pool.',
    defaultLightingCue: '2700K warm architectural pin-spots + floating brass candle urlis + cold-sparkler entry.',
    aspectRatio: '16:9',
    primaryHex: '#7F1D1D',
    secondaryHex: '#D97706',
    accentHex: '#FDE68A',
  },
  {
    id: 'haldi-carnival',
    title: 'Marigold & Brass Courtyard Haldi Carnival',
    category: 'Heritage Shaadi',
    defaultCaption: 'Wrought-iron arches draped in yellow genda phool, brass urli tubs, and shaded linen cabanas.',
    defaultLightingCue: 'Natural morning courtyard sunlight + marigold petal cannons + acoustic dhol circle.',
    aspectRatio: '4:3',
    primaryHex: '#B45309',
    secondaryHex: '#F59E0B',
    accentHex: '#FEF3C7',
  },
  {
    id: 'sangeet-truss',
    title: 'Velvet & Mirrorwork Sangeet Stage',
    category: 'Heritage Shaadi',
    defaultCaption: 'Wide-span LED backdrop framed by mirrorwork panels, kinetic chandelier truss, and velvet lounge.',
    defaultLightingCue: 'Amber & deep crimson beam wash + synchronized timecode DMX cues for family choreography.',
    aspectRatio: '16:9',
    primaryHex: '#1E1B4B',
    secondaryHex: '#991B1B',
    accentHex: '#F59E0B',
  },
  {
    id: 'glasshouse-atrium',
    title: 'Botanical Glasshouse & Suspended Olive Cloud',
    category: 'Botanical Wedding',
    defaultCaption: 'Victorian iron-and-glass conservatory with serpentine linen banquet tables and hanging foliage.',
    defaultLightingCue: 'Golden hour natural glasshouse light transitioning to 2400K beeswax tapers & micro-fairy canopy.',
    aspectRatio: '16:9',
    primaryHex: '#14532D',
    secondaryHex: '#3F6212',
    accentHex: '#E7E5E4',
  },
  {
    id: 'champagne-tower',
    title: 'Terrace Coupe Champagne Tower & Cello Prelude',
    category: 'Botanical Wedding',
    defaultCaption: '6-tier crystal coupe pyramid on travertine plinth surrounded by white garden roses.',
    defaultLightingCue: 'Warm sunset backlight + dual directional spot on crystal tower during pour.',
    aspectRatio: '4:3',
    primaryHex: '#292524',
    secondaryHex: '#78716C',
    accentHex: '#FDE68A',
  },
  {
    id: 'speakeasy-rooftop',
    title: 'Velvet Speakeasy & Smoked Mixology Bar',
    category: 'Milestone Soirée',
    defaultCaption: 'Penthouse skyline terrace with low velvet banquettes, brass bar back, and custom ice sculptures.',
    defaultLightingCue: '40% dimmed Edison filament canopy + amber under-bar LED glow + vinyl booth spot.',
    aspectRatio: '16:9',
    primaryHex: '#0F172A',
    secondaryHex: '#7C2D12',
    accentHex: '#FBBF24',
  },
  {
    id: 'tribute-projection',
    title: 'Architectural Cake Parade & Tribute Projection',
    category: 'Milestone Soirée',
    defaultCaption: 'Large-format projection wall for tribute film paired with rolling plinth cake reveal.',
    defaultLightingCue: 'Full house blackout for 4-min film followed by gold confetti & sax spotlight.',
    aspectRatio: '4:3',
    primaryHex: '#18181B',
    secondaryHex: '#9A3412',
    accentHex: '#FDE047',
  },
  {
    id: 'lantern-promenade',
    title: 'Civic Lantern Canopy & Makers Agora',
    category: 'Community Festival',
    defaultCaption: 'Overhead bamboo paper lantern grid spanning pedestrian plaza with accessible stage & booths.',
    defaultLightingCue: '450 synchronized warm LED lanterns illuminated at 17:30 dusk.',
    aspectRatio: '16:9',
    primaryHex: '#1E3A8A',
    secondaryHex: '#C2410C',
    accentHex: '#FED7AA',
  },
];

interface ScenographyArtworkProps {
  presetId?: string;
  imageUrl?: string;
  title?: string;
  className?: string;
  showBadge?: boolean;
}

export const ScenographyArtwork: React.FC<ScenographyArtworkProps> = ({
  presetId = 'mandap-courtyard',
  imageUrl,
  title,
  className = 'w-full h-full',
  showBadge = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const preset =
    SCENOGRAPHY_PRESETS.find((p) => p.id === presetId) || SCENOGRAPHY_PRESETS[0];

  if (imageUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-stone-900 ${className}`}>
        <img
          src={imageUrl}
          alt={title || preset.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Bespoke Architectural SVG Scenography Illustration per Preset
  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`bg-${preset.id}`} x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={preset.primaryHex} />
            <stop offset="60%" stopColor={preset.secondaryHex} />
            <stop offset="100%" stopColor="#0C0A09" />
          </linearGradient>
          <radialGradient id={`glow-${preset.id}`} cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor={preset.accentHex} stopOpacity="0.55" />
            <stop offset="55%" stopColor={preset.secondaryHex} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <pattern id={`grid-${preset.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Base Atmospheric Sky / Backdrop */}
        <rect width="800" height="500" fill={`url(#bg-${preset.id})`} />
        <rect width="800" height="500" fill={`url(#grid-${preset.id})`} />
        <circle cx="400" cy="220" r="260" fill={`url(#glow-${preset.id})`} />

        {/* Architectural & Scenographic Geometry by Archetype */}
        {(preset.id === 'kumbakonam-mandapam' || preset.id === 'mandap-courtyard' || preset.id === 'haldi-carnival') && (
          <g>
            {/* Courtyard Reflection Pool */}
            <rect x="0" y="370" width="800" height="130" fill="rgba(12, 10, 9, 0.55)" />
            <line x1="0" y1="370" x2="800" y2="370" stroke={preset.accentHex} strokeOpacity="0.4" strokeWidth="1.5" />
            {/* Palace Cusped Arches & Mandap Pillars */}
            <path
              d="M140 370 V150 C140 100 220 80 260 130 C300 80 360 70 400 110 C440 70 500 80 540 130 C580 80 660 100 660 150 V370"
              stroke={preset.accentHex}
              strokeOpacity="0.55"
              strokeWidth="2.5"
              fill="rgba(0,0,0,0.22)"
            />
            <line x1="220" y1="125" x2="220" y2="370" stroke={preset.accentHex} strokeOpacity="0.45" strokeWidth="6" />
            <line x1="580" y1="125" x2="580" y2="370" stroke={preset.accentHex} strokeOpacity="0.45" strokeWidth="6" />
            {/* Hanging Marigold & Jasmine Garlands */}
            {[180, 230, 280, 330, 380, 420, 470, 520, 570, 620].map((x, idx) => (
              <g key={x}>
                <line
                  x1={x}
                  y1="115"
                  x2={x}
                  y2={210 + (idx % 3) * 28}
                  stroke={preset.accentHex}
                  strokeOpacity="0.7"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={x}
                  cy={215 + (idx % 3) * 28}
                  r="4.5"
                  fill={preset.accentHex}
                  fillOpacity="0.9"
                />
              </g>
            ))}
            {/*Sacred Fire / Center Urli Plinth */}
            <rect x="350" y="330" width="100" height="40" rx="4" fill={preset.accentHex} fillOpacity="0.25" stroke={preset.accentHex} strokeOpacity="0.6" />
            <path d="M385 330 Q400 285 415 330 Z" fill={preset.accentHex} fillOpacity="0.85" />
            {/* Floating Diya Lamps on Water */}
            {[190, 290, 400, 510, 610].map((cx, i) => (
              <g key={i}>
                <ellipse cx={cx} cy={410 + (i % 2) * 22} rx="14" ry="4" fill={preset.accentHex} fillOpacity="0.65" />
                <circle cx={cx} cy={405 + (i % 2) * 22} r="3" fill="#FFFBEB" />
              </g>
            ))}
          </g>
        )}

        {preset.id === 'sangeet-truss' && (
          <g>
            {/* Stage Deck */}
            <polygon points="80,390 720,390 780,470 20,470" fill="rgba(15,23,42,0.75)" stroke={preset.accentHex} strokeOpacity="0.45" strokeWidth="1.5" />
            {/* LED Screen Geometry */}
            <rect x="170" y="110" width="460" height="250" rx="8" fill="rgba(0,0,0,0.45)" stroke={preset.accentHex} strokeOpacity="0.6" strokeWidth="2" />
            {/* Concentric Mirrorwork Mandala on LED Wall */}
            <circle cx="400" cy="235" r="95" stroke={preset.accentHex} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="400" cy="235" r="60" stroke={preset.accentHex} strokeOpacity="0.65" strokeWidth="1.5" />
            {/* Stage Truss Spotlights */}
            {[200, 300, 400, 500, 600].map((lx) => (
              <polygon
                key={lx}
                points={`${lx},90 ${lx - 55},390 ${lx + 55},390`}
                fill={preset.accentHex}
                fillOpacity="0.12"
              />
            ))}
          </g>
        )}

        {(preset.id === 'glasshouse-atrium' || preset.id === 'champagne-tower') && (
          <g>
            {/* Victorian Glasshouse Roof Vaults */}
            <path
              d="M60 420 L60 170 L400 55 L740 170 L740 420"
              stroke="#E7E5E4"
              strokeOpacity="0.5"
              strokeWidth="2"
              fill="rgba(0,0,0,0.18)"
            />
            <line x1="400" y1="55" x2="400" y2="420" stroke="#E7E5E4" strokeOpacity="0.3" strokeWidth="1.5" />
            <line x1="230" y1="112" x2="230" y2="420" stroke="#E7E5E4" strokeOpacity="0.25" strokeWidth="1" />
            <line x1="570" y1="112" x2="570" y2="420" stroke="#E7E5E4" strokeOpacity="0.25" strokeWidth="1" />
            {/* Suspended Botanical Cloud */}
            <ellipse cx="400" cy="175" rx="190" ry="38" fill="#3F6212" fillOpacity="0.65" stroke="#FEF08A" strokeOpacity="0.4" />
            {/* Coupe Pyramid / Banquet Table */}
            {[0, 1, 2, 3, 4].map((row) => (
              <rect
                key={row}
                x={400 - (row + 1) * 22}
                y={260 + row * 22}
                width={(row + 1) * 44}
                height="18"
                rx="3"
                fill="rgba(254, 240, 138, 0.22)"
                stroke="#FEF08A"
                strokeOpacity="0.65"
              />
            ))}
          </g>
        )}

        {(preset.id === 'speakeasy-rooftop' || preset.id === 'tribute-projection') && (
          <g>
            {/* City Skyline Silhouette */}
            {[70, 140, 210, 290, 480, 560, 640, 710].map((bx, i) => (
              <rect
                key={bx}
                x={bx}
                y={160 + (i % 3) * 35}
                width="55"
                height={260 - (i % 3) * 35}
                fill="rgba(15, 23, 42, 0.7)"
                stroke="rgba(251, 191, 36, 0.2)"
              />
            ))}
            {/* Edison Bulb String Canopy */}
            <path d="M50 95 Q400 175 750 95" stroke="#FBBF24" strokeOpacity="0.5" strokeWidth="1.5" fill="none" />
            {[130, 240, 350, 450, 560, 670].map((cx, i) => (
              <circle key={cx} cx={cx} cy={120 + (i === 2 || i === 3 ? 16 : 4)} r="6" fill="#FDE68A" />
            ))}
            {/* Craft Bar Counter */}
            <rect x="180" y="330" width="440" height="90" rx="8" fill="rgba(24, 24, 27, 0.85)" stroke="#FBBF24" strokeOpacity="0.5" />
          </g>
        )}

        {preset.id === 'lantern-promenade' && (
          <g>
            {/* Lantern Catenary Strings */}
            <path d="M20 80 Q400 160 780 80" stroke="#FED7AA" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
            <path d="M20 150 Q400 230 780 150" stroke="#FED7AA" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
            {[110, 220, 330, 440, 550, 660].map((lx, idx) => (
              <g key={lx}>
                <rect
                  x={lx - 12}
                  y={105 + (idx % 2) * 55}
                  width="24"
                  height="34"
                  rx="8"
                  fill="#FB923C"
                  fillOpacity="0.88"
                  stroke="#FEF3C7"
                  strokeWidth="1.5"
                />
                <circle cx={lx} cy={122 + (idx % 2) * 55} r="18" fill="#FDE68A" fillOpacity="0.22" />
              </g>
            ))}
            {/* Civic Plaza Pavilion */}
            <path d="M220 390 L260 280 L540 280 L580 390 Z" fill="rgba(15, 23, 42, 0.55)" stroke="#FED7AA" strokeOpacity="0.5" />
          </g>
        )}
      </svg>

      {/* Subtle Bottom Scrim for Overlay Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

      {showBadge && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/55 backdrop-blur-xs text-[11px] font-medium text-stone-200 tracking-wide">
          {preset.category} · {preset.aspectRatio}
        </div>
      )}
    </div>
  );
};
