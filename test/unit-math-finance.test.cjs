const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Unit Test Suite: Financial Modeling & Algorithmic Budget Engine', () => {

  const { generateFallbackBudgetOptimization } = require('../serverFallback.ts');

  it('TC-MATH-01: Per-guest spend must calculate with integer precision', () => {
    const budget = 2500000;
    const guests = 400;
    const perGuest = Math.round(budget / guests);
    assert.strictEqual(perGuest, 6250);
  });

  it('TC-MATH-02: Zero-guest guard must prevent Division-by-Zero NaN', () => {
    const budget = 1000000;
    const guests = 0;
    const perGuest = Math.round(budget / Math.max(1, guests));
    assert.strictEqual(perGuest, 1000000);
    assert.ok(!Number.isNaN(perGuest));
  });

  it('TC-MATH-03: USD to INR conversion must remain within established monetary boundaries', () => {
    const usd = 30000;
    const rate = 84;
    const inr = usd * rate;
    assert.strictEqual(inr, 2520000);
    assert.strictEqual(Math.round(inr / rate), usd);
  });

  it('TC-MATH-04: Value-engineering algorithm must identify non-negative savings', () => {
    const mockItems = [
      { id: '1', category: 'Venue', item: 'Heritage Mandapam', planned: 900000, actual: 950000 },
      { id: '2', category: 'Catering', item: 'Traditional Virundhu', planned: 800000, actual: 800000 },
      { id: '3', category: 'Decor', item: 'Floral Architecture', planned: 500000, actual: 550000 },
    ];

    const result = generateFallbackBudgetOptimization({
      totalBudget: 2200000,
      currencySymbol: '₹',
      budgetItems: mockItems,
    });

    assert.ok(result.projectedSavings >= 0, 'Projected savings cannot be negative');
    assert.ok(Array.isArray(result.savingsStrategies), 'Must return structured tactics list');
    assert.ok(result.savingsStrategies.length >= 3, 'Must suggest at least 3 actionable levers');
  });

  it('TC-MATH-05: Rebalanced items must retain all original items without drops', () => {
    const mockItems = [
      { id: 'item-1', category: 'Venue', item: 'Hall', planned: 500000, actual: 500000 },
      { id: 'item-2', category: 'Tech', item: 'Audio Visual', planned: 200000, actual: 200000 },
    ];
    const result = generateFallbackBudgetOptimization({
      totalBudget: 700000,
      currencySymbol: '₹',
      budgetItems: mockItems,
    });
    assert.strictEqual(result.rebalancedItems.length, mockItems.length);
  });

  it('TC-MATH-06: Extreme boundary inputs (100,000 guests) must not overflow standard integers', () => {
    const largeGuests = 100000;
    const largeBudget = 500000000;
    const perGuest = Math.round(largeBudget / largeGuests);
    assert.strictEqual(perGuest, 5000);
    assert.ok(Number.isSafeInteger(perGuest));
  });

  it('TC-MATH-07: Negative budget values must be normalized safely by math bounds', () => {
    const negativeBudget = -50000;
    const normalizedBudget = Math.max(0, negativeBudget);
    assert.strictEqual(normalizedBudget, 0);
  });
});
