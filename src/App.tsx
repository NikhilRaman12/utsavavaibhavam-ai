import React, { useState, useMemo, useRef } from 'react';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  FileText,
  Send,
  Copy,
  Check,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  Upload,
  Eye,
  X,
  Star,
  Mic,
  Square,
  Volume2,
  Camera,
  Globe,
  Play,
  Heart,
  Compass,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { EVENT_ARCHETYPES } from './data/eventArchetypes';
import {
  SCENOGRAPHY_PRESETS,
  ScenographyArtwork,
} from './components/ScenographyArtwork';
import { SpatialVenueCanvas } from './components/SpatialVenueCanvas';
import { PdfExportModal } from './components/PdfExportModal';
import {
  BudgetItem,
  ChatMessage,
  EventArchetypeId,
  EventConcept,
  PersonalizedIdea,
  ProposedAgentAction,
  RfpDraft,
  TimelineItem,
  TimelineVisualReference,
  VendorItem,
} from './types/event';

type WorkspaceTab = 'feed' | 'timeline' | 'spatial' | 'budget' | 'vendors';
type CurrencyCode = 'USD' | 'INR';

interface VisionAnalysisResult {
  title: string;
  pillar: string;
  architecturalSummary: string;
  lightingAndMoodCue: string;
  estimatedCost: number;
  costSavingHack: string;
  suggestedTimelinePhase: string;
  extractedPalette: Array<{ name: string; hex: string }>;
  uploadedImageUrl?: string;
}

const INITIAL_INR_MULT = 84;

export default function App() {
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<EventArchetypeId>('kumbakonam');
  const activeArchetype = EVENT_ARCHETYPES[selectedArchetypeId];

  // Event Core Configuration State (Defaulting to Kumbakonam Wedding Plan in INR)
  const [eventTitle, setEventTitle] = useState<string>(activeArchetype.defaultTitle);
  const [city, setCity] = useState<string>(activeArchetype.defaultCity);
  const [eventDate, setEventDate] = useState<string>(activeArchetype.defaultDate);
  const [guestCount, setGuestCount] = useState<number>(activeArchetype.defaultGuests);
  const [budget, setBudget] = useState<number>(
    Math.round(activeArchetype.defaultBudget * INITIAL_INR_MULT)
  );
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [theme, setTheme] = useState<string>(activeArchetype.themes[0]);
  const [dietaryNotes, setDietaryNotes] = useState<string>(activeArchetype.defaultDietaryNotes);
  const [culturalNotes, setCulturalNotes] = useState<string>(activeArchetype.defaultCulturalNotes);
  const [isBriefDrawerOpen, setIsBriefDrawerOpen] = useState<boolean>(false);

  // Hero Visual Scenography State
  const [heroPresetId, setHeroPresetId] = useState<string>(activeArchetype.heroVisualPresetId);
  const [heroCustomImageUrl, setHeroCustomImageUrl] = useState<string>('');
  const [heroCaption, setHeroCaption] = useState<string>(activeArchetype.heroVisualCaption);

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('feed');

  // Live Event Data Collections (Scaled to INR on initial load)
  const [aiConcept, setAiConcept] = useState<EventConcept>(activeArchetype.defaultConcept);
  const [personalizedIdeas, setPersonalizedIdeas] = useState<PersonalizedIdea[]>(() =>
    activeArchetype.sampleIdeas.map((idea) => ({
      ...idea,
      costEstimate: Math.round(idea.costEstimate * INITIAL_INR_MULT),
    }))
  );
  const [likedIdeaIds, setLikedIdeaIds] = useState<Record<string, boolean>>({});
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() =>
    activeArchetype.sampleBudgets.map((item) => ({
      ...item,
      planned: Math.round(item.planned * INITIAL_INR_MULT),
      actual: Math.round(item.actual * INITIAL_INR_MULT),
    }))
  );
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(
    activeArchetype.sampleTimelines
  );
  const [vendorList, setVendorList] = useState<VendorItem[]>(() =>
    activeArchetype.sampleVendors.map((v) => ({
      ...v,
      quoteAmount: Math.round(v.quoteAmount * INITIAL_INR_MULT),
    }))
  );

  // Instagram-Style Story Reel Player State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Server-Side Gemini Loading & Error States
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisBanner, setSynthesisBanner] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Multimodal Vision Scanner State
  const [isVisionModalOpen, setIsVisionModalOpen] = useState<boolean>(false);
  const [visionImagePreview, setVisionImagePreview] = useState<string>('');
  const [visionMimeType, setVisionMimeType] = useState<string>('image/jpeg');
  const [visionPrompt, setVisionPrompt] = useState<string>('');
  const [isAnalyzingVision, setIsAnalyzingVision] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);

  // Multimodal Voice Note Recording State (gemini-3.5-transcribe)
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [isTranscribingVoice, setIsTranscribingVoice] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Generative TTS Audio Emcee State (gemini-3.8-flash-lite-tts)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Google Search Grounding Discovery State
  const [groundingQuery, setGroundingQuery] = useState<string>('');
  const [isSearchingGrounding, setIsSearchingGrounding] = useState<boolean>(false);
  const [groundingResult, setGroundingResult] = useState<{
    markdownReport: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  // Timeline View & Visual Attachment Studio State
  const [timelineFilter, setTimelineFilter] = useState<
    'ALL' | 'HIGH_IMPACT' | 'pending' | 'in-progress' | 'completed'
  >('ALL');
  const [newTaskPhase, setNewTaskPhase] = useState<string>('Day 1 · 19:00');
  const [newTaskDate, setNewTaskDate] = useState<string>('07:00 PM');
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskOwner, setNewTaskOwner] = useState<string>('Stage Manager');
  const [newTaskTag, setNewTaskTag] = useState<string>('Ceremony');
  const [newTaskPresetId, setNewTaskPresetId] = useState<string>('mandap-courtyard');

  // Visual Reference Editor Modal State
  const [editingTimelineVisualItem, setEditingTimelineVisualItem] =
    useState<TimelineItem | null>(null);
  const [visualDraftPresetId, setVisualDraftPresetId] = useState<string>('mandap-courtyard');
  const [visualDraftImageUrl, setVisualDraftImageUrl] = useState<string>('');
  const [visualDraftTitle, setVisualDraftTitle] = useState<string>('');
  const [visualDraftCaption, setVisualDraftCaption] = useState<string>('');
  const [visualDraftLightingCue, setVisualDraftLightingCue] = useState<string>('');

  // Fullscreen Lightbox Modal
  const [lightboxItem, setLightboxItem] = useState<{
    title: string;
    phase: string;
    visual: TimelineVisualReference;
  } | null>(null);

  // Budget View Filters & Optimization State
  const [budgetCategoryFilter, setBudgetCategoryFilter] = useState<string>('ALL');
  const [budgetSearch, setBudgetSearch] = useState<string>('');
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemPlanned, setNewItemPlanned] = useState<string>('');
  const [newItemActual, setNewItemActual] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>(activeArchetype.categories[0]);
  const [isOptimizingBudget, setIsOptimizingBudget] = useState<boolean>(false);
  const [budgetOptimizationResult, setBudgetOptimizationResult] = useState<{
    executiveSummary: string;
    projectedSavings: number;
    savingsStrategies: string[];
    rebalancedItems: BudgetItem[];
  } | null>(null);

  // Vendor View & RFP Draft State
  const [vendorStatusFilter, setVendorStatusFilter] = useState<string>('ALL');
  const [newVendorName, setNewVendorName] = useState<string>('');
  const [newVendorRole, setNewVendorRole] = useState<string>('');
  const [newVendorQuote, setNewVendorQuote] = useState<string>('');
  const [newVendorNotes, setNewVendorNotes] = useState<string>('');
  const [generatingRfpVendorId, setGeneratingRfpVendorId] = useState<string | null>(null);
  const [activeRfpDraft, setActiveRfpDraft] = useState<RfpDraft | null>(null);
  const [copiedRfp, setCopiedRfp] = useState<boolean>(false);

  // Formatted PDF Report Studio Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Agentic Copilot Drawer & Omni-Bar State
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      timestamp: 'Ready',
      text: `Welcome to **UtsavaVaibhavam AI**. Use the Multimodal Omni-Bar below to speak a voice memo, scan any decor photo with Gemini Vision, or ask me to orchestrate your **${activeArchetype.defaultTitle}**.`,
      followUpPrompts: activeArchetype.promptSuggestions,
      proposedActions: [],
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const formatMoney = (amount: number) => {
    const val = Math.round(Number(amount) || 0);
    return `${currencySymbol}${val.toLocaleString()}`;
  };

  // Switch between USD and INR
  const handleCurrencySwitch = (target: CurrencyCode) => {
    if (target === currency) return;
    const factor = target === 'INR' ? 84 : 1 / 84;
    setCurrency(target);
    setBudget((prev) => Math.round((prev * factor) / 100) * 100);
    setBudgetItems((prev) =>
      prev.map((item) => ({
        ...item,
        planned: Math.round((item.planned * factor) / 10) * 10,
        actual: Math.round((item.actual * factor) / 10) * 10,
      }))
    );
    setVendorList((prev) =>
      prev.map((v) => ({
        ...v,
        quoteAmount: Math.round((v.quoteAmount * factor) / 10) * 10,
      }))
    );
    setPersonalizedIdeas((prev) =>
      prev.map((idea) => ({
        ...idea,
        costEstimate: Math.round((idea.costEstimate * factor) / 10) * 10,
      }))
    );
  };

  // Switch Event Archetype
  const handleArchetypeSwitch = (typeKey: EventArchetypeId) => {
    setSelectedArchetypeId(typeKey);
    const arch = EVENT_ARCHETYPES[typeKey];
    const mult = currency === 'INR' ? 84 : 1;

    setEventTitle(arch.defaultTitle);
    setCity(arch.defaultCity);
    setEventDate(arch.defaultDate);
    setGuestCount(arch.defaultGuests);
    setBudget(Math.round(arch.defaultBudget * mult));
    setTheme(arch.themes[0]);
    setDietaryNotes(arch.defaultDietaryNotes);
    setCulturalNotes(arch.defaultCulturalNotes);
    setHeroPresetId(arch.heroVisualPresetId);
    setHeroCustomImageUrl('');
    setHeroCaption(arch.heroVisualCaption);
    setNewItemCategory(arch.categories[0]);
    setAiConcept(arch.defaultConcept);
    setPersonalizedIdeas(
      arch.sampleIdeas.map((i) => ({
        ...i,
        costEstimate: Math.round(i.costEstimate * mult),
      }))
    );
    setTimelineItems(arch.sampleTimelines);
    setBudgetItems(
      arch.sampleBudgets.map((b) => ({
        ...b,
        planned: Math.round(b.planned * mult),
        actual: Math.round(b.actual * mult),
      }))
    );
    setVendorList(
      arch.sampleVendors.map((v) => ({
        ...v,
        quoteAmount: Math.round(v.quoteAmount * mult),
      }))
    );
    setBudgetOptimizationResult(null);
    setActiveRfpDraft(null);
    setGroundingResult(null);
    setApiError(null);
    setSynthesisBanner(`Switched experience canvas to ${arch.label}.`);
  };

  // Derived Financial & Readiness Metrics
  const totalPlanned = useMemo(
    () => budgetItems.reduce((acc, curr) => acc + (Number(curr.planned) || 0), 0),
    [budgetItems]
  );
  const totalActual = useMemo(
    () => budgetItems.reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0),
    [budgetItems]
  );
  const totalPaid = useMemo(
    () =>
      budgetItems
        .filter((b) => b.paid)
        .reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0),
    [budgetItems]
  );
  const budgetVariance = budget - totalActual;
  const costPerGuest = Math.round(totalActual / Math.max(1, guestCount));
  const budgetUtilizationPct = Math.min(
    100,
    Math.round((totalActual / Math.max(1, budget)) * 100)
  );

  const completedTimelineCount = useMemo(
    () => timelineItems.filter((t) => t.status === 'completed').length,
    [timelineItems]
  );
  const highImpactTimelineCount = useMemo(
    () => timelineItems.filter((t) => t.isHighImpact || t.visualReference).length,
    [timelineItems]
  );
  const timelineReadinessPct = Math.round(
    (completedTimelineCount / Math.max(1, timelineItems.length)) * 100
  );
  const confirmedVendorCount = useMemo(
    () => vendorList.filter((v) => v.status === 'Confirmed').length,
    [vendorList]
  );

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { planned: number; actual: number; count: number }>();
    budgetItems.forEach((item) => {
      const current = map.get(item.category) || { planned: 0, actual: 0, count: 0 };
      current.planned += Number(item.planned) || 0;
      current.actual += Number(item.actual) || 0;
      current.count += 1;
      map.set(item.category, current);
    });
    return Array.from(map.entries()).map(([category, stats]) => ({
      category,
      ...stats,
      shareOfSpend: totalActual > 0 ? Math.round((stats.actual / totalActual) * 100) : 0,
    }));
  }, [budgetItems, totalActual]);

  // 1. Full Agentic Blueprint Synthesis via Server-Side Gemini 3.8 Flash
  const handleSynthesizeBlueprint = async () => {
    setIsSynthesizing(true);
    setApiError(null);
    setSynthesisBanner(null);

    try {
      const response = await fetch('/api/agent/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetypeLabel: activeArchetype.label,
          eventTitle,
          theme,
          city,
          eventDate,
          guestCount,
          totalBudget: budget,
          currencySymbol,
          dietaryNotes,
          culturalNotes,
          categories: activeArchetype.categories,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to synthesize blueprint.');
      }

      if (data.concept) setAiConcept(data.concept);
      if (Array.isArray(data.personalizedIdeas) && data.personalizedIdeas.length > 0) {
        setPersonalizedIdeas(
          data.personalizedIdeas.map((idea: any, idx: number) => ({
            ...idea,
            visualPresetId:
              SCENOGRAPHY_PRESETS[idx % SCENOGRAPHY_PRESETS.length]?.id ||
              activeArchetype.heroVisualPresetId,
          }))
        );
      }
      if (Array.isArray(data.budgetItems) && data.budgetItems.length > 0) {
        setBudgetItems(data.budgetItems);
      }
      if (Array.isArray(data.timelineItems) && data.timelineItems.length > 0) {
        setTimelineItems(
          data.timelineItems.map((t: any, idx: number) => {
            const isImpact = Boolean(t.isHighImpact) || idx % 2 === 1;
            const matchedPreset =
              SCENOGRAPHY_PRESETS.find((p) => p.id === t.visualPresetId) ||
              SCENOGRAPHY_PRESETS.find((p) => p.id === activeArchetype.heroVisualPresetId) ||
              SCENOGRAPHY_PRESETS[0];

            return {
              ...t,
              status:
                t.status === 'completed' || t.status === 'in-progress' ? t.status : 'pending',
              isHighImpact: isImpact,
              visualReference: isImpact
                ? {
                    presetId: matchedPreset.id,
                    title: `${t.title} — Scenography & Cue Reference`,
                    caption: t.notes || matchedPreset.defaultCaption,
                    lightingCue: t.lightingCue || matchedPreset.defaultLightingCue,
                    aspectTag: 'AI Visual Cue',
                  }
                : undefined,
            };
          })
        );
      }
      if (Array.isArray(data.vendorList) && data.vendorList.length > 0) {
        setVendorList(
          data.vendorList.map((v: any) => ({
            ...v,
            status:
              v.status === 'Confirmed' ||
              v.status === 'Contract Sent' ||
              v.status === 'Negotiating'
                ? v.status
                : 'Shortlisted',
          }))
        );
      }

      setSynthesisBanner(
        `Gemini synthesized a fresh experience feed, story reels, budget ledger, and vendor SLAs for "${eventTitle}".`
      );
    } catch (err: any) {
      setApiError(err.message || 'Error connecting to Gemini synthesis endpoint.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // 2. MULTIMODAL VISION: Reverse-Engineer Any Photo into Scenography, Palette & Cost
  const handleVisionImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVisionMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setVisionImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunVisionAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzingVision(true);
    setApiError(null);
    try {
      const response = await fetch('/api/agent/multimodal-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: visionImagePreview,
          mimeType: visionMimeType,
          userPrompt: visionPrompt,
          eventContext: {
            eventTitle,
            archetypeLabel: activeArchetype.label,
            guestCount,
            currencySymbol,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Vision analysis failed.');
      }
      setVisionResult({
        ...data,
        uploadedImageUrl: visionImagePreview || undefined,
      });
    } catch (err: any) {
      setApiError(err.message || 'Failed to analyze image with Gemini Vision.');
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  const handlePromoteVisionResultToWorkspace = () => {
    if (!visionResult) return;
    const newIdea: PersonalizedIdea = {
      id: 'vision-idea-' + Date.now(),
      pillar: visionResult.pillar,
      title: visionResult.title,
      description: `${visionResult.architecturalSummary} · Value Hack: ${visionResult.costSavingHack}`,
      estimatedImpact: visionResult.lightingAndMoodCue,
      costEstimate: visionResult.estimatedCost,
      visualPresetId: heroPresetId,
      promotedToPlan: true,
    };

    const newBudget: BudgetItem = {
      id: 'vision-budget-' + Date.now(),
      category: activeArchetype.categories[0],
      item: `${visionResult.title} (Vision Scanned)`,
      planned: visionResult.estimatedCost,
      actual: visionResult.estimatedCost,
      paid: false,
      notes: visionResult.costSavingHack,
    };

    const newCue: TimelineItem = {
      id: 'vision-cue-' + Date.now(),
      phase: visionResult.suggestedTimelinePhase || 'Event Highlight',
      date: 'Vision Cue',
      title: visionResult.title,
      owner: 'Scenography Lead',
      tag: visionResult.pillar,
      status: 'pending',
      notes: visionResult.architecturalSummary,
      isHighImpact: true,
      visualReference: {
        presetId: heroPresetId,
        imageUrl: visionResult.uploadedImageUrl,
        title: visionResult.title,
        caption: visionResult.architecturalSummary,
        lightingCue: visionResult.lightingAndMoodCue,
        aspectTag: 'Gemini Vision Scan',
      },
    };

    if (visionResult.extractedPalette?.length >= 3) {
      setAiConcept((prev) => ({
        ...prev,
        colorPalette: visionResult.extractedPalette.map((p) => ({
          name: p.name,
          hex: p.hex,
          usage: 'Extracted via Gemini Vision',
        })),
      }));
    }

    setPersonalizedIdeas((prev) => [newIdea, ...prev]);
    setBudgetItems((prev) => [newBudget, ...prev]);
    setTimelineItems((prev) => [...prev, newCue]);
    setSynthesisBanner(
      `Added Vision-Scanned "${visionResult.title}" (${formatMoney(visionResult.estimatedCost)}) to Vibe Feed, Story Reels, and Budget!`
    );
    setIsVisionModalOpen(false);
    setVisionResult(null);
  };

  // 3. MULTIMODAL AUDIO TRANSCRIPTION: Record Live Voice Brief -> Structured Updates
  const handleToggleVoiceRecording = async () => {
    if (isRecordingVoice) {
      mediaRecorderRef.current?.stop();
      setIsRecordingVoice(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = typeof reader.result === 'string' ? reader.result : '';
          if (!base64Audio) return;
          setIsTranscribingVoice(true);
          setIsCopilotDrawerOpen(true);
          try {
            const response = await fetch('/api/agent/voice-brief', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: 'audio/webm',
                eventContext: {
                  eventTitle,
                  archetypeLabel: activeArchetype.label,
                  guestCount,
                  totalBudget: budget,
                  currencySymbol,
                },
              }),
            });
            const data = await response.json();
            if (!response.ok || data.error) {
              throw new Error(data.error || 'Voice transcription failed.');
            }
            const userVoiceMsg: ChatMessage = {
              id: 'voice-u-' + Date.now(),
              sender: 'user',
              text: `🎙️ Voice Note: "${data.transcript}"`,
              timestamp: 'Voice Memo',
            };
            const aiVoiceMsg: ChatMessage = {
              id: 'voice-ai-' + Date.now(),
              sender: 'ai',
              text: data.replyMarkdown,
              timestamp: 'Gemini Audio',
              proposedActions: data.proposedActions || [],
            };
            setMessages((prev) => [...prev, userVoiceMsg, aiVoiceMsg]);
          } catch (err: any) {
            setApiError(err.message || 'Voice transcription failed.');
          } finally {
            setIsTranscribingVoice(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingVoice(true);
    } catch (err: any) {
      setApiError(
        'Microphone access was not granted. You can type your request in the Omni-Bar instead.'
      );
    }
  };

  // 4. GENERATIVE AUDIO TTS: Play Spoken AI Emcee / Stage Manager Voiceover
  const handlePlayVoiceover = async (textToSpeak: string) => {
    if (isPlayingAudio) {
      audioPlayerRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    setApiError(null);
    try {
      const response = await fetch('/api/agent/tts-announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          style: 'Warm, poised, celebratory luxury event host and stage director',
          voiceName: 'Kore',
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error || !data.audioDataUrl) {
        throw new Error(data.error || 'Failed to synthesize voice preview.');
      }
      const audio = new Audio(data.audioDataUrl);
      audioPlayerRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      await audio.play();
    } catch (err: any) {
      setIsPlayingAudio(false);
      setApiError(err.message || 'Could not play Gemini TTS audio.');
    }
  };

  // 5. GOOGLE SEARCH GROUNDING: Live Real-World Venue & Vendor Discovery
  const handleRunGroundingSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearchingGrounding(true);
    setApiError(null);
    try {
      const response = await fetch('/api/agent/grounding-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: groundingQuery,
          city,
          archetypeLabel: activeArchetype.label,
          guestCount,
          currencySymbol,
          totalBudget: budget,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Search grounding failed.');
      }
      setGroundingResult(data);
    } catch (err: any) {
      setApiError(err.message || 'Failed to run Google Search Grounding.');
    } finally {
      setIsSearchingGrounding(false);
    }
  };

  // Open Visual Reference Attachment Modal for a Timeline Item
  const handleOpenVisualEditor = (item: TimelineItem) => {
    setEditingTimelineVisualItem(item);
    const existing = item.visualReference;
    const fallbackPreset =
      SCENOGRAPHY_PRESETS.find((p) => p.id === activeArchetype.heroVisualPresetId) ||
      SCENOGRAPHY_PRESETS[0];

    setVisualDraftPresetId(existing?.presetId || fallbackPreset.id);
    setVisualDraftImageUrl(existing?.imageUrl || '');
    setVisualDraftTitle(existing?.title || `${item.title} — Visual Reference`);
    setVisualDraftCaption(existing?.caption || item.notes || fallbackPreset.defaultCaption);
    setVisualDraftLightingCue(existing?.lightingCue || fallbackPreset.defaultLightingCue);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'timeline' | 'hero'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (target === 'timeline') {
        setVisualDraftImageUrl(result);
      } else {
        setHeroCustomImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTimelineVisual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimelineVisualItem) return;

    const updatedVisual: TimelineVisualReference = {
      presetId: visualDraftPresetId,
      imageUrl: visualDraftImageUrl.trim() || undefined,
      title: visualDraftTitle.trim() || editingTimelineVisualItem.title,
      caption:
        visualDraftCaption.trim() ||
        'Custom scenographic & staging reference attached by planner.',
      lightingCue: visualDraftLightingCue.trim() || 'Standard architectural warm wash',
      aspectTag: visualDraftImageUrl.trim() ? 'Uploaded Reference' : 'Scenography Preset',
    };

    setTimelineItems((prev) =>
      prev.map((t) =>
        t.id === editingTimelineVisualItem.id
          ? {
              ...t,
              isHighImpact: true,
              visualReference: updatedVisual,
            }
          : t
      )
    );
    setSynthesisBanner(`Attached visual reference to "${editingTimelineVisualItem.title}".`);
    setEditingTimelineVisualItem(null);
  };

  const handleRemoveTimelineVisual = (id: string) => {
    setTimelineItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visualReference: undefined } : t))
    );
  };

  const handleToggleHighImpact = (item: TimelineItem) => {
    const nextState = !item.isHighImpact;
    const defaultPreset =
      SCENOGRAPHY_PRESETS.find((p) => p.id === activeArchetype.heroVisualPresetId) ||
      SCENOGRAPHY_PRESETS[0];

    setTimelineItems((prev) =>
      prev.map((t) => {
        if (t.id !== item.id) return t;
        return {
          ...t,
          isHighImpact: nextState,
          visualReference:
            nextState && !t.visualReference
              ? {
                  presetId: defaultPreset.id,
                  title: `${t.title} — Staging Reference`,
                  caption: t.notes || defaultPreset.defaultCaption,
                  lightingCue: defaultPreset.defaultLightingCue,
                  aspectTag: 'High-Impact Cue',
                }
              : t.visualReference,
        };
      })
    );
  };

  // Budget Optimization
  const handleRunBudgetOptimization = async () => {
    setIsOptimizingBudget(true);
    setApiError(null);
    try {
      const response = await fetch('/api/agent/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetypeLabel: activeArchetype.label,
          theme,
          guestCount,
          totalBudget: budget,
          currencySymbol,
          budgetItems,
          optimizationGoal:
            budgetVariance < 0
              ? `Eliminate the ${formatMoney(Math.abs(budgetVariance))} overspend so total actual spend stays below ${formatMoney(budget)} while protecting guest hospitality.`
              : `Optimize cost-per-guest efficiency and carve out a 10% contingency reserve within ${formatMoney(budget)}.`,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to optimize budget.');
      }
      setBudgetOptimizationResult(data);
    } catch (err: any) {
      setApiError(err.message || 'Budget optimization failed.');
    } finally {
      setIsOptimizingBudget(false);
    }
  };

  const handleApplyRebalancedBudget = () => {
    if (!budgetOptimizationResult?.rebalancedItems?.length) return;
    setBudgetItems(budgetOptimizationResult.rebalancedItems);
    setSynthesisBanner(
      `Applied Gemini rebalanced ledger (${formatMoney(budgetOptimizationResult.projectedSavings)} projected savings).`
    );
    setBudgetOptimizationResult(null);
  };

  // Vendor RFP Generator
  const handleGenerateVendorRfp = async (vendor: VendorItem) => {
    setGeneratingRfpVendorId(vendor.id);
    setApiError(null);
    try {
      const response = await fetch('/api/agent/generate-rfp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor,
          eventTitle,
          archetypeLabel: activeArchetype.label,
          theme,
          city,
          eventDate,
          guestCount,
          currencySymbol,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate vendor RFP.');
      }
      setActiveRfpDraft({
        vendorId: vendor.id,
        vendorName: vendor.name,
        subjectLine: data.subjectLine,
        emailBody: data.emailBody,
        negotiationLevers: data.negotiationLevers || [],
        mandatoryContractClauses: data.mandatoryContractClauses || [],
      });
    } catch (err: any) {
      setApiError(err.message || 'Could not generate vendor RFP.');
    } finally {
      setGeneratingRfpVendorId(null);
    }
  };

  // Conversational Copilot
  const handleSendMessage = async (promptOverride?: string) => {
    const query = (promptOverride ?? inputMessage).trim();
    if (!query || isCopilotThinking) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptOverride) setInputMessage('');
    setIsCopilotThinking(true);
    setIsCopilotDrawerOpen(true);
    setApiError(null);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          eventContext: {
            eventTitle,
            archetypeLabel: activeArchetype.label,
            theme,
            city,
            eventDate,
            guestCount,
            totalBudget: budget,
            totalActual,
            currencySymbol,
            dietaryNotes,
            culturalNotes,
            categories: activeArchetype.categories,
            budgetItems,
            timelineItems,
            vendorList,
          },
          conversationHistory: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Copilot request failed.');
      }

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.replyMarkdown || 'Here are my recommendations for your event.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpPrompts: data.followUpPrompts || [],
        proposedActions: data.proposedActions || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setApiError(err.message || 'Failed to reach Gemini Event Copilot.');
    } finally {
      setIsCopilotThinking(false);
    }
  };

  const handleExecuteAgentAction = (messageId: string, action: ProposedAgentAction) => {
    if (action.applied) return;

    if (action.actionType === 'ADD_BUDGET_ITEM' && action.budgetItem) {
      const newEntry: BudgetItem = {
        id: 'ai-budget-' + Date.now(),
        category: action.budgetItem.category || activeArchetype.categories[0],
        item: action.budgetItem.item,
        planned: Number(action.budgetItem.planned) || 500,
        actual: Number(action.budgetItem.actual ?? action.budgetItem.planned) || 500,
        paid: false,
        notes: action.budgetItem.notes || 'Added via Gemini Copilot',
      };
      setBudgetItems((prev) => [newEntry, ...prev]);
      setSynthesisBanner(
        `Added "${newEntry.item}" (${formatMoney(newEntry.actual)}) to Smart Wallet.`
      );
    } else if (action.actionType === 'ADD_TIMELINE_TASK' && action.timelineItem) {
      const preset =
        SCENOGRAPHY_PRESETS.find((p) => p.id === activeArchetype.heroVisualPresetId) ||
        SCENOGRAPHY_PRESETS[0];
      const newTask: TimelineItem = {
        id: 'ai-task-' + Date.now(),
        phase: action.timelineItem.phase || 'Event Day',
        date: action.timelineItem.date || 'TBD',
        title: action.timelineItem.title,
        owner: action.timelineItem.owner || 'Lead Planner',
        tag: action.timelineItem.tag || 'Execution',
        status: 'pending',
        notes: action.timelineItem.notes || 'Added via Gemini Copilot',
        isHighImpact: true,
        visualReference: {
          presetId: preset.id,
          title: `${action.timelineItem.title} — Visual Reference`,
          caption: action.timelineItem.notes || preset.defaultCaption,
          lightingCue: preset.defaultLightingCue,
          aspectTag: 'Copilot Cue',
        },
      };
      setTimelineItems((prev) => [...prev, newTask]);
      setSynthesisBanner(`Added high-impact cue "${newTask.title}" to Story Reels & Timeline.`);
    } else if (action.actionType === 'ADD_VENDOR' && action.vendorItem) {
      const newVendor: VendorItem = {
        id: 'ai-vendor-' + Date.now(),
        name: action.vendorItem.name,
        role: action.vendorItem.role,
        rating: 4.9,
        quoteAmount: Number(action.vendorItem.quoteAmount) || 1500,
        status: 'Shortlisted',
        contact: action.vendorItem.contact || 'concierge@vendorpartner.com',
        notes: action.vendorItem.notes || 'Recommended by Gemini Copilot',
        slaChecklist: [
          'Verify certificate of liability insurance & load-in window',
          'Lock milestone payment schedule (30% deposit / 70% completion)',
        ],
      };
      setVendorList((prev) => [newVendor, ...prev]);
      setSynthesisBanner(`Added supplier "${newVendor.name}" to Vendor Concierge.`);
    } else if (action.actionType === 'ADD_IDEA' && action.ideaItem) {
      const newIdea: PersonalizedIdea = {
        id: 'ai-idea-' + Date.now(),
        pillar: action.ideaItem.pillar || 'Experiential',
        title: action.ideaItem.title,
        description: action.ideaItem.description,
        estimatedImpact: action.ideaItem.estimatedImpact || 'High guest impact',
        costEstimate: Number(action.ideaItem.costEstimate) || 800,
        visualPresetId: activeArchetype.heroVisualPresetId,
      };
      setPersonalizedIdeas((prev) => [newIdea, ...prev]);
      setSynthesisBanner(`Added bespoke card "${newIdea.title}" to Vibe Feed.`);
    }

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        return {
          ...msg,
          proposedActions: (msg.proposedActions || []).map((a) =>
            a.actionId === action.actionId ? { ...a, applied: true } : a
          ),
        };
      })
    );
  };

  // Promote Idea to Plan
  const handlePromoteIdeaToPlan = (idea: PersonalizedIdea) => {
    if (idea.promotedToPlan) return;

    const newBudgetLine: BudgetItem = {
      id: 'idea-b-' + Date.now(),
      category: activeArchetype.categories[0],
      item: `${idea.title} (${idea.pillar})`,
      planned: idea.costEstimate,
      actual: idea.costEstimate,
      paid: false,
      notes: idea.description,
    };

    const preset =
      SCENOGRAPHY_PRESETS.find((p) => p.id === (idea.visualPresetId || heroPresetId)) ||
      SCENOGRAPHY_PRESETS[0];

    const newTimelineTask: TimelineItem = {
      id: 'idea-t-' + Date.now(),
      phase: 'Showstopper Cue',
      date: 'Peak Hour',
      title: idea.title,
      owner: 'Experience Lead',
      tag: idea.pillar,
      status: 'pending',
      notes: idea.description,
      isHighImpact: true,
      visualReference: {
        presetId: preset.id,
        title: `${idea.title} — Staging & Moodboard`,
        caption: idea.description,
        lightingCue: preset.defaultLightingCue,
        aspectTag: idea.pillar,
      },
    };

    setBudgetItems((prev) => [newBudgetLine, ...prev]);
    setTimelineItems((prev) => [...prev, newTimelineTask]);
    setPersonalizedIdeas((prev) =>
      prev.map((item) => (item.id === idea.id ? { ...item, promotedToPlan: true } : item))
    );
    setSynthesisBanner(
      `Locked "${idea.title}" into Smart Wallet (${formatMoney(idea.costEstimate)}) & Ceremony Story Reels!`
    );
  };

  // Budget CRUD
  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPlanned) return;
    const plannedVal = Number(newItemPlanned) || 0;
    const actualVal = newItemActual !== '' ? Number(newItemActual) : plannedVal;
    const newItem: BudgetItem = {
      id: 'b-' + Date.now(),
      category: newItemCategory,
      item: newItemName.trim(),
      planned: plannedVal,
      actual: actualVal,
      paid: false,
      notes: 'Custom allocation',
    };
    setBudgetItems((prev) => [newItem, ...prev]);
    setNewItemName('');
    setNewItemPlanned('');
    setNewItemActual('');
  };

  const handleToggleBudgetPaid = (id: string) => {
    setBudgetItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, paid: !item.paid } : item))
    );
  };

  const handleUpdateBudgetActual = (id: string, value: number) => {
    setBudgetItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, actual: Math.max(0, value) } : item))
    );
  };

  const handleDeleteBudgetItem = (id: string) => {
    setBudgetItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Timeline CRUD
  const handleCycleTimelineStatus = (id: string) => {
    const order: Array<'pending' | 'in-progress' | 'completed'> = [
      'pending',
      'in-progress',
      'completed',
    ];
    setTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextIdx = (order.indexOf(item.status) + 1) % order.length;
        return { ...item, status: order[nextIdx] };
      })
    );
  };

  const handleAddTimelineTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const selectedPreset =
      SCENOGRAPHY_PRESETS.find((p) => p.id === newTaskPresetId) || SCENOGRAPHY_PRESETS[0];

    const created: TimelineItem = {
      id: 't-' + Date.now(),
      phase: newTaskPhase.trim() || 'Event Day',
      date: newTaskDate.trim() || 'TBD',
      title: newTaskTitle.trim(),
      owner: newTaskOwner.trim() || 'Ops Lead',
      tag: newTaskTag.trim() || 'General',
      status: 'pending',
      isHighImpact: true,
      visualReference: {
        presetId: selectedPreset.id,
        title: `${newTaskTitle.trim()} — Visual Staging`,
        caption: selectedPreset.defaultCaption,
        lightingCue: selectedPreset.defaultLightingCue,
        aspectTag: 'High-Impact Cue',
      },
    };
    setTimelineItems((prev) => [...prev, created]);
    setNewTaskTitle('');
  };

  const handleDeleteTimelineTask = (id: string) => {
    setTimelineItems((prev) => prev.filter((t) => t.id !== id));
  };

  // Vendor CRUD
  const handleCycleVendorStatus = (id: string) => {
    const statuses: Array<VendorItem['status']> = [
      'Shortlisted',
      'Negotiating',
      'Contract Sent',
      'Confirmed',
    ];
    setVendorList((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const next = statuses[(statuses.indexOf(v.status) + 1) % statuses.length];
        return { ...v, status: next };
      })
    );
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim() || !newVendorRole.trim()) return;
    const created: VendorItem = {
      id: 'v-' + Date.now(),
      name: newVendorName.trim(),
      role: newVendorRole.trim(),
      rating: 4.8,
      quoteAmount: Number(newVendorQuote) || 2000,
      status: 'Shortlisted',
      contact: 'bookings@vendor.com',
      notes: newVendorNotes.trim() || 'Added to procurement list',
      slaChecklist: [
        'Confirm load-in and strike window with venue',
        'Verify backup staff & cancellation protection clause',
      ],
    };
    setVendorList((prev) => [created, ...prev]);
    setNewVendorName('');
    setNewVendorRole('');
    setNewVendorQuote('');
    setNewVendorNotes('');
  };

  const handleDeleteVendor = (id: string) => {
    setVendorList((prev) => prev.filter((v) => v.id !== id));
  };

  // Export Master Run-Book (Markdown)
  const handleExportMasterRunbook = () => {
    const lines = [
      `# ${eventTitle} — Master Event Production Runbook`,
      `Archetype: ${activeArchetype.label} | Theme: ${theme}`,
      `Location: ${city} | Date: ${eventDate}`,
      `Attendance: ${guestCount} Guests | Target Budget: ${formatMoney(budget)} | Actual Spend: ${formatMoney(totalActual)}`,
      ``,
      `## 1. Executive Concept & Scenography`,
      `- Concept: ${aiConcept.conceptName}`,
      `- Narrative: ${aiConcept.editorialNarrative}`,
      `- Spatial Scenography: ${aiConcept.spatialScenography}`,
      `- Culinary Direction: ${aiConcept.recommendedCatering}`,
      `- Signature Moment: ${aiConcept.signatureMoment}`,
      `- Risk & Compliance Advisory: ${aiConcept.logisticsRiskAdvisory}`,
      ``,
      `## 2. Personalized Experience Ideas`,
      ...personalizedIdeas.map(
        (i) => `- [${i.pillar}] ${i.title} (${formatMoney(i.costEstimate)}): ${i.description}`
      ),
      ``,
      `## 3. Financial Budget Ledger`,
      ...budgetItems.map(
        (b) =>
          `- [${b.category}] ${b.item} | Planned: ${formatMoney(b.planned)} | Actual: ${formatMoney(b.actual)} | Paid: ${b.paid ? 'Yes' : 'No'}`
      ),
      ``,
      `## 4. Chrono-Synchronized Run of Show & Visual Cues`,
      ...timelineItems.map(
        (t) =>
          `- [${t.phase} · ${t.date}] ${t.isHighImpact ? '[HIGH-IMPACT] ' : ''}${t.title} (Owner: ${t.owner} | Status: ${t.status})${
            t.visualReference ? ` | Lighting Cue: ${t.visualReference.lightingCue}` : ''
          }`
      ),
      ``,
      `## 5. Vendor SLA & Procurement Roster`,
      ...vendorList.map(
        (v) =>
          `- ${v.name} (${v.role}) | Quote: ${formatMoney(v.quoteAmount)} | Status: ${v.status} | Contact: ${v.contact}`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-runbook.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredBudgetItems = useMemo(() => {
    return budgetItems.filter((item) => {
      const matchesCat =
        budgetCategoryFilter === 'ALL' || item.category === budgetCategoryFilter;
      const matchesQuery =
        !budgetSearch.trim() ||
        item.item.toLowerCase().includes(budgetSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(budgetSearch.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [budgetItems, budgetCategoryFilter, budgetSearch]);

  const filteredTimelineItems = useMemo(() => {
    if (timelineFilter === 'ALL') return timelineItems;
    if (timelineFilter === 'HIGH_IMPACT') {
      return timelineItems.filter((t) => t.isHighImpact || Boolean(t.visualReference));
    }
    return timelineItems.filter((t) => t.status === timelineFilter);
  }, [timelineItems, timelineFilter]);

  const filteredVendors = useMemo(() => {
    if (vendorStatusFilter === 'ALL') return vendorList;
    return vendorList.filter((v) => v.status === vendorStatusFilter);
  }, [vendorList, vendorStatusFilter]);

  const activeStoryItem =
    activeStoryIndex !== null ? timelineItems[activeStoryIndex] || null : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-stone-900 pb-28">
      {/* Top Bar Contract: Strictly 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 lg:px-10 py-4 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-stone-200/90">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('feed');
          }}
          className="text-xl font-bold tracking-tight text-stone-950 font-editorial whitespace-nowrap shrink-0"
        >
          UtsavaVaibhavam AI
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary Workspace Navigation" role="tablist" className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            role="tab"
            aria-selected={activeTab === 'feed'}
            aria-label="Feed Workspace View"
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'feed'
                ? 'border-amber-800 text-stone-950 font-semibold'
                : 'border-transparent hover:text-stone-950'
            }`}
          >
            Vibe Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            role="tab"
            aria-selected={activeTab === 'timeline'}
            aria-label="Timeline Workspace View"
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-amber-800 text-stone-950 font-semibold'
                : 'border-transparent hover:text-stone-950'
            }`}
          >
            Chrono Storyboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spatial')}
            role="tab"
            aria-selected={activeTab === 'spatial'}
            aria-label="Spatial Workspace View"
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'spatial'
                ? 'border-amber-800 text-stone-950 font-semibold'
                : 'border-transparent hover:text-stone-950'
            }`}
          >
            360° Venue Canvas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            role="tab"
            aria-selected={activeTab === 'budget'}
            aria-label="Budget Workspace View"
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'budget'
                ? 'border-amber-800 text-stone-950 font-semibold'
                : 'border-transparent hover:text-stone-950'
            }`}
          >
            Smart Wallet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vendors')}
            role="tab"
            aria-selected={activeTab === 'vendors'}
            aria-label="Vendors Workspace View"
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'vendors'
                ? 'border-amber-800 text-stone-950 font-semibold'
                : 'border-transparent hover:text-stone-950'
            }`}
          >
            Vendor Concierge
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleSynthesizeBlueprint}
            disabled={isSynthesizing}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'Synthesizing...' : 'Re-Imagine with Gemini'}</span>
          </button>
        </div>
      </header>

      {/* Main Product Viewport */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-8">
        {/* Notifications / Error Feedback */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-4 text-sm text-red-900">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-xs font-semibold text-red-800 underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {synthesisBanner && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-sm text-amber-950">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
              <span>{synthesisBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setSynthesisBanner(null)}
              className="text-xs font-medium text-amber-900 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =====================================================================
            INSTAGRAM-STYLE CEREMONY STORY REELS & MULTIMODAL LAUNCHPAD
           ===================================================================== */}
        <section className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          {/* Top Occasion Context Bar (Zero Clutter) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(EVENT_ARCHETYPES) as EventArchetypeId[]).map((key) => {
                const item = EVENT_ARCHETYPES[key];
                const active = selectedArchetypeId === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleArchetypeSwitch(key)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-stone-950 text-white font-semibold shadow-xs'
                        : 'bg-[#F8F5EE] text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    {item.shortLabel}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setIsBriefDrawerOpen((p) => !p)}
                className="px-3 py-1.5 rounded-xl bg-[#F8F5EE] hover:bg-stone-200/70 text-stone-800 font-medium flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
                <span>
                  {guestCount} Guests · {formatMoney(budget)} · {city}
                </span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-[#F8F5EE] rounded-xl border border-stone-200/70">
                <button
                  type="button"
                  onClick={() => handleCurrencySwitch('USD')}
                  className={`px-2 py-1 text-xs font-mono-tabular font-medium rounded-lg cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600'
                  }`}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => handleCurrencySwitch('INR')}
                  className={`px-2 py-1 text-xs font-mono-tabular font-medium rounded-lg cursor-pointer ${
                    currency === 'INR'
                      ? 'bg-white text-stone-950 shadow-xs font-semibold'
                      : 'text-stone-600'
                  }`}
                >
                  ₹ INR
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF Report</span>
              </button>
            </div>
          </div>

          {/* Expandable Event Brief Drawer (Hidden by Default so UI Stays Clean & Visual) */}
          {isBriefDrawerOpen && (
            <div className="p-5 rounded-2xl bg-[#F8F5EE] border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-600">Occasion Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 font-medium"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-700"
                  />
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Date"
                    className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-600">
                  Aesthetic Theme & Rituals
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 font-medium"
                >
                  {activeArchetype.themes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={culturalNotes}
                  onChange={(e) => setCulturalNotes(e.target.value)}
                  placeholder="Ceremonies & highlights"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-700"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600 font-medium">Guest Count</span>
                  <span className="font-mono-tabular font-semibold">{guestCount} pax</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={1000}
                  step={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <input
                  type="text"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="Dietary notes"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-700"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600 font-medium">Target Budget</span>
                  <span className="font-mono-tabular font-semibold">{formatMoney(budget)}</span>
                </div>
                <input
                  type="range"
                  min={currency === 'INR' ? 200000 : 2500}
                  max={currency === 'INR' ? 12000000 : 150000}
                  step={currency === 'INR' ? 25000 : 500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsBriefDrawerOpen(false);
                    handleSynthesizeBlueprint();
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg cursor-pointer"
                >
                  Apply & Re-Synthesize
                </button>
              </div>
            </div>
          )}

          {/* Instagram-Style Horizontal Story Reels Bar */}
          <div className="flex items-center gap-4 overflow-x-auto pb-1 pt-1">
            {/* Multimodal Vision Scanner Ring */}
            <button
              type="button"
              onClick={() => setIsVisionModalOpen(true)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-700 via-rose-600 to-amber-400">
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-amber-300 group-hover:scale-95 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-stone-900 whitespace-nowrap">
                Vision Scan
              </span>
            </button>

            {/* Ceremony & Milestone Story Rings */}
            {timelineItems.map((cue, index) => {
              const presetId =
                cue.visualReference?.presetId || activeArchetype.heroVisualPresetId;
              const isImpact = Boolean(cue.isHighImpact || cue.visualReference);

              return (
                <button
                  key={cue.id}
                  type="button"
                  onClick={() => setActiveStoryIndex(index)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer max-w-[84px]"
                >
                  <div
                    className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                      cue.status === 'completed'
                        ? 'bg-emerald-600'
                        : isImpact
                        ? 'bg-gradient-to-tr from-amber-800 via-amber-500 to-rose-500'
                        : 'bg-stone-300'
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative">
                      <ScenographyArtwork
                        presetId={presetId}
                        imageUrl={cue.visualReference?.imageUrl}
                        title={cue.title}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-stone-800 truncate w-full text-center">
                    {cue.date}
                  </span>
                </button>
              );
            })}

            {/* Add New Story Cue Ring */}
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-stone-300 hover:border-amber-800 flex items-center justify-center text-stone-500 hover:text-amber-800 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-stone-600 whitespace-nowrap">
                Add Reel Cue
              </span>
            </button>
          </div>

          {/* 1-Click Live AI Test Bar for Current Plan */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-stone-600">
              <span className="font-semibold text-stone-900">Live AI Test Suite:</span>{' '}
              <span>
                Test real-time Gemini capabilities on <strong className="text-stone-900">{city}</strong> ({eventTitle})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSynthesizeBlueprint}
                disabled={isSynthesizing}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>{isSynthesizing ? 'Synthesizing...' : '1. Test Gemini Blueprint'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('vendors');
                  setGroundingQuery(
                    `Top heritage wedding venues like Mantra Koodam, Kalyana Mandapams, and traditional banana leaf Elai Sapadu caterers in ${city}`
                  );
                  handleRunGroundingSearch();
                }}
                disabled={isSearchingGrounding}
                className="px-3 py-1.5 rounded-xl bg-[#F8F5EE] hover:bg-stone-200/70 text-stone-900 border border-stone-200/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Globe className="w-3.5 h-3.5 text-amber-800" />
                <span>{isSearchingGrounding ? 'Searching Google...' : `2. Ground ${city} Venues`}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handlePlayVoiceover(
                    `Subha Muhurtham Welcome at ${city}. Welcome to ${eventTitle}. Guests are invited to the carved teakwood courtyard for the Kashi Yatra and Oonjal swing ceremony, followed by the Mangalya Dharanam under the sound of Thiruvavaduthurai Nadaswaram, and our 24-item Cauvery banana leaf Elai Sapadu with authentic Kumbakonam Degree Filter Coffee.`
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-[#F8F5EE] hover:bg-stone-200/70 text-stone-900 border border-stone-200/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                <span>{isPlayingAudio ? 'Stop Audio' : '3. Test Spoken Emcee TTS'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('budget');
                  handleRunBudgetOptimization();
                }}
                disabled={isOptimizingBudget}
                className="px-3 py-1.5 rounded-xl bg-[#F8F5EE] hover:bg-stone-200/70 text-stone-900 border border-stone-200/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />
                <span>{isOptimizingBudget ? 'Rebalancing...' : '4. Optimize Budget AI'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto">
          {(
            [
              ['feed', 'Vibe Feed'],
              ['timeline', 'Storyboard'],
              ['spatial', '360° Venue'],
              ['budget', 'Smart Wallet'],
              ['vendors', 'Concierge'],
            ] as Array<[WorkspaceTab, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 ${
                activeTab === key
                  ? 'bg-stone-950 text-white font-semibold'
                  : 'bg-white border border-stone-200 text-stone-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* =====================================================================
            VIEW 1: INSTAGRAM/PINTEREST-STYLE VISUAL VIBE FEED & LOOKBOOK
           ===================================================================== */}
        {activeTab === 'feed' && (
          <div className="space-y-8">
            {/* Hero Visual Lookbook Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left 7 Cols: Full-Bleed Interactive Scenography Lookbook Reel */}
              <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 relative min-h-[420px] flex flex-col justify-between">
                <ScenographyArtwork
                  presetId={heroPresetId}
                  imageUrl={heroCustomImageUrl}
                  title={aiConcept.conceptName}
                  className="w-full h-full absolute inset-0"
                  showBadge={true}
                />

                {/* Top Floating Audio & Vision Action Controls */}
                <div className="relative z-10 p-5 flex flex-wrap items-center justify-between gap-2">
                  <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs text-stone-200 font-mono-tabular">
                    {eventTitle}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handlePlayVoiceover(
                          `Welcome to ${eventTitle}. Our signature concept is ${aiConcept.conceptName}. ${aiConcept.editorialNarrative} For our showstopper moment: ${aiConcept.signatureMoment}`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? 'Stop Audio' : 'Hear AI Emcee Intro'}</span>
                    </button>

                    <label className="px-3 py-1.5 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-medium backdrop-blur-md border border-white/15 flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Custom Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'hero')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Bottom Editorial Overlay */}
                <div className="relative z-10 p-6 sm:p-8 space-y-4">
                  <div className="text-xs font-medium text-amber-300 tracking-wide">
                    {aiConcept.vibeKeywords.join(' · ')}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white font-editorial leading-tight">
                    {aiConcept.conceptName}
                  </h1>
                  <p className="text-sm text-stone-200 max-w-2xl leading-relaxed">
                    {aiConcept.editorialNarrative}
                  </p>

                  {/* Interactive Chromatic Palette Swatches */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    {aiConcept.colorPalette.map((swatch) => (
                      <div
                        key={swatch.name}
                        className="px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15 flex items-center gap-2"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-xs font-medium text-white">{swatch.name}</span>
                        <span className="text-[11px] font-mono-tabular text-stone-400">
                          {swatch.hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Interactive Production Pulse & Showstopper Card */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="bg-white border border-stone-200/90 rounded-3xl p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Showstopper Signature Moment</span>
                      <button
                        type="button"
                        onClick={() => handlePlayVoiceover(aiConcept.signatureMoment)}
                        className="text-amber-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-amber-800" />
                        <span>Voice Cue</span>
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-stone-950 font-editorial leading-snug">
                      {aiConcept.signatureMoment}
                    </h2>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <strong className="text-stone-900">Culinary Direction:</strong>{' '}
                      {aiConcept.recommendedCatering}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <strong className="text-amber-900">Risk & Weather Guardrail:</strong>{' '}
                      {aiConcept.logisticsRiskAdvisory}
                    </p>
                  </div>

                  {/* QuickPreset Mood Switcher */}
                  <div className="pt-4 border-t border-stone-100 space-y-2">
                    <div className="text-xs text-stone-500">
                      Instant Scenography Lookbook Switcher:
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {SCENOGRAPHY_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setHeroPresetId(p.id);
                            setHeroCustomImageUrl('');
                            setHeroCaption(p.defaultCaption);
                          }}
                          className={`px-2.5 py-1 text-xs rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                            heroPresetId === p.id && !heroCustomImageUrl
                              ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                              : 'bg-[#F8F5EE] text-stone-700 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Compact Live Telemetry Strip */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('budget')}
                    className="p-5 bg-white border border-stone-200/90 hover:border-amber-700 rounded-3xl text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs text-stone-500">Smart Wallet</div>
                    <div className="text-xl font-bold text-stone-950 font-mono-tabular mt-1">
                      {formatMoney(totalActual)}
                    </div>
                    <div className="text-xs text-emerald-700 font-mono-tabular mt-0.5">
                      {formatMoney(costPerGuest)} / guest
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('spatial')}
                    className="p-5 bg-stone-950 text-white border border-stone-800 hover:border-amber-500 rounded-3xl text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs text-amber-400 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>360° Spatial Twin</span>
                    </div>
                    <div className="text-lg font-bold font-editorial mt-1">
                      Interactive Floorplan
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      Inspect sightlines & kVA load
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Experience Feed Cards (Instagram/Pinterest Card Grid) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-stone-500">
                    Curated Experience Feed · Tap Heart to Bookmark or Lock Directly into Plan
                  </div>
                  <h2 className="text-2xl font-bold text-stone-950 font-editorial">
                    Signature Moments & Cultural Installations
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVisionModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                >
                  <Camera className="w-4 h-4 text-amber-800" />
                  <span>Scan Inspiration Photo with Gemini Vision</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {personalizedIdeas.map((idea, index) => {
                  const isLiked = Boolean(likedIdeaIds[idea.id]);
                  const presetId =
                    idea.visualPresetId ||
                    SCENOGRAPHY_PRESETS[index % SCENOGRAPHY_PRESETS.length].id;

                  return (
                    <div
                      key={idea.id}
                      className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
                    >
                      <div>
                        {/* Visual Media Header (4:3 Portrait Feel) */}
                        <div className="h-52 relative overflow-hidden bg-stone-950">
                          <ScenographyArtwork
                            presetId={presetId}
                            title={idea.title}
                            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-xs text-[11px] font-medium text-amber-200">
                            {idea.pillar}
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                handlePlayVoiceover(
                                  `${idea.title}. ${idea.description} Estimated investment is ${formatMoney(idea.costEstimate)}.`
                                )
                              }
                              className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer"
                              title="Hear Audio Pitch"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setLikedIdeaIds((prev) => ({
                                  ...prev,
                                  [idea.id]: !prev[idea.id],
                                }))
                              }
                              className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer"
                              title="Bookmark Vibe"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                            <span className="text-xs font-mono-tabular font-bold bg-black/65 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                              {formatMoney(idea.costEstimate)}
                            </span>
                          </div>
                        </div>

                        {/* Card Copy */}
                        <div className="p-5 space-y-2">
                          <h3 className="text-base font-bold text-stone-950 font-editorial leading-snug">
                            {idea.title}
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {idea.description}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-stone-100 space-y-3">
                        <div className="text-[11px] text-stone-500">{idea.estimatedImpact}</div>
                        <button
                          type="button"
                          onClick={() => handlePromoteIdeaToPlan(idea)}
                          disabled={idea.promotedToPlan}
                          className={`w-full py-2 px-3 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                            idea.promotedToPlan
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-950 text-white hover:bg-stone-800'
                          }`}
                        >
                          {idea.promotedToPlan
                            ? 'Locked in Storyboard & Wallet'
                            : 'Lock into My Event Plan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            VIEW 2: VISUAL CHRONO STORYBOARD (WITH REFERENCE ATTACHMENTS & AUDIO)
           ===================================================================== */}
        {activeTab === 'timeline' && (
          <div className="space-y-8">
            <section className="bg-white border border-stone-200/90 rounded-3xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-stone-200/80">
                <div>
                  <div className="text-xs text-stone-500">
                    Chrono-Synchronized Visual Storyboard · {highImpactTimelineCount} High-Impact
                    Moments
                  </div>
                  <h2 className="text-2xl font-bold text-stone-950 font-editorial mt-0.5">
                    Visual Run-of-Show & Milestone Reference Studio
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F8F5EE] rounded-xl border border-stone-200/70">
                    {(
                      [
                        ['ALL', `All (${timelineItems.length})`],
                        ['HIGH_IMPACT', `Key Visuals (${highImpactTimelineCount})`],
                        ['pending', 'Pending'],
                        ['in-progress', 'In Progress'],
                        ['completed', 'Done'],
                      ] as const
                    ).map(([statusKey, label]) => (
                      <button
                        key={statusKey}
                        type="button"
                        onClick={() => setTimelineFilter(statusKey)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          timelineFilter === statusKey
                            ? 'bg-white text-stone-950 shadow-xs font-semibold'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Run-of-Show PDF</span>
                  </button>
                </div>
              </div>

              {/* Visual Storyboard Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTimelineItems.map((item, idx) => {
                  const hasVisual = Boolean(item.visualReference);
                  const isImpact = Boolean(item.isHighImpact || hasVisual);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
                        isImpact
                          ? 'bg-[#F8F5EE]/90 border-amber-300 shadow-xs'
                          : 'bg-white border-stone-200/90'
                      }`}
                    >
                      {/* Top Visual Reference Banner or Interactive Upload Placeholder */}
                      <div>
                        {item.visualReference ? (
                          <div className="h-52 relative bg-stone-950">
                            <ScenographyArtwork
                              presetId={item.visualReference.presetId}
                              imageUrl={item.visualReference.imageUrl}
                              title={item.visualReference.title}
                              className="w-full h-full"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-xs font-mono-tabular font-semibold text-white">
                                {item.phase} · {item.date}
                              </span>
                              {isImpact && (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-stone-950 text-[11px] font-semibold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-stone-950" />
                                  Key Moment
                                </span>
                              )}
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handlePlayVoiceover(
                                    `Run of show cue for ${item.phase} at ${item.date}: ${item.title}. Assigned to ${item.owner}. ${
                                      item.visualReference?.lightingCue || ''
                                    }`
                                  )
                                }
                                className="p-2 rounded-full bg-black/65 hover:bg-black/85 text-white cursor-pointer"
                                title="Hear Stage Manager Audio Cue"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setLightboxItem({
                                    title: item.title,
                                    phase: `${item.phase} · ${item.date}`,
                                    visual: item.visualReference!,
                                  })
                                }
                                className="p-2 rounded-full bg-black/65 hover:bg-black/85 text-white cursor-pointer"
                                title="Fullscreen Lightbox"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenVisualEditor(item)}
                                className="px-2.5 py-1 rounded-lg bg-black/65 hover:bg-black/85 text-white text-xs font-medium cursor-pointer"
                              >
                                Edit Visual
                              </button>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <div className="text-xs font-semibold text-amber-200">
                                {item.visualReference.title}
                              </div>
                              <div className="text-[11px] text-stone-200 line-clamp-1">
                                {item.visualReference.lightingCue}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-stone-100/70 border-b border-stone-200/80 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs font-mono-tabular text-stone-700">
                              <span className="font-bold">0{idx + 1}</span>
                              <span>·</span>
                              <span className="font-semibold">{item.phase}</span>
                              <span>·</span>
                              <span>{item.date}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenVisualEditor(item)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-stone-300 text-xs font-semibold text-stone-800 flex items-center gap-1.5 cursor-pointer"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
                              <span>Attach Visual Reference</span>
                            </button>
                          </div>
                        )}

                        {/* Card Details */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-xs text-stone-500">
                            <span>
                              Owner: <strong className="text-stone-800">{item.owner}</strong> ·{' '}
                              {item.tag}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleHighImpact(item)}
                              className="text-amber-800 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  isImpact ? 'fill-amber-700 text-amber-700' : 'text-stone-400'
                                }`}
                              />
                              <span>{isImpact ? 'High-Impact' : 'Mark High-Impact'}</span>
                            </button>
                          </div>

                          <h3
                            className={`text-lg font-bold font-editorial ${
                              item.status === 'completed'
                                ? 'line-through text-stone-400'
                                : 'text-stone-950'
                            }`}
                          >
                            {item.title}
                          </h3>

                          {item.notes && (
                            <p className="text-xs text-stone-600 leading-relaxed">{item.notes}</p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Controls */}
                      <div className="px-5 py-3.5 bg-white/80 border-t border-stone-200/70 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleCycleTimelineStatus(item.id)}
                          className={`px-3 py-1.5 text-xs font-mono-tabular font-semibold rounded-xl border transition-colors cursor-pointer ${
                            item.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : item.status === 'in-progress'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {item.status === 'completed'
                            ? 'Completed ✓'
                            : item.status === 'in-progress'
                            ? 'In Progress'
                            : 'Mark Complete'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenVisualEditor(item)}
                            className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 rounded-xl cursor-pointer"
                          >
                            {hasVisual ? 'Change Photo' : '+ Add Photo'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTimelineTask(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Visual Milestone Bar */}
              <form
                onSubmit={handleAddTimelineTask}
                className="pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Phase / Day
                  </label>
                  <input
                    type="text"
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Time Cue</label>
                  <input
                    type="text"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono-tabular bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Showstopper or Milestone Title
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g., Sunset Varmala & Petal Cannon Drop"
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Visual Scenography Preset
                  </label>
                  <select
                    value={newTaskPresetId}
                    onChange={(e) => setNewTaskPresetId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                  >
                    {SCENOGRAPHY_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full px-3 py-2 text-xs font-semibold text-white bg-stone-950 hover:bg-stone-800 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Story Cue</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* =====================================================================
            VIEW 3: 360° INTERACTIVE SPATIAL VENUE & CROWD-FLOW CANVAS
           ===================================================================== */}
        {activeTab === 'spatial' && (
          <div className="space-y-8">
            <SpatialVenueCanvas
              archetypeId={selectedArchetypeId}
              guestCount={guestCount}
              isPlayingAudio={isPlayingAudio}
              onPlayVoiceover={handlePlayVoiceover}
              onAddZoneTask={(title, notes) => {
                const newTask: TimelineItem = {
                  id: 'spatial-cue-' + Date.now(),
                  phase: 'Site Production',
                  date: 'T-3 Hrs',
                  title,
                  owner: 'Technical Director',
                  tag: 'Spatial & Rigging',
                  status: 'pending',
                  notes,
                  isHighImpact: true,
                  visualReference: {
                    presetId: heroPresetId,
                    title,
                    caption: notes,
                    lightingCue: notes,
                    aspectTag: '360° Zone Spec',
                  },
                };
                setTimelineItems((prev) => [...prev, newTask]);
                setSynthesisBanner(`Pinned "${title}" from 360° Venue Canvas to Visual Storyboard.`);
              }}
            />
          </div>
        )}

        {/* =====================================================================
            VIEW 4: SMART WALLET & AI VALUE-ENGINEERING STUDIO
           ===================================================================== */}
        {activeTab === 'budget' && (
          <div className="space-y-8">
            <section className="bg-white border border-stone-200/90 rounded-3xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-stone-200/80">
                <div>
                  <div className="text-xs text-stone-500">
                    Smart Wallet · {formatMoney(costPerGuest)} per guest across {guestCount} guests
                  </div>
                  <h2 className="text-2xl font-bold text-stone-950 font-editorial mt-0.5">
                    Visual Allocation & Gemini Value-Engineering
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleRunBudgetOptimization}
                    disabled={isOptimizingBudget}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-60 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>
                      {isOptimizingBudget
                        ? 'Rebalancing with Gemini...'
                        : 'AI Value-Engineer & Rebalance'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="px-3.5 py-2.5 text-xs font-semibold text-stone-900 bg-[#F8F5EE] hover:bg-stone-200/80 border border-stone-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-800" />
                    <span>Export Budget & Plan PDF</span>
                  </button>
                </div>
              </div>

              {budgetOptimizationResult && (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-amber-900">
                        Gemini Value-Engineering Proposal · Projected Savings:{' '}
                        <span className="font-mono-tabular">
                          {formatMoney(budgetOptimizationResult.projectedSavings)}
                        </span>
                      </div>
                      <p className="text-sm text-stone-800 mt-1">
                        {budgetOptimizationResult.executiveSummary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleApplyRebalancedBudget}
                        className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl cursor-pointer"
                      >
                        Apply Rebalanced Wallet
                      </button>
                      <button
                        type="button"
                        onClick={() => setBudgetOptimizationResult(null)}
                        className="px-3 py-2 text-xs font-medium text-stone-600 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-amber-200/70">
                    {budgetOptimizationResult.savingsStrategies.map((tip, idx) => (
                      <div key={idx} className="text-xs text-stone-800 leading-relaxed">
                        <span className="font-mono-tabular font-semibold text-amber-900">
                          0{idx + 1}.{' '}
                        </span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Category Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryBreakdown.map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() =>
                      setBudgetCategoryFilter(
                        budgetCategoryFilter === cat.category ? 'ALL' : cat.category
                      )
                    }
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                      budgetCategoryFilter === cat.category
                        ? 'bg-stone-950 text-white border-stone-950'
                        : 'bg-[#F8F5EE] border-stone-200/90 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={
                          budgetCategoryFilter === cat.category
                            ? 'text-amber-300 font-medium'
                            : 'text-stone-600 font-medium'
                        }
                      >
                        {cat.category}
                      </span>
                      <span className="font-mono-tabular">{cat.shareOfSpend}%</span>
                    </div>
                    <div className="text-xl font-bold font-mono-tabular">
                      {formatMoney(cat.actual)}
                    </div>
                    <div className="w-full h-1.5 bg-stone-300/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600"
                        style={{ width: `${Math.min(100, cat.shareOfSpend)}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Clean Interactive Expense Cards (Instead of Cramped Clipped Tables) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-stone-500">
                    Active Allocation Lines ({filteredBudgetItems.length})
                  </div>
                  <div className="relative w-60">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={budgetSearch}
                      onChange={(e) => setBudgetSearch(e.target.value)}
                      placeholder="Search allocations..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBudgetItems.map((item) => {
                    const diff = item.planned - item.actual;
                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-[#F8F5EE]/70 border border-stone-200/90 flex flex-col justify-between gap-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-xs text-stone-500">{item.category}</span>
                            <h3 className="text-base font-bold text-stone-950">{item.item}</h3>
                            {item.notes && (
                              <p className="text-xs text-stone-600 leading-relaxed">{item.notes}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteBudgetItem(item.id)}
                            className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="pt-3 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3 font-mono-tabular text-xs">
                            <span className="text-stone-500">
                              Plan: {formatMoney(item.planned)}
                            </span>
                            <span>·</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-stone-700 font-semibold">Actual:</span>
                              <input
                                type="number"
                                value={item.actual}
                                onChange={(e) =>
                                  handleUpdateBudgetActual(item.id, Number(e.target.value))
                                }
                                className="w-24 px-2 py-1 text-right font-mono-tabular bg-white border border-stone-300 rounded-lg text-stone-950 font-semibold"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-mono-tabular ${
                                diff >= 0 ? 'text-emerald-700' : 'text-red-700'
                              }`}
                            >
                              {diff >= 0
                                ? `+${formatMoney(diff)}`
                                : `-${formatMoney(Math.abs(diff))}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleBudgetPaid(item.id)}
                              className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                                item.paid
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-white text-stone-700 border border-stone-200'
                              }`}
                            >
                              {item.paid ? 'Settled ✓' : 'Mark Paid'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Allocation Form */}
              <form
                onSubmit={handleAddBudgetItem}
                className="pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl"
                  >
                    {activeArchetype.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-5">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Allocation Item
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Sangeet Cold-Sparkler & Rose Cannon Package"
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Amount ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={newItemPlanned}
                    onChange={(e) => setNewItemPlanned(e.target.value)}
                    placeholder="1800"
                    className="w-full px-3 py-2 text-xs font-mono-tabular bg-[#F8F5EE] border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full px-3 py-2 text-xs font-semibold text-white bg-stone-950 hover:bg-stone-800 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Wallet</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* =====================================================================
            VIEW 5: VENDOR CONCIERGE + GOOGLE SEARCH LIVE GROUNDING
           ===================================================================== */}
        {activeTab === 'vendors' && (
          <div className="space-y-8">
            {/* Live Google Search Grounding Discovery Card */}
            <section className="bg-stone-950 text-white rounded-3xl p-6 lg:p-8 space-y-5 border border-stone-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Live Google Search Grounding · Real-World Market Intelligence</span>
                  </div>
                  <h2 className="text-2xl font-bold font-editorial mt-1">
                    Discover Real Venues, Suppliers & Weather Benchmarks in {city}
                  </h2>
                </div>

                <form
                  onSubmit={handleRunGroundingSearch}
                  className="flex items-center gap-2 w-full lg:w-auto"
                >
                  <input
                    type="text"
                    value={groundingQuery}
                    onChange={(e) => setGroundingQuery(e.target.value)}
                    placeholder={`Search real venues or vendors in ${city}...`}
                    className="w-full lg:w-80 px-3.5 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingGrounding}
                    className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isSearchingGrounding ? 'Searching Web...' : 'Search Live Market'}
                  </button>
                </form>
              </div>

              {groundingResult && (
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                  <div className="text-xs text-stone-200 whitespace-pre-wrap leading-relaxed">
                    {groundingResult.markdownReport}
                  </div>
                  {groundingResult.sources.length > 0 && (
                    <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-stone-400">Verified Web Sources:</span>
                      {groundingResult.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-amber-300 hover:underline"
                        >
                          [{i + 1}] {src.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Supplier SLA & RFP Studio */}
            <section className="bg-white border border-stone-200/90 rounded-3xl p-6 lg:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
                <div>
                  <div className="text-xs text-stone-500">
                    Supplier SLA Checklists & Automated Contract RFPs
                  </div>
                  <h2 className="text-2xl font-bold text-stone-950 font-editorial mt-0.5">
                    Shortlisted Vendor Roster
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F8F5EE] rounded-xl">
                  {(['ALL', 'Confirmed', 'Contract Sent', 'Negotiating', 'Shortlisted'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setVendorStatusFilter(st)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer ${
                          vendorStatusFilter === st
                            ? 'bg-white text-stone-950 shadow-xs font-semibold'
                            : 'text-stone-600'
                        }`}
                      >
                        {st === 'ALL' ? `All (${vendorList.length})` : st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {activeRfpDraft && (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                    <div>
                      <div className="text-xs font-semibold text-amber-900">
                        Gemini Procurement RFP & Contract SLA · {activeRfpDraft.vendorName}
                      </div>
                      <h3 className="text-base font-bold text-stone-950 mt-0.5">
                        {activeRfpDraft.subjectLine}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `Subject: ${activeRfpDraft.subjectLine}\n\n${activeRfpDraft.emailBody}`
                          );
                          setCopiedRfp(true);
                          setTimeout(() => setCopiedRfp(false), 2000);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedRfp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedRfp ? 'Copied' : 'Copy RFP'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveRfpDraft(null)}
                        className="px-3 py-1.5 text-xs font-medium text-stone-600 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7">
                      <pre className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
                        {activeRfpDraft.emailBody}
                      </pre>
                    </div>
                    <div className="lg:col-span-5 space-y-3">
                      <div className="text-xs font-semibold text-stone-600">
                        Negotiation Levers & Mandatory SLA Clauses
                      </div>
                      {activeRfpDraft.negotiationLevers.map((lev, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-800"
                        >
                          <strong className="text-amber-900">Lever 0{i + 1}:</strong> {lev}
                        </div>
                      ))}
                      {activeRfpDraft.mandatoryContractClauses.map((cl, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-800"
                        >
                          <strong className="text-stone-900">SLA 0{i + 1}:</strong> {cl}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-6 rounded-2xl border border-stone-200 bg-[#F8F5EE]/70 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs text-stone-500">
                            {vendor.role} · Rating {vendor.rating.toFixed(1)} · {vendor.contact}
                          </div>
                          <h3 className="text-lg font-bold text-stone-950 font-editorial mt-0.5">
                            {vendor.name}
                          </h3>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-bold text-stone-950 font-mono-tabular">
                            {formatMoney(vendor.quoteAmount)}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCycleVendorStatus(vendor.id)}
                            className={`mt-1 px-2.5 py-0.5 text-xs font-medium rounded-lg border cursor-pointer ${
                              vendor.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-white text-stone-700 border-stone-200'
                            }`}
                          >
                            {vendor.status}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed">{vendor.notes}</p>

                      <div className="pt-2 border-t border-stone-200/70 space-y-1">
                        {vendor.slaChecklist.map((checkItem, idx) => (
                          <div key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                            <span className="font-mono-tabular text-stone-400">0{idx + 1}.</span>
                            <span>{checkItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleGenerateVendorRfp(vendor)}
                        disabled={generatingRfpVendorId === vendor.id}
                        className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-800" />
                        <span>
                          {generatingRfpVendorId === vendor.id
                            ? 'Drafting with Gemini...'
                            : 'Generate AI RFP & Contract'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleAddVendor}
                className="pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    placeholder="e.g., Heritage Floral & Canopy Studio"
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Role</label>
                  <input
                    type="text"
                    value={newVendorRole}
                    onChange={(e) => setNewVendorRole(e.target.value)}
                    placeholder="Scenography & Florals"
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Quote ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={newVendorQuote}
                    onChange={(e) => setNewVendorQuote(e.target.value)}
                    placeholder="3500"
                    className="w-full px-3 py-2 text-xs font-mono-tabular bg-[#F8F5EE] border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-600 mb-1">Notes</label>
                  <input
                    type="text"
                    value={newVendorNotes}
                    onChange={(e) => setNewVendorNotes(e.target.value)}
                    placeholder="Turnkey package"
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full px-3 py-2 text-xs font-semibold text-white bg-stone-950 hover:bg-stone-800 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Supplier</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>

      {/* =====================================================================
          FLOATING MULTIMODAL AI OMNI-BAR (VOICE + VISION + TEXT COMMAND)
         ===================================================================== */}
      <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto bg-stone-950/95 text-white backdrop-blur-md border border-stone-700/80 rounded-2xl p-2.5 shadow-2xl pointer-events-auto flex items-center gap-2">
          {/* Multimodal Vision Camera Trigger */}
          <button
            type="button"
            onClick={() => setIsVisionModalOpen(true)}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors shrink-0 cursor-pointer"
            title="Scan Inspiration Photo or Quote with Gemini Vision"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Multimodal Voice Memo Trigger (gemini-3.5-transcribe) */}
          <button
            type="button"
            onClick={handleToggleVoiceRecording}
            disabled={isTranscribingVoice}
            className={`p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
              isRecordingVoice
                ? 'bg-red-600 text-white'
                : 'bg-stone-800 hover:bg-stone-700 text-amber-300'
            }`}
            title="Speak a Voice Memo to Gemini Audio"
          >
            {isRecordingVoice ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecordingVoice && (
              <span className="text-[11px] font-semibold pr-1">Stop & Transcribe</span>
            )}
          </button>

          {/* Natural Language Command Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isTranscribingVoice
                  ? 'Transcribing your voice note with Gemini 3.5 Transcribe...'
                  : 'Ask AI Architect, speak a voice note, or scan a photo to update your event...'
              }
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-transparent text-white placeholder-stone-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isCopilotThinking || !inputMessage.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Orchestrate</span>
            </button>
          </form>

          {/* Open Copilot History Drawer */}
          <button
            type="button"
            onClick={() => setIsCopilotDrawerOpen((p) => !p)}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Copilot ({messages.length})
          </button>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: INSTAGRAM-STYLE FULLSCREEN CEREMONY STORY REEL PLAYER
         ===================================================================== */}
      {activeStoryItem && activeStoryIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveStoryIndex(null)}
        >
          <div
            className="relative w-full max-w-md h-[640px] rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full-Bleed Story Artwork */}
            <ScenographyArtwork
              presetId={
                activeStoryItem.visualReference?.presetId || activeArchetype.heroVisualPresetId
              }
              imageUrl={activeStoryItem.visualReference?.imageUrl}
              title={activeStoryItem.title}
              className="w-full h-full absolute inset-0"
            />

            {/* Top Story Progress Bars & Header */}
            <div className="relative z-10 p-4 space-y-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-1">
                {timelineItems.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveStoryIndex(idx)}
                    className="flex-1 h-1 rounded-full overflow-hidden bg-white/30 cursor-pointer"
                  >
                    <div
                      className={`h-full ${
                        idx <= activeStoryIndex ? 'bg-amber-400' : 'bg-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="text-xs font-mono-tabular text-amber-300">
                    {activeStoryItem.phase} · {activeStoryItem.date}
                  </div>
                  <div className="text-xs text-stone-300">
                    Lead: {activeStoryItem.owner} · {activeStoryItem.tag}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayVoiceover(
                        `${activeStoryItem.phase}, at ${activeStoryItem.date}. ${activeStoryItem.title}. ${
                          activeStoryItem.notes || ''
                        }. ${activeStoryItem.visualReference?.lightingCue || ''}`
                      )
                    }
                    className="px-3 py-1.5 rounded-full bg-amber-400 text-stone-950 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingAudio ? 'Speaking' : 'Voice Cue'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStoryIndex(null)}
                    className="p-1.5 rounded-full bg-black/60 text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prev / Next Navigation Paddles */}
            <div className="relative z-10 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={() =>
                  setActiveStoryIndex(
                    (activeStoryIndex - 1 + timelineItems.length) % timelineItems.length
                  )
                }
                className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveStoryIndex((activeStoryIndex + 1) % timelineItems.length)}
                className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Story Content & Actions */}
            <div className="relative z-10 p-6 space-y-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-bold font-editorial leading-snug">
                  {activeStoryItem.title}
                </h3>
                {activeStoryItem.notes && (
                  <p className="text-xs text-stone-200 leading-relaxed">{activeStoryItem.notes}</p>
                )}
                {activeStoryItem.visualReference?.lightingCue && (
                  <div className="text-xs text-amber-300 font-mono-tabular pt-1">
                    Lighting Cue: {activeStoryItem.visualReference.lightingCue}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => handleCycleTimelineStatus(activeStoryItem.id)}
                  className="px-4 py-2 rounded-xl bg-white text-stone-950 text-xs font-semibold cursor-pointer"
                >
                  Status: {activeStoryItem.status.toUpperCase()}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item = activeStoryItem;
                    setActiveStoryIndex(null);
                    handleOpenVisualEditor(item);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Customize Visual</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: GEMINI MULTIMODAL VISION MOODBOARD & QUOTE SCANNER
         ===================================================================== */}
      {isVisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-800 font-semibold">
                  Gemini 3.8 Flash Multimodal Vision Studio
                </div>
                <h3 className="text-lg font-bold text-stone-950 font-editorial">
                  Scan Any Decor Photo, Floorplan, or Vendor Quote
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVisionModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              <form onSubmit={handleRunVisionAnalysis} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5">
                    <label className="w-full h-40 rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-800 bg-[#F8F5EE] flex flex-col items-center justify-center text-center p-4 cursor-pointer overflow-hidden relative">
                      {visionImagePreview ? (
                        <img
                          src={visionImagePreview}
                          alt="Vision Scan Preview"
                          className="w-full h-full object-cover absolute inset-0"
                        />
                      ) : (
                        <>
                          <Camera className="w-7 h-7 text-amber-800 mb-2" />
                          <span className="text-xs font-semibold text-stone-800">
                            Upload Inspiration Photo
                          </span>
                          <span className="text-[11px] text-stone-500 mt-0.5">
                            PNG / JPG decor, stage, or quote
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleVisionImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <label className="block text-xs font-medium text-stone-600">
                      What should Gemini Vision extract or adapt?
                    </label>
                    <textarea
                      rows={3}
                      value={visionPrompt}
                      onChange={(e) => setVisionPrompt(e.target.value)}
                      placeholder="e.g., Reverse-engineer this floral mandap / stage setup, extract the 4-color hex palette, estimate production cost for our guest count, and suggest a 30% cost-saving hack..."
                      className="w-full p-3 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                    />
                    <button
                      type="submit"
                      disabled={isAnalyzingVision}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl cursor-pointer"
                    >
                      {isAnalyzingVision
                        ? 'Scanning Image with Gemini Multimodal Vision...'
                        : 'Analyze Scenography, Palette & Cost'}
                    </button>
                  </div>
                </div>
              </form>

              {visionResult && (
                <div className="p-5 rounded-2xl bg-[#F8F5EE] border border-amber-300 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-amber-900">
                        {visionResult.pillar} · Cue: {visionResult.suggestedTimelinePhase}
                      </span>
                      <h4 className="text-lg font-bold text-stone-950 font-editorial">
                        {visionResult.title}
                      </h4>
                    </div>
                    <div className="text-right font-mono-tabular">
                      <div className="text-xs text-stone-500">Est. Production</div>
                      <div className="text-lg font-bold text-stone-950">
                        {formatMoney(visionResult.estimatedCost)}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {visionResult.architecturalSummary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-stone-200">
                      <strong className="text-stone-900 block mb-0.5">Lighting & DMX Cue:</strong>
                      <span className="text-stone-600">{visionResult.lightingAndMoodCue}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-stone-200">
                      <strong className="text-emerald-800 block mb-0.5">
                        Value-Engineering Hack:
                      </strong>
                      <span className="text-stone-600">{visionResult.costSavingHack}</span>
                    </div>
                  </div>

                  {/* Extracted Swatches */}
                  <div className="flex flex-wrap items-center gap-2">
                    {visionResult.extractedPalette.map((sw) => (
                      <div
                        key={sw.hex}
                        className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 flex items-center gap-2 text-xs"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <span className="font-medium text-stone-800">{sw.name}</span>
                        <span className="font-mono-tabular text-stone-400">{sw.hex}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handlePromoteVisionResultToWorkspace}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-950 hover:bg-stone-800 rounded-xl cursor-pointer"
                  >
                    Add Scanned Look to Vibe Feed, Story Reels & Smart Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: TIMELINE VISUAL REFERENCE ATTACHMENT STUDIO
         ===================================================================== */}
      {editingTimelineVisualItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-500 font-mono-tabular">
                  {editingTimelineVisualItem.phase} · {editingTimelineVisualItem.date}
                </div>
                <h3 className="text-lg font-bold text-stone-950 font-editorial">
                  Attach Visual Reference · {editingTimelineVisualItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTimelineVisualItem(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveTimelineVisual}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              <div className="h-48 rounded-2xl overflow-hidden border border-stone-200 relative bg-stone-950">
                <ScenographyArtwork
                  presetId={visualDraftPresetId}
                  imageUrl={visualDraftImageUrl}
                  title={visualDraftTitle}
                  className="w-full h-full"
                  showBadge={true}
                />
                <div className="absolute bottom-0 inset-x-0 p-3.5">
                  <div className="text-xs font-semibold text-white">{visualDraftTitle}</div>
                  <div className="text-[11px] text-stone-300 truncate">{visualDraftCaption}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Option A · Select Curated Architectural Scenography Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SCENOGRAPHY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setVisualDraftPresetId(preset.id);
                        setVisualDraftImageUrl('');
                        setVisualDraftTitle(preset.title);
                        setVisualDraftCaption(preset.defaultCaption);
                        setVisualDraftLightingCue(preset.defaultLightingCue);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        visualDraftPresetId === preset.id && !visualDraftImageUrl
                          ? 'bg-amber-50 border-amber-700 text-stone-950 font-semibold'
                          : 'bg-[#F8F5EE] border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="text-[11px] font-medium truncate">{preset.title}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{preset.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Option B · Upload Reference Photo or Paste Image URL
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label className="px-4 py-2 text-xs font-semibold text-stone-900 bg-[#F8F5EE] hover:bg-stone-200/70 border border-stone-300 rounded-xl cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-800" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'timeline')}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={visualDraftImageUrl}
                    onChange={(e) => setVisualDraftImageUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Visual Reference Title
                  </label>
                  <input
                    type="text"
                    value={visualDraftTitle}
                    onChange={(e) => setVisualDraftTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Lighting & Production Cue
                  </label>
                  <input
                    type="text"
                    value={visualDraftLightingCue}
                    onChange={(e) => setVisualDraftLightingCue(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                {editingTimelineVisualItem.visualReference ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveTimelineVisual(editingTimelineVisualItem.id);
                      setEditingTimelineVisualItem(null);
                    }}
                    className="text-xs font-medium text-red-700 hover:underline cursor-pointer"
                  >
                    Remove Visual Reference
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTimelineVisualItem(null)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl cursor-pointer"
                  >
                    Save Visual Reference
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: FULLSCREEN MOODBOARD LIGHTBOX VIEWER
         ===================================================================== */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="bg-stone-950 border border-stone-800 rounded-3xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between text-stone-100">
              <div>
                <div className="text-xs text-amber-400 font-mono-tabular">
                  {lightboxItem.phase}
                </div>
                <h3 className="text-lg font-bold font-editorial">{lightboxItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="p-1.5 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[420px] relative">
              <ScenographyArtwork
                presetId={lightboxItem.visual.presetId}
                imageUrl={lightboxItem.visual.imageUrl}
                title={lightboxItem.visual.title}
                className="w-full h-full"
              />
            </div>
            <div className="p-6 bg-stone-900 space-y-2 text-stone-200">
              <div className="text-sm font-semibold text-white">
                {lightboxItem.visual.title}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {lightboxItem.visual.caption}
              </p>
              {lightboxItem.visual.lightingCue && (
                <div className="pt-2 text-xs text-amber-300 font-mono-tabular">
                  Lighting & Staging Cue: {lightboxItem.visual.lightingCue}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SLIDE-OVER AGENTIC COPILOT DRAWER
         ===================================================================== */}
      {isCopilotDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full flex flex-col border-l border-stone-200 shadow-2xl">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-500">
                  Multimodal Agentic Copilot · Text, Voice & One-Click Actions
                </div>
                <h3 className="text-base font-bold text-stone-950 font-editorial">
                  UtsavaVaibhavam AI Architect
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCopilotDrawerOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-stone-900 text-white'
                        : 'bg-[#F8F5EE] border border-stone-200 text-stone-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.proposedActions && msg.proposedActions.length > 0 && (
                    <div className="mt-2 w-full space-y-1.5">
                      {msg.proposedActions.map((act) => (
                        <div
                          key={act.actionId}
                          className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2"
                        >
                          <span className="text-xs font-medium text-stone-800 truncate">
                            {act.summaryLabel}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleExecuteAgentAction(msg.id, act)}
                            disabled={act.applied}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                              act.applied
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-800 text-white'
                            }`}
                          >
                            {act.applied ? 'Applied ✓' : 'Apply to Event'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isCopilotThinking && (
                <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-800 animate-spin" />
                  <span>Orchestrating workspace actions...</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-200 space-y-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {activeArchetype.promptSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(sug)}
                    className="px-2.5 py-1 text-[11px] bg-[#F8F5EE] hover:bg-stone-200 rounded-lg text-stone-700 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Copilot to add ceremonies, rebalance budget, or draft SLAs..."
                  className="flex-1 px-3.5 py-2 text-xs bg-[#F8F5EE] border border-stone-200 rounded-xl"
                />
                <button
                  type="submit"
                  disabled={isCopilotThinking || !inputMessage.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 rounded-xl cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          FORMATTED PDF PRODUCTION REPORT PREVIEW & EXPORT MODAL
         ===================================================================== */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        eventTitle={eventTitle}
        archetypeLabel={activeArchetype.label}
        city={city}
        eventDate={eventDate}
        guestCount={guestCount}
        budget={budget}
        totalPlanned={totalPlanned}
        totalActual={totalActual}
        totalPaid={totalPaid}
        costPerGuest={costPerGuest}
        currency={currency}
        formatMoney={formatMoney}
        theme={theme}
        dietaryNotes={dietaryNotes}
        culturalNotes={culturalNotes}
        aiConcept={aiConcept}
        timelineItems={timelineItems}
        budgetItems={budgetItems}
        categoryBreakdown={categoryBreakdown}
        vendorList={vendorList}
        personalizedIdeas={personalizedIdeas}
        onExportMarkdown={handleExportMasterRunbook}
        onSuccessBanner={(msg) => setSynthesisBanner(msg)}
      />
    </div>
  );
}
