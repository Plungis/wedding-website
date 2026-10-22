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

export function formatRichHtml(raw) {
  if (raw === null || raw === undefined) return '';
  const str = String(raw);
  if (!str) return '';
  return str.replace(/\r\n/g, '\n').replace(/\n/g, '<br />');
}

export function stripHtmlToPlain(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function RichText({ text, tag: Tag = 'span', className, style }) {
  if (text === null || text === undefined || text === '') return null;
  return (
    <Tag
      className={className}
      style={{ whiteSpace: 'pre-line', ...style }}
      dangerouslySetInnerHTML={{ __html: formatRichHtml(text) }}
    />
  );
}

// Gothic Pointed Cathedral Arch & Rose Filigree SVG Ornament
export function GothicRoseArchOrnament({ width = 180 }) {
  return (
    <svg
      width={width}
      height="28"
      viewBox="0 0 220 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0.25rem auto 0.6rem', opacity: 0.88 }}
    >
      <path
        d="M10 26 C55 26, 85 4, 110 2 C135 4, 165 26, 210 26"
        stroke="var(--accent-secondary)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M35 28 C70 28, 92 11, 110 8 C128 11, 150 28, 185 28"
        stroke="var(--accent-primary)"
        strokeWidth="1"
        strokeDasharray="3 3"
        fill="none"
      />
      <circle cx="110" cy="15" r="5.5" fill="var(--accent-primary)" stroke="var(--accent-secondary)" strokeWidth="1.3" />
      <circle cx="82" cy="21" r="2.5" fill="var(--accent-secondary)" />
      <circle cx="138" cy="21" r="2.5" fill="var(--accent-secondary)" />
    </svg>
  );
}

// Reusable Image Renderer that applies interactive pan (x, y) & zoom crop alignment
export function PositionedImage({
  src,
  alt,
  crop,
  height = '340px',
  borderRadius = '16px',
  border = 'none',
  style = {}
}) {
  const x = crop?.x !== undefined ? Number(crop.x) : 50;
  const y = crop?.y !== undefined ? Number(crop.y) : 50;
  const zoom = crop?.zoom !== undefined ? Number(crop.zoom) : 1;

  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius,
        border,
        overflow: 'hidden',
        position: 'relative',
        background: '#050305',
        ...style
      }}
    >
      <img
        src={src}
        alt={alt || ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${x}% ${y}%`,
          transform: zoom !== 1 ? `scale(${zoom})` : 'none',
          transformOrigin: `${x}% ${y}%`,
          display: 'block',
          transition: 'object-position 0.08s ease-out, transform 0.08s ease-out'
        }}
      />
    </div>
  );
}

export default function PageBlockRenderer({
  pageData,
  siteSettings,
  onSelectTab,
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
                <Heart size={16} fill="currentColor" />{' '}
                <RichText text={settings.noteLabel || `A NOTE FROM ${siteSettings?.shortNames?.toUpperCase() || 'US'}`} />
              </div>
              <blockquote className="serif-font" style={{ fontSize: '1.75rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '0.75rem', whiteSpace: 'pre-line' }}>
                “<RichText text={settings.quote || 'Whatever our souls are made of, yours and mine are the same.'} />”
              </blockquote>
              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                <RichText text={settings.subtext || `Join us on ${siteSettings?.weddingDateDisplay} in ${siteSettings?.locationSummary}.`} />
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
                  padding: '1.4rem',
                  borderRadius: '36px 36px 16px 16px',
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
                {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}><RichText text={block.title} /></h3>}
                <GothicRoseArchOrnament />
                {block.subtitle && <p className="section-subtitle"><RichText text={block.subtitle} /></p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 2)}>
              {items.map((person, idx) => {
                const radius =
                  settings.frameStyle === 'rounded'
                    ? '18px'
                    : settings.frameStyle === 'circle'
                    ? '50%'
                    : '220px 220px 14px 14px';
                return (
                  <div key={person.id || idx} className="couple-card">
                    <div className="couple-card-img-wrap">
                      <PositionedImage
                        src={person.photo}
                        alt={stripHtmlToPlain(person.name)}
                        crop={person.photoCrop}
                        height="370px"
                        borderRadius={radius}
                        border="2px solid var(--border-gold)"
                      />
                    </div>
                    <div className="couple-card-body">
                      {person.role && <span className="role-badge"><RichText text={person.role} /></span>}
                      <h3 style={{ fontSize: '2.1rem', marginBottom: '0.65rem' }}><RichText text={person.name} /></h3>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.15rem', fontSize: '0.96rem', whiteSpace: 'pre-line' }}>
                        <RichText text={person.bio} />
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
                            <strong style={{ color: 'var(--accent-secondary)' }}>Fun Fact:</strong> <RichText text={person.funFact} />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div>
            {(block.kicker || block.title) && (
              <div className="section-header-box" style={{ marginBottom: '1.75rem' }}>
                {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}><RichText text={block.title} /></h3>}
                <GothicRoseArchOrnament />
                {block.subtitle && <p className="section-subtitle"><RichText text={block.subtitle} /></p>}
              </div>
            )}
            <div className="timeline-list">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="timeline-item">
                  <div className="timeline-img-wrap">
                    <PositionedImage
                      src={item.image}
                      alt={stripHtmlToPlain(item.title)}
                      crop={item.imageCrop}
                      height="100%"
                      borderRadius="0px"
                      style={{ minHeight: '220px' }}
                    />
                  </div>
                  <div className="timeline-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                      {item.year && (
                        <span className="role-badge" style={{ marginBottom: 0 }}>
                          <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          <RichText text={item.year} />
                        </span>
                      )}
                      {item.location && (
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} /> <RichText text={item.location} />
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}><RichText text={item.title} /></h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', whiteSpace: 'pre-line' }}><RichText text={item.description} /></p>
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
                {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}><RichText text={block.title} /></h3>}
                <GothicRoseArchOrnament />
                {block.subtitle && <p className="section-subtitle"><RichText text={block.subtitle} /></p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 4)}>
              {items.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="surface-card"
                  style={{
                    padding: '1.5rem 1.35rem',
                    textAlign: 'center',
                    borderRadius: '110px 110px 20px 20px'
                  }}
                >
                  {member.photo && (
                    <div style={{ width: '130px', height: '150px', margin: '0 auto 0.95rem' }}>
                      <PositionedImage
                        src={member.photo}
                        alt={stripHtmlToPlain(member.name)}
                        crop={member.photoCrop}
                        height="150px"
                        borderRadius="80px 80px 14px 14px"
                        border="2px solid var(--accent-secondary)"
                      />
                    </div>
                  )}
                  {member.role && <span className="role-badge"><RichText text={member.role} /></span>}
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.2rem' }}><RichText text={member.name} /></h4>
                  {member.relation && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.6rem' }}>
                      <RichText text={member.relation} />
                    </div>
                  )}
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}><RichText text={member.bio} /></p>
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
                {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.35rem' }}><RichText text={block.title} /></h3>}
                <GothicRoseArchOrnament />
                {block.subtitle && <p className="section-subtitle"><RichText text={block.subtitle} /></p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 4)}>
              {items.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  style={{
                    borderRadius: '120px 120px 16px 16px',
                    overflow: 'hidden',
                    border: '1.5px solid var(--border-gold)',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-soft)'
                  }}
                >
                  <PositionedImage
                    src={photo.url}
                    alt={stripHtmlToPlain(photo.caption) || 'Wedding Gallery'}
                    crop={photo.urlCrop}
                    height={settings.aspectRatio === 'portrait' ? '320px' : settings.aspectRatio === 'square' ? '260px' : '240px'}
                    borderRadius="0px"
                  />
                  {photo.caption && (
                    <div style={{ padding: '0.8rem 1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'pre-line' }}>
                      <RichText text={photo.caption} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'venue_showcase': {
        const venueImgSrc = settings.heroImage || settings.venueImageUrl;
        const venueImgCrop = settings.heroImageCrop || settings.venueImageCrop;
        const addressText = settings.venueAddress || settings.address;

        const imgBlock = (
          <div style={{ minHeight: '360px', position: 'relative', padding: '1.15rem' }}>
            <PositionedImage
              src={venueImgSrc}
              alt={stripHtmlToPlain(settings.venueName)}
              crop={venueImgCrop}
              height="100%"
              borderRadius="180px 180px 16px 16px"
              border="1.5px solid var(--border-gold)"
              style={{ minHeight: '350px' }}
            />
          </div>
        );
        const textBlock = (
          <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {settings.badge && <span className="role-badge" style={{ alignSelf: 'flex-start' }}><RichText text={settings.badge} /></span>}
            <h3 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}><RichText text={settings.venueName} /></h3>
            {addressText && (
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem', fontSize: '0.96rem' }}>
                <MapPin size={18} color="var(--accent-secondary)" />
                <RichText text={addressText} />
              </p>
            )}
            {(settings.description || settings.attireNote) && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
                <RichText text={settings.description || settings.attireNote} />
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
                      <RichText text={h.label} />
                    </div>
                    <div style={{ fontWeight: 600, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                      <RichText text={h.value} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              {settings.mapUrl && (
                <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <MapPin size={16} /> <RichText text={settings.mapButtonText || 'Open in Google Maps'} /> <ExternalLink size={14} />
                </a>
              )}
              {settings.ctaText && onSelectTab && (
                <button className="btn-secondary" onClick={() => onSelectTab(settings.ctaTargetTab || 'rsvp')}>
                  <RichText text={settings.ctaText} /> <ArrowRight size={16} />
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
                {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
                {block.title && <h3 style={{ fontSize: '2.15rem' }}><RichText text={block.title} /></h3>}
                <GothicRoseArchOrnament />
                {block.subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '0.3rem', whiteSpace: 'pre-line' }}><RichText text={block.subtitle} /></p>}
              </div>
            )}
            <div className={getGridClass(settings.columns || 3)}>
              {items.map((step, idx) => (
                <div
                  key={step.id || idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '44px 44px 16px 16px',
                    padding: '1.65rem 1.5rem'
                  }}
                >
                  {(step.badge || step.time) && <span className="role-badge"><RichText text={step.badge || step.time} /></span>}
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.45rem' }}><RichText text={step.title} /></h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', whiteSpace: 'pre-line' }}><RichText text={step.description || step.detail} /></p>
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
                {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
                {block.title && <h3 className="section-title" style={{ fontSize: '2.25rem' }}><RichText text={block.title} /></h3>}
                <GothicRoseArchOrnament />
              </div>
            )}
            <div className={getGridClass(settings.columns || 3)}>
              {items.map((card, idx) => (
                <div key={card.id || idx} className="surface-card" style={{ borderRadius: '48px 48px 20px 20px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '22px 22px 10px 10px',
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
                  {card.kicker && <span className="section-kicker"><RichText text={card.kicker} /></span>}
                  <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}><RichText text={card.title} /></h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', whiteSpace: 'pre-line' }}><RichText text={card.description} /></p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dinner_menu':
        return (
          <div className="surface-card">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2rem' }}>
              {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
              <h3 style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}><RichText text={block.title || 'Reception Dinner Menu'} /></h3>
              <GothicRoseArchOrnament />
              {block.subtitle && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', whiteSpace: 'pre-line' }}><RichText text={block.subtitle} /></p>
              )}
            </div>
            <div className={getGridClass(settings.columns || 3)}>
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-gold)',
                    borderRadius: '55px 55px 18px 18px',
                    padding: '1.75rem 1.55rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="role-badge" style={{ marginBottom: 0 }}><RichText text={item.tag} /></span>
                      <Utensils size={18} color="var(--accent-secondary)" />
                    </div>
                    <h4 style={{ fontSize: '1.55rem', marginBottom: '0.55rem' }}><RichText text={item.name} /></h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', whiteSpace: 'pre-line' }}><RichText text={item.description} /></p>
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
              {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
              <h3 style={{ fontSize: '2.1rem' }}><RichText text={block.title || 'Schedule of Events'} /></h3>
              <GothicRoseArchOrnament />
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
                    <Clock size={16} /> <RichText text={event.time} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.35rem', marginBottom: '0.15rem' }}><RichText text={event.title} /></h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}><RichText text={event.description} /></p>
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
              {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
              <h3 className="section-title" style={{ fontSize: '2.3rem' }}><RichText text={block.title || 'Accommodations'} /></h3>
              <GothicRoseArchOrnament />
              {block.subtitle && <p className="section-subtitle"><RichText text={block.subtitle} /></p>}
            </div>
            <div className={getGridClass(settings.columns || 2)}>
              {items.map((hotel, idx) => (
                <div key={hotel.id || idx} className="surface-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <span className="role-badge">Preferred Hotel Block</span>
                    <Hotel size={20} color="var(--accent-secondary)" />
                  </div>
                  <h4 style={{ fontSize: '1.7rem', marginBottom: '0.25rem' }}><RichText text={hotel.name} /></h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.85rem' }}>
                    <RichText text={hotel.distance} /> {hotel.rate ? <>• <RichText text={hotel.rate} /></> : ''}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.15rem', whiteSpace: 'pre-line' }}>
                    <RichText text={hotel.notes} />
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
                      Group Code: <strong style={{ color: 'var(--accent-secondary)' }}><RichText text={hotel.bookingCode || 'N/A'} /></strong>
                    </span>
                    {hotel.phone && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                        <Phone size={14} /> <RichText text={hotel.phone} />
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
              <h3 style={{ fontSize: '1.95rem' }}><RichText text={block.title || 'Questions & Answers'} /></h3>
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
                    <RichText text={faq.question} />
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}><RichText text={faq.answer} /></p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'split_media': {
        const mediaSide = (
          <div style={{ minHeight: '320px', padding: '1.15rem' }}>
            <PositionedImage
              src={settings.imageUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'}
              alt={stripHtmlToPlain(block.title)}
              crop={settings.imageUrlCrop}
              height="100%"
              borderRadius="160px 160px 16px 16px"
              border="1.5px solid var(--border-gold)"
              style={{ minHeight: '300px' }}
            />
          </div>
        );
        const contentSide = (
          <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {block.kicker && <span className="role-badge" style={{ alignSelf: 'flex-start' }}><RichText text={block.kicker} /></span>}
            <h3 style={{ fontSize: '2.1rem', marginBottom: '0.65rem' }}><RichText text={block.title} /></h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginBottom: settings.buttonText ? '1.35rem' : 0, whiteSpace: 'pre-line' }}>
              <RichText text={settings.bodyText || block.subtitle} />
            </p>
            {settings.buttonText && (
              <div>
                {settings.buttonUrl ? (
                  <a href={settings.buttonUrl} target="_blank" rel="noreferrer" className="btn-primary">
                    <RichText text={settings.buttonText} /> <ExternalLink size={15} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onSelectTab && onSelectTab(settings.buttonTab || 'rsvp')}
                  >
                    <RichText text={settings.buttonText} /> <ArrowRight size={15} />
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
            {block.kicker && <span className="section-kicker"><RichText text={block.kicker} /></span>}
            <h3 style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}><RichText text={block.title} /></h3>
            <GothicRoseArchOrnament />
            <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: settings.align === 'left' ? '0 0 1.25rem' : '0 auto 1.25rem', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              <RichText text={settings.bodyText || block.subtitle} />
            </p>
            {settings.buttonText && (
              <div>
                {settings.buttonUrl ? (
                  <a href={settings.buttonUrl} target="_blank" rel="noreferrer" className="btn-primary">
                    <RichText text={settings.buttonText} /> <ExternalLink size={15} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onSelectTab && onSelectTab(settings.buttonTab || 'rsvp')}
                  >
                    <RichText text={settings.buttonText} /> <ArrowRight size={15} />
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
      {/* Page Top Header (Clickable & Editable in Visual Builder!) */}
      {(editMode || pageData.hideHeader !== true) && (
        <div
          onClick={(e) => {
            if (editMode && onSelectBlock) {
              e.stopPropagation();
              onSelectBlock('__PAGE_HEADER__');
            }
          }}
          style={{
            position: 'relative',
            opacity: pageData.hideHeader === true ? 0.45 : 1,
            outline:
              editMode && selectedBlockId === '__PAGE_HEADER__'
                ? '2.5px solid var(--accent-secondary)'
                : editMode
                ? '1px dashed rgba(212, 168, 83, 0.45)'
                : 'none',
            borderRadius: editMode ? '22px' : undefined,
            padding: editMode ? '0.75rem' : 0,
            marginBottom: editMode ? '1.75rem' : undefined,
            cursor: editMode ? 'pointer' : 'default',
            transition: 'outline 0.15s ease'
          }}
        >
          {editMode && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectBlock) onSelectBlock('__PAGE_HEADER__');
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: selectedBlockId === '__PAGE_HEADER__' ? 'var(--accent-primary)' : '#0a0609',
                border: '1px solid var(--border-gold)',
                padding: '0.45rem 0.85rem',
                borderRadius: '12px',
                marginBottom: '0.65rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#f5eee6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={15} color="var(--accent-secondary)" />
                <span>0. PAGE TITLE & TOP HEADER (“{pageData.headline || 'Untitled Page'}”)</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectBlock) onSelectBlock('__PAGE_HEADER__');
                }}
                style={{
                  background: 'var(--accent-secondary)',
                  border: 'none',
                  color: '#090608',
                  padding: '0.28rem 0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Edit3 size={12} /> Edit Page Title
              </button>
            </div>
          )}

          <div className="section-header-box" style={editMode ? { marginBottom: '0.5rem' } : undefined}>
            {pageData.kicker && <span className="section-kicker"><RichText text={pageData.kicker} /></span>}
            <h2 className="section-title"><RichText text={pageData.headline} /></h2>
            <GothicRoseArchOrnament width={220} />
            {pageData.divider && <div className="goth-divider"><RichText text={pageData.divider} /></div>}
            {pageData.subheadline && <p className="section-subtitle"><RichText text={pageData.subheadline} /></p>}
          </div>
        </div>
      )}

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
                  ? '1px dashed rgba(212, 168, 83, 0.35)'
                  : 'none',
                borderRadius: editMode ? '24px' : undefined,
                padding: editMode ? '0.65rem' : 0,
                transition: 'outline 0.15s ease, transform 0.15s ease',
                cursor: editMode ? 'pointer' : 'default'
              }}
            >
              {editMode && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isSelected ? 'var(--accent-primary)' : '#0a0609',
                    border: '1px solid var(--border-gold)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '12px',
                    marginBottom: '0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#f5eee6'
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
                      style={{ background: 'var(--accent-secondary)', border: 'none', color: '#090608', padding: '0.28rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
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

      {/* Optional Editable Bottom Page CTA Banner */}
      {(editMode || pageData.showBottomBanner) && (
        <div
          onClick={(e) => {
            if (editMode && onSelectBlock) {
              e.stopPropagation();
              onSelectBlock('__PAGE_HEADER__');
            }
          }}
          className="surface-card"
          style={{
            marginTop: '2.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'var(--bg-accent-subtle)',
            border:
              editMode && selectedBlockId === '__PAGE_HEADER__'
                ? '2.5px solid var(--accent-secondary)'
                : '1px solid var(--border-gold)',
            opacity: pageData.showBottomBanner ? 1 : 0.45,
            cursor: editMode ? 'pointer' : 'default',
            position: 'relative'
          }}
        >
          {editMode && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                marginBottom: '0.5rem',
                borderBottom: '1px dashed var(--border-gold)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--accent-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              <span>★ BOTTOM PAGE BANNER {pageData.showBottomBanner ? '(Visible)' : '(Hidden — Click to Enable)'}</span>
              <span>Click to Edit Banner Text & Buttons →</span>
            </div>
          )}
          <div>
            <h4 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>
              <RichText text={pageData.bottomBannerTitle || 'Join Us Under the October Moon'} />
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', whiteSpace: 'pre-line' }}>
              <RichText
                text={
                  pageData.bottomBannerSubtitle ||
                  'Explore our candlelit ceremony details, autumn feast menu, or scan your invitation QR code to RSVP.'
                }
              />
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {(pageData.bottomBannerPrimaryText || pageData.bottomPrimaryBtnText || 'View Twilight Ceremony') && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  !editMode &&
                  onSelectTab &&
                  onSelectTab(pageData.bottomBannerPrimaryTab || pageData.bottomPrimaryBtnTab || 'ceremony')
                }
              >
                <RichText text={pageData.bottomBannerPrimaryText || pageData.bottomPrimaryBtnText || 'View Twilight Ceremony'} />{' '}
                <ArrowRight size={16} />
              </button>
            )}
            {(pageData.bottomBannerSecondaryText || pageData.bottomSecondaryBtnText || 'Open QR Code RSVP') && (
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  !editMode &&
                  onSelectTab &&
                  onSelectTab(pageData.bottomBannerSecondaryTab || pageData.bottomSecondaryBtnTab || 'rsvp')
                }
              >
                <RichText text={pageData.bottomBannerSecondaryText || pageData.bottomSecondaryBtnText || 'Open QR Code RSVP'} />{' '}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
