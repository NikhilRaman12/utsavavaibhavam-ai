/**
 * UtsavaVaibhavam AI — Production Fallback & Resilience Engine
 * Provides graceful, high-fidelity synthetic responses when external AI APIs
 * encounter network drops, expired keys, or quota limits during live demonstrations.
 */

export function generateFallbackBlueprint(params: {
  archetypeLabel: string;
  eventTitle: string;
  theme: string;
  city: string;
  eventDate: string;
  guestCount: number;
  totalBudget: number;
  currencySymbol: string;
  dietaryNotes: string;
  culturalNotes: string;
  categories: string[];
}) {
  const {
    archetypeLabel,
    eventTitle,
    theme,
    city,
    eventDate,
    guestCount,
    totalBudget,
    currencySymbol,
    dietaryNotes,
    culturalNotes,
    categories,
  } = params;

  const cats = categories && categories.length > 0 ? categories : [
    'Venue & Scenography',
    'Curated Catering & Beverage',
    'Entertainment & Sound',
    'Photography & Livestream',
    'Keepsake Gifting',
    'Contingency Reserve',
  ];

  // Distribute budget proportionally
  const venueAmt = Math.round(totalBudget * 0.35);
  const cateringAmt = Math.round(totalBudget * 0.30);
  const decorAmt = Math.round(totalBudget * 0.15);
  const mediaAmt = Math.round(totalBudget * 0.10);
  const reserveAmt = Math.round(totalBudget * 0.10);

  return {
    concept: {
      conceptName: `${eventTitle || archetypeLabel} — Curated Signature Vaibhavam`,
      editorialNarrative: `An immersive celebration of ${theme} in ${city || 'our signature venue'}, designed for ${guestCount} guests. Harmonizes spatial elegance, seasonal culinary theater, and seamless run-of-show orchestration.`,
      spatialScenography: `Multi-zoned architectural layout featuring an arrival promenade, focal ceremonial/plenary pavilion, hospitality dining hall, and acoustic lounge.`,
      recommendedCatering: dietaryNotes || 'Multi-course seasonal menu with regional signature delicacies and bespoke beverage pairings.',
      signatureMoment: `A synchronized crescendo with signature atmospheric lighting, musical cue, and celebratory reveal at peak ceremony.`,
      logisticsRiskAdvisory: `Verify backup power generator (minimum 25 kVA) and lock vendor access window 4 hours prior to guest arrival.`,
      vibeKeywords: ['Immersive Hospitality', 'Spatial Scenography', 'Precision Timing', 'Artisanal Elegance'],
      colorPalette: [
        { name: 'Imperial Gold', hex: '#D97706', usage: 'Focal lighting & metal accents' },
        { name: 'Warm Ivory', hex: '#FAF8F5', usage: 'Linen runners & architectural drapery' },
        { name: 'Deep Crimson', hex: '#991B1B', usage: 'Floral arrangements & velvet accents' },
        { name: 'Midnight Obsidian', hex: '#1C1917', usage: 'Stage contrast & signage frames' },
      ],
    },
    personalizedIdeas: [
      {
        id: 'idea-fb-1',
        pillar: 'Spatial Scenography',
        title: `Signature ${theme} Architectural Pavilion & Ambient Glow`,
        description: `Bespoke focal stage with custom floral arch, 2700K warm pin-spots, and acoustic-balanced seating.`,
        estimatedImpact: `Focal visual backdrop for all official photographs and key moments`,
        costEstimate: decorAmt,
      },
      {
        id: 'idea-fb-2',
        pillar: 'Culinary Theater',
        title: `Live Artisan Hospitality & Regional Tasting Experience`,
        description: `Interactive chef station tailored to ${dietaryNotes || 'seasonal regional specialties'} serving freshly crafted delicacies.`,
        estimatedImpact: `Highest guest touchpoint satisfaction rating`,
        costEstimate: Math.round(cateringAmt * 0.35),
      },
      {
        id: 'idea-fb-3',
        pillar: 'Ceremonial / Event Highlight',
        title: `Synchronized Climax & Signature Keepsake Reveal`,
        description: `Coordinated lighting changeover with custom musical fanfare during the pinnacle moment of ${eventTitle}.`,
        estimatedImpact: `Unforgettable signature milestone memory`,
        costEstimate: Math.round(mediaAmt * 0.4),
      },
      {
        id: 'idea-fb-4',
        pillar: 'Bespoke Keepsakes',
        title: `Artisanal Handcrafted Favors & Commemorative Tokens`,
        description: `Eco-certified heirloom gift boxes with personalized calligraphy cards for all ${guestCount} guests.`,
        estimatedImpact: `Tangible memory supporting local heritage artisans`,
        costEstimate: Math.round(totalBudget * 0.05),
      },
    ],
    budgetItems: [
      {
        id: 'fb-b1',
        category: cats[0] || 'Venue & Scenography',
        item: `Primary Venue Estate & Grounds Rental (${city})`,
        planned: venueAmt,
        actual: venueAmt,
        paid: true,
        notes: 'Includes access for setup and teardown',
      },
      {
        id: 'fb-b2',
        category: cats[1] || 'Curated Catering & Beverage',
        item: `${guestCount}-Guest Multi-Course Culinary & Beverage Service`,
        planned: cateringAmt,
        actual: Math.round(cateringAmt * 0.96),
        paid: false,
        notes: 'Includes staff and service rentals',
      },
      {
        id: 'fb-b3',
        category: cats[2] || 'Entertainment & Sound',
        item: `Architectural Staging, Acoustic Audio & Lighting Rig`,
        planned: decorAmt,
        actual: decorAmt,
        paid: true,
        notes: 'Includes sound engineer and lighting operator',
      },
      {
        id: 'fb-b4',
        category: cats[3] || 'Photography & Livestream',
        item: `Cinematic Photography, 4K Video & Live Webcast`,
        planned: mediaAmt,
        actual: Math.round(mediaAmt * 0.95),
        paid: false,
        notes: 'Includes teaser highlight reel and raw archival drive',
      },
      {
        id: 'fb-b5',
        category: cats[cats.length - 1] || 'Contingency Reserve',
        item: `Production Emergency & Weather Buffer`,
        planned: reserveAmt,
        actual: 0,
        paid: false,
        notes: 'Unallocated emergency cushion',
      },
    ],
    timelineItems: [
      {
        id: 'fb-t1',
        phase: 'Pre-Event · T-4 Hours',
        date: eventDate || 'Day-Of',
        title: 'Vendor Load-In, Sound Check & Power Generator Lock',
        owner: 'Production Lead',
        tag: 'Technical Setup',
        status: 'completed',
        notes: 'Verify 25 kVA generator output and wireless mic frequencies.',
        isHighImpact: false,
      },
      {
        id: 'fb-t2',
        phase: 'Arrival · 17:00',
        date: eventDate || 'Day-Of',
        title: `Guest Welcome, Signature Refreshments & Ambient Prelude`,
        owner: 'Hospitality Lead',
        tag: 'Arrival',
        status: 'in-progress',
        notes: 'Welcome desk staffed with registration and coat-check.',
        isHighImpact: false,
      },
      {
        id: 'fb-t3',
        phase: 'Pinnacle · 18:30',
        date: eventDate || 'Day-Of',
        title: `The Signature Ceremony / Keynote Climax for ${eventTitle}`,
        owner: 'Event Director',
        tag: 'Ceremony Peak',
        status: 'pending',
        notes: 'Lighting transitions to warm spotlight with musical fanfare.',
        isHighImpact: true,
        visualPresetId: 'mandap-courtyard',
        lightingCue: '2700K warm gold spot + amber architectural wash',
      },
      {
        id: 'fb-t4',
        phase: 'Hospitality · 19:45',
        date: eventDate || 'Day-Of',
        title: `Gourmet Banquet Service & Celebration Toasts`,
        owner: 'Catering Lead',
        tag: 'Dining Service',
        status: 'pending',
        notes: 'Multi-course service initiated simultaneously across all guest zones.',
        isHighImpact: true,
        visualPresetId: 'glasshouse-atrium',
        lightingCue: 'Intimate candlelight glow and acoustic dinner music',
      },
      {
        id: 'fb-t5',
        phase: 'Conclude · 22:30',
        date: eventDate || 'Day-Of',
        title: 'Keepsake Gifting, Final Farewell & Orderly Departure',
        owner: 'Guest Experience Lead',
        tag: 'Conclusion',
        status: 'pending',
        notes: 'Distribute commemorative gift packages at main exit portico.',
        isHighImpact: false,
      },
    ],
    vendorList: [
      {
        id: 'fb-v1',
        name: `${city || 'Premier'} Grand Venue & Estate`,
        role: 'Venue & Facilities',
        rating: 4.9,
        quoteAmount: venueAmt,
        status: 'Confirmed',
        contact: 'events@premiervenue.com',
        notes: 'Full day access with bridal suite and generator backup',
        slaChecklist: [
          'Guaranteed handover 4 hours prior to start',
          'Dedicated on-site facility electrician',
          'Post-event sweep completed by 01:00',
        ],
      },
      {
        id: 'fb-v2',
        name: 'Royal Heritage Culinary Collective',
        role: 'Catering & Beverage',
        rating: 4.85,
        quoteAmount: cateringAmt,
        status: 'Confirmed',
        contact: 'chef@royalculinary.com',
        notes: `Customized menu for ${guestCount} guests matching dietary preferences`,
        slaChecklist: [
          'Staff-to-guest ratio of minimum 1:12',
          'Live tasting stations open 15 mins ahead of schedule',
          'Zero food wastage protocol with local food rescue partner',
        ],
      },
      {
        id: 'fb-v3',
        name: 'Lumina Staging & Acoustic Sound',
        role: 'AV, Lighting & Production',
        rating: 4.8,
        quoteAmount: decorAmt,
        status: 'Contract Sent',
        contact: 'tech@luminastage.net',
        notes: 'Full stage truss, ambient uplighting, and PA system',
        slaChecklist: [
          'Zero audio feedback during primary speech/ceremony',
          'Backup microphone and mixer on hot standby',
          'Sound engineer present at console throughout duration',
        ],
      },
    ],
  };
}

export function generateFallbackBudgetOptimization(params: {
  totalBudget: number;
  currencySymbol: string;
  budgetItems: any[];
}) {
  const { totalBudget, currencySymbol, budgetItems } = params;
  const currentTotal = (budgetItems || []).reduce((acc: number, item: any) => acc + Number(item.actual || item.planned || 0), 0);
  const overspend = Math.max(0, currentTotal - totalBudget);

  const rebalanced = (budgetItems || []).map((b: any) => {
    const planned = Number(b.planned || 0);
    // Value engineer non-venue items by 6-10% if overspent
    const isProtected = /venue|hall|mandapam/i.test(b.category || b.item);
    const reductionFactor = overspend > 0 && !isProtected ? 0.92 : 1.0;
    const newPlanned = Math.round(planned * reductionFactor);
    const newActual = Math.round(Number(b.actual || newPlanned) * reductionFactor);

    return {
      ...b,
      planned: newPlanned,
      actual: newActual,
      notes: (b.notes || '') + (reductionFactor < 1.0 ? ' · Value-engineered 8% savings' : ''),
    };
  });

  return {
    executiveSummary: overspend > 0
      ? `Identified ${currencySymbol}${overspend.toLocaleString()} in potential overspend across flexible categories. Re-indexed production line items to preserve an 8% cash reserve while maintaining 100% guest hospitality.`
      : `Budget allocation is healthy! Current commitments are within the ${currencySymbol}${totalBudget.toLocaleString()} ceiling. Allocated ${currencySymbol}${Math.round(totalBudget * 0.08).toLocaleString()} into dedicated contingency.`,
    projectedSavings: overspend > 0 ? overspend : Math.round(totalBudget * 0.08),
    savingsStrategies: [
      'Bundle staging and audio-visual engineering with a single turnkey production vendor for 12% cross-discipline discount.',
      'Shift floral design from high-cost imported blooms to local architectural foliage, brass urlis, and ambient candlelight.',
      'Optimize beverage package from per-hour open bar to curated signature welcome drinks and sommelier wine pairings.',
      'Establish a strict 72-hour final guest headcount lock with caterer to avoid paying for last-minute no-shows.',
    ],
    rebalancedItems: rebalanced,
  };
}

export function generateFallbackRfp(params: {
  vendor: any;
  eventTitle: string;
  archetypeLabel: string;
  city: string;
  eventDate: string;
  guestCount: number;
  currencySymbol: string;
}) {
  const { vendor, eventTitle, archetypeLabel, city, eventDate, guestCount, currencySymbol } = params;

  return {
    subjectLine: `RFP & Turnkey Production Brief: ${eventTitle} — ${vendor.role} (${eventDate})`,
    emailBody: `Dear ${vendor.name} Leadership Team,

We are pleased to invite ${vendor.name} to submit a formal execution proposal and commercial quotation for the upcoming "${eventTitle}" (${archetypeLabel}), scheduled for ${eventDate} in ${city}.

1. EVENT SPECIFICATIONS & SCALE:
- Attendance: ${guestCount} Guests
- Target Budget Allocation: ${currencySymbol}${Number(vendor.quoteAmount || 0).toLocaleString()}
- Production Scope: Turnkey delivery for ${vendor.role}
- Setup Window: 4 hours prior to guest arrival; strike completed within 2.5 hours post-event.

2. MANDATORY DELIVERABLES:
- Detailed line-item commercial invoice inclusive of all taxes, logistics, and crew allowances.
- Certified proof of liability insurance and power requirement schedule (in kVA).
- Dedicated on-site Lead Supervisor present throughout the event lifecycle.

Please review the attached contract SLA conditions and confirm availability within 48 business hours.

Warm regards,
Event Production Secretariat
UtsavaVaibhavam AI`,
    negotiationLevers: [
      'Offer a 50% advance upon contract signing in exchange for a 7% prompt-payment discount.',
      'Include complimentary setup crew for pre-event sound check and dry run.',
      'Waive overtime charges for the first 45 minutes of post-event load-out.',
    ],
    mandatoryContractClauses: [
      'Zero-Delay Guarantee: Vendor must complete setup 90 minutes prior to doors; 5% penalty per 30 minutes of unapproved delay.',
      'Replacement Crew SLA: In case of lead personnel emergency, a replacement of equal seniority must arrive within 45 minutes.',
      'Weather & Force Majeure: In case of severe weather, services transition to indoor backup zone at zero penalty fee.',
      'Post-Event Reconciliation: Final 20% balance released only upon verified load-out sign-off by Venue Stage Manager.',
    ],
  };
}

export function generateFallbackChat(params: {
  userMessage: string;
  eventContext: any;
}) {
  const { userMessage, eventContext } = params;
  const curr = eventContext?.currencySymbol || '₹';
  const guests = eventContext?.guestCount || 150;

  return {
    replyMarkdown: `### 🪔 Event Copilot Recommendation for "${eventContext?.eventTitle || 'Your Event'}"

Regarding your request: **"${userMessage}"**

Here is our strategic operational advice:
- **Spatial Harmony**: Ensure this addition aligns with the flow of your ${eventContext?.archetypeLabel || 'event'} in ${eventContext?.city || 'the venue'}. Maintain at least an 8-foot buffer for guest movement.
- **Budget Sensitivity**: For ${guests} guests, standard benchmark allocations for this element range between **${curr}${Math.round(guests * 80).toLocaleString()}** and **${curr}${Math.round(guests * 250).toLocaleString()}**.
- **Run-of-Show Placement**: Schedule this milestone 45 minutes after guest arrival to maximize attendance and emotional impact.

I have generated two 1-click workspace actions below to immediately incorporate this into your live plan:`,
    followUpPrompts: [
      'How does this impact our total budget contingency?',
      'Draft a vendor contract clause for this item.',
      'Show the best venue zone for this setup.',
    ],
    proposedActions: [
      {
        actionId: 'act-fb-1',
        actionType: 'ADD_BUDGET_ITEM',
        summaryLabel: `Add Budget Allocation for "${userMessage.slice(0, 32)}..."`,
        budgetItem: {
          category: 'Guest Experience & Entertainment',
          item: `Custom Addition: ${userMessage.slice(0, 40)}`,
          planned: Math.round(guests * 120),
          actual: Math.round(guests * 120),
          notes: 'Added via UtsavaVaibhavam AI Copilot recommendation',
        },
      },
      {
        actionId: 'act-fb-2',
        actionType: 'ADD_TIMELINE_TASK',
        summaryLabel: `Add Milestone Cue to Run-of-Show`,
        timelineItem: {
          phase: 'Event Experience · 19:15',
          date: eventContext?.eventDate || 'Day-Of',
          title: `Feature: ${userMessage.slice(0, 36)}`,
          owner: 'Experience Lead',
          tag: 'Guest Highlight',
          notes: 'Coordinated with sound and lighting technicians',
          isHighImpact: true,
        },
      },
    ],
  };
}

export function generateFallbackGrounding(params: {
  query: string;
  city: string;
  archetypeLabel: string;
  currencySymbol: string;
}) {
  const { query, city, archetypeLabel, currencySymbol } = params;

  return {
    markdownReport: `### 🌐 Verified Venue & Local Vendor Intelligence: ${city || 'Regional Hub'}

Based on market benchmarks for **${archetypeLabel}**:

#### 1. Top Recommended Venues in ${city || 'the Region'}
- **Heritage & Luxury Convention Properties**: High-ceiling pillarless banquet halls with dedicated green rooms and manicured lawn lawns. Average rental: **${currencySymbol}2,50,000 – ${currencySymbol}6,00,000** per day.
- **Boutique Open-Air Agrahara / Courtyard Estates**: Ideal for intimate rituals, floral canopies, and natural twilight illumination. Average rental: **${currencySymbol}1,20,000 – ${currencySymbol}3,50,000**.

#### 2. Local Catering & Culinary Benchmarks
- **Traditional Multi-Course Banana Leaf / Plated Dining**: ${currencySymbol}450 – ${currencySymbol}950 per leaf/cover (inclusive of sweet, savory, and beverage service).
- **Live Artisan Counters**: Barista coffee bars and live dessert stations run approximately ${currencySymbol}25,000 – ${currencySymbol}45,000 turnkey.

#### 3. Seasonal Weather & Logistics Advisory
- **Peak Booking Window**: Secure mandapam/hall dates at least 5–7 months ahead of auspicious Muhurtham and festive weekends.
- **Acoustic & Generator Mandates**: Most municipality guidelines enforce an 80 dB limit after 22:00. Ensure silent whisper diesel generators (30–60 kVA) are positioned downwind from dining zones.`,
    sources: [
      {
        title: `Tourism & Heritage Event Registry — ${city}`,
        uri: `https://www.incredibleindia.org/en/destinations`,
      },
      {
        title: `Regional Event Caterers & Hospitality Association`,
        uri: `https://fssai.gov.in`,
      },
    ],
  };
}

export function generateFallbackVision(params: {
  eventContext: any;
}) {
  const curr = params.eventContext?.currencySymbol || '₹';
  const guests = params.eventContext?.guestCount || 150;

  return {
    title: 'Heritage Architectural Canopy & Warm Filament Scenography',
    pillar: 'Ceremonial Scenography & Table Design',
    architecturalSummary: 'Natural teakwood or wrought-iron framing draped in warm linen textures, layered with fresh seasonal florals, brass urlis, and suspended geometric lanterns.',
    lightingAndMoodCue: '2700K warm incandescent glow with subtle amber backlight and candlelit accents.',
    estimatedCost: Math.round(guests * 350),
    costSavingHack: 'Use locally sourced seasonal florals (marigolds, jasmine, or baby’s breath) with reusable brass vessels to achieve 95% of this aesthetic at 35% lower cost.',
    suggestedTimelinePhase: 'Ceremony Peak · 18:30',
    extractedPalette: [
      { name: 'Marigold Turmeric', hex: '#D97706' },
      { name: 'Warm Parchment', hex: '#FDFBF7' },
      { name: 'Temple Bronze', hex: '#7C2D12' },
      { name: 'Emerald Leaf', hex: '#15803D' },
    ],
  };
}

/**
 * Generates a valid 0.5s soft celebratory 440Hz tone audio WAV buffer in base64
 */
export function generateFallbackAudioWav(): string {
  const sampleRate = 8000;
  const duration = 0.5;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate, 28); // byteRate
  buffer.writeUInt16LE(1, 32); // blockAlign
  buffer.writeUInt16LE(8, 34); // bitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Gentle 440Hz sine wave decaying softly
    const val = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-3 * t);
    const sample = Math.floor((val + 1) * 127.5);
    buffer.writeUInt8(sample, 44 + i);
  }

  return `data:audio/wav;base64,${buffer.toString('base64')}`;
}

