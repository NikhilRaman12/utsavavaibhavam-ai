import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please verify your API key in the Settings > Secrets panel.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // 1. Full Agentic Event Blueprint Synthesis
  app.post('/api/agent/architect', async (req, res) => {
    try {
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
      } = req.body;

      const ai = getGenAIClient();

      const prompt = `Act as a Principal Event Architect and Cultural Scenographer for UtsavaVaibhavam AI.
Design a complete, realistic, production-ready event blueprint for:
- Event Title: ${eventTitle || archetypeLabel}
- Event Archetype: ${archetypeLabel}
- Selected Theme: ${theme}
- City / Venue Region: ${city || 'Metropolitan Venue'}
- Target Date / Season: ${eventDate || 'Upcoming Season'}
- Guest Count: ${guestCount} guests
- Total Target Budget: ${currencySymbol}${Number(totalBudget).toLocaleString()} (approx ${currencySymbol}${Math.round(Number(totalBudget) / Math.max(1, Number(guestCount)))} per guest)
- Dietary / Culinary Preferences: ${dietaryNotes || 'Multi-course seasonal menu with inclusive dietary stations'}
- Cultural / Ritual / Special Requirements: ${culturalNotes || 'Signature ceremonial and experiential highlights'}
- Allowed Budget Categories: ${(categories || []).join(', ')}

Requirements:
1. Ensure the sum of "planned" amounts across the budgetItems equals approximately ${totalBudget} (within 2-5%) and uses the exact allowed categories where possible.
2. Provide 6 concrete, high-impact personalized ideas spanning Decor & Scenography, Culinary & Beverage, Cultural/Ceremonial Ritual, Interactive Guest Experience, Sustainability/Logistics, and Keepsake Favors.
3. Provide 7 chronological timeline items spanning pre-event milestones and exact Day-Of Run-of-Show timestamps, marking key visual moments with isHighImpact: true.
4. Provide 5 domain-specific vendor checklist items with realistic quotes in ${currencySymbol}, concrete deliverables, and critical SLA negotiation questions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are UtsavaVaibhavam AI, an expert event operations and cultural experience architect. Always return realistic, actionable numbers, specific culinary and scenographic details, and practical logistics.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              concept: {
                type: Type.OBJECT,
                properties: {
                  conceptName: { type: Type.STRING },
                  editorialNarrative: { type: Type.STRING },
                  spatialScenography: { type: Type.STRING },
                  recommendedCatering: { type: Type.STRING },
                  signatureMoment: { type: Type.STRING },
                  logisticsRiskAdvisory: { type: Type.STRING },
                  vibeKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  colorPalette: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        hex: { type: Type.STRING },
                        usage: { type: Type.STRING },
                      },
                      required: ['name', 'hex', 'usage'],
                    },
                  },
                },
                required: [
                  'conceptName',
                  'editorialNarrative',
                  'spatialScenography',
                  'recommendedCatering',
                  'signatureMoment',
                  'logisticsRiskAdvisory',
                  'vibeKeywords',
                  'colorPalette',
                ],
              },
              personalizedIdeas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    pillar: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    estimatedImpact: { type: Type.STRING },
                    costEstimate: { type: Type.NUMBER },
                  },
                  required: ['id', 'pillar', 'title', 'description', 'estimatedImpact', 'costEstimate'],
                },
              },
              budgetItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING },
                    item: { type: Type.STRING },
                    planned: { type: Type.NUMBER },
                    actual: { type: Type.NUMBER },
                    paid: { type: Type.BOOLEAN },
                    notes: { type: Type.STRING },
                  },
                  required: ['id', 'category', 'item', 'planned', 'actual', 'paid', 'notes'],
                },
              },
              timelineItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    phase: { type: Type.STRING },
                    date: { type: Type.STRING },
                    title: { type: Type.STRING },
                    owner: { type: Type.STRING },
                    tag: { type: Type.STRING },
                    status: { type: Type.STRING },
                    notes: { type: Type.STRING },
                    isHighImpact: { type: Type.BOOLEAN },
                    visualPresetId: {
                      type: Type.STRING,
                      description:
                        'One of: mandap-courtyard, haldi-carnival, sangeet-truss, glasshouse-atrium, champagne-tower, speakeasy-rooftop, tribute-projection, lantern-promenade',
                    },
                    lightingCue: { type: Type.STRING },
                  },
                  required: [
                    'id',
                    'phase',
                    'date',
                    'title',
                    'owner',
                    'tag',
                    'status',
                    'notes',
                    'isHighImpact',
                  ],
                },
              },
              vendorList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    quoteAmount: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    contact: { type: Type.STRING },
                    notes: { type: Type.STRING },
                    slaChecklist: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: [
                    'id',
                    'name',
                    'role',
                    'rating',
                    'quoteAmount',
                    'status',
                    'contact',
                    'notes',
                    'slaChecklist',
                  ],
                },
              },
            },
            required: ['concept', 'personalizedIdeas', 'budgetItems', 'timelineItems', 'vendorList'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/agent/architect:', error);
      res.status(500).json({
        error:
          error?.message ||
          'Failed to synthesize event blueprint with Gemini. Please check your API key in Settings > Secrets.',
      });
    }
  });

  // 2. MULTIMODAL VISION: Reverse-Engineer Any Uploaded Decor Photo, Floorplan, or Vendor Quote
  app.post('/api/agent/multimodal-vision', async (req, res) => {
    try {
      const { imageBase64, mimeType, userPrompt, eventContext } = req.body;
      const ai = getGenAIClient();

      const cleanBase64 = (imageBase64 || '').replace(/^data:[^;]+;base64,/, '');

      const parts: any[] = [];
      if (cleanBase64) {
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      parts.push({
        text: `Analyze this visual inspiration photo, stage design, or vendor quote for our upcoming event: "${eventContext?.eventTitle}" (${eventContext?.archetypeLabel}, ${eventContext?.guestCount} guests, currency: ${eventContext?.currencySymbol || '$'}).
User instruction: ${userPrompt || 'Reverse-engineer the scenography, lighting, floral/rental components, color palette, and estimated production cost so we can add it to our event plan.'}

Return a structured analysis with:
- title: Evocative name for this look or item
- pillar: Category (e.g., Ceremonial Scenography, Table & Floral, Lighting & Rigging, Culinary Theater)
- architecturalSummary: Detailed breakdown of materials, structures, florals, and spatial layout visible
- lightingAndMoodCue: Specific lighting temperature, fixture type, and atmosphere cue
- estimatedCost: Realistic production cost in ${eventContext?.currencySymbol || '$'} for ${eventContext?.guestCount || 150} guests
- costSavingHack: How to achieve 90% of this look for 30% less cost
- extractedPalette: Array of 4 dominant hex colors with names
- suggestedTimelinePhase: When to cue or install this (e.g., "Event · 18:00" or "Day 1 · 20:00")`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction:
            'You are a Multimodal Event Scenographer and Production Cost Estimator. Extract actionable production specs, hex palettes, lighting cues, and realistic costs from event images.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              pillar: { type: Type.STRING },
              architecturalSummary: { type: Type.STRING },
              lightingAndMoodCue: { type: Type.STRING },
              estimatedCost: { type: Type.NUMBER },
              costSavingHack: { type: Type.STRING },
              suggestedTimelinePhase: { type: Type.STRING },
              extractedPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                  },
                  required: ['name', 'hex'],
                },
              },
            },
            required: [
              'title',
              'pillar',
              'architecturalSummary',
              'lightingAndMoodCue',
              'estimatedCost',
              'costSavingHack',
              'suggestedTimelinePhase',
              'extractedPalette',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/agent/multimodal-vision:', error);
      res.status(500).json({
        error: error?.message || 'Failed to analyze image with Gemini Multimodal Vision.',
      });
    }
  });

  // 3. MULTIMODAL AUDIO TRANSCRIPTION: Voice Note Brief -> Structured Event Plan Updates
  app.post('/api/agent/voice-brief', async (req, res) => {
    try {
      const { audioBase64, mimeType, eventContext } = req.body;
      const ai = getGenAIClient();

      const cleanBase64 = (audioBase64 || '').replace(/^data:[^;]+;base64,/, '');
      if (!cleanBase64) {
        return res.status(400).json({ error: 'No audio data provided.' });
      }

      // Step 1: Transcribe with gemini-3.5-transcribe
      const transcriptionResponse = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: cleanBase64,
              },
            },
            {
              text: 'Transcribe this event planning voice memo accurately.',
            },
          ],
        },
      });

      const transcriptText = (transcriptionResponse.text ?? '').trim();

      // Step 2: Interpret transcript into actionable workspace updates with gemini-3.8-flash
      const planResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `The host recorded this voice memo for "${eventContext?.eventTitle}" (${eventContext?.archetypeLabel}, ${eventContext?.guestCount} guests, budget ${eventContext?.currencySymbol}${eventContext?.totalBudget}):
"${transcriptText}"

Synthesize an encouraging executive response and 1 to 3 concrete workspace actions (ADD_BUDGET_ITEM, ADD_TIMELINE_TASK, ADD_VENDOR, or ADD_IDEA) to fulfill their voice note.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transcript: { type: Type.STRING },
              replyMarkdown: { type: Type.STRING },
              proposedActions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    actionId: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    summaryLabel: { type: Type.STRING },
                    budgetItem: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        item: { type: Type.STRING },
                        planned: { type: Type.NUMBER },
                        actual: { type: Type.NUMBER },
                        notes: { type: Type.STRING },
                      },
                    },
                    timelineItem: {
                      type: Type.OBJECT,
                      properties: {
                        phase: { type: Type.STRING },
                        date: { type: Type.STRING },
                        title: { type: Type.STRING },
                        owner: { type: Type.STRING },
                        tag: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                    },
                    vendorItem: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        quoteAmount: { type: Type.NUMBER },
                        contact: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                    },
                    ideaItem: {
                      type: Type.OBJECT,
                      properties: {
                        pillar: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedImpact: { type: Type.STRING },
                        costEstimate: { type: Type.NUMBER },
                      },
                    },
                  },
                  required: ['actionId', 'actionType', 'summaryLabel'],
                },
              },
            },
            required: ['transcript', 'replyMarkdown', 'proposedActions'],
          },
        },
      });

      const parsed = JSON.parse((planResponse.text ?? '{}').trim());
      res.json({
        ...parsed,
        transcript: transcriptText || parsed.transcript,
      });
    } catch (error: any) {
      console.error('Error in /api/agent/voice-brief:', error);
      res.status(500).json({
        error: error?.message || 'Failed to transcribe and process voice brief.',
      });
    }
  });

  // 4. GENERATIVE AUDIO TTS: Spoken Emcee Announcement / Ritual Voiceover Preview
  app.post('/api/agent/tts-announce', async (req, res) => {
    try {
      const { text, style, voiceName } = req.body;
      const ai = getGenAIClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  text ||
                  'Welcome to UtsavaVaibhavam. Please take your seats as the twilight ceremony begins.',
                speechMetadata: {
                  style: style || 'Warm, poised, celebratory luxury event host and stage director',
                },
              } as any,
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName || 'Kore',
              },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        throw new Error('No audio stream returned by Gemini TTS.');
      }

      res.json({
        audioDataUrl: `data:audio/wav;base64,${base64Audio}`,
      });
    } catch (error: any) {
      console.error('Error in /api/agent/tts-announce:', error);
      res.status(500).json({
        error: error?.message || 'Failed to synthesize voice announcement.',
      });
    }
  });

  // 5. GOOGLE SEARCH GROUNDING: Real-World Venue, Weather & Local Vendor Discovery
  app.post('/api/agent/grounding-search', async (req, res) => {
    try {
      const { query, city, archetypeLabel, guestCount, currencySymbol, totalBudget } = req.body;
      const ai = getGenAIClient();

      const searchPrompt = `Find real-world event venues, top-rated local vendor categories, seasonal weather considerations, and practical pricing benchmarks in ${city || 'major metro areas'} for a ${archetypeLabel} (${guestCount} guests, target budget ${currencySymbol}${Number(totalBudget).toLocaleString()}).
Specific user query: ${query || `Best real venues, caterers, and event production tips in ${city} for ${archetypeLabel}`}.
Format clearly with bullet points, venue/vendor highlights, and practical booking tips.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const chunks =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .map((c: any) => ({
          title: c.web?.title || 'Verified Web Source',
          uri: c.web?.uri || '',
        }))
        .filter((s: any) => Boolean(s.uri));

      res.json({
        markdownReport: response.text || 'No grounded results returned.',
        sources,
      });
    } catch (error: any) {
      console.error('Error in /api/agent/grounding-search:', error);
      res.status(500).json({
        error: error?.message || 'Failed to perform Google Search Grounding discovery.',
      });
    }
  });

  // 6. Agentic Budget Optimization & Value-Engineering Rebalancer
  app.post('/api/agent/optimize-budget', async (req, res) => {
    try {
      const {
        archetypeLabel,
        theme,
        guestCount,
        totalBudget,
        currencySymbol,
        budgetItems,
        optimizationGoal,
      } = req.body;

      const ai = getGenAIClient();

      const prompt = `Analyze and optimize this event budget for a ${archetypeLabel} (${theme}) with ${guestCount} guests.
Target Total Budget Cap: ${currencySymbol}${Number(totalBudget).toLocaleString()}
Optimization Goal: ${optimizationGoal || 'Eliminate overspend, maintain guest experience quality, and ensure a 8-10% contingency reserve.'}

Current Budget Ledger:
${JSON.stringify(budgetItems, null, 2)}

Return:
1. executiveSummary: Concise diagnosis of current allocation vs target cap.
2. savingsStrategies: 4 specific, practical value-engineering tactics for this exact event.
3. rebalancedItems: Complete updated array of budget items where total planned & actual fit cleanly within ${totalBudget} while preserving existing IDs where appropriate.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a Senior Event Financial Controller. Provide realistic cost re-allocations that fit the target budget without sacrificing guest hospitality.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              projectedSavings: { type: Type.NUMBER },
              savingsStrategies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              rebalancedItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING },
                    item: { type: Type.STRING },
                    planned: { type: Type.NUMBER },
                    actual: { type: Type.NUMBER },
                    paid: { type: Type.BOOLEAN },
                    notes: { type: Type.STRING },
                  },
                  required: ['id', 'category', 'item', 'planned', 'actual', 'paid', 'notes'],
                },
              },
            },
            required: ['executiveSummary', 'projectedSavings', 'savingsStrategies', 'rebalancedItems'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/agent/optimize-budget:', error);
      res.status(500).json({
        error: error?.message || 'Failed to run Gemini budget optimization.',
      });
    }
  });

  // 7. Agentic Vendor RFP & Contract SLA Generator
  app.post('/api/agent/generate-rfp', async (req, res) => {
    try {
      const {
        vendor,
        eventTitle,
        archetypeLabel,
        theme,
        city,
        eventDate,
        guestCount,
        currencySymbol,
      } = req.body;

      const ai = getGenAIClient();

      const prompt = `Draft a professional, ready-to-send Vendor Request for Proposal (RFP) and Contract SLA Checklist for:
- Vendor Name: ${vendor.name}
- Role / Category: ${vendor.role}
- Target Quote / Budget Allocation: ${currencySymbol}${Number(vendor.quoteAmount || 0).toLocaleString()}
- Event: ${eventTitle} (${archetypeLabel} — ${theme})
- Location: ${city}
- Date: ${eventDate}
- Attendance: ${guestCount} guests
- Existing Notes: ${vendor.notes || 'Standard turnkey execution'}

Return a structured RFP document with subjectLine, emailBody (formatted clearly with sections for Scope, Load-in/Strike Window, Staffing, and Pricing Breakdown), negotiationLevers (3 specific points to negotiate), and mandatoryContractClauses (4 SLA protection clauses).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an Event Procurement & Legal SLA Specialist. Write crisp, high-leverage vendor RFP communications.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjectLine: { type: Type.STRING },
              emailBody: { type: Type.STRING },
              negotiationLevers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              mandatoryContractClauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['subjectLine', 'emailBody', 'negotiationLevers', 'mandatoryContractClauses'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/agent/generate-rfp:', error);
      res.status(500).json({
        error: error?.message || 'Failed to draft vendor RFP with Gemini.',
      });
    }
  });

  // 8. Conversational Agentic Copilot with Workspace Mutation Actions
  app.post('/api/agent/chat', async (req, res) => {
    try {
      const { userMessage, eventContext, conversationHistory } = req.body;
      const ai = getGenAIClient();

      const prompt = `User Request: "${userMessage}"

Current Live Event Workspace State:
- Event Title: ${eventContext.eventTitle}
- Archetype: ${eventContext.archetypeLabel}
- Theme: ${eventContext.theme}
- City: ${eventContext.city} | Date: ${eventContext.eventDate}
- Guests: ${eventContext.guestCount} | Target Budget: ${eventContext.currencySymbol}${eventContext.totalBudget}
- Current Total Actual Spend: ${eventContext.currencySymbol}${eventContext.totalActual}
- Dietary / Cultural Notes: ${eventContext.dietaryNotes} | ${eventContext.culturalNotes}
- Budget Categories: ${(eventContext.categories || []).join(', ')}
- Existing Budget Items (${(eventContext.budgetItems || []).length}): ${JSON.stringify(
        (eventContext.budgetItems || []).map((b: any) => ({
          category: b.category,
          item: b.item,
          planned: b.planned,
          actual: b.actual,
        }))
      )}
- Existing Timeline Milestones (${(eventContext.timelineItems || []).length}): ${JSON.stringify(
        (eventContext.timelineItems || []).map((t: any) => ({
          phase: t.phase,
          date: t.date,
          title: t.title,
          status: t.status,
        }))
      )}
- Existing Vendors (${(eventContext.vendorList || []).length}): ${JSON.stringify(
        (eventContext.vendorList || []).map((v: any) => ({
          name: v.name,
          role: v.role,
          quoteAmount: v.quoteAmount,
          status: v.status,
        }))
      )}

Recent Conversation:
${JSON.stringify((conversationHistory || []).slice(-4))}

Instructions:
1. Provide a comprehensive, deeply helpful response in "replyMarkdown" (use clean bullet points and bold labels; no code comments).
2. Whenever relevant to the user's question, propose 1 to 4 concrete workspace actions in "proposedActions" that the user can click to immediately add/update items in their Budget Ledger, Run-of-Show Timeline, Vendor Checklist, or Personalized Ideas board!
Allowed actionType values:
- "ADD_BUDGET_ITEM" (requires budgetItem payload)
- "ADD_TIMELINE_TASK" (requires timelineItem payload)
- "ADD_VENDOR" (requires vendorItem payload)
- "ADD_IDEA" (requires ideaItem payload)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are the UtsavaVaibhavam AI Agentic Event Copilot. You combine cultural richness (weddings, shaadis, birthdays, community galas) with rigorous production logistics, timelines, and budgets. Always propose concrete workspace actions alongside your advice so the user can update their plan in one click.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyMarkdown: { type: Type.STRING },
              followUpPrompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              proposedActions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    actionId: { type: Type.STRING },
                    actionType: {
                      type: Type.STRING,
                      description: 'ADD_BUDGET_ITEM, ADD_TIMELINE_TASK, ADD_VENDOR, or ADD_IDEA',
                    },
                    summaryLabel: { type: Type.STRING },
                    budgetItem: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        item: { type: Type.STRING },
                        planned: { type: Type.NUMBER },
                        actual: { type: Type.NUMBER },
                        notes: { type: Type.STRING },
                      },
                    },
                    timelineItem: {
                      type: Type.OBJECT,
                      properties: {
                        phase: { type: Type.STRING },
                        date: { type: Type.STRING },
                        title: { type: Type.STRING },
                        owner: { type: Type.STRING },
                        tag: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                    },
                    vendorItem: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        quoteAmount: { type: Type.NUMBER },
                        contact: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                    },
                    ideaItem: {
                      type: Type.OBJECT,
                      properties: {
                        pillar: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedImpact: { type: Type.STRING },
                        costEstimate: { type: Type.NUMBER },
                      },
                    },
                  },
                  required: ['actionId', 'actionType', 'summaryLabel'],
                },
              },
            },
            required: ['replyMarkdown', 'followUpPrompts', 'proposedActions'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/agent/chat:', error);
      res.status(500).json({
        error: error?.message || 'Failed to communicate with Gemini Event Copilot.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UtsavaVaibhavam AI Server listening on http://localhost:${PORT}`);
  });
}

startServer();
