import React from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  Car,
  CameraOff,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function CeremonyTab({ ceremony, onSelectTab }) {
  if (!ceremony) return null;

  return (
    <div className="ceremony-tab-content">
      <div className="section-header-box">
        <span className="section-kicker">02 • The Vow Exchange</span>
        <h2 className="section-title">{ceremony.headline}</h2>
        <p className="section-subtitle">{ceremony.subheadline}</p>
      </div>

      {/* Main Venue Showcase Card */}
      <div
        className="surface-card"
        style={{
          padding: 0,
          overflow: 'hidden',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}
      >
        <div style={{ minHeight: '360px', position: 'relative' }}>
          <img
            src={ceremony.heroImage}
            alt={ceremony.venueName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="role-badge" style={{ alignSelf: 'flex-start' }}>Ceremony Venue</span>
          <h3 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{ceremony.venueName}</h3>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.5rem', fontSize: '0.96rem' }}>
            <MapPin size={18} color="var(--accent-primary)" />
            {ceremony.venueAddress}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Date
              </div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Calendar size={15} color="var(--accent-primary)" /> {ceremony.dateDisplay}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Gates Open
              </div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Clock size={15} color="var(--accent-primary)" /> {ceremony.doorsOpenTime}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Processional Begins
              </div>
              <div style={{ fontWeight: 600, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                {ceremony.startTime}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Officiant
              </div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <UserCheck size={15} color="var(--accent-primary)" /> {ceremony.officiant}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            {ceremony.mapUrl && (
              <a
                href={ceremony.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <MapPin size={16} /> View Venue on Google Maps <ExternalLink size={14} />
              </a>
            )}
            <button className="btn-secondary" onClick={() => onSelectTab('reception')}>
              See Reception Details <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Ceremony Order of Events */}
      {(ceremony.orderOfEvents || []).length > 0 && (
        <div className="surface-card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span className="section-kicker">Timeline of Vows</span>
            <h3 style={{ fontSize: '2.1rem' }}>Ceremony Order of Events</h3>
          </div>

          <div className="grid-3">
            {ceremony.orderOfEvents.map((step, index) => (
              <div
                key={step.id || index}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  position: 'relative'
                }}
              >
                <span className="role-badge">{step.time}</span>
                <h4 style={{ fontSize: '1.45rem', marginBottom: '0.45rem' }}>{step.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attire, Unplugged Note & Transportation Cards */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="surface-card">
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg-accent-subtle)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Sparkles size={20} />
          </div>
          <span className="section-kicker">Attire Guidance</span>
          <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{ceremony.dressCodeTitle}</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{ceremony.dressCodeNote}</p>
        </div>

        <div className="surface-card">
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg-accent-subtle)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <CameraOff size={20} />
          </div>
          <span className="section-kicker">Be Present With Us</span>
          <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Unplugged Ceremony</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{ceremony.unpluggedNote}</p>
        </div>

        <div className="surface-card">
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg-accent-subtle)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Car size={20} />
          </div>
          <span className="section-kicker">Arrival & Valet</span>
          <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Parking & Shuttles</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{ceremony.parkingAndShuttle}</p>
        </div>
      </div>

      {/* Ceremony FAQs */}
      {(ceremony.faqs || []).length > 0 && (
        <div className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.35rem' }}>
            <HelpCircle size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.9rem' }}>Ceremony Questions & Answers</h3>
          </div>
          <div className="grid-3">
            {ceremony.faqs.map((faq, idx) => (
              <div
                key={faq.id || idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: '14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.45rem', color: 'var(--accent-primary)' }}>
                  {faq.question}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
