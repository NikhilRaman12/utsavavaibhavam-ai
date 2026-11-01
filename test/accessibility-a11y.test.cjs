const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

describe('Accessibility (A11y) & WCAG 2.1 Compliance Suite', () => {

  const root = path.resolve(__dirname, '..');

  it('TC-A11Y-01: index.html must declare valid lang="en" and responsive viewport meta', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.ok(html.includes('lang="en"'), 'HTML root must specify lang="en"');
    assert.ok(html.includes('name="viewport"'), 'Must define viewport meta tag');
    assert.ok(html.includes('role="main"'), 'Must define semantic main landmark');
  });

  it('TC-A11Y-02: index.html must provide accessible <noscript> advisory fallback', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.ok(html.includes('<noscript>'), 'Must include noscript fallback for assistive readers');
  });

  it('TC-A11Y-03: Primary navigation in App.tsx must implement role="tablist" and aria-selected', () => {
    const app = fs.readFileSync(path.join(root, 'src', 'App.tsx'), 'utf8');
    assert.ok(app.includes('role="tablist"'), 'Navigation container must declare role="tablist"');
    assert.ok(app.includes('role="tab"'), 'Tab items must declare role="tab"');
    assert.ok(app.includes('aria-selected'), 'Tabs must indicate active state via aria-selected');
  });

  it('TC-A11Y-04: Spatial Venue Canvas must provide accessible aria-labels on zone controls', () => {
    const canvas = fs.readFileSync(path.join(root, 'src', 'components', 'SpatialVenueCanvas.tsx'), 'utf8');
    assert.ok(canvas.includes('aria-label="Toggle guest flow vectors"'));
    assert.ok(canvas.includes('aria-pressed='));
  });

  it('TC-A11Y-05: PDF Export Modal must declare aria-label on download and close controls', () => {
    const modal = fs.readFileSync(path.join(root, 'src', 'components', 'PdfExportModal.tsx'), 'utf8');
    assert.ok(modal.includes('aria-label="Export Master Run of Show Executive PDF dossier"'));
    assert.ok(modal.includes('aria-label="Close export dossier modal"'));
  });

  it('TC-A11Y-06: ErrorBoundary must implement role="alert" and aria-live="assertive"', () => {
    const eb = fs.readFileSync(path.join(root, 'src', 'components', 'ErrorBoundary.tsx'), 'utf8');
    assert.ok(eb.includes('role="alert"'), 'ErrorBoundary container must declare role="alert"');
    assert.ok(eb.includes('aria-live="assertive"'), 'Error messages must announce assertively to screen readers');
  });
});

