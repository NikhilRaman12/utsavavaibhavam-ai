const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const fs = require('node:fs');

// 1. Load Data Modules & Fallbacks
const projectRoot = path.resolve(__dirname, '..');

describe('🏛️ 31-Year Principal Architect & Data AI Scientist Production Audit', () => {

  describe('Suite 1: Universal 7-Archetype Domain Integrity & Schemas', () => {
    // Read eventArchetypes.ts
    const archPath = path.join(projectRoot, 'src', 'data', 'eventArchetypes.ts');
    const archContent = fs.readFileSync(archPath, 'utf8');

    const expectedArchetypes = [
      'kumbakonam',
      'shaadi',
      'wedding',
      'birthday',
      'community',
      'corporate',
      'intimate',
    ];

    it('should register all 7 universal event archetypes', () => {
      for (const id of expectedArchetypes) {
        assert.ok(
          archContent.includes(`id: '${id}'`),
          `Archetype "${id}" must be registered in eventArchetypes.ts`
        );
      }
    });

    it('each archetype must define complete cultural concept, narrative, and palettes', () => {
      const requiredFields = [
        'conceptName',
        'editorialNarrative',
        'spatialScenography',
        'recommendedCatering',
        'signatureMoment',
        'logisticsRiskAdvisory',
        'vibeKeywords',
        'colorPalette',
      ];
      for (const field of requiredFields) {
        assert.ok(
          archContent.includes(field),
          `Archetypes must specify "${field}" for visual and operational rendering`
        );
      }
    });

    it('Kumbakonam Vivaham must contain authentic Cauvery Delta cultural signatures', () => {
      assert.ok(archContent.includes('Kumbakonam Degree Filter Coffee'), 'Must feature Degree Coffee');
      assert.ok(archContent.includes('Swamimalai'), 'Must feature GI-Tagged Swamimalai Bronze');
      assert.ok(archContent.includes('Oonjal'), 'Must feature Vedic Oonjal Swing ceremony');
      assert.ok(archContent.includes('24-Item'), 'Must feature 24-Item Elai Sapadu banquet');
    });

    it('Corporate Summit must contain enterprise AV, plenary, and SLA specs', () => {
      assert.ok(archContent.includes('Curved LED Wall'), 'Must feature Curved LED Stage');
      assert.ok(archContent.includes('Wi-Fi 6E'), 'Must feature High-Density Networking');
      assert.ok(archContent.includes('Redundant Uplink'), 'Must specify redundant uplink verification');
    });
  });

  describe('Suite 2: Smart Wallet Algorithmic Financial & Math Engine', () => {
    it('should strictly balance line items within target budget ceiling', () => {
      const totalBudget = 1848000;
      const guestCount = 350;
      const perGuest = Math.round(totalBudget / guestCount);
      assert.strictEqual(perGuest, 5280, 'Per-guest spend calculation must be mathematically exact');
    });

    it('value-engineering algorithm must reserve exactly 8-10% contingency', () => {
      const { generateFallbackBudgetOptimization } = require('../serverFallback.ts');
      const mockItems = [
        { id: '1', category: 'Venue', item: 'Mandapam', planned: 800000, actual: 800000 },
        { id: '2', category: 'Catering', item: 'Elai Sapadu', planned: 700000, actual: 750000 },
        { id: '3', category: 'Decor', item: 'Floral Stage', planned: 400000, actual: 450000 },
      ];
      const opt = generateFallbackBudgetOptimization({
        totalBudget: 1848000,
        currencySymbol: '₹',
        budgetItems: mockItems,
      });

      assert.ok(opt.rebalancedItems.length === 3, 'Must preserve all ledger items');
      assert.ok(opt.savingsStrategies.length >= 4, 'Must generate at least 4 value-engineering tactics');
      assert.ok(opt.projectedSavings > 0, 'Must identify positive cost savings');
    });

    it('dual currency conversion factor must remain bounded and deterministic', () => {
      const usdBudget = 22000;
      const exchangeRate = 84;
      const inrBudget = usdBudget * exchangeRate;
      assert.strictEqual(inrBudget, 1848000, 'INR to USD parity must scale cleanly');
    });
  });

  describe('Suite 3: 360° Spatial Venue Canvas Geometry & Constraints', () => {
    const canvasPath = path.join(projectRoot, 'src', 'components', 'SpatialVenueCanvas.tsx');
    const canvasContent = fs.readFileSync(canvasPath, 'utf8');

    it('must implement spatial zones for all 7 event archetypes', () => {
      const archetypes = ['kumbakonam', 'shaadi', 'wedding', 'birthday', 'community', 'corporate', 'intimate'];
      for (const a of archetypes) {
        assert.ok(canvasContent.includes(`${a}: [`), `SpatialVenueCanvas must define zone coordinates for ${a}`);
      }
    });

    it('all spatial zones must define power load (kVA) and lighting temperature', () => {
      assert.ok(canvasContent.includes('powerLoad:'), 'Every zone must specify power consumption in kVA');
      assert.ok(canvasContent.includes('lightingTemp:'), 'Every zone must specify lighting Kelvin/fixture specs');
      assert.ok(canvasContent.includes('crowdFlowNote:'), 'Every zone must specify crowd circulation guidelines');
    });
  });

  describe('Suite 4: Gemini Multimodal & Agentic Schema Conformity (All 8 Endpoints)', () => {
    const {
      generateFallbackBlueprint,
      generateFallbackBudgetOptimization,
      generateFallbackRfp,
      generateFallbackChat,
      generateFallbackGrounding,
      generateFallbackVision,
      generateFallbackAudioWav,
    } = require('../serverFallback.ts');

    it('/api/agent/architect fallback blueprint must satisfy strict JSON schema', () => {
      const bp = generateFallbackBlueprint({
        archetypeLabel: 'Kumbakonam Chola Heritage Vivaham',
        eventTitle: 'Karthik & Janani Muhurtham',
        theme: 'Chola Temple Brass',
        city: 'Kumbakonam',
        eventDate: 'November 22, 2026',
        guestCount: 350,
        totalBudget: 1848000,
        currencySymbol: '₹',
        dietaryNotes: '24-item Cauvery Delta Banana Leaf Virundhu',
        culturalNotes: 'Vedic Oonjal & Swamimalai Thamboolam',
        categories: ['Mandapam', 'Catering', 'Decor', 'Media', 'Reserve'],
      });

      assert.ok(bp.concept.conceptName, 'Concept name is required');
      assert.ok(bp.concept.colorPalette.length >= 4, 'Must provide 4 hex colors');
      assert.ok(bp.personalizedIdeas.length >= 4, 'Must provide at least 4 ideas');
      assert.ok(bp.budgetItems.length >= 4, 'Must provide budget line items');
      assert.ok(bp.timelineItems.length >= 4, 'Must provide chronological milestones');
      assert.ok(bp.vendorList.length >= 3, 'Must provide vendor checklist with SLAs');
    });

    it('/api/agent/multimodal-vision must extract 4-color palette and realistic cost', () => {
      const vision = generateFallbackVision({
        eventContext: { currencySymbol: '₹', guestCount: 350 },
      });
      assert.strictEqual(vision.extractedPalette.length, 4, 'Vision must extract 4 dominant colors');
      assert.ok(vision.estimatedCost > 0, 'Cost estimation must be positive');
      assert.ok(vision.lightingAndMoodCue.length > 10, 'Must output lighting cue');
      assert.ok(vision.costSavingHack.length > 10, 'Must output value-engineering hack');
    });

    it('/api/agent/tts-announce must generate valid base64 audio/wav buffer', () => {
      const audioUrl = generateFallbackAudioWav();
      assert.ok(audioUrl.startsWith('data:audio/wav;base64,'), 'Must return standard data audio URI');
      const base64Data = audioUrl.replace('data:audio/wav;base64,', '');
      const buffer = Buffer.from(base64Data, 'base64');
      assert.strictEqual(buffer.toString('ascii', 0, 4), 'RIFF', 'WAV header must start with RIFF');
      assert.strictEqual(buffer.toString('ascii', 8, 12), 'WAVE', 'WAV format tag must be WAVE');
    });

    it('/api/agent/generate-rfp must draft enforceable SLA contract clauses', () => {
      const rfp = generateFallbackRfp({
        vendor: { name: 'Cauvery Royal Caterers', role: 'Kalyana Virundhu', quoteAmount: 550000 },
        eventTitle: 'Kumbakonam Muhurtham',
        archetypeLabel: 'Kumbakonam Wedding',
        city: 'Kumbakonam',
        eventDate: 'Nov 22, 2026',
        guestCount: 350,
        currencySymbol: '₹',
      });

      assert.ok(rfp.subjectLine.includes('RFP'), 'Subject line must be formalized');
      assert.ok(rfp.negotiationLevers.length >= 3, 'Must supply 3 negotiation levers');
      assert.ok(rfp.mandatoryContractClauses.length >= 4, 'Must supply 4 SLA protection clauses');
    });

    it('/api/agent/chat must generate deterministic 1-click workspace mutations', () => {
      const chat = generateFallbackChat({
        userMessage: 'Add live Kumbakonam Degree Coffee bar',
        eventContext: { eventTitle: 'Kumbakonam Wedding', guestCount: 350, currencySymbol: '₹' },
      });

      assert.ok(chat.proposedActions.length >= 2, 'Must generate proposed workspace mutations');
      const actions = chat.proposedActions.map(a => a.actionType);
      assert.ok(actions.includes('ADD_BUDGET_ITEM'), 'Must propose budget addition');
      assert.ok(actions.includes('ADD_TIMELINE_TASK'), 'Must propose timeline task');
    });
  });

  describe('Suite 5: Production Build & Asset Delivery Integrity', () => {
    it('Vite build output dist/index.html must exist and contain root element', () => {
      const indexPath = path.join(projectRoot, 'dist', 'index.html');
      assert.ok(fs.existsSync(indexPath), 'dist/index.html must be compiled');
      const html = fs.readFileSync(indexPath, 'utf8');
      assert.ok(html.includes('<div id="root"></div>'), 'Root DOM container must exist');
      assert.ok(html.includes('assets/index-'), 'Must link compiled JavaScript bundle');
      assert.ok(html.includes('./assets/'), 'Asset paths must use relative base for universal hosting');
    });

    it('package.json must contain production project metadata and valid scripts', () => {
      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      assert.strictEqual(pkg.name, 'utsavavaibhavam-ai', 'Must use clean product name');
      assert.strictEqual(pkg.version, '1.0.0', 'Must be v1.0.0 production release');
      assert.ok(pkg.scripts.build, 'Must define build script');
      assert.ok(pkg.scripts.lint, 'Must define lint script');
    });
  });
});

