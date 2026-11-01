import { jsPDF } from 'jspdf';
import {
  BudgetItem,
  EventConcept,
  PersonalizedIdea,
  TimelineItem,
  VendorItem,
} from '../types/event';

export interface PdfExportOptions {
  includeVisualCues: boolean;
  includeBudgetSummary: boolean;
  includeVendorRoster: boolean;
  includeIdeasLookbook: boolean;
  preparedBy: string;
}

export interface PdfExportPayload {
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
  options: PdfExportOptions;
}

// Sanitize text for standard PDF WinAnsi encoding so no garbled characters appear
function cleanPdfText(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/₹/g, 'INR ')
    .replace(/·/g, ' | ')
    .replace(/—/g, ' - ')
    .replace(/–/g, '-')
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'")
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
    .trim();
}

function formatPdfMoney(amount: number, currency: 'USD' | 'INR'): string {
  const rounded = Math.round(Number(amount) || 0);
  const prefix = currency === 'INR' ? 'INR ' : '$';
  return `${prefix}${rounded.toLocaleString('en-IN')}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16) || 146;
    const g = parseInt(cleaned.slice(2, 4), 16) || 64;
    const b = parseInt(cleaned.slice(4, 6), 16) || 14;
    return [r, g, b];
  }
  return [146, 64, 14];
}

// Renders a crisp architectural thumbnail on an offscreen HTML5 canvas for PDF embedding
async function renderVisualCueThumbnail(
  presetId: string | undefined,
  imageUrl: string | undefined
): Promise<string | null> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // If user uploaded a custom dataURL image, try drawing it first
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      const loaded = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = imageUrl;
      });
      if (loaded) {
        return canvas.toDataURL('image/jpeg', 0.88);
      }
    }

    const id = presetId || 'kumbakonam-mandapam';

    // Background gradient per preset
    const grad = ctx.createLinearGradient(0, 0, 320, 180);
    if (id === 'kumbakonam-mandapam') {
      grad.addColorStop(0, '#2B0908');
      grad.addColorStop(0.55, '#5C1612');
      grad.addColorStop(1, '#9E3B14');
    } else if (id === 'mandap-courtyard') {
      grad.addColorStop(0, '#2A0812');
      grad.addColorStop(0.6, '#5A1224');
      grad.addColorStop(1, '#9D3B23');
    } else if (id === 'sangeet-glam' || id === 'neon-lounge') {
      grad.addColorStop(0, '#090D24');
      grad.addColorStop(0.6, '#1E1B4B');
      grad.addColorStop(1, '#6D28D9');
    } else if (id === 'Botanical-glasshouse' || id === 'glasshouse-arch') {
      grad.addColorStop(0, '#13261F');
      grad.addColorStop(0.6, '#234236');
      grad.addColorStop(1, '#4A6B5B');
    } else {
      grad.addColorStop(0, '#1C1917');
      grad.addColorStop(0.6, '#44403C');
      grad.addColorStop(1, '#78350F');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 180);

    // Subtle warm radial glow
    const glow = ctx.createRadialGradient(160, 82, 10, 160, 82, 120);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.42)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 320, 180);

    // Floor stage line & Athangudi / carpet runner
    ctx.fillStyle = 'rgba(20, 12, 10, 0.72)';
    ctx.fillRect(0, 138, 320, 42);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, 138);
    ctx.lineTo(300, 138);
    ctx.stroke();

    // Draw architectural columns & arch/gopuram motif
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;

    if (id === 'kumbakonam-mandapam' || id === 'mandap-courtyard') {
      // Teakwood Mandapam pillars
      ctx.fillStyle = '#92400E';
      ctx.fillRect(54, 42, 10, 96);
      ctx.fillRect(256, 42, 10, 96);
      ctx.fillRect(92, 50, 8, 88);
      ctx.fillRect(220, 50, 8, 88);

      // Top Mandapam lintel
      ctx.fillStyle = '#B45309';
      ctx.fillRect(42, 34, 236, 10);

      // Mango-leaf & jasmine thoranam swags
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2;
      for (let x = 58; x < 245; x += 38) {
        ctx.beginPath();
        ctx.arc(x + 19, 44, 19, 0, Math.PI, false);
        ctx.stroke();
      }

      // Suspended Brass Oonjal Swing or Sacred Homa Centerpiece
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(135, 44);
      ctx.lineTo(135, 105);
      ctx.moveTo(185, 44);
      ctx.lineTo(185, 105);
      ctx.stroke();

      ctx.fillStyle = '#D97706';
      ctx.fillRect(126, 105, 68, 8);

      // Twin Swamimalai Kuthuvilakku lamps
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(75, 110, 4, 28);
      ctx.fillRect(241, 110, 4, 28);
      ctx.beginPath();
      ctx.arc(77, 106, 5, 0, Math.PI * 2);
      ctx.arc(243, 106, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === 'sangeet-glam' || id === 'neon-lounge') {
      // LED Truss & Kinetic Spotlight Beams
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 20);
      ctx.lineTo(40, 138);
      ctx.moveTo(80, 20);
      ctx.lineTo(130, 138);
      ctx.moveTo(240, 20);
      ctx.lineTo(190, 138);
      ctx.moveTo(240, 20);
      ctx.lineTo(280, 138);
      ctx.stroke();

      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(160, 88, 36, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Botanical / Banquet Arch & Chandelier
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(160, 105, 58, Math.PI, 0, false);
      ctx.stroke();

      // Long banquet table
      ctx.fillStyle = '#D6D3D1';
      ctx.fillRect(75, 120, 170, 12);
    }

    // Corner label badge inside thumbnail
    ctx.fillStyle = 'rgba(12, 10, 9, 0.75)';
    ctx.fillRect(10, 10, 118, 20);
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('VISUAL CUE', 18, 23);

    return canvas.toDataURL('image/jpeg', 0.9);
  } catch {
    return null;
  }
}

export async function generateEventPlanPdf(payload: PdfExportPayload): Promise<void> {
  const {
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
  } = payload;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let cursorY = 14;

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 18) {
      doc.addPage();
      cursorY = 16;
      // Subtle top continuation bar on subsequent pages
      doc.setFillColor(28, 25, 23);
      doc.rect(margin, cursorY - 6, contentWidth, 0.6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 113, 108);
      doc.text(
        cleanPdfText(`${eventTitle.toUpperCase()}  |  MASTER PRODUCTION RUNBOOK & BUDGET DOSSIER`),
        margin,
        cursorY - 8
      );
      cursorY += 2;
    }
  };

  const drawSectionHeader = (indexLabel: string, title: string, subtitle: string) => {
    ensureSpace(18);
    cursorY += 3;
    doc.setFillColor(146, 64, 14); // Warm Amber-800 accent bar
    doc.rect(margin, cursorY, 3, 11, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14);
    doc.text(cleanPdfText(indexLabel.toUpperCase()), margin + 6, cursorY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(28, 25, 23);
    doc.text(cleanPdfText(title), margin + 6, cursorY + 10);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 113, 108);
      doc.text(cleanPdfText(subtitle), pageWidth - margin, cursorY + 10, { align: 'right' });
    }

    cursorY += 14;
    doc.setDrawColor(231, 229, 228);
    doc.setLineWidth(0.3);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 5;
  };

  // =========================================================================
  // 1. COVER HEADER BANNER & EXECUTIVE METRICS STRIP
  // =========================================================================
  doc.setFillColor(28, 25, 23); // Stone-900 Editorial Header
  doc.roundedRect(margin, cursorY, contentWidth, 42, 3, 3, 'F');

  // Gold accent rule inside banner
  doc.setFillColor(217, 119, 6);
  doc.rect(margin + 6, cursorY + 6, 38, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(253, 230, 138);
  doc.text(
    cleanPdfText(`UTSAVAVAIBHAVAM AI  |  ${archetypeLabel.toUpperCase()}`),
    margin + 6,
    cursorY + 12
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(cleanPdfText(eventTitle), contentWidth - 14);
  doc.text(titleLines[0] || 'Master Event Production Plan', margin + 6, cursorY + 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(214, 211, 209);
  doc.text(
    cleanPdfText(`Venue / City: ${city}   |   Date: ${eventDate}   |   Theme: ${theme}`),
    margin + 6,
    cursorY + 29
  );

  doc.setFontSize(8.5);
  doc.setTextColor(168, 162, 158);
  doc.text(
    cleanPdfText(
      `Prepared By: ${options.preparedBy || 'UtsavaVaibhavam AI Executive Producer'}   |   Attendance: ${guestCount} Guests`
    ),
    margin + 6,
    cursorY + 36
  );

  cursorY += 47;

  // 4-Column KPI Summary Strip
  const kpiWidth = (contentWidth - 9) / 4;
  const variance = budget - totalActual;
  const highImpactCount = timelineItems.filter(
    (t) => t.isHighImpact || Boolean(t.visualReference)
  ).length;
  const confirmedVendors = vendorList.filter((v) => v.status === 'Confirmed').length;

  const kpis = [
    {
      label: 'TARGET BUDGET',
      value: formatPdfMoney(budget, currency),
      sub: `Planned: ${formatPdfMoney(totalPlanned, currency)}`,
    },
    {
      label: 'COMMITTED SPEND',
      value: formatPdfMoney(totalActual, currency),
      sub: `${formatPdfMoney(costPerGuest, currency)} / guest (${guestCount} pax)`,
    },
    {
      label: variance >= 0 ? 'BUDGET BUFFER' : 'OVER BUDGET',
      value: `${variance >= 0 ? '+' : '-'}${formatPdfMoney(Math.abs(variance), currency)}`,
      sub: `Paid to Date: ${formatPdfMoney(totalPaid, currency)}`,
    },
    {
      label: 'PRODUCTION READINESS',
      value: `${timelineItems.length} Cues (${highImpactCount} Visual)`,
      sub: `${confirmedVendors}/${vendorList.length} Vendors Confirmed`,
    },
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + idx * (kpiWidth + 3);
    doc.setFillColor(248, 245, 238);
    doc.setDrawColor(214, 211, 209);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, cursorY, kpiWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120, 113, 108);
    doc.text(cleanPdfText(kpi.label), x + 3.5, cursorY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(28, 25, 23);
    doc.text(cleanPdfText(kpi.value), x + 3.5, cursorY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 94, 89);
    doc.text(cleanPdfText(kpi.sub), x + 3.5, cursorY + 17);
  });

  cursorY += 25;

  // =========================================================================
  // 2. EXECUTIVE CONCEPT, SCENOGRAPHY & COLOR PALETTE SWATCHES
  // =========================================================================
  drawSectionHeader(
    'Section 01',
    'Executive Concept & Scenographic Blueprint',
    aiConcept.conceptName
  );

  // Concept Title & Narrative Box
  const narrativeLines = doc.splitTextToSize(
    cleanPdfText(aiConcept.editorialNarrative),
    contentWidth - 8
  );
  const scenographyLines = doc.splitTextToSize(
    cleanPdfText(`Spatial Architecture: ${aiConcept.spatialScenography}`),
    contentWidth - 8
  );
  const culinaryLines = doc.splitTextToSize(
    cleanPdfText(`Culinary Direction: ${aiConcept.recommendedCatering}`),
    contentWidth - 8
  );
  const signatureLines = doc.splitTextToSize(
    cleanPdfText(`Signature Moment: ${aiConcept.signatureMoment}`),
    contentWidth - 8
  );
  const riskLines = doc.splitTextToSize(
    cleanPdfText(`Risk & Crowd Advisory: ${aiConcept.logisticsRiskAdvisory}`),
    contentWidth - 8
  );

  const boxHeight =
    14 +
    (narrativeLines.length +
      scenographyLines.length +
      culinaryLines.length +
      signatureLines.length +
      riskLines.length) *
      4.2 +
    14;

  ensureSpace(boxHeight + 22);
  doc.setFillColor(250, 248, 244);
  doc.setDrawColor(225, 220, 212);
  doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2.5, 2.5, 'FD');

  let innerY = cursorY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(146, 64, 14);
  doc.text(cleanPdfText(aiConcept.conceptName), margin + 4, innerY);
  innerY += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(41, 37, 36);
  doc.text(narrativeLines, margin + 4, innerY);
  innerY += narrativeLines.length * 4.2 + 2.5;

  const detailBlocks = [
    { lines: scenographyLines, color: [28, 25, 23] as [number, number, number] },
    { lines: culinaryLines, color: [28, 25, 23] as [number, number, number] },
    { lines: signatureLines, color: [146, 64, 14] as [number, number, number] },
    { lines: riskLines, color: [153, 27, 27] as [number, number, number] },
  ];

  detailBlocks.forEach((block) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(block.color[0], block.color[1], block.color[2]);
    doc.text(block.lines, margin + 4, innerY);
    innerY += block.lines.length * 4.2 + 2;
  });

  cursorY += boxHeight + 4;

  // Color Story Swatches Row
  if (aiConcept.colorPalette && aiConcept.colorPalette.length > 0) {
    ensureSpace(18);
    const swatchCount = Math.min(4, aiConcept.colorPalette.length);
    const swatchWidth = (contentWidth - (swatchCount - 1) * 3) / swatchCount;

    aiConcept.colorPalette.slice(0, 4).forEach((swatch, idx) => {
      const sx = margin + idx * (swatchWidth + 3);
      const [r, g, b] = hexToRgb(swatch.hex);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 215, 208);
      doc.roundedRect(sx, cursorY, swatchWidth, 14, 1.5, 1.5, 'FD');

      // Colored swatch square
      doc.setFillColor(r, g, b);
      doc.roundedRect(sx + 2, cursorY + 2, 10, 10, 1.2, 1.2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(28, 25, 23);
      doc.text(cleanPdfText(swatch.name.slice(0, 20)), sx + 14, cursorY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 113, 108);
      doc.text(
        cleanPdfText(`${swatch.hex.toUpperCase()} - ${swatch.usage.slice(0, 24)}`),
        sx + 14,
        cursorY + 10.8
      );
    });

    cursorY += 18;
  }

  // Cultural & Dietary Requirements Bar
  ensureSpace(14);
  doc.setFillColor(245, 242, 234);
  doc.roundedRect(margin, cursorY, contentWidth, 12, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(87, 83, 78);
  doc.text(
    cleanPdfText(`RITUALS: ${culturalNotes.slice(0, 95)}`),
    margin + 3.5,
    cursorY + 5
  );
  doc.text(
    cleanPdfText(`DIETARY: ${dietaryNotes.slice(0, 95)}`),
    margin + 3.5,
    cursorY + 9.5
  );
  cursorY += 16;

  // =========================================================================
  // 3. CHRONO-SYNCHRONIZED RUN-OF-SHOW & VISUAL CUES
  // =========================================================================
  drawSectionHeader(
    'Section 02',
    'Chrono-Synchronized Run-of-Show & Visual Cues',
    `${timelineItems.length} Production Milestones`
  );

  for (let i = 0; i < timelineItems.length; i++) {
    const item = timelineItems[i];
    const hasVisual =
      options.includeVisualCues && Boolean(item.visualReference || item.isHighImpact);

    const cardHeight = hasVisual ? 34 : 20;
    ensureSpace(cardHeight + 4);

    // Card container
    doc.setFillColor(hasVisual ? 255 : 250, hasVisual ? 252 : 249, hasVisual ? 245 : 246);
    doc.setDrawColor(hasVisual ? 217 : 225, hasVisual ? 119 : 222, hasVisual ? 6 : 216);
    doc.setLineWidth(hasVisual ? 0.45 : 0.25);
    doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 2, 2, 'FD');

    let textStartX = margin + 4;
    let textAvailWidth = contentWidth - 8;

    // Render embedded visual cue thumbnail if enabled
    if (hasVisual) {
      const thumbDataUrl = await renderVisualCueThumbnail(
        item.visualReference?.presetId,
        item.visualReference?.imageUrl
      );
      if (thumbDataUrl) {
        doc.addImage(thumbDataUrl, 'JPEG', margin + 3, cursorY + 3, 46, 28);
        doc.setDrawColor(180, 160, 140);
        doc.setLineWidth(0.2);
        doc.rect(margin + 3, cursorY + 3, 46, 28, 'S');
        textStartX = margin + 53;
        textAvailWidth = contentWidth - 57;
      }
    }

    // Top row: Cue # + Phase/Time + High-Impact Badge + Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14);
    const cueHeader = `CUE ${String(i + 1).padStart(2, '0')}  |  ${item.phase} (${item.date})  |  [${item.tag.toUpperCase()}]`;
    doc.text(cleanPdfText(cueHeader), textStartX, cursorY + 6.5);

    const statusBadge = `${item.isHighImpact ? 'HIGH-IMPACT VISUAL  |  ' : ''}STATUS: ${item.status.toUpperCase()}  |  OWNER: ${item.owner}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(87, 83, 78);
    doc.text(cleanPdfText(statusBadge), pageWidth - margin - 4, cursorY + 6.5, {
      align: 'right',
    });

    // Milestone Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);
    const milestoneTitleLines = doc.splitTextToSize(
      cleanPdfText(item.title),
      textAvailWidth
    );
    doc.text(milestoneTitleLines[0] || '', textStartX, cursorY + 12.5);

    // Visual Reference & Lighting Cue details
    if (hasVisual) {
      const visualCaption =
        item.visualReference?.caption ||
        item.notes ||
        'High-impact ceremonial staging & camera blocking cue.';
      const lightingCue =
        item.visualReference?.lightingCue ||
        'Warm 2700K architectural wash & spot cue';

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(68, 64, 60);
      const capLines = doc.splitTextToSize(
        cleanPdfText(`Visual Staging: ${visualCaption}`),
        textAvailWidth
      );
      doc.text(capLines.slice(0, 2), textStartX, cursorY + 17.5);

      // Lighting Cue Pill Strip inside card
      doc.setFillColor(28, 25, 23);
      doc.roundedRect(textStartX, cursorY + 25, textAvailWidth, 6, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(253, 230, 138);
      doc.text(
        cleanPdfText(`LIGHTING & AUDIO CUE: ${lightingCue.slice(0, 88)}`),
        textStartX + 2.5,
        cursorY + 29
      );
    } else if (item.notes) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(87, 83, 78);
      const noteLine = doc.splitTextToSize(cleanPdfText(item.notes), textAvailWidth);
      doc.text(noteLine[0] || '', textStartX, cursorY + 17.5);
    }

    cursorY += cardHeight + 3.5;
  }

  // =========================================================================
  // 4. FINANCIAL BUDGET SUMMARY & LINE-ITEM LEDGER
  // =========================================================================
  if (options.includeBudgetSummary) {
    drawSectionHeader(
      'Section 03',
      'Smart Wallet Budget Summary & Category Ledger',
      `Total Budget: ${formatPdfMoney(budget, currency)}  |  Actual: ${formatPdfMoney(totalActual, currency)}`
    );

    // Category Allocation Grid (2 columns)
    if (categoryBreakdown.length > 0) {
      const colW = (contentWidth - 4) / 2;
      const rows = Math.ceil(categoryBreakdown.length / 2);
      ensureSpace(rows * 14 + 8);

      categoryBreakdown.forEach((cat, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = margin + col * (colW + 4);
        const cy = cursorY + row * 13.5;

        doc.setFillColor(248, 245, 238);
        doc.setDrawColor(225, 220, 212);
        doc.roundedRect(cx, cy, colW, 11.5, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(28, 25, 23);
        doc.text(cleanPdfText(cat.category), cx + 3, cy + 4.8);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(146, 64, 14);
        doc.text(
          cleanPdfText(`${formatPdfMoney(cat.actual, currency)} (${cat.shareOfSpend}%)`),
          cx + colW - 3,
          cy + 4.8,
          { align: 'right' }
        );

        // Progress bar track
        doc.setFillColor(228, 223, 215);
        doc.roundedRect(cx + 3, cy + 7.2, colW - 6, 2.2, 0.8, 0.8, 'F');
        const fillW = Math.max(2, ((colW - 6) * Math.min(100, cat.shareOfSpend)) / 100);
        doc.setFillColor(146, 64, 14);
        doc.roundedRect(cx + 3, cy + 7.2, fillW, 2.2, 0.8, 0.8, 'F');
      });

      cursorY += rows * 13.5 + 4;
    }

    // Line-Item Budget Table Header
    ensureSpace(22);
    doc.setFillColor(28, 25, 23);
    doc.rect(margin, cursorY, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('CATEGORY', margin + 3, cursorY + 5.2);
    doc.text('LINE ITEM & SCOPE NOTES', margin + 36, cursorY + 5.2);
    doc.text('PLANNED', margin + 118, cursorY + 5.2, { align: 'right' });
    doc.text('ACTUAL', margin + 144, cursorY + 5.2, { align: 'right' });
    doc.text('VARIANCE', margin + 166, cursorY + 5.2, { align: 'right' });
    doc.text('STATUS', pageWidth - margin - 2, cursorY + 5.2, { align: 'right' });
    cursorY += 8;

    budgetItems.forEach((bItem, idx) => {
      ensureSpace(10);
      if (idx % 2 === 0) {
        doc.setFillColor(252, 250, 246);
      } else {
        doc.setFillColor(245, 242, 235);
      }
      doc.rect(margin, cursorY, contentWidth, 9.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(87, 83, 78);
      doc.text(cleanPdfText(bItem.category.slice(0, 18)), margin + 3, cursorY + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(28, 25, 23);
      doc.text(cleanPdfText(bItem.item.slice(0, 42)), margin + 36, cursorY + 4.5);

      if (bItem.notes) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(120, 113, 108);
        doc.text(cleanPdfText(bItem.notes.slice(0, 56)), margin + 36, cursorY + 8.2);
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(68, 64, 60);
      doc.text(formatPdfMoney(bItem.planned, currency), margin + 118, cursorY + 5.5, {
        align: 'right',
      });

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(28, 25, 23);
      doc.text(formatPdfMoney(bItem.actual, currency), margin + 144, cursorY + 5.5, {
        align: 'right',
      });

      const itemVar = bItem.planned - bItem.actual;
      doc.setFont('helvetica', 'bold');
      if (itemVar >= 0) {
        doc.setTextColor(4, 120, 87);
      } else {
        doc.setTextColor(185, 28, 28);
      }
      doc.text(
        `${itemVar >= 0 ? '+' : '-'}${formatPdfMoney(Math.abs(itemVar), currency)}`,
        margin + 166,
        cursorY + 5.5,
        { align: 'right' }
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      if (bItem.paid) {
        doc.setTextColor(4, 120, 87);
        doc.text('PAID', pageWidth - margin - 2, cursorY + 5.5, { align: 'right' });
      } else {
        doc.setTextColor(180, 83, 9);
        doc.text('DUE', pageWidth - margin - 2, cursorY + 5.5, { align: 'right' });
      }

      cursorY += 9.5;
    });

    // Totals Footer Row
    ensureSpace(12);
    doc.setFillColor(28, 25, 23);
    doc.rect(margin, cursorY, contentWidth, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(253, 230, 138);
    doc.text('TOTAL BUDGET LEDGER SUMMARY', margin + 3, cursorY + 5.8);
    doc.setTextColor(255, 255, 255);
    doc.text(formatPdfMoney(totalPlanned, currency), margin + 118, cursorY + 5.8, {
      align: 'right',
    });
    doc.text(formatPdfMoney(totalActual, currency), margin + 144, cursorY + 5.8, {
      align: 'right',
    });
    const totalVar = budget - totalActual;
    doc.setTextColor(253, 230, 138);
    doc.text(
      `${totalVar >= 0 ? '+' : '-'}${formatPdfMoney(Math.abs(totalVar), currency)}`,
      margin + 166,
      cursorY + 5.8,
      { align: 'right' }
    );
    cursorY += 14;
  }

  // =========================================================================
  // 5. VENDOR SLA & PROCUREMENT ROSTER
  // =========================================================================
  if (options.includeVendorRoster && vendorList.length > 0) {
    drawSectionHeader(
      'Section 04',
      'Vendor Procurement & SLA Checklist Roster',
      `${vendorList.length} Active Vendors`
    );

    vendorList.forEach((v) => {
      const slaLines = (v.slaChecklist || []).slice(0, 3);
      const vHeight = 16 + slaLines.length * 4;
      ensureSpace(vHeight + 4);

      doc.setFillColor(250, 248, 244);
      doc.setDrawColor(220, 215, 208);
      doc.roundedRect(margin, cursorY, contentWidth, vHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(28, 25, 23);
      doc.text(cleanPdfText(`${v.name}  —  ${v.role}`), margin + 4, cursorY + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(146, 64, 14);
      doc.text(
        cleanPdfText(
          `${formatPdfMoney(v.quoteAmount, currency)}  |  [${v.status.toUpperCase()}]`
        ),
        pageWidth - margin - 4,
        cursorY + 6,
        { align: 'right' }
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(87, 83, 78);
      doc.text(
        cleanPdfText(`Contact: ${v.contact}   |   Notes: ${v.notes.slice(0, 85)}`),
        margin + 4,
        cursorY + 11.2
      );

      slaLines.forEach((sla, sIdx) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.4);
        doc.setTextColor(68, 64, 60);
        doc.text(
          cleanPdfText(`[SLA ${sIdx + 1}] ${sla.slice(0, 105)}`),
          margin + 6,
          cursorY + 15.8 + sIdx * 3.8
        );
      });

      cursorY += vHeight + 3;
    });
  }

  // =========================================================================
  // 6. CURATED EXPERIENCE LOOKBOOK IDEAS & SIGN-OFF
  // =========================================================================
  if (options.includeIdeasLookbook && personalizedIdeas.length > 0) {
    drawSectionHeader(
      'Section 05',
      'Curated Guest Experience & Scenography Ideas',
      `${personalizedIdeas.length} Signature Concepts`
    );

    personalizedIdeas.forEach((idea) => {
      ensureSpace(18);
      doc.setFillColor(248, 245, 238);
      doc.setDrawColor(222, 217, 208);
      doc.roundedRect(margin, cursorY, contentWidth, 15, 1.8, 1.8, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(28, 25, 23);
      doc.text(
        cleanPdfText(`[${idea.pillar.toUpperCase()}]  ${idea.title}`),
        margin + 4,
        cursorY + 5.5
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(146, 64, 14);
      doc.text(
        cleanPdfText(
          `Est: ${formatPdfMoney(idea.costEstimate, currency)}  |  Impact: ${idea.estimatedImpact.slice(0, 32)}`
        ),
        pageWidth - margin - 4,
        cursorY + 5.5,
        { align: 'right' }
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.6);
      doc.setTextColor(87, 83, 78);
      const descLines = doc.splitTextToSize(
        cleanPdfText(idea.description),
        contentWidth - 8
      );
      doc.text(descLines.slice(0, 2), margin + 4, cursorY + 10.2);

      cursorY += 17.5;
    });
  }

  // Executive Sign-Off Block
  ensureSpace(24);
  cursorY += 4;
  doc.setFillColor(245, 242, 234);
  doc.setDrawColor(214, 211, 209);
  doc.roundedRect(margin, cursorY, contentWidth, 18, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(28, 25, 23);
  doc.text('EXECUTIVE PRODUCTION APPROVAL & SIGN-OFF', margin + 4, cursorY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(87, 83, 78);
  doc.text(
    'Client / Family Representative: ___________________________     Stage & Venue Director: ___________________________     Date: ______________',
    margin + 4,
    cursorY + 13.5
  );

  // =========================================================================
  // PAGE NUMBERS & FOOTER ACROSS ALL PAGES
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(214, 211, 209);
    doc.setLineWidth(0.25);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 113, 108);
    doc.text(
      cleanPdfText(
        `UtsavaVaibhavam AI — Master Event Plan & Run-of-Show   |   Generated ${timestamp}`
      ),
      margin,
      pageHeight - 7.5
    );
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7.5,
      { align: 'right' }
    );
  }

  const slug =
    eventTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'utsavavaibhavam-event-plan';

  doc.save(`${slug}-production-report.pdf`);
}
