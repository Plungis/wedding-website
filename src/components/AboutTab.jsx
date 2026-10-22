import React from 'react';
import { ArrowRight } from 'lucide-react';
import PageBlockRenderer from './PageBlockRenderer.jsx';

export default function AboutTab({ aboutUs, siteSettings, onSelectTab }) {
  if (!aboutUs) return null;

  return (
    <div className="about-tab-content">
      <PageBlockRenderer
        pageData={aboutUs}
        siteSettings={siteSettings}
        onSelectTab={onSelectTab}
      />

      {/* Bottom Quick Navigation Banner */}
      <div
        className="surface-card"
        style={{
          marginTop: '2.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-accent-subtle)',
          border: '1px solid var(--border-gold)'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>Ready to explore the wedding night details?</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            View the twilight ceremony schedule, candlelit reception menu, or scan your invitation QR code to RSVP.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => onSelectTab('ceremony')}>
            Explore Ceremony <ArrowRight size={16} />
          </button>
          <button className="btn-primary" onClick={() => onSelectTab('rsvp')}>
            Go to QR RSVP <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
