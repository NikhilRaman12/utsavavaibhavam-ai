import React, { useState } from 'react';
import { EventArchetypeId } from '../types/event';
import { Volume2, Users, Zap, Maximize2, Plus } from 'lucide-react';

export interface SpatialZone {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  w: number;
  h: number;
  capacityPct: number;
  powerLoad: string;
  lightingTemp: string;
  crowdFlowNote: string;
  colorHex: string;
}

const ARCHETYPE_ZONES: Record<EventArchetypeId, SpatialZone[]> = {
  kumbakonam: [
    {
      id: 'kz-mandapam',
      name: 'Teakwood Muhurtham Mandapam & Homa Kundam',
      role: 'Vedic Lagnam Core',
      x: 32,
      y: 10,
      w: 36,
      h: 28,
      capacityPct: 45,
      powerLoad: '14 kVA · Lapel Mics for Priests & Nadaswaram Monitor',
      lightingTemp: '2700K Warm Gold + 108 Swamimalai Brass Kuthuvilakku Lamps',
      crowdFlowNote: 'Raised 3ft teak stage with smoke-extraction hood above Homa Kundam for clear guest sightlines.',
      colorHex: '#B45309',
    },
    {
      id: 'kz-oonjal',
      name: 'Agrahara Brass Oonjal (Swing) & Kashi Yatra Courtyard',
      role: 'Ritual & Laali Songs',
      x: 34,
      y: 44,
      w: 32,
      h: 22,
      capacityPct: 40,
      powerLoad: '6 kVA · Overhead Warm Pin-Spots on Brass Swing',
      lightingTemp: 'Natural Courtyard Light + Jasmine & Kanakambaram Arch',
      crowdFlowNote: 'Circular 12ft radius around the brass chain swing so family elders can perform Aarthi & Pidi Sutruthal.',
      colorHex: '#991B1B',
    },
    {
      id: 'kz-sapadu',
      name: 'Cauvery Banana Leaf (Elai Sapadu) Panti Hall',
      role: '24-Item Kalyana Virundhu',
      x: 5,
      y: 18,
      w: 23,
      h: 68,
      capacityPct: 50,
      powerLoad: '28 kVA · Steam Boilers, Idli/Dosa Tawa & Banana Leaf Prep',
      lightingTemp: '3000K Crisp Warm Dining Illumination',
      crowdFlowNote: '180 seats per Panti batch · 35-minute turnaround with dedicated 1-to-8 parimara (serving) brigade.',
      colorHex: '#15803D',
    },
    {
      id: 'kz-coffee',
      name: 'Kumbakonam Degree Filter Coffee & Vetrilai Thamboolam Desk',
      role: 'Brass Davarah-Tumbler Bar',
      x: 72,
      y: 22,
      w: 23,
      h: 62,
      capacityPct: 35,
      powerLoad: '12 kVA · Brass Boiler Percolators & Live Mysore Pak Counter',
      lightingTemp: 'Warm Brass Lanterns & Kolam Floor Art',
      crowdFlowNote: 'Positioned along exit promenade alongside Swamimalai bronze Thamboolam distribution.',
      colorHex: '#7C2D12',
    },
  ],
  shaadi: [
    {
      id: 'sz-mandap',
      name: 'Lakeside Sandstone Mandap',
      role: 'Ceremonial Focal Core',
      x: 34,
      y: 12,
      w: 32,
      h: 28,
      capacityPct: 35,
      powerLoad: '18 kVA · Pin-Spots & Wireless Lapel PA',
      lightingTemp: '2700K Warm Amber + Floating Lotus Diyas',
      crowdFlowNote: '360° tiered low divan seating for 120 elders with unobstructed sightlines.',
      colorHex: '#B45309',
    },
    {
      id: 'sz-baraat',
      name: 'Baraat Procession & Phoolon Entry Corridor',
      role: 'Arrival & Processional Spine',
      x: 40,
      y: 68,
      w: 20,
      h: 26,
      capacityPct: 60,
      powerLoad: '8 kVA · Mobile Dhol & Brass Trolley',
      lightingTemp: 'Cold-SparklerFountains + Uplight Arches',
      crowdFlowNote: 'Keep 16ft clear width for vintage car turn-around and dhol circle.',
      colorHex: '#991B1B',
    },
    {
      id: 'sz-chaat',
      name: 'Royal Chaat & Kulhad Chai Conservatory',
      role: 'Interactive Gastronomy',
      x: 6,
      y: 22,
      w: 22,
      h: 46,
      capacityPct: 45,
      powerLoad: '24 kVA · Live Induction Tawa & Chiller Units',
      lightingTemp: '2400K Terracotta Lantern Canopy',
      crowdFlowNote: 'Staggered 4-island layout prevents queue buildup during Mehendi & Cocktail transition.',
      colorHex: '#065F46',
    },
    {
      id: 'sz-sangeet',
      name: 'Mirrorwork Sangeet Stage & Dance Floor',
      role: 'Acoustic & Performance Arena',
      x: 72,
      y: 20,
      w: 22,
      h: 50,
      capacityPct: 80,
      powerLoad: '45 kVA · LED Wall, Line-Array & DMX Truss',
      lightingTemp: 'Timecode DMX Amber/Crimson Wash',
      crowdFlowNote: 'Subwoofer array angled 15° inward to comply with 22:00 courtyard decibel limit.',
      colorHex: '#4338CA',
    },
  ],
  wedding: [
    {
      id: 'wz-altar',
      name: 'Botanical Glasshouse Altar & Olive Canopy',
      role: 'Ceremony Focal Frame',
      x: 35,
      y: 10,
      w: 30,
      h: 24,
      capacityPct: 100,
      powerLoad: '6 kVA · Hidden Acoustic Quartet Mics',
      lightingTemp: 'Natural Golden Hour West Backlight',
      crowdFlowNote: 'Curved aisle chairs give every guest a 45° diagonal sightline to vows.',
      colorHex: '#3F6212',
    },
    {
      id: 'wz-banquet',
      name: 'Serpentine Linen Harvest Tables',
      role: 'Communal Dining Atrium',
      x: 22,
      y: 40,
      w: 56,
      h: 32,
      capacityPct: 95,
      powerLoad: '14 kVA · 24 Overhead Pin-Spots',
      lightingTemp: '2200K Beeswax Tapers + Suspended Foliage',
      crowdFlowNote: '5.5ft service lanes between serpentine curves for synchronized family-style plating.',
      colorHex: '#92400E',
    },
    {
      id: 'wz-spritz',
      name: 'Terrace Champagne Tower & Oyster Cart',
      role: 'Aperitivo & Toast Deck',
      x: 8,
      y: 74,
      w: 38,
      h: 18,
      capacityPct: 65,
      powerLoad: '4 kVA · Cross-Spot Crystal Illumination',
      lightingTemp: 'Warm Sunset Rim Light',
      crowdFlowNote: 'Positioned at terrace threshold for seamless indoor-outdoor transition.',
      colorHex: '#0F766E',
    },
    {
      id: 'wz-vinyl',
      name: 'Acoustic Quartet & Vinyl Lounge',
      role: 'Late-Night Dance & Espresso Bar',
      x: 54,
      y: 74,
      w: 38,
      h: 18,
      capacityPct: 75,
      powerLoad: '18 kVA · Turntables, PA & Espresso Machine',
      lightingTemp: 'Warm Amber Uplights',
      crowdFlowNote: 'Adjacent to wood-fired flatbread window for 22:00 late-night pass.',
      colorHex: '#1E293B',
    },
  ],
  birthday: [
    {
      id: 'bz-entry',
      name: 'Secret Bookcase Speakeasy Portal',
      role: 'Arrival & Token Check-In',
      x: 8,
      y: 68,
      w: 24,
      h: 22,
      capacityPct: 30,
      powerLoad: '3 kVA · Monochrome Portrait Booth',
      lightingTemp: '2200K Vintage Filament Sconces',
      crowdFlowNote: 'Instant polaroid wall right inside entry prevents elevator foyer congestion.',
      colorHex: '#7F1D1D',
    },
    {
      id: 'bz-bar',
      name: 'Alchemy Smoked Mixology Theater',
      role: '3-Era Cocktail & Tapas Bar',
      x: 12,
      y: 16,
      w: 34,
      h: 40,
      capacityPct: 70,
      powerLoad: '12 kVA · Ice Carvers, Smokers & Under-Bar LED',
      lightingTemp: '2400K Amber Bar Back Glow',
      crowdFlowNote: 'Dual bartender stations keep cocktail wait times under 90 seconds.',
      colorHex: '#B45309',
    },
    {
      id: 'bz-stage',
      name: 'Skyline DJ Booth, Sax & Tribute Wall',
      role: 'Climax & Projection Stage',
      x: 54,
      y: 16,
      w: 36,
      h: 72,
      capacityPct: 85,
      powerLoad: '20 kVA · 4K Laser Projector & Club Subwoofers',
      lightingTemp: '40% Dimmed Edison Canopy + Strobe Drop',
      crowdFlowNote: 'Central cake plinth rolls out from catering prep door at 21:20 sharp.',
      colorHex: '#312E81',
    },
  ],
  community: [
    {
      id: 'cz-stage',
      name: 'Civic Agora Mainstage & Lantern Grid',
      role: 'Youth Orchestra & Charity Auction',
      x: 28,
      y: 10,
      w: 44,
      h: 26,
      capacityPct: 85,
      powerLoad: '60 kVA · Whisper Biodiesel Generator + Line Array',
      lightingTemp: '450 Overhead Warm LED Bamboo Lanterns',
      crowdFlowNote: 'Dedicated ASL interpreter deck stage-right + wheelchair viewing terrace.',
      colorHex: '#C2410C',
    },
    {
      id: 'cz-trucks',
      name: '8 Multicultural Food Trucks & Eco-Hubs',
      role: 'Zero-Waste Culinary Commons',
      x: 6,
      y: 44,
      w: 28,
      h: 44,
      capacityPct: 75,
      powerLoad: 'Self-Contained + 3-Stream Compost Stations',
      lightingTemp: 'High-Contrast Festoon String Lighting',
      crowdFlowNote: '14-foot emergency fire lane preserved through center promenade.',
      colorHex: '#15803D',
    },
    {
      id: 'cz-makers',
      name: 'Artisan Makers Alley & Live Mural Studio',
      role: 'Interactive Community Workshops',
      x: 66,
      y: 44,
      w: 28,
      h: 44,
      capacityPct: 60,
      powerLoad: '15 kVA · ADA Cable Ramps Across Walkways',
      lightingTemp: 'Warm Daylight Task Spots',
      crowdFlowNote: 'Sensory-friendly quiet pavilion and EMT first-aid station at south corner.',
      colorHex: '#1D4ED8',
    },
  ],
  corporate: [
    {
      id: 'corp-plenary',
      name: 'Keynote Plenary & Ultra-Wide Curved LED Wall',
      role: 'Keynote & Executive Fireside Stage',
      x: 24,
      y: 10,
      w: 52,
      h: 32,
      capacityPct: 85,
      powerLoad: '75 kVA · 4K Broadcast Feed + Shure Axient Lapels',
      lightingTemp: '5000K Studio Keylights + Blue/Cyan DMX Horizon Wash',
      crowdFlowNote: 'Dual teleprompters, confidence monitors, and wheelchair-accessible stage ramp.',
      colorHex: '#1E3A8A',
    },
    {
      id: 'corp-expo',
      name: 'Innovation Demo Hub & Breakout Pods',
      role: 'Partner Showcases & Hands-On Labs',
      x: 8,
      y: 48,
      w: 38,
      h: 44,
      capacityPct: 65,
      powerLoad: '30 kVA · High-Density Wi-Fi 6E & Dedicated 100W USB-C Drops',
      lightingTemp: '4000K Neutral Crisp Exhibition Illumination',
      crowdFlowNote: '10ft central circulation aisle preventing bottlenecks around partner booths.',
      colorHex: '#0D9488',
    },
    {
      id: 'corp-lounge',
      name: 'VIP Executive Lounge & Specialty Coffee Bar',
      role: 'Investor Networking & Speaker Green Room',
      x: 54,
      y: 48,
      w: 38,
      h: 44,
      capacityPct: 50,
      powerLoad: '18 kVA · Dual La Marzocco Espresso Bars + Acoustic Baffles',
      lightingTemp: '2700K Warm Hospitality Amber Glow',
      crowdFlowNote: 'Badge-scanned NFC access control gate with soundproofed interview room.',
      colorHex: '#D97706',
    },
  ],
  intimate: [
    {
      id: 'int-banquet',
      name: 'Imperial Travertine Banquet Table & Olive Cloud',
      role: '24-Seat Curated Chef Table',
      x: 28,
      y: 16,
      w: 44,
      h: 40,
      capacityPct: 60,
      powerLoad: '4 kVA · Low-Voltage Micro-Pendants',
      lightingTemp: '2200K Natural Beeswax Tapers & Soft Chandelier Glow',
      crowdFlowNote: 'Single continuous banquet line allowing conversational intimacy across all 24 chairs.',
      colorHex: '#4D7C0F',
    },
    {
      id: 'int-lounge',
      name: 'Sommelier Tasting Cellar & Acoustic String Pergola',
      role: 'Reserve Wine Flights & Solo Harpist',
      x: 8,
      y: 60,
      w: 36,
      h: 32,
      capacityPct: 40,
      powerLoad: '2 kVA · Unamplified Acoustic Chamber',
      lightingTemp: 'Deep Amber Wall Sconces',
      crowdFlowNote: 'Adjacent to private cellar vault with sommelier service trolley lane.',
      colorHex: '#7C2D12',
    },
    {
      id: 'int-terrace',
      name: 'Starlight Firepit Terrace & Digestif Deck',
      role: 'Dessert Climax & Fireside Keepsakes',
      x: 56,
      y: 60,
      w: 36,
      h: 32,
      capacityPct: 55,
      powerLoad: '5 kVA · Gas Firepits & Ambient Landscape Glow',
      lightingTemp: 'Warm Firelight & Fairy-Trellis Canopy',
      crowdFlowNote: 'Seamless double French door walkout from main dining room.',
      colorHex: '#B45309',
    },
  ],
};

interface SpatialVenueCanvasProps {
  archetypeId: EventArchetypeId;
  guestCount: number;
  onAddZoneTask: (title: string, notes: string) => void;
  onPlayVoiceover: (text: string) => void;
  isPlayingAudio: boolean;
}

export const SpatialVenueCanvas: React.FC<SpatialVenueCanvasProps> = ({
  archetypeId,
  guestCount,
  onAddZoneTask,
  onPlayVoiceover,
  isPlayingAudio,
}) => {
  const zones = ARCHETYPE_ZONES[archetypeId] || ARCHETYPE_ZONES.shaadi;
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0].id);
  const [showFlowVectors, setShowFlowVectors] = useState<boolean>(true);

  const activeZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  return (
    <div className="bg-stone-950 text-stone-100 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-amber-400 font-medium">
            Interactive 360° Spatial Architecture & Crowd-Flow Twins
          </div>
          <h3 className="text-lg font-bold text-white font-editorial">
            Click Any Venue Zone to Inspect Power, Sightlines & Guest Density
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFlowVectors((p) => !p)}
            aria-label="Toggle guest flow vectors"
            aria-pressed={showFlowVectors}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              showFlowVectors
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
            }`}
          >
            {showFlowVectors ? 'Crowd Flow & Sightlines: ON' : 'Crowd Flow: OFF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive Architectural Blueprint Canvas */}
        <div className="lg:col-span-7 relative min-h-[380px] bg-[#0C0A09] p-6 flex items-center justify-center overflow-hidden">
          {/* Architectural Blueprint Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #44403C 1px, transparent 1px), linear-gradient(to bottom, #44403C 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Interactive Venue Floor Frame */}
          <div className="relative w-full h-[330px] rounded-2xl border border-stone-700/80 bg-stone-900/50 overflow-hidden">
            {/* Compass & Scale Legend */}
            <div className="absolute top-3 left-3 text-[11px] font-mono-tabular text-stone-400 flex items-center gap-2 pointer-events-none">
              <span>SCALE 1:100</span>
              <span>·</span>
              <span>{guestCount} PAX CAPACITY</span>
            </div>

            {/* Crowd Flow SVG Vectors */}
            {showFlowVectors && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-65"
              >
                <defs>
                  <marker
                    id="flow-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#FBBF24" />
                  </marker>
                </defs>
                <path
                  d="M 50 92 C 50 70, 25 60, 20 45"
                  stroke="#FBBF24"
                  strokeWidth="0.6"
                  strokeDasharray="2 1.5"
                  fill="none"
                  markerEnd="url(#flow-arrow)"
                />
                <path
                  d="M 50 92 C 50 65, 50 45, 50 28"
                  stroke="#FBBF24"
                  strokeWidth="0.8"
                  strokeDasharray="2 1.5"
                  fill="none"
                  markerEnd="url(#flow-arrow)"
                />
                <path
                  d="M 50 92 C 55 70, 75 60, 80 45"
                  stroke="#FBBF24"
                  strokeWidth="0.6"
                  strokeDasharray="2 1.5"
                  fill="none"
                  markerEnd="url(#flow-arrow)"
                />
              </svg>
            )}

            {/* Clickable Spatial Zones */}
            {zones.map((z) => {
              const isSelected = z.id === activeZone.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZoneId(z.id)}
                  aria-label={`Select venue zone: ${z.name}`}
                  style={{
                    left: `${z.x}%`,
                    top: `${z.y}%`,
                    width: `${z.w}%`,
                    height: `${z.h}%`,
                    backgroundColor: isSelected ? `${z.colorHex}55` : `${z.colorHex}28`,
                    borderColor: isSelected ? '#FBBF24' : z.colorHex,
                  }}
                  className={`absolute rounded-xl border-2 p-2.5 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected ? 'ring-4 ring-amber-400/25 z-10 scale-[1.02]' : 'hover:opacity-95'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                      {z.name}
                    </span>
                    <Maximize2 className="w-3 h-3 text-amber-300 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono-tabular text-amber-200/90">
                    <span>{z.role}</span>
                    <span>{Math.round((guestCount * z.capacityPct) / 100)} pax</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Telemetry & Audio Walkthrough Panel */}
        <div className="lg:col-span-5 p-6 bg-stone-900/90 border-t lg:border-t-0 lg:border-l border-stone-800 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono-tabular text-amber-400">
                ACTIVE ZONE SPEC · {activeZone.role.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() =>
                  onPlayVoiceover(
                    `Spatial production briefing for ${activeZone.name}. ${activeZone.crowdFlowNote} Lighting cue is set to ${activeZone.lightingTemp}.`
                  )
                }
                disabled={isPlayingAudio}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Speaking...' : 'Hear Audio Walkthrough'}</span>
              </button>
            </div>

            <h4 className="text-xl font-bold text-white font-editorial">{activeZone.name}</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zone Peak Load</span>
                </div>
                <div className="text-sm font-bold text-white font-mono-tabular mt-1">
                  ~{Math.round((guestCount * activeZone.capacityPct) / 100)} Guests ({activeZone.capacityPct}%)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Power & Rigging</span>
                </div>
                <div className="text-xs font-semibold text-white font-mono-tabular mt-1">
                  {activeZone.powerLoad}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
                <span className="text-stone-400 block mb-0.5">Chromatic & Lighting Temperature:</span>
                <span className="text-stone-100 font-medium">{activeZone.lightingTemp}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
                <span className="text-stone-400 block mb-0.5">Crowd Flow & Bottleneck Prevention:</span>
                <span className="text-stone-200 leading-relaxed">{activeZone.crowdFlowNote}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onAddZoneTask(
                `Site Inspection & Rigging Sign-Off: ${activeZone.name}`,
                `${activeZone.powerLoad} · ${activeZone.lightingTemp} · ${activeZone.crowdFlowNote}`
              )
            }
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pin Zone Spec to Visual Run of Show</span>
          </button>
        </div>
      </div>
    </div>
  );
};
