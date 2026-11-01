import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  RefreshCw,
  Eye,
  Clock,
} from 'lucide-react';
import {
  BudgetItem,
  EventConcept,
  PersonalizedIdea,
  TimelineItem,
  VendorItem,
} from '../types/event';
import { ScenographyArtwork } from './ScenographyArtwork';
import { generateEventPlanPdf, PdfExportOptions } from '../utils/pdfExporter';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  archetypeLabel: string;
  city: string;
  eventDate: string;
  guestCount: number;
  budget: number;
  totalPlanned: number;
  totalActual: number;
  totalPaid: number;
  costPerGuest: number;
  currency: 'USD' | 'INR';
  formatMoney: (amount: number) => string;
  theme: string;
  dietaryNotes: string;
  culturalNotes: string;
  aiConcept: EventConcept;
  timelineItems: TimelineItem[];
  budgetItems: BudgetItem[];
  categoryBreakdown: Array<{
    category: string;
    planned: number;
    actual: number;
    count: number;
    shareOfSpend: number;
  }>;
  vendorList: VendorItem[];
  personalizedIdeas: PersonalizedIdea[];
  onExportMarkdown: () => void;
  onSuccessBanner: (msg: string) => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  archetypeLabel,
  city,
  eventDate,
  guestCount,
  budget,
  totalPlanned,
  totalActual,
  totalPaid,
  costPerGuest,
  currency,
  formatMoney,
  theme,
  dietaryNotes,
  culturalNotes,
  aiConcept,
  timelineItems,
  budgetItems,
  categoryBreakdown,
  vendorList,
  personalizedIdeas,
  onExportMarkdown,
  onSuccessBanner,
}) => {
  const [options, setOptions] = useState<PdfExportOptions>({
    includeVisualCues: true,
    includeBudgetSummary: true,
    includeVendorRoster: true,
    includeIdeasLookbook: true,
    preparedBy: 'UtsavaVaibhavam AI Executive Producer',
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  if (!isOpen) return null;

  const variance = budget - totalActual;
  const highImpactCues = timelineItems.filter(
    (t) => t.isHighImpact || Boolean(t.visualReference)
  );

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateEventPlanPdf({
        eventTitle,
        archetypeLabel,
        city,
        eventDate,
        guestCount,
        budget,
        totalPlanned,
        totalActual,
        totalPaid,
        costPerGuest,
        currency,
        theme,
        dietaryNotes,
        culturalNotes,
        aiConcept,
        timelineItems,
        budgetItems,
        categoryBreakdown,
        vendorList,
        personalizedIdeas,
        options,
      });
      onSuccessBanner(
        `Exported formatted PDF report ("${eventTitle}") with ${timelineItems.length} Run-of-Show cues & Budget Ledger.`
      );
      onClose();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-stone-950 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-amber-300">
                Production Dossier & Master Run-of-Show PDF Exporter
              </p>
              <h3 className="text-lg font-bold font-editorial">
                Export Formatted PDF Report — {eventTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              aria-label="Export Master Run of Show Executive PDF dossier"
              title="Download executive PDF dossier"
              disabled={isGeneratingPdf}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              {isGeneratingPdf ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                {isGeneratingPdf ? 'Rendering PDF...' : 'Download PDF Report (.pdf)'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close export dossier modal"
              title="Close modal"
              className="p-2 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Left Options + Right Live Dossier Preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
          {/* Left 4 Columns: Export Configuration & Controls */}
          <div className="lg:col-span-4 p-6 bg-[#F8F5EE] space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                Report Configuration
              </p>
              <p className="text-xs text-stone-600">
                Customize which sections and visual storyboard thumbnails are embedded into your multi-page A4 PDF report.
              </p>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeVisualCues}
                  onChange={(e) =>
                    setOptions((p) => ({ ...p, includeVisualCues: e.target.checked }))
                  }
                  className="mt-0.5 accent-amber-800"
                />
                <div className="text-xs">
                  <p className="font-semibold text-stone-900">
                    Embed Visual Cues & Scenography Thumbnails
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Renders artwork thumbnails, lighting/DMX cues, and staging notes for all {highImpactCues.length} high-impact milestones.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeBudgetSummary}
                  onChange={(e) =>
                    setOptions((p) => ({ ...p, includeBudgetSummary: e.target.checked }))
                  }
                  className="mt-0.5 accent-amber-800"
                />
                <div className="text-xs">
                  <p className="font-semibold text-stone-900">
                    Include Smart Wallet Budget & Category Ledger
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Includes category allocation bars ({categoryBreakdown.length} categories) and all {budgetItems.length} line items with Planned vs. Actual variance.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeVendorRoster}
                  onChange={(e) =>
                    setOptions((p) => ({ ...p, includeVendorRoster: e.target.checked }))
                  }
                  className="mt-0.5 accent-amber-800"
                />
                <div className="text-xs">
                  <p className="font-semibold text-stone-900">
                    Include Vendor SLA & Procurement Roster
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Includes all {vendorList.length} vendors, contract status, quotes, and mandatory SLA clauses.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeIdeasLookbook}
                  onChange={(e) =>
                    setOptions((p) => ({ ...p, includeIdeasLookbook: e.target.checked }))
                  }
                  className="mt-0.5 accent-amber-800"
                />
                <div className="text-xs">
                  <p className="font-semibold text-stone-900">
                    Include Curated Guest Experience Ideas
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Appends {personalizedIdeas.length} signature experience concepts and Executive Sign-Off block.
                  </p>
                </div>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Prepared By / Production Credit Line
              </label>
              <input
                type="text"
                value={options.preparedBy}
                onChange={(e) =>
                  setOptions((p) => ({ ...p, preparedBy: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl text-stone-900"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-60 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isGeneratingPdf ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingPdf
                    ? 'Generating Multi-Page PDF...'
                    : 'Download Formatted PDF Report (.pdf)'}
                </span>
              </button>

              <button
                type="button"
                onClick={onExportMarkdown}
                className="w-full py-2.5 px-4 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200/90 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Also Download Raw Markdown (.md)</span>
              </button>
            </div>
          </div>

          {/* Right 8 Columns: Interactive Visual Preview of the PDF Dossier */}
          <div className="lg:col-span-8 p-6 bg-stone-100/80 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="font-semibold flex items-center gap-1.5 text-stone-800">
                <Eye className="w-3.5 h-3.5 text-amber-800" />
                <span>Live PDF Dossier Sheet Preview (A4 Multi-Page Layout)</span>
              </span>
              <span className="font-mono-tabular">
                {timelineItems.length} Cues · {budgetItems.length} Budget Lines · {vendorList.length} Vendors
              </span>
            </div>

            {/* Simulated A4 Dossier Sheet */}
            <div className="bg-white border border-stone-300 rounded-2xl p-6 shadow-md space-y-6">
              {/* Cover Banner */}
              <div className="bg-stone-950 text-white rounded-xl p-5 space-y-2 border-l-4 border-amber-500">
                <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-amber-300">
                  UTSAVAVAIBHAVAM AI · {archetypeLabel.toUpperCase()}
                </p>
                <h4 className="text-xl font-bold font-editorial">{eventTitle}</h4>
                <p className="text-xs text-stone-300">
                  Venue: {city} · Date: {eventDate} · Theme: {theme} · {guestCount} Guests
                </p>
                <p className="text-[11px] text-stone-400">
                  Prepared By: {options.preparedBy}
                </p>
              </div>

              {/* 4-Card KPI Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-stone-200/90">
                  <p className="text-[10px] font-mono-tabular uppercase text-stone-500">
                    Target Budget
                  </p>
                  <p className="text-sm font-bold font-mono-tabular text-stone-950 mt-0.5">
                    {formatMoney(budget)}
                  </p>
                  <p className="text-[11px] text-stone-600 font-mono-tabular">
                    Planned: {formatMoney(totalPlanned)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-stone-200/90">
                  <p className="text-[10px] font-mono-tabular uppercase text-stone-500">
                    Committed Spend
                  </p>
                  <p className="text-sm font-bold font-mono-tabular text-stone-950 mt-0.5">
                    {formatMoney(totalActual)}
                  </p>
                  <p className="text-[11px] text-stone-600 font-mono-tabular">
                    {formatMoney(costPerGuest)} / guest
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-stone-200/90">
                  <p className="text-[10px] font-mono-tabular uppercase text-stone-500">
                    {variance >= 0 ? 'Budget Buffer' : 'Overrun'}
                  </p>
                  <p
                    className={`text-sm font-bold font-mono-tabular mt-0.5 ${
                      variance >= 0 ? 'text-emerald-800' : 'text-red-700'
                    }`}
                  >
                    {variance >= 0 ? '+' : '-'}
                    {formatMoney(Math.abs(variance))}
                  </p>
                  <p className="text-[11px] text-stone-600 font-mono-tabular">
                    Paid: {formatMoney(totalPaid)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-stone-200/90">
                  <p className="text-[10px] font-mono-tabular uppercase text-stone-500">
                    Visual Cues
                  </p>
                  <p className="text-sm font-bold font-mono-tabular text-stone-950 mt-0.5">
                    {highImpactCues.length} Visual Cues
                  </p>
                  <p className="text-[11px] text-stone-600">
                    of {timelineItems.length} total milestones
                  </p>
                </div>
              </div>

              {/* Section 1 Preview: Concept & Color Swatches */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  01 · Executive Concept & Color Story — {aiConcept.conceptName}
                </p>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {aiConcept.editorialNarrative}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {aiConcept.colorPalette.map((swatch, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#F8F5EE] border border-stone-200/80"
                    >
                      <span
                        className="w-5 h-5 rounded-md shrink-0 border border-stone-300"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-stone-900 truncate">
                          {swatch.name}
                        </p>
                        <p className="text-[10px] font-mono-tabular text-stone-500">
                          {swatch.hex}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2 Preview: Run of Show & Visual Cues */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    02 · Chrono-Synchronized Run-of-Show & Visual Cues
                  </p>
                  <span className="text-[11px] font-mono-tabular text-stone-500">
                    {options.includeVisualCues
                      ? 'Visual Thumbnails & DMX Cues Enabled'
                      : 'Compact Text Mode'}
                  </span>
                </div>

                <div className="space-y-2">
                  {timelineItems.map((cue, idx) => (
                    <div
                      key={cue.id}
                      className="p-3 rounded-xl bg-[#F8F5EE] border border-stone-200/90 flex flex-col sm:flex-row gap-3 items-start"
                    >
                      {options.includeVisualCues &&
                        (cue.visualReference || cue.isHighImpact) && (
                          <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-stone-300">
                            <ScenographyArtwork
                              presetId={
                                cue.visualReference?.presetId || 'kumbakonam-mandapam'
                              }
                              imageUrl={cue.visualReference?.imageUrl}
                              title={cue.title}
                              className="w-full h-full"
                            />
                          </div>
                        )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular text-amber-900">
                          <span className="font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Cue {String(idx + 1).padStart(2, '0')} · {cue.phase} ({cue.date})
                          </span>
                          <span className="text-stone-600">
                            Owner: {cue.owner} · [{cue.status.toUpperCase()}]
                          </span>
                        </div>
                        <p className="text-xs font-bold text-stone-950">{cue.title}</p>
                        {options.includeVisualCues && cue.visualReference && (
                          <p className="text-[11px] text-stone-600">
                            <strong className="text-stone-800">Lighting & Staging:</strong>{' '}
                            {cue.visualReference.lightingCue}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3 Preview: Budget Summary */}
              {options.includeBudgetSummary && (
                <div className="space-y-2.5 pt-3 border-t border-stone-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    03 · Smart Wallet Budget Summary ({budgetItems.length} Line Items)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categoryBreakdown.map((cat) => (
                      <div
                        key={cat.category}
                        className="p-2.5 rounded-lg bg-[#F8F5EE] border border-stone-200/80 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-900">
                          {cat.category}
                        </span>
                        <span className="font-mono-tabular text-amber-900 font-semibold">
                          {formatMoney(cat.actual)} ({cat.shareOfSpend}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ready Footer */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Ready for client & stakeholder sign-off. Clicking{' '}
                    <strong>Download PDF Report (.pdf)</strong> generates a vector A4 PDF with embedded visual thumbnails.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
