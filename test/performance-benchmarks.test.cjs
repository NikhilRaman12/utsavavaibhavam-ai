const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Performance & Execution Latency Benchmark Suite', () => {

  const {
    generateFallbackBlueprint,
    generateFallbackBudgetOptimization,
    generateFallbackVision,
    generateFallbackAudioWav,
  } = require('../serverFallback.ts');

  it('TC-PERF-01: Blueprint fallback synthesis must execute in < 25 milliseconds', () => {
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
      generateFallbackBlueprint({
        archetypeLabel: 'Kumbakonam Wedding',
        eventTitle: 'Speed Test',
        guestCount: 300,
        totalBudget: 1500000,
        currencySymbol: '₹',
      });
    }
    const elapsed = (performance.now() - start) / 10;
    assert.ok(elapsed < 25, `Mean synthesis time must be < 25ms (was ${elapsed.toFixed(2)}ms)`);
  });

  it('TC-PERF-02: Budget value-engineering optimizer must execute in < 60 milliseconds', () => {
    const mockItems = Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i}`,
      category: 'Decor',
      item: `Floral Pillar ${i}`,
      planned: 20000,
      actual: 22000,
    }));

    const start = performance.now();
    generateFallbackBudgetOptimization({
      totalBudget: 1000000,
      currencySymbol: '₹',
      budgetItems: mockItems,
    });
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 60, `Optimizer execution must be < 60ms for 50 items (was ${elapsed.toFixed(2)}ms)`);
  });

  it('TC-PERF-03: Multimodal Vision fallback color extraction must run in < 15 milliseconds', () => {
    const start = performance.now();
    const vision = generateFallbackVision({
      eventContext: { currencySymbol: '₹', guestCount: 400 },
    });
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 15, `Vision heuristic extraction must be < 15ms (was ${elapsed.toFixed(2)}ms)`);
    assert.strictEqual(vision.extractedPalette.length, 4);
  });

  it('TC-PERF-04: Audio WAV buffer generation must produce valid stream in < 20 milliseconds', () => {
    const start = performance.now();
    const wav = generateFallbackAudioWav();
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 20, `Audio buffer generation must be < 20ms (was ${elapsed.toFixed(2)}ms)`);
    assert.ok(wav.length > 500, 'WAV payload must contain audio samples');
  });
});
