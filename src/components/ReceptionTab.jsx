import React from 'react';
import {
  Wine,
  Utensils,
  Music,
  Sparkles,
  Clock,
  MapPin,
  Hotel,
  Phone,
  ExternalLink,
  QrCode
} from 'lucide-react';

export default function ReceptionTab({ reception, onSelectTab }) {
  if (!reception) return null;

  return (
    <div className="reception-tab-content">
      <div className="section-header-box">
        <span className="section-kicker">03 • Dinner, Wine & Dancing</span>
        <h2 className="section-title">{reception.headline}</h2>
        <div className="goth-divider">✦ 🕯️ ✦</div>
        <p className="section-subtitle">{reception.subheadline}</p>
      </div>

      {/* Main Reception Venue Showcase */}
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
        <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="role-badge" style={{ alignSelf: 'flex-start' }}>Evening Celebration</span>
          <h3 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{reception.venueName}</h3>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <MapPin size={18} color="var(--accent-primary)" />
            {reception.venueAddress}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.9rem',
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Cocktail Hour
              </div>
              <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{reception.cocktailTime}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Plated Dinner
              </div>
              <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{reception.dinnerTime}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Band & Dancing
              </div>
              <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{reception.dancingTime}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Grand Finale
              </div>
              <div style={{ fontWeight: 600, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                {reception.sendOffTime}
              </div>
            </div>
          </div>

          <div>
            <button className="btn-primary" onClick={() => onSelectTab('rsvp')}>
              <QrCode size={17} /> Select Your Entrée on the QR RSVP Page
            </button>
          </div>
        </div>

        <div style={{ minHeight: '360px' }}>
          <img
            src={reception.heroImage}
            alt={reception.venueName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* Plated Dinner Entrée Selections */}
      <div className="surface-card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem' }}>
          <span className="section-kicker">Chef's Tasting Table</span>
          <h3 style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>Reception Dinner Menu</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
            All entrées are preceded by a Sonoma Heirloom Peach & Burrata Salad and warm Rosemary Focaccia. Please select your preferred entrée when you RSVP with your QR code.
          </p>
        </div>

        <div className="grid-3">
          {(reception.menuOptions || []).map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                background: 'var(--bg-primary)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '18px',
                padding: '1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="role-badge" style={{ marginBottom: 0 }}>{item.tag}</span>
                  <Utensils size={18} color="var(--accent-secondary)" />
                </div>
                <h4 style={{ fontSize: '1.55rem', marginBottom: '0.55rem' }}>{item.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Music & Drinks Highlight Cards */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="surface-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-accent-subtle)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Music size={22} />
          </div>
          <div>
            <span className="section-kicker">Live Music & Entertainment</span>
            <h4 style={{ fontSize: '1.65rem', marginBottom: '0.45rem' }}>Soundtrack of the Night</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>{reception.entertainment}</p>
          </div>
        </div>

        <div className="surface-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-accent-subtle)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Wine size={22} />
          </div>
          <div>
            <span className="section-kicker">Estate Wines & Craft Cocktails</span>
            <h4 style={{ fontSize: '1.65rem', marginBottom: '0.45rem' }}>From the Conservatory Bar</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>{reception.barNote}</p>
          </div>
        </div>
      </div>

      {/* Evening Schedule */}
      {(reception.schedule || []).length > 0 && (
        <div className="surface-card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span className="section-kicker">Order of the Evening</span>
            <h3 style={{ fontSize: '2.1rem' }}>Reception Timeline</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {reception.schedule.map((event, idx) => (
              <div
                key={event.id || idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  gap: '1.25rem',
                  alignItems: 'center',
                  padding: '1.15rem 1.35rem',
                  borderRadius: '14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} /> {event.time}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.35rem', marginBottom: '0.15rem' }}>{event.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotel Blocks & Accommodations */}
      {(reception.accommodations || []).length > 0 && (
        <div>
          <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
            <span className="section-kicker">Where to Stay</span>
            <h3 className="section-title" style={{ fontSize: '2.3rem' }}>Hotel Room Blocks & Shuttles</h3>
          </div>
          <div className="grid-2">
            {reception.accommodations.map((hotel, idx) => (
              <div key={hotel.id || idx} className="surface-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <span className="role-badge">Preferred Hotel Block</span>
                  <Hotel size={20} color="var(--accent-secondary)" />
                </div>
                <h4 style={{ fontSize: '1.7rem', marginBottom: '0.25rem' }}>{hotel.name}</h4>
                <div style={{ fontSize: '0.88rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.85rem' }}>
                  {hotel.distance} • {hotel.rate}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.15rem' }}>
                  {hotel.notes}
                </p>
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.86rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <span>
                    Group Code: <strong style={{ color: 'var(--accent-primary)' }}>{hotel.bookingCode}</strong>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                    <Phone size={14} /> {hotel.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
