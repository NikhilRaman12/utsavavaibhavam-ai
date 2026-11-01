export type EventArchetypeId = 'kumbakonam' | 'shaadi' | 'wedding' | 'birthday' | 'community';

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface EventConcept {
  conceptName: string;
  editorialNarrative: string;
  spatialScenography: string;
  recommendedCatering: string;
  signatureMoment: string;
  logisticsRiskAdvisory: string;
  vibeKeywords: string[];
  colorPalette: ColorSwatch[];
}

export interface PersonalizedIdea {
  id: string;
  pillar: string;
  title: string;
  description: string;
  estimatedImpact: string;
  costEstimate: number;
  promotedToPlan?: boolean;
  visualPresetId?: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  planned: number;
  actual: number;
  paid: boolean;
  notes?: string;
}

export interface TimelineVisualReference {
  presetId?: string;
  imageUrl?: string;
  title: string;
  caption: string;
  lightingCue?: string;
  aspectTag?: string;
}

export interface TimelineItem {
  id: string;
  phase: string;
  date: string;
  title: string;
  owner: string;
  tag: string;
  status: 'completed' | 'in-progress' | 'pending';
  notes?: string;
  isHighImpact?: boolean;
  visualReference?: TimelineVisualReference;
}

export interface VendorItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  quoteAmount: number;
  status: 'Confirmed' | 'Contract Sent' | 'Shortlisted' | 'Negotiating';
  contact: string;
  notes: string;
  slaChecklist: string[];
}

export interface EventArchetypeConfig {
  id: EventArchetypeId;
  label: string;
  shortLabel: string;
  tagline: string;
  heroVisualPresetId: string;
  heroVisualCaption: string;
  defaultTitle: string;
  defaultCity: string;
  defaultDate: string;
  defaultBudget: number;
  defaultGuests: number;
  defaultDietaryNotes: string;
  defaultCulturalNotes: string;
  categories: string[];
  themes: string[];
  promptSuggestions: string[];
  defaultConcept: EventConcept;
  sampleIdeas: PersonalizedIdea[];
  sampleTimelines: TimelineItem[];
  sampleBudgets: BudgetItem[];
  sampleVendors: VendorItem[];
}

export interface ProposedAgentAction {
  actionId: string;
  actionType: 'ADD_BUDGET_ITEM' | 'ADD_TIMELINE_TASK' | 'ADD_VENDOR' | 'ADD_IDEA';
  summaryLabel: string;
  applied?: boolean;
  budgetItem?: {
    category: string;
    item: string;
    planned: number;
    actual: number;
    notes?: string;
  };
  timelineItem?: {
    phase: string;
    date: string;
    title: string;
    owner: string;
    tag: string;
    notes?: string;
    isHighImpact?: boolean;
  };
  vendorItem?: {
    name: string;
    role: string;
    quoteAmount: number;
    contact: string;
    notes: string;
  };
  ideaItem?: {
    pillar: string;
    title: string;
    description: string;
    estimatedImpact: string;
    costEstimate: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  followUpPrompts?: string[];
  proposedActions?: ProposedAgentAction[];
}

export interface RfpDraft {
  vendorId: string;
  vendorName: string;
  subjectLine: string;
  emailBody: string;
  negotiationLevers: string[];
  mandatoryContractClauses: string[];
}
