import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Sparkles, Users, Camera, ArrowRight } from 'lucide-react';

export default function AboutTab({ aboutUs, siteSettings, onSelectTab }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    function updateCountdown() {
      const target = new Date(siteSettings?.weddingDate || '2027-06-19T16:00:00').getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      setCountdown({ days, hours, mins });
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 30000);
    return () => clearInterval(timer);
  }, [siteSettings?.weddingDate]);

  if (!aboutUs) return null;

  return (
    <div className="about-tab-content">
      {/* Header & Romantic Quote */}
      <div className="section-header-box">
        <span className="section-kicker">01 • About The Couple</span>
        <h2 className="section-title">{aboutUs.headline}</h2>
        <p className="section-subtitle">{aboutUs.subheadline}</p>
      </div>

      {/* Quote & Countdown Strip */}
      <div
        className="surface-card"
        style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.85rem' }}>
            <Heart size={16} fill="currentColor" /> A NOTE FROM {siteSettings?.shortNames?.toUpperCase()}
          </div>
          <blockquote className="serif-font" style={{ fontSize: '1.55rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            “{aboutUs.introQuote}”
          </blockquote>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Join us on <strong>{siteSettings?.weddingDateDisplay}</strong> in <strong>{siteSettings?.locationSummary}</strong>.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.85rem',
            textAlign: 'center',
            background: 'var(--bg-card)',
            padding: '1.35rem',
            borderRadius: '18px',
            border: '1px solid var(--border-color)'
          }}
        >
          <div>
            <div className="serif-font" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {countdown.days}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Days
            </div>
          </div>
          <div>
            <div className="serif-font" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {countdown.hours}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Hours
            </div>
          </div>
          <div>
            <div className="serif-font" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {countdown.mins}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>
              Minutes
            </div>
          </div>
        </div>
      </div>

      {/* Couple Profiles */}
      <div className="grid-2" style={{ marginBottom: '3.5rem' }}>
        {(aboutUs.coupleProfiles || []).map((person) => (
          <div key={person.id} className="couple-card">
            <img src={person.photo} alt={person.name} className="couple-card-img" />
            <div className="couple-card-body">
              <span className="role-badge">{person.role}</span>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.65rem' }}>{person.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.15rem', fontSize: '0.96rem' }}>
                {person.bio}
              </p>
              {person.funFact && (
                <div
                  style={{
                    background: 'var(--bg-accent-subtle)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.86rem',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span><strong>Fun Fact:</strong> {person.funFact}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Story Timeline */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
          <span className="section-kicker">How We Got Here</span>
          <h3 className="section-title" style={{ fontSize: '2.35rem' }}>Chapters of Our Story</h3>
        </div>

        <div className="timeline-list">
          {(aboutUs.storyTimeline || []).map((item) => (
            <div key={item.id} className="timeline-item">
              <img src={item.image} alt={item.title} className="timeline-img" />
              <div className="timeline-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                  <span className="role-badge" style={{ marginBottom: 0 }}>
                    <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {item.year}
                  </span>
                  {item.location && (
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} /> {item.location}
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wedding Party */}
      {(aboutUs.weddingParty || []).length > 0 && (
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
            <span className="section-kicker">Standing By Our Side</span>
            <h3 className="section-title" style={{ fontSize: '2.35rem' }}>The Wedding Party</h3>
          </div>

          <div className="grid-4">
            {aboutUs.weddingParty.map((member) => (
              <div key={member.id} className="surface-card" style={{ padding: '1.35rem', textAlign: 'center' }}>
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 0.9rem',
                    border: '3px solid var(--accent-light)'
                  }}
                />
                <span className="role-badge">{member.role}</span>
                <h4 style={{ fontSize: '1.45rem', marginBottom: '0.2rem' }}>{member.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.6rem' }}>
                  {member.relation}
                </div>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)' }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      {(aboutUs.gallery || []).length > 0 && (
        <div style={{ marginBottom: '2.75rem' }}>
          <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
            <span className="section-kicker">Captured Moments</span>
            <h3 className="section-title" style={{ fontSize: '2.35rem' }}>Engagement Gallery</h3>
          </div>
          <div className="grid-4">
            {aboutUs.gallery.map((photo) => (
              <div
                key={photo.id}
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-soft)'
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '0.75rem 1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  {photo.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Quick Navigation Banner */}
      <div
        className="surface-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-accent-subtle)'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>Ready to explore the wedding day details?</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            View the ceremony schedule, reception menu, or scan your invitation QR code to RSVP.
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
