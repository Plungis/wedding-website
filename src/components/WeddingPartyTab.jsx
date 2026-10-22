import React, { useState } from 'react';
import { Crown, Lock, Search, Sparkles, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import PageBlockRenderer, { GothicRoseArchOrnament } from './PageBlockRenderer.jsx';

export default function WeddingPartyTab({
  weddingPartyPage,
  siteSettings,
  unlockedGuest,
  onUnlockWeddingParty,
  sampleInvites = [],
  onSelectTab
}) {
  const [codeInput, setCodeInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const weddingPartySamples = sampleInvites.filter((inv) => inv.isWeddingParty);

  async function handleVerifyCode(rawCode) {
    const clean = (rawCode || '').trim().toUpperCase();
    if (!clean) {
      setError('Please enter your Wedding Party invitation code.');
      return;
    }
    setChecking(true);
    setError('');
    try {
      const res = await fetch(`/api/rsvp/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok || !data.guest) {
        setError(data.error || 'Invitation code not found.');
      } else if (!data.guest.isWeddingParty) {
        setError(
          `Invitation "${data.guest.householdName}" (${data.guest.code}) is not marked as Wedding Party. Ask the couple or check the "Wedding Party" box in the CMS Guest Studio.`
        );
      } else {
        onUnlockWeddingParty(data.guest);
      }
    } catch {
      setError('Unable to verify code right now. Please try again.');
    } finally {
      setChecking(false);
    }
  }

  if (!unlockedGuest) {
    return (
      <div className="wedding-party-gate">
        <div
          className="surface-card"
          style={{
            maxWidth: '640px',
            margin: '1rem auto 2.5rem',
            textAlign: 'center',
            padding: '2.75rem 2rem',
            borderRadius: '200px 200px 22px 22px',
            border: '1.5px solid var(--border-gold)'
          }}
        >
          <div
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '32px 32px 12px 12px',
              background: 'var(--bg-accent-subtle)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <Crown size={28} />
          </div>
          <span className="section-kicker">05 • Inner Circle Access Only</span>
          <h2 className="section-title" style={{ fontSize: '2.3rem' }}>
            Wedding Party Private Portal
          </h2>
          <GothicRoseArchOrnament width={190} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            This page contains private rehearsal dinner details, hair & makeup call times, portrait schedules, and day-of contacts exclusively for members of the Wedding Party.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyCode(codeInput);
            }}
            style={{ maxWidth: '420px', margin: '0 auto 1.25rem' }}
          >
            <label className="form-label" style={{ display: 'block', marginBottom: '0.45rem' }}>
              Enter Your Wedding Party QR Code
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ROSE-4829"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn-primary" disabled={checking} style={{ whiteSpace: 'nowrap' }}>
                <Search size={16} /> {checking ? 'Verifying...' : 'Unlock Portal'}
              </button>
            </div>
          </form>

          {error && (
            <div
              style={{
                background: 'rgba(153, 27, 27, 0.25)',
                border: '1px solid #f87171',
                color: '#fecaca',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                fontSize: '0.86rem',
                marginBottom: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {weddingPartySamples.length > 0 && (
            <div
              style={{
                marginTop: '1.35rem',
                paddingTop: '1.25rem',
                borderTop: '1px dashed var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                <QrCode size={13} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                Quick Test — Click a Wedding Party Guest Below to Unlock:
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                {weddingPartySamples.map((wp) => (
                  <button
                    key={wp.code}
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                    onClick={() => {
                      setCodeInput(wp.code);
                      handleVerifyCode(wp.code);
                    }}
                  >
                    <Crown size={13} color="var(--accent-secondary)" /> {wp.householdName} ({wp.code})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="wedding-party-tab-content">
      {/* Unlocked VIP Banner */}
      <div
        className="surface-card"
        style={{
          marginBottom: '2rem',
          padding: '1.15rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(158, 27, 50, 0.28), rgba(9, 6, 8, 0.92))',
          border: '1.5px solid var(--border-gold)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              background: 'rgba(212, 168, 83, 0.2)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            <Crown size={14} /> Wedding Party VIP Access
          </span>
          <div>
            <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Unlocked for {unlockedGuest.householdName}
            </strong>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: '0.6rem' }}>
              ({unlockedGuest.category || 'Wedding Party'} • Code: {unlockedGuest.code})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            onClick={() => onSelectTab('rsvp')}
          >
            View My RSVP Card
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            onClick={() => onUnlockWeddingParty(null)}
          >
            <Lock size={13} /> Lock Portal
          </button>
        </div>
      </div>

      <PageBlockRenderer
        pageData={weddingPartyPage}
        siteSettings={siteSettings}
        onSelectTab={onSelectTab}
      />
    </div>
  );
}
