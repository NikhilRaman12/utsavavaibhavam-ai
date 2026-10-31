// Intelligent Knowledge Base & GenAI Synthesis Rules for Event Archetypes

export const EVENT_ARCHETYPES = {
  wedding: {
    id: 'wedding',
    label: 'Luxury Wedding Celebration',
    tagline: 'Elegance, emotion, timeless design & synchronized execution',
    badge: 'Ceremony & Reception',
    defaultBudget: 35000,
    defaultGuests: 140,
    categories: ['Venue & Styling', 'Catering & Spirits', 'Photography & Cinema', 'Music & Lighting', 'Attire & Beauty', 'Guest Hospitality'],
    themes: ['Royal Rajasthani Mandap & Marigold Glow', 'Modern Botanical Glasshouse', 'Romantic Tuscan Villa Sunset', 'South Indian Temple Brass & Mogra', 'Celestial Midnight Sangeet'],
    promptSuggestions: [
      'What are creative late-night snack ideas for 150 guests?',
      'How to structure a 4-hour cocktail and seated dinner timeline?',
      'Draft an RFP message for an editorial wedding photographer.',
      'Suggest a color palette blending emerald, champagne, and brushed gold.'
    ],
    sampleTimelines: [
      { id: 'w1', phase: '6-8 Months Out', title: 'Lock Venue & Master Contract', status: 'completed', owner: 'Planner/Couple', tag: 'High Priority', date: 'M-6' },
      { id: 'w2', phase: '4-5 Months Out', title: 'Curate Tasting Menu & Sommelier Pairing', status: 'in-progress', owner: 'Catering Lead', tag: 'Culinary', date: 'M-4' },
      { id: 'w3', phase: '2 Months Out', title: 'Finalize Floor Plan & Seating Matrix', status: 'pending', owner: 'Stationery & Decor', tag: 'Logistics', date: 'M-2' },
      { id: 'w4', phase: '2 Weeks Out', title: 'Vendor Call Sheets & Run of Show Lock', status: 'pending', owner: 'Day-of Coordinator', tag: 'Operations', date: 'W-2' },
      { id: 'w5', phase: 'Day-Of 14:00', title: 'First Look & Bridal Party Editorial Portraits', status: 'pending', owner: 'Photo Crew', tag: 'Run-of-show', date: '02:00 PM' },
      { id: 'w6', phase: 'Day-Of 17:30', title: 'Vow Ceremony & Acoustic Strings Recessional', status: 'pending', owner: 'Officiant/Strings', tag: 'Run-of-show', date: '05:30 PM' },
      { id: 'w7', phase: 'Day-Of 21:00', title: 'Live Brass Band & Nitrogen Gelato Cart', status: 'pending', owner: 'Entertainment Lead', tag: 'Party', date: '09:00 PM' }
    ],
    sampleBudgets: [
      { id: 'b1', category: 'Venue & Styling', item: 'Glass Pavilion & Ambient Uplighting', planned: 11000, actual: 10500, paid: true },
      { id: 'b2', category: 'Catering & Spirits', item: 'Plated 3-Course + Artisanal Gin & Wine Bar', planned: 12500, actual: 13200, paid: false },
      { id: 'b3', category: 'Photography & Cinema', item: 'Dual Shooter 10-Hour Coverage + Drone Film', planned: 4200, actual: 4000, paid: true },
      { id: 'b4', category: 'Music & Lighting', item: 'String Quartet & 6-Piece Evening Live Band', planned: 3600, actual: 3500, paid: false },
      { id: 'b5', category: 'Guest Hospitality', item: 'Welcome Hampers & Luxury Shuttle Transfer', planned: 1800, actual: 1650, paid: false },
      { id: 'b6', category: 'Contingency Reserve', item: 'Overtime buffer & weather weatherproofing', planned: 1900, actual: 0, paid: false }
    ],
    sampleVendors: [
      { id: 'v1', name: 'Lumière Botanical Floral & Design', role: 'Florist & Scenographer', rating: 4.9, quote: '$4,800', status: 'Confirmed', contact: 'helena@lumierebotanicals.com', notes: 'Includes hanging floral cloud over head table' },
      { id: 'v2', name: 'Atelier Narrative Cinema', role: 'Lead Cinematographer', rating: 5.0, quote: '$3,400', status: 'Shortlisted', contact: 'marcus@ateliernarrative.co', notes: '4K film + 60s teaser reels for socials' },
      { id: 'v3', name: 'Heritage Epicurean Catering', role: 'Executive Chef Team', rating: 4.8, quote: '$13,200', status: 'Contract Sent', contact: 'chef@heritageepicurean.com', notes: 'Farm-to-table seasonal harvest menu' },
      { id: 'v4', name: 'The Velvet Sound Collective', role: 'Live Band & DJ Hybrid', rating: 4.9, quote: '$3,500', status: 'Confirmed', contact: 'booking@velvetsound.fm', notes: 'Soul/Funk set followed by deep house DJ' }
    ]
  },

  birthday: {
    id: 'birthday',
    label: 'Milestone Birthday & Party',
    tagline: 'Vibrant experiential celebration, immersive staging & signature moments',
    badge: 'Party & Celebration',
    defaultBudget: 8500,
    defaultGuests: 60,
    categories: ['Venue & Atmosphere', 'Bespoke Bar & Food', 'Live Entertainment', 'Visual Production & Photo', 'Favors & Surprises'],
    themes: ['Neon Cyber-Retro Lounge', 'Gatsby 1920s Speakeasy', 'Boho Sunset Rooftop Fiesta', 'High-Roller Casino Royale'],
    promptSuggestions: [
      'Generate interactive icebreakers and drinking games for 30th birthday.',
      'Suggest a signature cocktail menu themed around the birthday year.',
      'How do I time a surprise reveal during speeches?',
      'Create a breakdown of audiovisual equipment needed for a backyard DJ setup.'
    ],
    sampleTimelines: [
      { id: 'b1', phase: '4 Weeks Out', title: 'Confirm Secret Venue & Security Clearance', status: 'completed', owner: 'Host', tag: 'Space', date: 'W-4' },
      { id: 'b2', phase: '2 Weeks Out', title: 'Custom Mixologist Menu & Ice Sculptures Ordered', status: 'in-progress', owner: 'Bar Lead', tag: 'Beverage', date: 'W-2' },
      { id: 'b3', phase: '3 Days Out', title: 'Photo Booth Props & 360 Video Rig Testing', status: 'pending', owner: 'Media Tech', tag: 'Experiential', date: 'D-3' },
      { id: 'b4', phase: 'Party 19:00', title: 'Guests Arrive: Champagne Flutes & Ambient Vinyl DJ', status: 'pending', owner: 'Host/DJ', tag: 'Welcome', date: '07:00 PM' },
      { id: 'b5', phase: 'Party 21:00', title: 'Surprise Tribute Video Projection & Toast', status: 'pending', owner: 'Best Friend', tag: 'Highlight', date: '09:00 PM' },
      { id: 'b6', phase: 'Party 21:30', title: 'Architectural Birthday Cake & Confetti Cannon Drop', status: 'pending', owner: 'Event Crew', tag: 'Climax', date: '09:30 PM' }
    ],
    sampleBudgets: [
      { id: 'bb1', category: 'Venue & Atmosphere', item: 'Panoramic Penthouse Terrace Loft', planned: 3200, actual: 3000, paid: true },
      { id: 'bb2', category: 'Bespoke Bar & Food', item: 'Tapas Grazing Table & 2 Craft Mixologists', planned: 2600, actual: 2750, paid: false },
      { id: 'bb3', category: 'Live Entertainment', item: 'Club DJ + Saxophone Accompaniment', planned: 1400, actual: 1400, paid: true },
      { id: 'bb4', category: 'Visual Production & Photo', item: '360 Glam Cam & Custom Neon Backdrop', planned: 800, actual: 750, paid: false },
      { id: 'bb5', category: 'Favors & Surprises', item: 'Personalized mini gin bottles & sparklers', planned: 500, actual: 480, paid: true }
    ],
    sampleVendors: [
      { id: 'bv1', name: 'Skyline Terrace Loft', role: 'Private Event Space', rating: 4.8, quote: '$3,000', status: 'Confirmed', contact: 'events@skylineterrace.city', notes: 'Sound curfew midnight' },
      { id: 'bv2', name: 'Alchemy Cocktail Lab', role: 'Mobile Craft Bar', rating: 5.0, quote: '$2,750', status: 'Confirmed', contact: 'cheers@alchemylab.co', notes: 'Dry ice cocktails + smoked rosemary garnishes' },
      { id: 'bv3', name: 'Spin & Sax Groove Project', role: 'DJ & Live Saxophonist', rating: 4.9, quote: '$1,400', status: 'Shortlisted', contact: 'booking@spinandsax.com', notes: '2x 45 min live sax sets over house tunes' }
    ]
  },

  community: {
    id: 'community',
    label: 'Community Festival & Gala',
    tagline: 'Public engagement, volunteer coordination, sponsorships & multi-stage logistics',
    badge: 'Civic & Charity',
    defaultBudget: 22000,
    defaultGuests: 450,
    categories: ['Permits & Public Safety', 'Stage & Audio/Visual', 'Food Trucks & Sanitation', 'Marketing & Signage', 'Community Workshops', 'Contingency'],
    themes: ['Eco-Sustain Green Harvest Fair', 'Art & Tech Innovation Street Showcase', 'Lantern Night Heritage Carnival', 'Local Makers & Beats Block Party'],
    promptSuggestions: [
      'Draft a volunteer shift schedule for 30 volunteers across 3 zones.',
      'What municipal permits and sound compliance checks are mandatory?',
      'How to structure a sponsor benefit tier for local businesses?',
      'Create an emergency contingency and first-aid response plan.'
    ],
    sampleTimelines: [
      { id: 'c1', phase: '8 Weeks Out', title: 'Submit City Street Closure & Sound Amplification Permits', status: 'completed', owner: 'Civic Liaison', tag: 'Regulatory', date: 'W-8' },
      { id: 'c2', phase: '5 Weeks Out', title: 'Confirm 8 Local Artisan Food Trucks & Health Licenses', status: 'in-progress', owner: 'Vendor Lead', tag: 'Concessions', date: 'W-5' },
      { id: 'c3', phase: '2 Weeks Out', title: 'Volunteer Orientation & Radio Comms Distribution', status: 'pending', owner: 'Community Director', tag: 'Staffing', date: 'W-2' },
      { id: 'c4', phase: 'Event 08:00', title: 'Site Setup: Portaloos, Generators & Trash Stations', status: 'pending', owner: 'Ops Crew', tag: 'Infra', date: '08:00 AM' },
      { id: 'c5', phase: 'Event 11:00', title: 'Gates Open: Welcome Address & Youth Orchestra', status: 'pending', owner: 'MC & Stage Crew', tag: 'Public', date: '11:00 AM' },
      { id: 'c6', phase: 'Event 16:00', title: 'Charity Auction & Community Achievement Awards', status: 'pending', owner: 'Foundation Lead', tag: 'Fundraising', date: '04:00 PM' }
    ],
    sampleBudgets: [
      { id: 'cb1', category: 'Permits & Public Safety', item: 'Traffic Marshals, EMT Station & City Permits', planned: 4500, actual: 4200, paid: true },
      { id: 'cb2', category: 'Stage & Audio/Visual', item: 'Truss Stage, Line Array Audio & Power Generators', planned: 7800, actual: 8100, paid: false },
      { id: 'cb3', category: 'Food Trucks & Sanitation', item: 'Commercial Waste Skips, Handwash Stations & Water', planned: 3200, actual: 3000, paid: true },
      { id: 'cb4', category: 'Marketing & Signage', item: 'Banners, Wayfinding QR Boards, Digital Ads', planned: 2400, actual: 2100, paid: true },
      { id: 'cb5', category: 'Community Workshops', item: 'Makers Materials, Tents & Seating', planned: 2100, actual: 2200, paid: false },
      { id: 'cb6', category: 'Contingency', item: 'Rain shelters and backup diesel', planned: 2000, actual: 400, paid: false }
    ],
    sampleVendors: [
      { id: 'cv1', name: 'ProSound Live Stage Rigging', role: 'Staging & Audio Engineering', rating: 4.8, quote: '$8,100', status: 'Confirmed', contact: 'tech@prosoundrigging.net', notes: 'Delivering generator 07:00 AM' },
      { id: 'cv2', name: 'CleanCity Eco Waste Management', role: 'Site Sanitation & Recycling', rating: 4.9, quote: '$3,000', status: 'Confirmed', contact: 'green@cleancityeco.org', notes: 'Zero-waste sorting stations + 4 staff' },
      { id: 'cv3', name: 'SafeGuard Event Security', role: 'First Aid & Crowd Management', rating: 4.7, quote: '$4,200', status: 'Confirmed', contact: 'ops@safeguardsecurity.com', notes: 'Certified EMTs + 8 trained marshals' }
    ]
  }
};

// GenAI Simulation Engine & Heuristic Intelligence
export function generateAIEventConcept(eventType, theme, budget, guestCount) {
  const baseBudget = Number(budget) || 10000;
  const guests = Number(guestCount) || 80;
  const costPerGuest = Math.round(baseBudget / (guests || 1));

  let vibes = [];
  let cateringVibe = '';
  let highlightFeature = '';
  let riskAnalysis = '';

  if (eventType === 'wedding') {
    vibes = ['Bespoke Botanical', 'Quiet Luxury', 'Candlelit Intimacy', 'Editorial Aesthetic'];
    cateringVibe = 'Family-style artisanal plates with sommelier wine flights';
    highlightFeature = 'Champagne tower ceremony with choreographed cold-spark fireworks';
    riskAnalysis = 'Ensure 15% budget buffer for floral seasonal price swings and late-night transport.';
  } else if (eventType === 'birthday') {
    vibes = ['High Energy', 'Retro-Futuristic', 'Gram-Worthy', 'Sensory Immersion'];
    cateringVibe = 'Gourmet street food sliders & interactive nitro-cocktail bar';
    highlightFeature = 'Secret speakeasy curtain reveal with DJ drop and customized LED wristbands';
    riskAnalysis = 'Secure strict noise variance limits with city council if outdoor music passes 22:00.';
  } else {
    vibes = ['Inspirational', 'Hyper-Local', 'Accessible & Inclusive', 'Zero-Waste'];
    cateringVibe = 'Curated fleet of multicultural food trucks with compostable ware';
    highlightFeature = 'Collaborative live mural painting by local artists auctioning for charity';
    riskAnalysis = 'Check weather forecasts 72 hours prior; have marquee rain anchors inspected.';
  }

  return {
    conceptName: `${theme || 'Signature Horizon'} Showcase`,
    archetype: eventType,
    estimatedCostPerHead: costPerGuest,
    vibeKeywords: vibes,
    recommendedCatering: cateringVibe,
    signatureMoment: highlightFeature,
    genaiRiskAdvisory: riskAnalysis,
    aiScore: Math.floor(Math.random() * 8) + 92, // 92 - 99 AI viability score
    colorPalette: [
      { name: 'Warm Terracotta', hex: '#D97706' },
      { name: 'Midnight Obsidian', hex: '#0F172A' },
      { name: 'Brushed Champagne', hex: '#FDE68A' },
      { name: 'Sage Linen', hex: '#10B981' }
    ]
  };
}

export function generateGenAIResponse(userPrompt, activeEvent, contextData) {
  const query = userPrompt.toLowerCase();
  const eventName = activeEvent.label;
  const budget = contextData.totalBudget;
  const guests = contextData.guestCount;

  if (query.includes('budget') || query.includes('cost') || query.includes('money') || query.includes('spend')) {
    return `### 💡 GenAI Financial Optimization Engine:
For your **${eventName}** with a budget of **$${budget.toLocaleString()}** across **${guests} guests** (~$${Math.round(budget/guests)}/guest):

1. **Strategic Allocation**:
   - **40-45%** on Venue & Hospitality ($${Math.round(budget * 0.42).toLocaleString()})
   - **20-25%** on Production, Sound & Floral Architecture ($${Math.round(budget * 0.22).toLocaleString()})
   - **15%** on Visual Capture (Photography/Cinematic Reel)
   - **10%** Contingency Reserve ($${Math.round(budget * 0.10).toLocaleString()})
2. **GenAI Cost-Saving Hack**:
   - Bundle audio-visual gear through your venue rather than third-party transport to save ~12-18%.
   - Consider signature welcome cocktails rather than full top-shelf open bars during dinner service.`;
  }

  if (query.includes('timeline') || query.includes('schedule') || query.includes('time') || query.includes('run of show')) {
    return `### ⏱️ GenAI Chrono-Synthesis (Run of Show Strategy):
Optimized flow for **${eventName}**:

- **T - 2.0 hrs**: Technical checks, lighting pre-sets, and florist handover.
- **T + 0.0 hrs**: Arrival portal opens; ambient sensory lighting and acoustic soundscape.
- **T + 1.5 hrs**: Thematic focal moment (Vows / Milestone Reveal / Opening Keynote).
- **T + 2.5 hrs**: Main culinary service paired with curated playlist.
- **T + 3.5 hrs**: Peak momentum — live performance, dance floor activation, surprise dessert cart.
- **T + 5.0 hrs**: Graceful wind-down, scheduled shuttles, and curated favor distribution.`;
  }

  if (query.includes('vendor') || query.includes('contract') || query.includes('rfp') || query.includes('photographer') || query.includes('caterer')) {
    return `### 📋 GenAI Vendor Procurement & Negotiation Advisory:
When booking suppliers for **${eventName}**:

1. **Essential Contract Clauses**:
   - **Force Majeure & Rescheduling clause**: 100% deposit transferability within 12 months.
   - **Load-in/Load-out buffers**: Specify minimum 90-minute setup window to avoid hourly penalties.
   - **Dietary & Liability Compliance**: Ensure caterers have valid allergen certifications & liability insurance minimum $2M.
2. **Draft Pitch snippet**:
   > *"Hello! We are curating our ${eventName} for ${guests} guests on [Date]. We love your aesthetic and would love to review your bespoke portfolio package with timeline milestones."*`;
  }

  if (query.includes('idea') || query.includes('theme') || query.includes('creative') || query.includes('unique')) {
    return `### ✨ GenAI Creative Horizon Ideation:
Here are 3 unique, unforgettable signatures for your **${eventName}**:

1. **Sensory Olfactory Bar**: Custom scent diffuser at the entryway tailored with bergamot and cedarwood, matching the scented guest favors.
2. **Live Digital Sketch Artist**: An iPad artist roaming to draw 90-second digital portraits that guests receive instantly via AirDrop/QR code.
3. **Interactive Audio Guestbook**: A restored vintage 1970s rotary telephone where guests pick up the receiver to record voice messages and late-night cheers.`;
  }

  return `### 🤖 GenAI Strategic Response:
Regarding *"**${userPrompt}**"* for your **${eventName}**:

- **Optimization Angle**: Balancing guest experience (rated for ${guests} people) with high operational efficiency.
- **Architect Recommendation**: Establish single-threaded vendor ownership for this milestone. Ensure deliverables have concrete SLA time stamps in your timeline checklist.
- **Next Step**: Would you like me to auto-generate a custom checklist item or add a tailored budget line for this?`;
}
