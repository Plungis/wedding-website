import React, { useState, useEffect } from 'react';
import {
  Heart,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Camera,
  CameraOff,
  Car,
  Clock,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Utensils,
  Music,
  Wine,
  Hotel,
  Phone,
  QrCode,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Edit3,
  ArrowUp,
  ArrowDown,
  Star,
  Moon,
  Flame,
  Gift
} from 'lucide-react';

const ICON_MAP = {
  Heart,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Camera,
  CameraOff,
  Car,
  Clock,
  HelpCircle,
  Utensils,
  Music,
  Wine,
  Hotel,
  QrCode,
  Star,
  Moon,
  Flame,
  Gift
};

export function renderDynamicIcon(iconName, size = 20, color = 'currentColor') {
  const IconComp = ICON_MAP[iconName] || Sparkles;
  return <IconComp size={size} color={color} />;
}

export default function PageBlockRenderer({
  pageData,
  siteSettings,
  onSelectTab,
  // Visual Builder Props (optional, active when inside CMS Studio)
  editMode = false,
  selectedBlockId = null,
  onSelectBlock = null,
  onMoveBlock = null,
  onToggleBlockVisibility = null,
  onDuplicateBlock = null,
  onDeleteBlock = null,
  onDragReorderBlocks = null
}) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  useEffect(() => {
    function updateCountdown() {
      const target = new Date(siteSettings?.weddingDate || '2027-10-23T17:00:00').getTime();
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

  if (!pageData) return null;

  const blocks = pageData.blocks || [];

  function getGridClass(cols = 3) {
    if (Number(cols) === 2) return 'grid-2';
    if (Number(cols) === 4) return 'grid-4';
    return 'grid-3';
  }

  function renderSingleBlockContent(block) {
    const settings = block.settings || {};
    const items = block.items || [];

    switch (block.type) {
      case 'quote_countdown':
        return (
          <div
            className="surface-card"
            style={{
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-accent-subtle) 100%)',
              border: '1px solid var(--border-gold)',
              display: 'grid',
              gridTemplateColumns: settings.showCountdown !== false ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
              gap: '2rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                <Heart size={16} fill="currentColor" /> {settings.noteLabel || `A NOTE FROM ${siteSettings?.shortNames?.toUpperCase() || 'US'}`}
              </div>
              <blockquote className="serif-font" style={{ fontSize: '1.7rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                “{settings.quote || 'Whatever our souls are made of, yours and mine are the same.'}”
              </blockquote>
              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)' }}>
                {settings.subtext || `Join us on ${siteSettings?.weddingDateDisplay} in ${siteSettings?.locationSummary}.`}
              </p>
            </div>

            {settings.showCountdown !== false && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.85rem',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  padding: '1.35rem',
                  borderRadius: '18px',
                  border: '1px solid var(--border-gold)'
                }}
              >
                <div>
                  <div className="serif-font" style={{ fontSize: '2.6rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {countdown.days}
                  </div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Days
                  </div>
                </div>
                <div>
                  <div className="serif-font" style={{ fontSize: '2.6rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {countdown.hours}
                  </div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Hours
                  </div>
                </div>
                <div>
                  <div className="serif-font" style={{ fontSize: '2.6rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {countdown.mins}
                  </div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Minutes
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'couple_profiles':
        return (
          <div>
            {(block.kicker || block.title) && (
              <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
                {block.kicker && <span className="section-kicker">{block.kicker}</span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}>{block.title}</h3>}
                {block.subtitle && <p className="section-subtitle">{block.subtitle}</p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 2)}>
              {items.map((person, idx) => (
                <div key={person.id || idx} className="couple-card">
                  <div className="couple-card-img-wrap">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="couple-card-img"
                      style={{
                        borderRadius:
                          settings.frameStyle === 'rounded'
                            ? '16px'
                            : settings.frameStyle === 'circle'
                            ? '50%'
                            : '160px 160px 14px 14px'
                      }}
                    />
                  </div>
                  <div className="couple-card-body">
                    {person.role && <span className="role-badge">{person.role}</span>}
                    <h3 style={{ fontSize: '2.1rem', marginBottom: '0.65rem' }}>{person.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.15rem', fontSize: '0.96rem' }}>
                      {person.bio}
                    </p>
                    {person.funFact && (
                      <div
                        style={{
                          background: 'var(--bg-accent-subtle)',
                          border: '1px solid var(--border-gold)',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          fontSize: '0.86rem',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Sparkles size={16} color="var(--accent-secondary)" style={{ flexShrink: 0 }} />
                        <span>
                          <strong style={{ color: 'var(--accent-secondary)' }}>Fun Fact:</strong> {person.funFact}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div>
            {(block.kicker || block.title) && (
              <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
                {block.kicker && <span className="section-kicker">{block.kicker}</span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}>{block.title}</h3>}
                {block.subtitle && <p className="section-subtitle">{block.subtitle}</p>}
              </div>
            )}
            <div className="timeline-list">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="timeline-item">
                  <img src={item.image} alt={item.title} className="timeline-img" />
                  <div className="timeline-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                      {item.year && (
                        <span className="role-badge" style={{ marginBottom: 0 }}>
                          <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {item.year}
                        </span>
                      )}
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
        );

      case 'wedding_party':
        return (
          <div>
            {(block.kicker || block.title) && (
              <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
                {block.kicker && <span className="section-kicker">{block.kicker}</span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}>{block.title}</h3>}
                {block.subtitle && <p className="section-subtitle">{block.subtitle}</p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 4)}>
              {items.map((member, idx) => (
                <div key={member.id || idx} className="surface-card" style={{ padding: '1.45rem', textAlign: 'center' }}>
                  {member.photo && (
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{
                        width: '115px',
                        height: '115px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        margin: '0 auto 0.9rem',
                        border: '2.5px solid var(--accent-secondary)'
                      }}
                    />
                  )}
                  {member.role && <span className="role-badge">{member.role}</span>}
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.2rem' }}>{member.name}</h4>
                  {member.relation && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.6rem' }}>
                      {member.relation}
                    </div>
                  )}
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div>
            {(block.kicker || block.title) && (
              <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
                {block.kicker && <span className="section-kicker">{block.kicker}</span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}>{block.title}</h3>}
                {block.subtitle && <p className="section-subtitle">{block.subtitle}</p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 4)}>
              {items.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-gold)',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-soft)'
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Wedding Gallery'}
                    style={{
                      width: '100%',
                      height: settings.aspectRatio === 'portrait' ? '320px' : settings.aspectRatio === 'square' ? '260px' : '230px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  {photo.caption && (
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'venue_showcase': {
        const imgBlock = (
          <div style={{ minHeight: '360px', position: 'relative' }}>
            <img
              src={settings.heroImage}
              alt={settings.venueName}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        );
        const textBlock = (
          <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {settings.badge && <span className="role-badge" style={{ alignSelf: 'flex-start' }}>{settings.badge}</span>}
            <h3 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{settings.venueName}</h3>
            {settings.venueAddress && (
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.5rem', fontSize: '0.96rem' }}>
                <MapPin size={18} color="var(--accent-secondary)" />
                {settings.venueAddress}
              </p>
            )}

            {(settings.highlights || []).length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.5rem'
                }}
              >
                {settings.highlights.map((h, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                      {h.label}
                    </div>
                    <div style={{ fontWeight: 600, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                      {h.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              {settings.mapUrl && (
                <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <MapPin size={16} /> Open in Google Maps <ExternalLink size={14} />
                </a>
              )}
              {settings.ctaText && onSelectTab && (
                <button className="btn-secondary" onClick={() => onSelectTab(settings.ctaTargetTab || 'rsvp')}>
                  {settings.ctaText} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        );

        return (
          <div
            className="surface-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
            }}
          >
            {settings.imagePosition === 'right' ? (
              <>
                {textBlock}
                {imgBlock}
              </>
            ) : (
              <>
                {imgBlock}
                {textBlock}
              </>
            )}
          </div>
        );
      }

      case 'order_cards':
        return (
          <div className="surface-card">
            {(block.kicker || block.title) && (
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                {block.kicker && <span className="section-kicker">{block.kicker}</span>}
                {block.title && <h3 style={{ fontSize: '2.15rem' }}>{block.title}</h3>}
                {block.subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '0.3rem' }}>{block.subtitle}</p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 3)}>
              {items.map((step, idx) => (
                <div
                  key={step.id || idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.5rem'
                  }}
                >
                  {(step.badge || step.time) && <span className="role-badge">{step.badge || step.time}</span>}
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.45rem' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{step.description || step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'feature_grid':
        return (
          <div>
            {(block.kicker || block.title) && (
              <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
                {block.kicker && <span className="section-kicker">{block.kicker}</span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.25rem' }}>{block.title}</h3>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 3)}>
              {items.map((card, idx) => (
                <div key={card.id || idx} className="surface-card">
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--bg-accent-subtle)',
                      border: '1px solid var(--border-gold)',
                      color: 'var(--accent-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    {renderDynamicIcon(card.icon || 'Sparkles', 20)}
                  </div>
                  {card.kicker && <span className="section-kicker">{card.kicker}</span>}
                  <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{card.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem' }}>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dinner_menu':
        return (
          <div className="surface-card">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2rem' }}>
              {block.kicker && <span className="section-kicker">{block.kicker}</span>}
              <h3 style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>{block.title || 'Reception Dinner Menu'}</h3>
              {block.subtitle && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>{block.subtitle}</p>
              )}
            </div>
            <div className={getGridClass(settings.columns || 3)}>
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-gold)',
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
        );

      case 'schedule_list':
        return (
          <div className="surface-card">
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              {block.kicker && <span className="section-kicker">{block.kicker}</span>}
              <h3 style={{ fontSize: '2.1rem' }}>{block.title || 'Schedule of Events'}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {items.map((event, idx) => (
                <div
                  key={event.id || idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '145px 1fr',
                    gap: '1.25rem',
                    alignItems: 'center',
                    padding: '1.15rem 1.35rem',
                    borderRadius: '14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
        );

      case 'accommodations':
        return (
          <div>
            <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
              {block.kicker && <span className="section-kicker">{block.kicker}</span>}
              <h3 className="section-title" style={{ fontSize: '2.3rem' }}>{block.title || 'Accommodations'}</h3>
              {block.subtitle && <p className="section-subtitle">{block.subtitle}</p>}
            </div>
            <div className={getGridClass(settings.columns || 2)}>
              {items.map((hotel, idx) => (
                <div key={hotel.id || idx} className="surface-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <span className="role-badge">Preferred Hotel Block</span>
                    <Hotel size={20} color="var(--accent-secondary)" />
                  </div>
                  <h4 style={{ fontSize: '1.7rem', marginBottom: '0.25rem' }}>{hotel.name}</h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.85rem' }}>
                    {hotel.distance} {hotel.rate ? `• ${hotel.rate}` : ''}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.15rem' }}>
                    {hotel.notes}
                  </p>
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary)',
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
                      Group Code: <strong style={{ color: 'var(--accent-secondary)' }}>{hotel.bookingCode || 'N/A'}</strong>
                    </span>
                    {hotel.phone && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                        <Phone size={14} /> {hotel.phone}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq_grid':
        return (
          <div className="surface-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.35rem' }}>
              <HelpCircle size={22} color="var(--accent-secondary)" />
              <h3 style={{ fontSize: '1.95rem' }}>{block.title || 'Questions & Answers'}</h3>
            </div>
            <div className={getGridClass(settings.columns || 3)}>
              {items.map((faq, idx) => (
                <div
                  key={faq.id || idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.45rem', color: 'var(--accent-secondary)' }}>
                    {faq.question}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'split_media': {
        const mediaSide = (
          <div style={{ minHeight: '300px' }}>
            <img
              src={settings.imageUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'}
              alt={block.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        );
        const contentSide = (
          <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {block.kicker && <span className="role-badge" style={{ alignSelf: 'flex-start' }}>{block.kicker}</span>}
            <h3 style={{ fontSize: '2.1rem', marginBottom: '0.65rem' }}>{block.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginBottom: settings.buttonText ? '1.35rem' : 0, whiteSpace: 'pre-line' }}>
              {settings.bodyText || block.subtitle}
            </p>
            {settings.buttonText && (
              <div>
                {settings.buttonUrl ? (
                  <a href={settings.buttonUrl} target="_blank" rel="noreferrer" className="btn-primary">
                    {settings.buttonText} <ExternalLink size={15} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onSelectTab && onSelectTab(settings.buttonTab || 'rsvp')}
                  >
                    {settings.buttonText} <ArrowRight size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
        return (
          <div
            className="surface-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}
          >
            {settings.imagePosition === 'right' ? (
              <>
                {contentSide}
                {mediaSide}
              </>
            ) : (
              <>
                {mediaSide}
                {contentSide}
              </>
            )}
          </div>
        );
      }

      case 'rich_banner':
      default:
        return (
          <div
            className="surface-card"
            style={{
              textAlign: settings.align || 'center',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-accent-subtle) 100%)',
              border: '1px solid var(--border-gold)',
              padding: '2.5rem 2rem'
            }}
          >
            {block.kicker && <span className="section-kicker">{block.kicker}</span>}
            <h3 style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>{block.title}</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: settings.align === 'left' ? '0 0 1.25rem' : '0 auto 1.25rem', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {settings.bodyText || block.subtitle}
            </p>
            {settings.buttonText && (
              <div>
                {settings.buttonUrl ? (
                  <a href={settings.buttonUrl} target="_blank" rel="noreferrer" className="btn-primary">
                    {settings.buttonText} <ExternalLink size={15} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onSelectTab && onSelectTab(settings.buttonTab || 'rsvp')}
                  >
                    {settings.buttonText} <ArrowRight size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
    }
  }

  return (
    <div>
      {/* Page Top Header */}
      <div className="section-header-box">
        {pageData.kicker && <span className="section-kicker">{pageData.kicker}</span>}
        <h2 className="section-title">{pageData.headline}</h2>
        {pageData.divider && <div className="goth-divider">{pageData.divider}</div>}
        {pageData.subheadline && <p className="section-subtitle">{pageData.subheadline}</p>}
      </div>

      {/* Render Ordered Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>
        {blocks.map((block, index) => {
          if (!editMode && block.visible === false) {
            return null;
          }

          const isSelected = editMode && selectedBlockId === block.id;
          const isDragOver = editMode && dragOverIdx === index;

          return (
            <div
              key={block.id || index}
              draggable={editMode}
              onDragStart={(e) => {
                if (!editMode) return;
                setDraggedIdx(index);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                if (!editMode) return;
                e.preventDefault();
                if (dragOverIdx !== index) setDragOverIdx(index);
              }}
              onDragLeave={() => {
                if (!editMode) return;
                setDragOverIdx(null);
              }}
              onDrop={(e) => {
                if (!editMode) return;
                e.preventDefault();
                if (draggedIdx !== null && draggedIdx !== index && onDragReorderBlocks) {
                  onDragReorderBlocks(draggedIdx, index);
                }
                setDraggedIdx(null);
                setDragOverIdx(null);
              }}
              onClick={(e) => {
                if (editMode && onSelectBlock) {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                }
              }}
              style={{
                position: 'relative',
                opacity: block.visible === false ? 0.45 : 1,
                outline: isSelected
                  ? '2.5px solid var(--accent-secondary)'
                  : isDragOver
                  ? '2.5px dashed var(--accent-secondary)'
                  : editMode
                  ? '1px dashed rgba(209, 142, 71, 0.35)'
                  : 'none',
                borderRadius: editMode ? '24px' : undefined,
                padding: editMode ? '0.65rem' : 0,
                transition: 'outline 0.15s ease, transform 0.15s ease',
                cursor: editMode ? 'pointer' : 'default'
              }}
            >
              {/* Floating Visual Drag-and-Drop Bar when inside CMS Builder */}
              {editMode && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isSelected ? 'var(--accent-primary)' : '#0d0810',
                    border: '1px solid var(--border-gold)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '12px',
                    marginBottom: '0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#f4ece1'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'grab' }}>
                    <GripVertical size={16} color="var(--accent-secondary)" />
                    <span>
                      {index + 1}. {block.title || block.type.toUpperCase()}
                    </span>
                    {block.visible === false && (
                      <span style={{ color: '#fca5a5', fontSize: '0.72rem' }}>(Hidden on Live Site)</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      title="Move Section Up"
                      disabled={index === 0}
                      onClick={() => onMoveBlock && onMoveBlock(index, -1)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.28rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      title="Move Section Down"
                      disabled={index === blocks.length - 1}
                      onClick={() => onMoveBlock && onMoveBlock(index, 1)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.28rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      title="Edit Section Properties"
                      onClick={() => onSelectBlock && onSelectBlock(block.id)}
                      style={{ background: 'var(--accent-secondary)', border: 'none', color: '#120d14', padding: '0.28rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Edit3 size={12} /> Inspect
                    </button>
                    <button
                      type="button"
                      title={block.visible === false ? 'Show Section' : 'Hide Section'}
                      onClick={() => onToggleBlockVisibility && onToggleBlockVisibility(block.id)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.28rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {block.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      type="button"
                      title="Duplicate Section"
                      onClick={() => onDuplicateBlock && onDuplicateBlock(block.id)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.28rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      title="Delete Section"
                      onClick={() => onDeleteBlock && onDeleteBlock(block.id)}
                      style={{ background: 'rgba(220,38,38,0.3)', border: 'none', color: '#fca5a5', padding: '0.28rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}

              {renderSingleBlockContent(block)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
