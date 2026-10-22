import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Sparkles,
  Settings,
  Eye,
  QrCode,
  Hash,
  Heart
} from 'lucide-react';
import { GothicRoseArchOrnament, PositionedImage } from './PageBlockRenderer.jsx';
import RsvpTab from './RsvpTab.jsx';

export default function UnderConstructionView({
  siteSettings,
  aboutUs,
  rsvpPage,
  reception,
  sampleInvites,
  initialCode,
  onOpenCms,
  onPreviewFullSite,
  onRsvpSubmitted,
  onUnlockWeddingParty,
  previewOnly = false
}) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [showRsvpDrawer, setShowRsvpDrawer] = useState(Boolean(initialCode));

  const uc = siteSettings?.underConstruction || {};
  const heroCrop = siteSettings?.heroBannerCrop || { x: 50, y: 40, zoom: 1 };

  // Extract Bride & Groom profiles from aboutUs -> couple_profiles block
  const coupleProfilesBlock = (aboutUs?.blocks || []).find((b) => b.type === 'couple_profiles');
  const coupleItems = coupleProfilesBlock?.items || [
    {
      id: 'p1',
      name: (siteSettings?.coupleNames || 'The Bride & Groom').split('&')[0]?.trim() || 'Partner One',
      role: 'The Bride',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'p2',
      name: (siteSettings?.coupleNames || 'The Bride & Groom').split('&')[1]?.trim() || 'Partner Two',
      role: 'The Groom',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80'
    }
  ];

  useEffect(() => {
    function tick() {
      const target = new Date(siteSettings?.weddingDate || '2027-10-23T17:00:00').getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [siteSettings?.weddingDate]);

  return (
    <div
      className="under-construction-wrapper"
      style={{
        minHeight: previewOnly ? 'auto' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Top Utility Bar with Admin Preview & CMS Studio Access */}
      {!previewOnly && (
        <div className="top-utility-bar no-print">
          <div className="top-utility-left">
            <span>
              <strong>{siteSettings?.shortNames || 'Elena & Julian'}</strong>
              {siteSettings?.topBarText !== '' ? ` • ${siteSettings?.topBarText || 'Save The Date'}` : ''}
            </span>
            {siteSettings?.hashtag && (
              <span style={{ opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-secondary)' }}>
                <Hash size={13} />
                {siteSettings.hashtag.replace(/^#/, '')}
              </span>
            )}
          </div>

          <div className="top-utility-actions" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {onPreviewFullSite && (
              <button
                type="button"
                className="btn-secondary"
                style={{
                  padding: '0.36rem 0.85rem',
                  fontSize: '0.76rem',
                  borderColor: 'var(--border-gold)',
                  color: 'var(--accent-secondary)'
                }}
                onClick={onPreviewFullSite}
              >
                <Eye size={13} /> Preview Full Site (Admin Bypass)
              </button>
            )}
            {onOpenCms && (
              <button
                type="button"
                className="cms-launch-btn"
                onClick={onOpenCms}
              >
                <Settings size={14} /> Open Drag & Drop CMS Studio
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Atmospheric Save-The-Date / Under Construction Stage */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          padding: previewOnly ? '2rem 1.25rem' : '3.5rem 1.5rem 4.5rem',
          backgroundImage: `linear-gradient(180deg, rgba(8, 5, 8, 0.78) 0%, rgba(12, 7, 11, 0.92) 55%, var(--bg-primary) 100%), url(${
            siteSettings?.heroBannerUrl ||
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=85'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: `${heroCrop.x ?? 50}% ${heroCrop.y ?? 40}%`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            maxWidth: '980px',
            width: '100%',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          {/* Cathedral Gothic Arch Frame */}
          <div
            className="hero-gothic-arch-frame"
            style={{
              maxWidth: '880px',
              margin: '0 auto',
              padding: previewOnly ? '2.25rem 1.5rem' : '3.25rem 2.25rem 2.75rem'
            }}
          >
            {/* Eyebrow Badge */}
            <div style={{ marginBottom: '0.9rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(158, 27, 50, 0.24)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--accent-secondary)',
                  padding: '0.42rem 1.1rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase'
                }}
              >
                <Sparkles size={14} />
                {uc.eyebrow || '✦ Save The Date • Full Wedding Website Unveiling Soon ✦'}
              </span>
            </div>

            {/* Couple Full Names */}
            <h1
              className="hero-couple-names"
              style={{
                fontSize: previewOnly ? '2.7rem' : 'clamp(2.6rem, 6vw, 4.4rem)',
                marginBottom: '0.35rem'
              }}
            >
              {siteSettings?.coupleNames || 'Elena Vance & Julian Sterling'}
            </h1>

            <GothicRoseArchOrnament width={230} />

            {/* Under Construction Headline & Message */}
            <h2
              className="serif-font"
              style={{
                fontSize: previewOnly ? '1.65rem' : '2.15rem',
                color: 'var(--accent-secondary)',
                marginTop: '0.5rem',
                marginBottom: '0.65rem'
              }}
            >
              {uc.headline || 'Our Wedding Website Is Currently Under Construction'}
            </h2>

            <p
              style={{
                maxWidth: '670px',
                margin: '0 auto 1.65rem',
                color: 'var(--text-secondary)',
                fontSize: '1.02rem',
                lineHeight: 1.7
              }}
            >
              {uc.subheadline ||
                'We are busy putting the finishing touches on our ceremony details, candlelit reception menu, and travel guide. Save our date below and check back soon!'}
            </p>

            {/* Date & Location Pills */}
            {uc.showDateAndLocation !== false && (
              <div className="hero-meta-pills" style={{ marginBottom: '2rem' }}>
                <span className="hero-pill">
                  <Calendar size={15} color="var(--accent-secondary)" />{' '}
                  {siteSettings?.weddingDateDisplay || 'Saturday, October 23, 2027'}
                </span>
                <span className="hero-pill">
                  <MapPin size={15} color="var(--accent-secondary)" />{' '}
                  {siteSettings?.locationSummary || 'Tarrytown • Hudson Valley, NY'}
                </span>
              </div>
            )}

            {/* Live Countdown Timer */}
            {uc.showCountdown !== false && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(70px, 125px))',
                  justifyContent: 'center',
                  gap: '0.85rem',
                  margin: '0 auto 2.35rem'
                }}
              >
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Minutes', value: countdown.mins },
                  { label: 'Seconds', value: countdown.secs }
                ].map((unit) => (
                  <div
                    key={unit.label}
                    style={{
                      background: 'rgba(9, 6, 8, 0.78)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '28px 28px 12px 12px',
                      padding: '1rem 0.65rem',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.45)'
                    }}
                  >
                    <div
                      className="serif-font"
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: 'var(--accent-secondary)',
                        lineHeight: 1.1
                      }}
                    >
                      {unit.value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem',
                        fontWeight: 700
                      }}
                    >
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bride & Groom Portraits Section */}
            {uc.showCouplePhotos !== false && coupleItems.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    coupleItems.length === 1
                      ? 'minmax(240px, 340px)'
                      : 'repeat(auto-fit, minmax(230px, 310px))',
                  justifyContent: 'center',
                  gap: '1.65rem',
                  marginTop: '0.5rem',
                  marginBottom: '1.5rem'
                }}
              >
                {coupleItems.map((person, idx) => (
                  <div
                    key={person.id || idx}
                    style={{
                      background: 'rgba(14, 9, 13, 0.85)',
                      border: '1.5px solid var(--border-gold)',
                      borderRadius: '180px 180px 18px 18px',
                      padding: '1rem 1rem 1.35rem',
                      boxShadow: '0 16px 38px rgba(0,0,0,0.6)'
                    }}
                  >
                    <PositionedImage
                      src={person.photo}
                      alt={person.name}
                      crop={person.photoCrop}
                      height={previewOnly ? '230px' : '290px'}
                      borderRadius="165px 165px 12px 12px"
                      border="2px solid var(--accent-secondary)"
                    />
                    <div style={{ marginTop: '0.95rem' }}>
                      {person.role && (
                        <span
                          className="role-badge"
                          style={{ marginBottom: '0.35rem', display: 'inline-block' }}
                        >
                          {person.role}
                        </span>
                      )}
                      <h3
                        className="serif-font"
                        style={{
                          fontSize: '1.75rem',
                          color: 'var(--text-primary)',
                          margin: 0
                        }}
                      >
                        {person.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Optional Early QR RSVP Access */}
            {uc.allowRsvpAccess && !previewOnly && (
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowRsvpDrawer(!showRsvpDrawer)}
                  style={{ padding: '0.85rem 1.75rem', fontSize: '0.92rem' }}
                >
                  <QrCode size={17} />{' '}
                  {showRsvpDrawer
                    ? 'Hide QR Code RSVP Form'
                    : uc.rsvpButtonText || 'Have Your Invitation QR Code? Unlock Early RSVP'}
                </button>
              </div>
            )}

            {uc.footerNote && (
              <p
                style={{
                  marginTop: '1.5rem',
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic'
                }}
              >
                {uc.footerNote}
              </p>
            )}
          </div>

          {/* Optional Embedded QR RSVP Form if enabled */}
          {uc.allowRsvpAccess && showRsvpDrawer && !previewOnly && (
            <div
              className="surface-card"
              style={{
                marginTop: '2rem',
                textAlign: 'left',
                border: '1.5px solid var(--border-gold)'
              }}
            >
              <RsvpTab
                rsvpPage={rsvpPage}
                siteSettings={siteSettings}
                initialCode={initialCode}
                sampleInvites={sampleInvites}
                menuOptions={reception?.menuOptions || []}
                rsvpDeadline={siteSettings?.rsvpDeadline}
                coupleShortNames={siteSettings?.shortNames}
                onRsvpSubmitted={onRsvpSubmitted}
                onUnlockWeddingParty={onUnlockWeddingParty}
              />
            </div>
          )}
        </div>
      </main>

      {/* Discreet Footer */}
      {!previewOnly && (
        <footer
          className="no-print"
          style={{
            borderTop: '1px solid var(--border-gold)',
            background: 'var(--bg-secondary)',
            padding: '1.75rem 1.25rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <Heart size={14} />
            <span>{siteSettings?.footerText || 'Forever & Always Beneath the October Moon'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {onPreviewFullSite && (
              <button type="button" className="btn-secondary" onClick={onPreviewFullSite} style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem' }}>
                <Eye size={14} /> Preview Full Website (Admin)
              </button>
            )}
            {onOpenCms && (
              <button type="button" className="btn-secondary" onClick={onOpenCms} style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem' }}>
                <Settings size={14} /> Open CMS Studio (Passcode: wedding2026)
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
