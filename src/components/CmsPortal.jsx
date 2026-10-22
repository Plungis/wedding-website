import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import PageBlockRenderer, { GothicRoseArchOrnament } from './PageBlockRenderer.jsx';
import { applyThemeAndCustomColors } from '../App.jsx';
import {
  X,
  Lock,
  QrCode,
  Heart,
  Sparkles,
  Wine,
  Plus,
  Trash2,
  Save,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  History,
  RotateCcw,
  GripVertical,
  Eye,
  EyeOff,
  Layout,
  Palette,
  Layers,
  ArrowUp,
  ArrowDown,
  Upload,
  Columns,
  Move,
  ZoomIn,
  Scissors,
  Calendar,
  UserPlus,
  Crown,
  Search,
  MapPin
} from 'lucide-react';

const GUEST_CATEGORIES = [
  'Friend',
  'Family',
  'Immediate Family',
  'Extended Family',
  'Work / Colleague'
];

function toDateTimeLocalValue(isoStr) {
  if (!isoStr) return '2027-10-23T17:00';
  // Ensure YYYY-MM-DDTHH:mm format for <input type="datetime-local" />
  return String(isoStr).slice(0, 16);
}

function formatIsoToHumanDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatSimpleDateToHuman(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export const GOTHIC_THEMES = [
  {
    id: 'cathedral-roses',
    name: 'Cathedral Roses & Stone Archways',
    tagline: 'Pointed gothic stone arches, blood-red Baccara roses, obsidian shadows & cathedral gilt gold.',
    badge: 'Signature Rose & Archway Theme',
    swatches: ['#090608', '#181016', '#8f1128', '#d4a853', '#f5eee6'],
    previewGrad: 'linear-gradient(135deg, #090608 0%, #26121b 55%, #8f1128 100%)'
  },
  {
    id: 'gothic-noir',
    name: 'Victorian Gothic Noir & Moonlight Silver',
    tagline: 'High-contrast cinema noir, midnight ink, dark garnet wine & sterling moonlight silver filigree.',
    badge: 'Pure Gothic Noir',
    swatches: ['#060608', '#13151b', '#6e1223', '#c8d0de', '#f2f4f8'],
    previewGrad: 'linear-gradient(135deg, #060608 0%, #13151b 55%, #3d4454 100%)'
  },
  {
    id: 'vampiric-velvet',
    name: 'Crimson Velvet & Candlelit Baroque',
    tagline: 'Decadent blackened merlot, crushed cabernet velvet, scarlet roses & warm beeswax candlelight.',
    badge: 'Romantic Dark Opera',
    swatches: ['#0e0507', '#210c12', '#a8132b', '#e2a84b', '#f9efe8'],
    previewGrad: 'linear-gradient(135deg, #0e0507 0%, #33101a 55%, #a8132b 100%)'
  },
  {
    id: 'witching-autumn',
    name: 'Hollows Eve & Poison Ivy Conservatory',
    tagline: 'Enchanted nightshade forest black, dark moss stone, burnt autumn blood-orange & antique brass.',
    badge: 'Dark Botanical Autumn',
    swatches: ['#070b09', '#141f1a', '#8f301c', '#cf9c46', '#f2ede2'],
    previewGrad: 'linear-gradient(135deg, #070b09 0%, #141f1a 55%, #8f301c 100%)'
  },
  {
    id: 'mourning-lace',
    name: 'Black Lace, Withered Rose & Pewter',
    tagline: 'Soft melancholic Victorian romance in raven silk, smoked plum-ash, dusty rose & cameo silver.',
    badge: 'Victorian Lace & Rose',
    swatches: ['#0b090d', '#1c1622', '#823152', '#d4b2c4', '#f4eef6'],
    previewGrad: 'linear-gradient(135deg, #0b090d 0%, #2a1f32 55%, #823152 100%)'
  }
];

const BLOCK_LIBRARY = [
  {
    type: 'rich_banner',
    label: 'Rich Story / Callout Banner',
    desc: 'Full-width velvet banner with gothic arch ornament, headline & CTA button',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'rich_banner',
      kicker: 'Special Announcement',
      title: 'Midnight Tarot & Cigar Lounge',
      subtitle: '',
      visible: true,
      settings: {
        bodyText: 'Join us in the Manor Library after dinner for vintage port, hand-rolled cigars on the stone terrace, and live tarot readings by candlelight.',
        align: 'center',
        buttonText: 'RSVP Now',
        buttonTab: 'rsvp',
        buttonUrl: ''
      },
      items: []
    })
  },
  {
    type: 'split_media',
    label: 'Split Gothic Arch Image + Text Block',
    desc: 'Side-by-side arched photo and text card (reversible left/right layout)',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'split_media',
      kicker: 'Gothic Noir Lookbook',
      title: 'Velvet, Lace & Baccara Roses',
      subtitle: '',
      visible: true,
      settings: {
        imagePosition: 'left',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
        imageUrlCrop: { x: 50, y: 50, zoom: 1 },
        bodyText: 'We invite our guests to dress in moody gothic noir & autumn hues—think obsidian black, blood-rose crimson, deep plum, emerald velvet, and antique gold.',
        buttonText: '',
        buttonTab: 'rsvp',
        buttonUrl: ''
      },
      items: []
    })
  },
  {
    type: 'feature_grid',
    label: 'Arched Icon Feature Cards Grid',
    desc: '2, 3, or 4 column gothic-arch cards with icons & descriptions',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'feature_grid',
      kicker: 'Details & Highlights',
      title: 'What to Expect',
      visible: true,
      settings: { columns: 3 },
      items: [
        {
          id: `fg-${Date.now()}-1`,
          icon: 'Moon',
          kicker: 'Twilight Vibes',
          title: 'Candlelit Stone Archways',
          description: 'Over 300 pillar candles illuminating the historic stone abbey and glass conservatory.'
        },
        {
          id: `fg-${Date.now()}-2`,
          icon: 'Wine',
          kicker: 'Signature Drinks',
          title: 'Apothecary Cocktail Bar',
          description: 'Smoked blackberry bourbon smashes, mulled pear cider, and reserve Hudson Valley reds.'
        },
        {
          id: `fg-${Date.now()}-3`,
          icon: 'Music',
          kicker: 'After Dark',
          title: 'Live Band & Vinyl Set',
          description: 'Dance under the October moon until the midnight sparkler send-off.'
        }
      ]
    })
  },
  {
    type: 'gallery',
    label: 'Gothic Arch Photo Gallery Grid',
    desc: '2, 3, or 4 column arched photo gallery with interactive crop & alignment',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'gallery',
      kicker: 'Captured Moments',
      title: 'Photo Gallery',
      subtitle: 'Snapshots from our journey together',
      visible: true,
      settings: { columns: 3, aspectRatio: 'landscape' },
      items: [
        {
          id: `gal-${Date.now()}-1`,
          url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
          urlCrop: { x: 50, y: 50, zoom: 1 },
          caption: 'October twilight in the woods'
        },
        {
          id: `gal-${Date.now()}-2`,
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
          urlCrop: { x: 50, y: 50, zoom: 1 },
          caption: 'At the manor gates'
        },
        {
          id: `gal-${Date.now()}-3`,
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
          urlCrop: { x: 50, y: 50, zoom: 1 },
          caption: 'Autumn leaves & celebration'
        }
      ]
    })
  },
  {
    type: 'timeline',
    label: 'Story Timeline Chapters',
    desc: 'Illustrated horizontal milestone cards with dates, locations & photos',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'timeline',
      kicker: 'Milestones',
      title: 'Our Journey',
      subtitle: '',
      visible: true,
      settings: {},
      items: [
        {
          id: `tl-${Date.now()}-1`,
          year: 'October 2024',
          title: 'A Memorable Chapter',
          location: 'Hudson Valley, NY',
          description: 'Describe this special milestone in your story...',
          image: 'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=900&q=80',
          imageCrop: { x: 50, y: 50, zoom: 1 }
        }
      ]
    })
  },
  {
    type: 'order_cards',
    label: 'Event Steps / Order Cards',
    desc: 'Time-badged gothic arch cards for ceremony steps or weekend events',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'order_cards',
      kicker: 'Weekend Events',
      title: 'Order of Events',
      subtitle: '',
      visible: true,
      settings: { columns: 3 },
      items: [
        {
          id: `oc-${Date.now()}-1`,
          badge: '8:00 PM Friday',
          title: 'Welcome Drinks at the Tavern',
          description: 'Join us the night before for craft ciders and wood-fired flatbreads.'
        },
        {
          id: `oc-${Date.now()}-2`,
          badge: '5:00 PM Saturday',
          title: 'Twilight Ceremony',
          description: 'Promptly at dusk in the Stone Abbey Courtyard.'
        },
        {
          id: `oc-${Date.now()}-3`,
          badge: '11:00 AM Sunday',
          title: 'Farewell Autumn Brunch',
          description: 'Warm pastries, coffee, and hugs before you head home.'
        }
      ]
    })
  },
  {
    type: 'schedule_list',
    label: 'Time-Stamped Schedule List',
    desc: 'Vertical timeline rows with time badges and descriptions',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'schedule_list',
      kicker: 'Itinerary',
      title: 'Evening Schedule',
      visible: true,
      settings: {},
      items: [
        {
          id: `sc-${Date.now()}-1`,
          time: '5:00 PM',
          title: 'Doors Open',
          description: 'Welcome champagne and spiced cider.'
        },
        {
          id: `sc-${Date.now()}-2`,
          time: '6:00 PM',
          title: 'Main Event',
          description: 'Celebration and toasts.'
        }
      ]
    })
  },
  {
    type: 'faq_grid',
    label: 'FAQ Questions & Answers Grid',
    desc: 'Helpful Q&A cards for guests',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'faq_grid',
      kicker: 'Good to Know',
      title: 'Frequently Asked Questions',
      visible: true,
      settings: { columns: 3 },
      items: [
        {
          id: `fq-${Date.now()}-1`,
          question: 'Is there a shuttle from the hotel?',
          answer: 'Yes! Complimentary shuttles depart 45 minutes prior to the ceremony.'
        },
        {
          id: `fq-${Date.now()}-2`,
          question: 'When is the RSVP deadline?',
          answer: 'Please respond using your unique QR code by September 15, 2027.'
        }
      ]
    })
  },
  {
    type: 'venue_showcase',
    label: 'Venue Showcase & Map Card',
    desc: 'Large split venue card with arched photo, 4 highlight stats & Google Maps link',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'venue_showcase',
      title: 'Venue Showcase',
      visible: true,
      settings: {
        badge: 'Featured Venue',
        venueName: 'The Historic Stone Manor',
        venueAddress: '440 Old Sleepy Hollow Road, Tarrytown, NY',
        heroImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85',
        heroImageCrop: { x: 50, y: 50, zoom: 1 },
        imagePosition: 'left',
        mapUrl: 'https://maps.google.com',
        ctaText: 'Go to QR RSVP',
        ctaTargetTab: 'rsvp',
        highlights: [
          { label: 'Date', value: 'October 23, 2027' },
          { label: 'Doors Open', value: '4:30 PM' },
          { label: 'Attire', value: 'Gothic Black-Tie' },
          { label: 'Parking', value: 'Complimentary Valet' }
        ]
      },
      items: []
    })
  },
  {
    type: 'accommodations',
    label: 'Hotel Room Blocks Grid',
    desc: 'Hotel cards with group rates, booking codes, and shuttle notes',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'accommodations',
      kicker: 'Where to Stay',
      title: 'Hotel Room Blocks',
      subtitle: 'Mention our group code when booking',
      visible: true,
      settings: { columns: 2 },
      items: [
        {
          id: `ht-${Date.now()}-1`,
          name: 'The Castle Hotel & Spa',
          distance: '6 mins from venue',
          rate: '$295 / night',
          bookingCode: 'WEDDING27',
          phone: '(914) 555-0142',
          notes: 'Includes complimentary shuttle service to and from the manor.'
        }
      ]
    })
  },
  {
    type: 'wedding_party',
    label: 'Wedding Party / People Grid',
    desc: 'Gothic-arch portrait cards for bridesmaids, groomsmen, or family',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'wedding_party',
      kicker: 'Our Inner Circle',
      title: 'The Wedding Party',
      subtitle: '',
      visible: true,
      settings: { columns: 4 },
      items: [
        {
          id: `wp-${Date.now()}-1`,
          name: 'Alex Morgan',
          role: 'Wedding Party',
          relation: 'Dear Friend',
          bio: 'Short bio or favorite memory together...',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          photoCrop: { x: 50, y: 30, zoom: 1 }
        }
      ]
    })
  },
  {
    type: 'quote_countdown',
    label: 'Romantic Quote & Live Countdown',
    desc: 'Quote banner paired with live Days / Hours / Minutes wedding countdown',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'quote_countdown',
      title: 'Quote & Countdown',
      visible: true,
      settings: {
        noteLabel: 'COUNTING DOWN TO TWILIGHT',
        quote: 'Whatever our souls are made of, yours and mine are the same.',
        subtext: 'We cannot wait to celebrate with you.',
        showCountdown: true
      },
      items: []
    })
  }
];

const AVAILABLE_ICONS = [
  'Heart',
  'Sparkles',
  'Wine',
  'QrCode',
  'Moon',
  'Flame',
  'Star',
  'Music',
  'Utensils',
  'Camera',
  'CameraOff',
  'Car',
  'Clock',
  'Calendar',
  'MapPin',
  'Hotel',
  'Gift',
  'Users',
  'HelpCircle'
];

// ============================================================================
// INTERACTIVE PHOTO UPLOAD, DRAG-TO-LINE-UP & CROP STUDIO COMPONENT
// ============================================================================
function ImageFieldUploader({ label, value, cropValue, onChange, onCropChange }) {
  const [showCropper, setShowCropper] = useState(false);
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, startX: 50, startY: 50 });

  const x = cropValue?.x !== undefined ? Number(cropValue.x) : 50;
  const y = cropValue?.y !== undefined ? Number(cropValue.y) : 50;
  const zoom = cropValue?.zoom !== undefined ? Number(cropValue.zoom) : 1;

  function updateCrop(partial) {
    if (!onCropChange) return;
    onCropChange({
      x,
      y,
      zoom,
      ...partial
    });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onChange(ev.target.result);
        setShowCropper(true);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    setIsDraggingImg(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: x,
      startY: y
    };
  }

  function handleMouseMove(e) {
    if (!isDraggingImg) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    // Dragging image right means moving focal point left (natural pan feel)
    const nextX = Math.max(0, Math.min(100, Math.round(dragStartRef.current.startX - dx * 0.45)));
    const nextY = Math.max(0, Math.min(100, Math.round(dragStartRef.current.startY - dy * 0.45)));
    updateCrop({ x: nextX, y: nextY });
  }

  function handleMouseUp() {
    setIsDraggingImg(false);
  }

  // Optional permanent pixel crop via HTML5 Canvas
  function bakeCanvasCrop() {
    if (!value) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const outW = 800;
        const outH = 960;
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');

        const scale = Math.max(outW / img.width, outH / img.height) * zoom;
        const scaledW = img.width * scale;
        const scaledH = img.height * scale;

        const offsetX = (outW - scaledW) * (x / 100);
        const offsetY = (outH - scaledH) * (y / 100);

        ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onChange(croppedDataUrl);
        if (onCropChange) onCropChange({ x: 50, y: 50, zoom: 1 });
      } catch {
        alert('Live focal-point & zoom alignment is already saved! (External image host blocked raw pixel export, so your live pan & zoom coordinates will be used directly.)');
      }
    };
    img.onerror = () => {
      alert('Live focal-point & zoom alignment is saved!');
    };
    img.src = value;
  }

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Paste image URL or upload ->"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: '0.55rem 0.75rem', fontSize: '0.84rem' }}
        />
        <label
          className="btn-secondary"
          title="Upload image from your computer"
          style={{ padding: '0.55rem 0.7rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontSize: '0.78rem' }}
        >
          <Upload size={14} /> Upload
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        {onCropChange && value && (
          <button
            type="button"
            className={showCropper ? 'btn-primary' : 'btn-secondary'}
            title="Line up, pan, zoom, or crop this photo in the portrait frame"
            onClick={() => setShowCropper(!showCropper)}
            style={{ padding: '0.55rem 0.7rem', whiteSpace: 'nowrap', flexShrink: 0, fontSize: '0.78rem' }}
          >
            <Move size={14} /> Line Up / Crop
          </button>
        )}
      </div>

      {/* Interactive Portrait Frame Pan, Zoom & Crop Drawer */}
      {showCropper && value && onCropChange && (
        <div
          style={{
            marginTop: '0.6rem',
            padding: '0.95rem',
            borderRadius: '14px',
            background: '#080508',
            border: '1.5px solid var(--border-gold)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              🎯 Drag Photo Inside Arch Frame to Line Up Portrait
            </span>
            <button
              type="button"
              onClick={() => setShowCropper(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Done
            </button>
          </div>

          {/* Interactive Drag Viewport */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              width: '190px',
              height: '225px',
              margin: '0 auto 0.85rem',
              borderRadius: '110px 110px 14px 14px',
              border: '2px solid var(--accent-secondary)',
              overflow: 'hidden',
              position: 'relative',
              cursor: isDraggingImg ? 'grabbing' : 'grab',
              userSelect: 'none',
              background: '#000'
            }}
          >
            <img
              src={value}
              alt="Crop Preview"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${x}% ${y}%`,
                transform: `scale(${zoom})`,
                transformOrigin: `${x}% ${y}%`,
                pointerEvents: 'none',
                display: 'block'
              }}
            />
            {/* Crosshair Alignment Guides */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px dashed rgba(212, 168, 83, 0.35)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  background: 'rgba(9, 6, 8, 0.72)',
                  color: 'var(--accent-secondary)',
                  fontSize: '0.68rem',
                  padding: '0.18rem 0.5rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-gold)'
                }}
              >
                Drag to Pan ({x}%, {y}%)
              </span>
            </div>
          </div>

          {/* Sliders for Fine Tuning */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '90px', color: 'var(--text-secondary)' }}>Horizontal (X):</span>
              <input
                type="range"
                min={0}
                max={100}
                value={x}
                onChange={(e) => updateCrop({ x: Number(e.target.value) })}
                style={{ flex: 1, accentColor: 'var(--accent-secondary)' }}
              />
              <span style={{ width: '34px', textAlign: 'right' }}>{x}%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '90px', color: 'var(--text-secondary)' }}>Vertical (Y):</span>
              <input
                type="range"
                min={0}
                max={100}
                value={y}
                onChange={(e) => updateCrop({ y: Number(e.target.value) })}
                style={{ flex: 1, accentColor: 'var(--accent-secondary)' }}
              />
              <span style={{ width: '34px', textAlign: 'right' }}>{y}%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '90px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ZoomIn size={12} /> Zoom:
              </span>
              <input
                type="range"
                min={1}
                max={2.6}
                step={0.05}
                value={zoom}
                onChange={(e) => updateCrop({ zoom: Number(e.target.value) })}
                style={{ flex: 1, accentColor: 'var(--accent-secondary)' }}
              />
              <span style={{ width: '34px', textAlign: 'right' }}>{Math.round(zoom * 100)}%</span>
            </div>
          </div>

          {/* Quick Alignment Presets & Permanent Crop Bake */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', gap: '0.4rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.28rem 0.55rem', fontSize: '0.72rem' }}
                onClick={() => updateCrop({ x: 50, y: 22, zoom: 1.15 })}
              >
                Align Face / Top
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.28rem 0.55rem', fontSize: '0.72rem' }}
                onClick={() => updateCrop({ x: 50, y: 50, zoom: 1 })}
              >
                Reset Center
              </button>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.28rem 0.65rem', fontSize: '0.72rem' }}
              onClick={bakeCanvasCrop}
              title="Permanently crop pixels to this frame"
            >
              <Scissors size={12} /> Bake Crop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CmsPortal({
  isOpen,
  onClose,
  onContentUpdated,
  onSimulateQrScan
}) {
  const [passcode, setPasscode] = useState('wedding2026');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Top-level studio mode: 'builder' | 'all-text' | 'themes' | 'guests' | 'print-qrs' | 'revisions'
  const [studioMode, setStudioMode] = useState('builder');
  const [globalTextFilter, setGlobalTextFilter] = useState('');

  // Active page inside Visual Drag & Drop Builder: 'aboutUs' | 'ceremony' | 'reception' | 'rsvpPage' | 'weddingPartyPage' | 'heroTabs'
  const [builderPage, setBuilderPage] = useState('aboutUs');
  const [selectedBlockId, setSelectedBlockId] = useState('__HERO_BANNER__');
  const [showAddBlockDrawer, setShowAddBlockDrawer] = useState(false);

  const [treeDragIdx, setTreeDragIdx] = useState(null);
  const [treeDragOverIdx, setTreeDragOverIdx] = useState(null);
  const [itemDragIdx, setItemDragIdx] = useState(null);
  const [itemDragOverIdx, setItemDragOverIdx] = useState(null);
  const [tabDragIdx, setTabDragIdx] = useState(null);

  const [cmsDb, setCmsDb] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Guest & QR Studio State
  const [qrImages, setQrImages] = useState({});
  const [copiedCode, setCopiedCode] = useState('');
  const [guestFilter, setGuestFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [newGuestForm, setNewGuestForm] = useState({
    householdName: '',
    code: '',
    category: 'Friend',
    isWeddingParty: false,
    email: '',
    tableNumber: '',
    personalNote: '',
    plusOnesAllowed: 0,
    memberNames: ['']
  });

  useEffect(() => {
    if (isOpen && authenticated) {
      fetchAdminData();
    }
  }, [isOpen, authenticated]);

  useEffect(() => {
    if (!cmsDb) return;
    if (['aboutUs', 'ceremony', 'reception', 'rsvpPage', 'weddingPartyPage'].includes(builderPage)) {
      if (selectedBlockId === '__PAGE_HEADER__' || selectedBlockId === '__HERO_BANNER__') return;
      const blocks = cmsDb[builderPage]?.blocks || [];
      if (blocks.length > 0 && !blocks.some((b) => b.id === selectedBlockId)) {
        setSelectedBlockId(blocks[0].id);
      } else if (blocks.length === 0) {
        setSelectedBlockId('__PAGE_HEADER__');
      }
    }
  }, [builderPage, cmsDb, selectedBlockId]);

  useEffect(() => {
    async function generateAllGuestQrs() {
      if (!cmsDb?.guests) return;
      const origin = window.location.origin;
      const nextMap = {};
      for (const g of cmsDb.guests) {
        try {
          const url = `${origin}/?rsvp=${encodeURIComponent(g.code)}`;
          nextMap[g.code] = await QRCode.toDataURL(url, {
            width: 260,
            margin: 2,
            color: { dark: '#090608', light: '#ffffff' }
          });
        } catch {
          // ignore
        }
      }
      setQrImages(nextMap);
    }
    generateAllGuestQrs();
  }, [cmsDb?.guests]);

  if (!isOpen) return null;

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid passcode');
      } else {
        setAuthenticated(true);
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        setSelectedBlockId('__HERO_BANNER__');
      }
    } catch {
      setAuthError('Could not connect to CMS server.');
    }
  }

  async function fetchAdminData() {
    try {
      const res = await fetch('/api/admin/data', {
        headers: { 'x-admin-passcode': passcode }
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
      }
    } catch {
      // ignore
    }
  }

  async function publishAllChanges() {
    if (!cmsDb) return;
    setSavingStatus('Publishing changes...');
    try {
      const res = await fetch('/api/admin/publish-all', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({
          siteSettings: cmsDb.siteSettings,
          aboutUs: cmsDb.aboutUs,
          ceremony: cmsDb.ceremony,
          reception: cmsDb.reception,
          weddingPartyPage: cmsDb.weddingPartyPage,
          rsvpPage: cmsDb.rsvpPage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        applyThemeAndCustomColors(data.db.siteSettings);
        if (cmsDb.siteSettings?.adminPasscode) {
          setPasscode(cmsDb.siteSettings.adminPasscode);
        }
        setHasUnsavedChanges(false);
        setSavingStatus('✓ All Changes Published Live!');
        if (onContentUpdated) onContentUpdated();
        setTimeout(() => setSavingStatus(''), 3500);
      } else {
        setSavingStatus(`Error: ${data.error}`);
      }
    } catch {
      setSavingStatus('Error saving changes.');
    }
  }

  function updatePageField(pageKey, field, value) {
    setHasUnsavedChanges(true);
    setCmsDb((prev) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value
      }
    }));
  }

  function updateBlocksForPage(pageKey, newBlocks) {
    setHasUnsavedChanges(true);
    setCmsDb((prev) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        blocks: newBlocks
      }
    }));
  }

  function handleDragReorderBlocks(pageKey, fromIdx, toIdx) {
    const blocks = [...(cmsDb[pageKey]?.blocks || [])];
    if (fromIdx < 0 || toIdx < 0 || fromIdx >= blocks.length || toIdx >= blocks.length) return;
    const [moved] = blocks.splice(fromIdx, 1);
    blocks.splice(toIdx, 0, moved);
    updateBlocksForPage(pageKey, blocks);
  }

  function handleMoveBlock(pageKey, index, direction) {
    const targetIdx = index + direction;
    handleDragReorderBlocks(pageKey, index, targetIdx);
  }

  function handleToggleBlockVisibility(pageKey, blockId) {
    const blocks = (cmsDb[pageKey]?.blocks || []).map((b) =>
      b.id === blockId ? { ...b, visible: b.visible === false ? true : false } : b
    );
    updateBlocksForPage(pageKey, blocks);
  }

  function handleDuplicateBlock(pageKey, blockId) {
    const blocks = [...(cmsDb[pageKey]?.blocks || [])];
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const clone = structuredClone(blocks[idx]);
    clone.id = `block-${Date.now()}`;
    clone.title = `${clone.title || clone.type} (Copy)`;
    blocks.splice(idx + 1, 0, clone);
    updateBlocksForPage(pageKey, blocks);
    setSelectedBlockId(clone.id);
  }

  function handleDeleteBlock(pageKey, blockId) {
    const blocks = cmsDb[pageKey]?.blocks || [];
    const target = blocks.find((b) => b.id === blockId);
    if (!window.confirm(`Delete section "${target?.title || target?.type}" from this page?`)) return;
    const next = blocks.filter((b) => b.id !== blockId);
    updateBlocksForPage(pageKey, next);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(next[0]?.id || null);
    }
  }

  function handleAddBlock(pageKey, template) {
    const newBlock = template.create();
    const blocks = [...(cmsDb[pageKey]?.blocks || []), newBlock];
    updateBlocksForPage(pageKey, blocks);
    setSelectedBlockId(newBlock.id);
    setShowAddBlockDrawer(false);
  }

  function updateSelectedBlock(pageKey, updater) {
    const blocks = (cmsDb[pageKey]?.blocks || []).map((b) => {
      if (b.id !== selectedBlockId) return b;
      return typeof updater === 'function' ? updater(structuredClone(b)) : { ...b, ...updater };
    });
    updateBlocksForPage(pageKey, blocks);
  }

  function handleReorderBlockItems(pageKey, fromIdx, toIdx) {
    updateSelectedBlock(pageKey, (block) => {
      const items = [...(block.items || [])];
      if (fromIdx < 0 || toIdx < 0 || fromIdx >= items.length || toIdx >= items.length) return block;
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      block.items = items;
      return block;
    });
  }

  // Guest CRUD Handlers
  async function handleCreateGuest(e) {
    e.preventDefault();
    const cleanNames = newGuestForm.memberNames.map((n) => n.trim()).filter(Boolean);
    const members = (cleanNames.length ? cleanNames : [newGuestForm.householdName || 'Guest 1']).map(
      (name, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        name,
        isPlusOne: false,
        attending: null,
        mealChoice: '',
        dietary: ''
      })
    );

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({
          householdName: newGuestForm.householdName,
          code: newGuestForm.code,
          category: newGuestForm.category || 'Friend',
          isWeddingParty: Boolean(newGuestForm.isWeddingParty),
          email: newGuestForm.email,
          tableNumber: newGuestForm.tableNumber,
          personalNote: newGuestForm.personalNote,
          plusOnesAllowed: Number(newGuestForm.plusOnesAllowed || 0),
          members
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        setShowNewGuestModal(false);
        setNewGuestForm({
          householdName: '',
          code: '',
          category: 'Friend',
          isWeddingParty: false,
          email: '',
          tableNumber: '',
          personalNote: '',
          plusOnesAllowed: 0,
          memberNames: ['']
        });
        setSavingStatus(`✓ Created QR Invitation for ${data.guest.householdName} (${data.guest.code})`);
        if (onContentUpdated) onContentUpdated();
        setTimeout(() => setSavingStatus(''), 3500);
      } else {
        alert(data.error || 'Could not create guest');
      }
    } catch {
      alert('Failed to create guest household.');
    }
  }

  async function handleQuickUpdateGuestMeta(guest, updates) {
    try {
      const res = await fetch(`/api/admin/guests/${guest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({
          ...guest,
          ...updates
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        setSavingStatus(`✓ Updated ${guest.householdName}`);
        if (onContentUpdated) onContentUpdated();
        setTimeout(() => setSavingStatus(''), 2500);
      }
    } catch {
      // ignore
    }
  }

  async function handleUpdateGuest(e) {
    e.preventDefault();
    if (!editingGuest) return;
    try {
      const res = await fetch(`/api/admin/guests/${editingGuest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify(editingGuest)
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        setEditingGuest(null);
        setSavingStatus('✓ Guest household updated!');
        if (onContentUpdated) onContentUpdated();
        setTimeout(() => setSavingStatus(''), 3000);
      } else {
        alert(data.error || 'Failed to update guest');
      }
    } catch {
      alert('Error updating guest');
    }
  }

  async function handleDeleteGuest(id, name) {
    if (!window.confirm(`Remove invitation & QR code for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/guests/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode }
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        if (onContentUpdated) onContentUpdated();
      }
    } catch {
      // ignore
    }
  }

  function downloadQrPng(guest) {
    const dataUrl = qrImages[guest.code];
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    const safeName = guest.householdName.replace(/[^a-z0-9]/gi, '-');
    a.download = `Wedding-QR-${guest.code}-${safeName}.png`;
    a.click();
  }

  function copyInviteLink(code) {
    const link = `${window.location.origin}/?rsvp=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2200);
  }

  function exportGuestsCsv() {
    if (!cmsDb?.guests) return;
    const rows = [
      [
        'Household Name',
        'QR Code',
        'Category',
        'Wedding Party',
        'RSVP Status',
        'Table',
        'Guest Member Name',
        'Is +1 Slot',
        'Attending',
        'Entree Choice',
        'Member Dietary',
        'Email',
        'Song Request',
        'Message to Couple'
      ]
    ];

    cmsDb.guests.forEach((g) => {
      (g.members || []).forEach((m) => {
        rows.push([
          `"${(g.householdName || '').replace(/"/g, '""')}"`,
          g.code,
          `"${(g.category || 'Friend').replace(/"/g, '""')}"`,
          g.isWeddingParty ? 'Yes' : 'No',
          g.rsvpStatus,
          `"${(g.tableNumber || '').replace(/"/g, '""')}"`,
          `"${(m.name || '').replace(/"/g, '""')}"`,
          m.isPlusOne ? 'Yes (+1)' : 'No',
          m.attending === true ? 'Yes' : m.attending === false ? 'No' : 'Pending',
          `"${(m.mealChoice || '').replace(/"/g, '""')}"`,
          `"${(m.dietary || '').replace(/"/g, '""')}"`,
          `"${(g.email || '').replace(/"/g, '""')}"`,
          `"${(g.songRequest || '').replace(/"/g, '""')}"`,
          `"${(g.messageToCouple || '').replace(/"/g, '""')}"`
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'wedding-rsvp-guest-list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Login Gate
  if (!authenticated) {
    return (
      <div className="cms-overlay">
        <div
          className="surface-card"
          style={{
            maxWidth: '460px',
            width: '100%',
            margin: 'auto',
            textAlign: 'center',
            padding: '2.5rem',
            border: '1.5px solid var(--border-gold)',
            borderRadius: '180px 180px 22px 22px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '28px 28px 12px 12px',
              background: 'var(--bg-accent-subtle)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <Lock size={26} />
          </div>
          <span className="section-kicker">Gothic Noir Website Studio</span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.35rem' }}>CMS & Theme Builder</h2>
          <GothicRoseArchOrnament width={170} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Unlock the drag-and-drop builder, 5 Romantic Gothic themes, interactive portrait cropper, and guest QR studio.
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Admin Passcode</label>
              <input
                type="password"
                className="form-input"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Default: wedding2026"
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Default passcode is pre-filled: <strong>wedding2026</strong>
              </div>
            </div>

            {authError && (
              <div style={{ color: '#f87171', fontSize: '0.86rem', marginBottom: '1rem', fontWeight: 600 }}>
                {authError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Launch Gothic CMS Studio
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const isBlockPage = ['aboutUs', 'ceremony', 'reception', 'rsvpPage', 'weddingPartyPage'].includes(builderPage);
  const currentPageObj = isBlockPage ? cmsDb?.[builderPage] : null;
  const currentBlocks = currentPageObj?.blocks || [];
  const selectedBlock = currentBlocks.find((b) => b.id === selectedBlockId) || null;

  const filteredGuests = (cmsDb?.guests || []).filter((g) => {
    if (guestFilter === 'responded' && g.rsvpStatus !== 'responded') return false;
    if (guestFilter === 'pending' && g.rsvpStatus !== 'pending') return false;
    if (categoryFilter === 'wedding-party' && !g.isWeddingParty) return false;
    if (categoryFilter !== 'all' && categoryFilter !== 'wedding-party' && (g.category || 'Friend') !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHousehold = g.householdName?.toLowerCase().includes(q);
      const matchCode = g.code?.toLowerCase().includes(q);
      const matchCategory = g.category?.toLowerCase().includes(q);
      const matchMember = (g.members || []).some((m) => m.name?.toLowerCase().includes(q));
      return matchHousehold || matchCode || matchCategory || matchMember;
    }
    return true;
  });

  function renderInspectorItemsEditor(block) {
    const items = block.items || [];

    function updateItem(idx, field, value) {
      updateSelectedBlock(builderPage, (b) => {
        b.items[idx] = { ...b.items[idx], [field]: value };
        return b;
      });
    }

    function removeItem(idx) {
      updateSelectedBlock(builderPage, (b) => {
        b.items = b.items.filter((_, i) => i !== idx);
        return b;
      });
    }

    function addNewItem() {
      updateSelectedBlock(builderPage, (b) => {
        const id = `item-${Date.now()}`;
        let blank = { id, title: 'New Item', description: 'Details...' };
        if (b.type === 'couple_profiles') {
          blank = {
            id,
            name: 'Partner Name',
            role: 'The Bride / Groom',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
            photoCrop: { x: 50, y: 30, zoom: 1 },
            bio: 'Write bio here...',
            funFact: 'Fun fact...'
          };
        } else if (b.type === 'timeline') {
          blank = {
            id,
            year: 'October 2026',
            title: 'New Story Chapter',
            location: 'City, State',
            description: 'Tell the story of this milestone...',
            image: 'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=900&q=80',
            imageCrop: { x: 50, y: 50, zoom: 1 }
          };
        } else if (b.type === 'wedding_party') {
          blank = {
            id,
            name: 'New Party Member',
            role: 'Bridesmaid / Groomsman',
            relation: 'Friend of the Couple',
            bio: 'How you know each other...',
            photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
            photoCrop: { x: 50, y: 30, zoom: 1 }
          };
        } else if (b.type === 'gallery') {
          blank = {
            id,
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
            urlCrop: { x: 50, y: 50, zoom: 1 },
            caption: 'Photo caption'
          };
        } else if (b.type === 'order_cards') {
          blank = {
            id,
            badge: '5:00 PM',
            title: 'Ceremony Step',
            description: 'Step description...'
          };
        } else if (b.type === 'feature_grid') {
          blank = {
            id,
            icon: 'Sparkles',
            kicker: 'Highlight',
            title: 'Feature Title',
            description: 'Feature details...'
          };
        } else if (b.type === 'dinner_menu') {
          blank = {
            id,
            name: 'New Seasonal Entrée',
            tag: 'Chef Specialty',
            description: 'Preparation and accompaniments...'
          };
        } else if (b.type === 'schedule_list') {
          blank = {
            id,
            time: '8:00 PM',
            title: 'Schedule Event',
            description: 'What happens at this time...'
          };
        } else if (b.type === 'accommodations') {
          blank = {
            id,
            name: 'Hotel Name',
            distance: '10 mins from venue',
            rate: '$250 / night',
            bookingCode: 'WEDDING27',
            phone: '(555) 555-0100',
            notes: 'Booking instructions and shuttle details...'
          };
        } else if (b.type === 'faq_grid') {
          blank = {
            id,
            question: 'New Question?',
            answer: 'Helpful answer for guests...'
          };
        }
        b.items = [...(b.items || []), blank];
        return b;
      });
    }

    if (['quote_countdown', 'venue_showcase', 'rich_banner', 'split_media'].includes(block.type)) {
      return null;
    }

    return (
      <div style={{ marginTop: '1.35rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span className="form-label" style={{ margin: 0 }}>
            Draggable Cards / Items ({items.length})
          </span>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            onClick={addNewItem}
          >
            <Plus size={14} /> Add Card / Item
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              draggable
              onDragStart={() => setItemDragIdx(idx)}
              onDragOver={(e) => {
                e.preventDefault();
                if (itemDragOverIdx !== idx) setItemDragOverIdx(idx);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (itemDragIdx !== null && itemDragIdx !== idx) {
                  handleReorderBlockItems(builderPage, itemDragIdx, idx);
                }
                setItemDragIdx(null);
                setItemDragOverIdx(null);
              }}
              style={{
                background: 'var(--bg-primary)',
                border: itemDragOverIdx === idx ? '2px dashed var(--accent-secondary)' : '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '0.95rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', paddingBottom: '0.45rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'grab', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-secondary)' }}>
                  <GripVertical size={15} />
                  <span>
                    #{idx + 1} • {item.name || item.title || item.question || item.caption || 'Card'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleReorderBlockItems(builderPage, idx, idx - 1)}
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.2rem 0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => handleReorderBlockItems(builderPage, idx, idx + 1)}
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.2rem 0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    style={{ background: 'rgba(220,38,38,0.2)', border: 'none', color: '#fca5a5', padding: '0.2rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {block.type === 'couple_profiles' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={item.name || ''} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Badge</label>
                    <input type="text" className="form-input" value={item.role || ''} onChange={(e) => updateItem(idx, 'role', e.target.value)} />
                  </div>
                  <ImageFieldUploader
                    label="Portrait Photo (Click 'Line Up / Crop' to adjust face)"
                    value={item.photo}
                    cropValue={item.photoCrop}
                    onChange={(val) => updateItem(idx, 'photo', val)}
                    onCropChange={(c) => updateItem(idx, 'photoCrop', c)}
                  />
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea rows={3} className="form-textarea" value={item.bio || ''} onChange={(e) => updateItem(idx, 'bio', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fun Fact</label>
                    <input type="text" className="form-input" value={item.funFact || ''} onChange={(e) => updateItem(idx, 'funFact', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'timeline' && (
                <>
                  <div className="grid-2" style={{ gap: '0.6rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date / Year</label>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={item.year || ''}
                          onChange={(e) => updateItem(idx, 'year', e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="date"
                          className="form-input"
                          title="Pick Milestone Date from Calendar"
                          style={{ width: '42px', padding: '0.35rem', colorScheme: 'dark', cursor: 'pointer' }}
                          onChange={(e) => {
                            const formatted = formatSimpleDateToHuman(e.target.value);
                            if (formatted) updateItem(idx, 'year', formatted);
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input type="text" className="form-input" value={item.location || ''} onChange={(e) => updateItem(idx, 'location', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Milestone Title</label>
                    <input type="text" className="form-input" value={item.title || ''} onChange={(e) => updateItem(idx, 'title', e.target.value)} />
                  </div>
                  <ImageFieldUploader
                    label="Milestone Photo"
                    value={item.image}
                    cropValue={item.imageCrop}
                    onChange={(val) => updateItem(idx, 'image', val)}
                    onCropChange={(c) => updateItem(idx, 'imageCrop', c)}
                  />
                  <div className="form-group">
                    <label className="form-label">Story Description</label>
                    <textarea rows={2} className="form-textarea" value={item.description || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'wedding_party' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" value={item.name || ''} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
                  </div>
                  <div className="grid-2" style={{ gap: '0.6rem' }}>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input type="text" className="form-input" value={item.role || ''} onChange={(e) => updateItem(idx, 'role', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Relation</label>
                      <input type="text" className="form-input" value={item.relation || ''} onChange={(e) => updateItem(idx, 'relation', e.target.value)} />
                    </div>
                  </div>
                  <ImageFieldUploader
                    label="Portrait Photo (Line Up / Crop)"
                    value={item.photo}
                    cropValue={item.photoCrop}
                    onChange={(val) => updateItem(idx, 'photo', val)}
                    onCropChange={(c) => updateItem(idx, 'photoCrop', c)}
                  />
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea rows={2} className="form-textarea" value={item.bio || ''} onChange={(e) => updateItem(idx, 'bio', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'gallery' && (
                <>
                  <ImageFieldUploader
                    label="Photo URL / Upload & Line Up"
                    value={item.url}
                    cropValue={item.urlCrop}
                    onChange={(val) => updateItem(idx, 'url', val)}
                    onCropChange={(c) => updateItem(idx, 'urlCrop', c)}
                  />
                  <div className="form-group">
                    <label className="form-label">Caption</label>
                    <input type="text" className="form-input" value={item.caption || ''} onChange={(e) => updateItem(idx, 'caption', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'order_cards' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Time / Badge</label>
                    <input type="text" className="form-input" value={item.badge || item.time || ''} onChange={(e) => updateItem(idx, 'badge', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Title</label>
                    <input type="text" className="form-input" value={item.title || ''} onChange={(e) => updateItem(idx, 'title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea rows={2} className="form-textarea" value={item.description || item.detail || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'feature_grid' && (
                <>
                  <div className="grid-2" style={{ gap: '0.6rem' }}>
                    <div className="form-group">
                      <label className="form-label">Icon</label>
                      <select className="form-select" value={item.icon || 'Sparkles'} onChange={(e) => updateItem(idx, 'icon', e.target.value)}>
                        {AVAILABLE_ICONS.map((ic) => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Small Kicker</label>
                      <input type="text" className="form-input" value={item.kicker || ''} onChange={(e) => updateItem(idx, 'kicker', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Headline</label>
                    <input type="text" className="form-input" value={item.title || ''} onChange={(e) => updateItem(idx, 'title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Text</label>
                    <textarea rows={3} className="form-textarea" value={item.description || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'dinner_menu' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Entrée Name (Syncs with RSVP Form)</label>
                    <input type="text" className="form-input" value={item.name || ''} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dietary Tag (e.g. Beef • Gluten-Free)</label>
                    <input type="text" className="form-input" value={item.tag || ''} onChange={(e) => updateItem(idx, 'tag', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dish Description</label>
                    <textarea rows={2} className="form-textarea" value={item.description || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'schedule_list' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input type="text" className="form-input" value={item.time || ''} onChange={(e) => updateItem(idx, 'time', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Title</label>
                    <input type="text" className="form-input" value={item.title || ''} onChange={(e) => updateItem(idx, 'title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea rows={2} className="form-textarea" value={item.description || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'accommodations' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Hotel Name</label>
                    <input type="text" className="form-input" value={item.name || ''} onChange={(e) => updateItem(idx, 'name', e.target.value)} />
                  </div>
                  <div className="grid-2" style={{ gap: '0.6rem' }}>
                    <div className="form-group">
                      <label className="form-label">Distance / Shuttle</label>
                      <input type="text" className="form-input" value={item.distance || ''} onChange={(e) => updateItem(idx, 'distance', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Group Rate</label>
                      <input type="text" className="form-input" value={item.rate || ''} onChange={(e) => updateItem(idx, 'rate', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid-2" style={{ gap: '0.6rem' }}>
                    <div className="form-group">
                      <label className="form-label">Booking Code</label>
                      <input type="text" className="form-input" value={item.bookingCode || ''} onChange={(e) => updateItem(idx, 'bookingCode', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input type="text" className="form-input" value={item.phone || ''} onChange={(e) => updateItem(idx, 'phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea rows={2} className="form-textarea" value={item.notes || ''} onChange={(e) => updateItem(idx, 'notes', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'faq_grid' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Question</label>
                    <input type="text" className="form-input" value={item.question || ''} onChange={(e) => updateItem(idx, 'question', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Answer</label>
                    <textarea rows={3} className="form-textarea" value={item.answer || ''} onChange={(e) => updateItem(idx, 'answer', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cms-overlay">
      <div
        style={{
          background: 'var(--bg-primary)',
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.9)'
        }}
      >
        {/* TOP STUDIO BAR */}
        <header
          className="no-print"
          style={{
            background: '#050306',
            borderBottom: '1px solid var(--border-gold)',
            padding: '0.75rem 1.35rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="var(--accent-secondary)" />
              <span className="goth-display" style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                GOTHIC NOIR CMS & VISUAL BUILDER
              </span>
            </div>

            {/* Studio Mode Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setStudioMode('builder')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: studioMode === 'builder' ? 'var(--accent-primary)' : 'transparent',
                  color: studioMode === 'builder' ? '#fff' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Layout size={15} /> Drag & Drop Builder
              </button>

              <button
                type="button"
                onClick={() => setStudioMode('all-text')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: studioMode === 'all-text' ? 'var(--accent-primary)' : 'transparent',
                  color: studioMode === 'all-text' ? '#fff' : 'var(--accent-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Search size={15} /> Search & Edit All Site Text
              </button>

              <button
                type="button"
                onClick={() => setStudioMode('themes')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: studioMode === 'themes' ? 'var(--accent-primary)' : 'transparent',
                  color: studioMode === 'themes' ? '#fff' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Palette size={15} /> 5 Gothic Themes
              </button>

              <button
                type="button"
                onClick={() => setStudioMode('guests')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: studioMode === 'guests' ? 'var(--accent-primary)' : 'transparent',
                  color: studioMode === 'guests' ? '#fff' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <QrCode size={15} /> Guest List & QRs ({cmsDb?.guests?.length || 0})
              </button>

              <button
                type="button"
                onClick={() => setStudioMode('print-qrs')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: studioMode === 'print-qrs' ? 'var(--accent-primary)' : 'transparent',
                  color: studioMode === 'print-qrs' ? '#fff' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Printer size={15} /> Print QR Cards
              </button>

              <button
                type="button"
                onClick={() => setStudioMode('revisions')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: studioMode === 'revisions' ? 'var(--accent-primary)' : 'transparent',
                  color: studioMode === 'revisions' ? '#fff' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <History size={15} /> Activity
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {savingStatus && (
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #34d399',
                  color: '#a7f3d0',
                  padding: '0.38rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {savingStatus}
              </span>
            )}

            <button
              type="button"
              className="btn-primary"
              onClick={publishAllChanges}
              style={{
                padding: '0.52rem 1.15rem',
                fontSize: '0.84rem',
                boxShadow: hasUnsavedChanges ? '0 0 18px rgba(212, 168, 83, 0.6)' : 'none'
              }}
            >
              <Save size={15} /> {hasUnsavedChanges ? 'Publish Unsaved Changes *' : 'Publish All Changes Live'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
              onClick={onClose}
            >
              <X size={15} /> Exit Studio
            </button>
          </div>
        </header>

        {/* ================================================================= */}
        {/* MODE: SEARCH & EDIT ALL SITE TEXT (MASTER TEXT EDITOR)            */}
        {/* ================================================================= */}
        {studioMode === 'all-text' && cmsDb && (
          <div className="cms-scroll-body">
            <div className="section-header-box" style={{ marginBottom: '1.5rem' }}>
              <span className="section-kicker">Master Sitewide Copy & Text Editor</span>
              <h2 className="section-title" style={{ fontSize: '2.3rem' }}>
                Search & Edit Every Single Word on Your Website
              </h2>
              <GothicRoseArchOrnament width={210} />
              <p className="section-subtitle">
                Type any word you see on your website below (for example: <strong>Elena</strong>, <strong>Julian</strong>, <strong>moon</strong>, <strong>harvest</strong>, <strong>Twilight</strong>, <strong>Ravenswood</strong>) to find and edit every place it appears—then click <strong>Publish All Changes Live</strong> in the top bar!
              </p>
            </div>

            {/* Search Filter Bar */}
            <div
              className="surface-card"
              style={{
                maxWidth: '900px',
                margin: '0 auto 1.75rem',
                padding: '1.15rem 1.4rem',
                border: '2px solid var(--accent-secondary)',
                background: 'var(--bg-accent-subtle)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Search size={20} color="var(--accent-secondary)" />
              <input
                type="text"
                className="form-input"
                placeholder="Type any word or phrase on the site to filter (e.g. Elena, Julian, moon, harvest, Twilight)..."
                value={globalTextFilter}
                onChange={(e) => setGlobalTextFilter(e.target.value)}
                style={{ flex: 1, fontSize: '0.96rem', fontWeight: 600 }}
              />
              {globalTextFilter && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setGlobalTextFilter('')}
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* 1. HOME PAGE HERO BANNER, COUPLE NAMES, MOON TAGLINE & FOOTER */}
              {(() => {
                const q = globalTextFilter.trim().toLowerCase();
                const heroFields = [
                  { key: 'coupleNames', label: 'Home Page Main Couple Names (Big Hero Heading)', multiline: false },
                  { key: 'shortNames', label: 'Couple Short Names (Top Bar & Notes)', multiline: false },
                  { key: 'heroEyebrow', label: 'Home Hero Top Eyebrow Badge', multiline: false },
                  { key: 'heroTagline', label: 'Home Hero Tagline / Moon Quote Under Names', multiline: true },
                  { key: 'weddingDateDisplay', label: 'Displayed Wedding Date Pill Text', multiline: false },
                  { key: 'locationSummary', label: 'Displayed Location Pill Text', multiline: false },
                  { key: 'rsvpDeadline', label: 'RSVP Deadline Text', multiline: false },
                  { key: 'hashtag', label: 'Top Bar Wedding Hashtag', multiline: false },
                  { key: 'topBarText', label: 'Top Utility Bar Label (Next to Short Names)', multiline: false },
                  { key: 'weddingPartyBtnText', label: 'Top Utility Bar Wedding Party Button Text', multiline: false },
                  { key: 'footerText', label: 'Bottom Website Footer Motto / Moon Line', multiline: false }
                ].filter((f) => {
                  if (!q) return true;
                  const val = String(cmsDb.siteSettings?.[f.key] || '').toLowerCase();
                  return val.includes(q) || f.label.toLowerCase().includes(q);
                });

                if (heroFields.length === 0) return null;
                return (
                  <div className="surface-card" style={{ border: '1.5px solid var(--border-gold)' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-secondary)', marginBottom: '0.9rem' }}>
                      ★ Home Page Hero Banner, Couple Names, Top Bar & Footer
                    </h3>
                    <div className="grid-2" style={{ gap: '0.85rem' }}>
                      {heroFields.map((f) => (
                        <div key={f.key} className="form-group" style={{ gridColumn: f.multiline ? '1 / -1' : 'auto', marginBottom: 0 }}>
                          <label className="form-label">{f.label}</label>
                          {f.multiline ? (
                            <textarea
                              rows={2}
                              className="form-textarea"
                              value={cmsDb.siteSettings?.[f.key] ?? ''}
                              onChange={(e) => {
                                setHasUnsavedChanges(true);
                                setCmsDb({
                                  ...cmsDb,
                                  siteSettings: { ...cmsDb.siteSettings, [f.key]: e.target.value }
                                });
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-input"
                              value={cmsDb.siteSettings?.[f.key] ?? ''}
                              onChange={(e) => {
                                setHasUnsavedChanges(true);
                                setCmsDb({
                                  ...cmsDb,
                                  siteSettings: { ...cmsDb.siteSettings, [f.key]: e.target.value }
                                });
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* 2. EVERY PAGE HEADER, QUOTE, CARD & BOTTOM BANNER ACROSS ALL PAGES */}
              {[
                { key: 'aboutUs', title: '01 • Home / About Us Page (Quote, Couple Bios, Story Timeline, Wedding Party, Gallery & Bottom Banner)' },
                { key: 'ceremony', title: '02 • Ceremony Page (“The Twilight Ceremony”, Venue, Order of Events, Attire & FAQ)' },
                { key: 'reception', title: '03 • Reception Page (Venue, Dinner Menu, Evening Schedule & Hotels)' },
                { key: 'rsvpPage', title: '04 • QR Code RSVP Page (Headings, Scanner Banner & Code Box Labels)' },
                { key: 'weddingPartyPage', title: '05 • Wedding Party VIP Page (Rehearsal, Call Sheet & Contacts)' }
              ].map((pg) => {
                const pageObj = cmsDb[pg.key];
                if (!pageObj) return null;
                const q = globalTextFilter.trim().toLowerCase();
                const pageString = JSON.stringify(pageObj).toLowerCase();
                if (q && !pageString.includes(q) && !pg.title.toLowerCase().includes(q)) return null;

                return (
                  <div key={pg.key} className="surface-card" style={{ border: '1px solid var(--border-gold)' }}>
                    <h3 style={{ fontSize: '1.45rem', color: 'var(--accent-secondary)', marginBottom: '0.85rem' }}>
                      {pg.title}
                    </h3>

                    {/* Page Top Header & Bottom Banner Fields */}
                    <div
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '0.95rem',
                        marginBottom: '1rem'
                      }}
                    >
                      <div className="form-label" style={{ color: 'var(--accent-secondary)', marginBottom: '0.55rem' }}>
                        Page Top Title, Subtitle & Bottom Moon Banner
                      </div>
                      <div className="grid-2" style={{ gap: '0.65rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Page Main Title / Headline</label>
                          <input
                            type="text"
                            className="form-input"
                            value={pageObj.headline || ''}
                            onChange={(e) => updatePageField(pg.key, 'headline', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Page Top Eyebrow / Kicker</label>
                          <input
                            type="text"
                            className="form-input"
                            value={pageObj.kicker || ''}
                            onChange={(e) => updatePageField(pg.key, 'kicker', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                          <label className="form-label">Page Intro Subtitle</label>
                          <textarea
                            rows={2}
                            className="form-textarea"
                            value={pageObj.subheadline || ''}
                            onChange={(e) => updatePageField(pg.key, 'subheadline', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Bottom Banner Title (if enabled)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={pageObj.bottomBannerTitle ?? 'Join Us Under the October Moon'}
                            onChange={(e) => updatePageField(pg.key, 'bottomBannerTitle', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Bottom Banner Subtitle</label>
                          <input
                            type="text"
                            className="form-input"
                            value={pageObj.bottomBannerSubtitle ?? ''}
                            onChange={(e) => updatePageField(pg.key, 'bottomBannerSubtitle', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* All Section Blocks inside this Page */}
                    {(pageObj.blocks || []).map((block, bIdx) => {
                      if (q && !JSON.stringify(block).toLowerCase().includes(q)) return null;
                      return (
                        <div
                          key={block.id || bIdx}
                          style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '0.95rem',
                            marginBottom: '0.85rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                            <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem' }}>
                              Section #{bIdx + 1}: {block.title || block.type}
                            </strong>
                            <button
                              type="button"
                              className="btn-secondary"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem' }}
                              onClick={() => {
                                setBuilderPage(pg.key);
                                setSelectedBlockId(block.id);
                                setStudioMode('builder');
                              }}
                            >
                              Open in Visual Canvas →
                            </button>
                          </div>

                          {block.type === 'quote_countdown' && (
                            <div className="grid-2" style={{ gap: '0.6rem' }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Note Eyebrow (e.g. A NOTE FROM ELENA & JULIAN)</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={block.settings?.noteLabel || ''}
                                  onChange={(e) => {
                                    const nextBlocks = [...pageObj.blocks];
                                    nextBlocks[bIdx] = {
                                      ...block,
                                      settings: { ...(block.settings || {}), noteLabel: e.target.value }
                                    };
                                    updateBlocksForPage(pg.key, nextBlocks);
                                  }}
                                />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Subtext Under Quote (e.g. Join us beneath the October moon...)</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={block.settings?.subtext || ''}
                                  onChange={(e) => {
                                    const nextBlocks = [...pageObj.blocks];
                                    nextBlocks[bIdx] = {
                                      ...block,
                                      settings: { ...(block.settings || {}), subtext: e.target.value }
                                    };
                                    updateBlocksForPage(pg.key, nextBlocks);
                                  }}
                                />
                              </div>
                              <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                <label className="form-label">Romantic Quote</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={block.settings?.quote || ''}
                                  onChange={(e) => {
                                    const nextBlocks = [...pageObj.blocks];
                                    nextBlocks[bIdx] = {
                                      ...block,
                                      settings: { ...(block.settings || {}), quote: e.target.value }
                                    };
                                    updateBlocksForPage(pg.key, nextBlocks);
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {block.type !== 'quote_countdown' && (
                            <div className="grid-3" style={{ gap: '0.6rem', marginBottom: block.items?.length ? '0.65rem' : 0 }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Section Kicker</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={block.kicker || block.settings?.badge || ''}
                                  onChange={(e) => {
                                    const nextBlocks = [...pageObj.blocks];
                                    if (block.type === 'venue_showcase') {
                                      nextBlocks[bIdx] = {
                                        ...block,
                                        settings: { ...(block.settings || {}), badge: e.target.value }
                                      };
                                    } else {
                                      nextBlocks[bIdx] = { ...block, kicker: e.target.value };
                                    }
                                    updateBlocksForPage(pg.key, nextBlocks);
                                  }}
                                />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Section Title / Venue Name</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={block.type === 'venue_showcase' ? block.settings?.venueName || '' : block.title || ''}
                                  onChange={(e) => {
                                    const nextBlocks = [...pageObj.blocks];
                                    if (block.type === 'venue_showcase') {
                                      nextBlocks[bIdx] = {
                                        ...block,
                                        settings: { ...(block.settings || {}), venueName: e.target.value }
                                      };
                                    } else {
                                      nextBlocks[bIdx] = { ...block, title: e.target.value };
                                    }
                                    updateBlocksForPage(pg.key, nextBlocks);
                                  }}
                                />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Section Subtitle / Address</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={block.type === 'venue_showcase' ? block.settings?.venueAddress || '' : block.subtitle || ''}
                                  onChange={(e) => {
                                    const nextBlocks = [...pageObj.blocks];
                                    if (block.type === 'venue_showcase') {
                                      nextBlocks[bIdx] = {
                                        ...block,
                                        settings: { ...(block.settings || {}), venueAddress: e.target.value }
                                      };
                                    } else {
                                      nextBlocks[bIdx] = { ...block, subtitle: e.target.value };
                                    }
                                    updateBlocksForPage(pg.key, nextBlocks);
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Render Individual Card / Item Text Inputs */}
                          {Array.isArray(block.items) && block.items.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-color)' }}>
                              {block.items.map((item, iIdx) => {
                                if (q && !JSON.stringify(item).toLowerCase().includes(q)) return null;
                                const updateItemInPage = (field, val) => {
                                  const nextBlocks = [...pageObj.blocks];
                                  const nextItems = [...(nextBlocks[bIdx].items || [])];
                                  nextItems[iIdx] = { ...nextItems[iIdx], [field]: val };
                                  nextBlocks[bIdx] = { ...nextBlocks[bIdx], items: nextItems };
                                  updateBlocksForPage(pg.key, nextBlocks);
                                };
                                return (
                                  <div key={item.id || iIdx} className="grid-3" style={{ gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: '8px' }}>
                                    {'name' in item && (
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-input" value={item.name || ''} onChange={(e) => updateItemInPage('name', e.target.value)} />
                                      </div>
                                    )}
                                    {'role' in item && (
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Role</label>
                                        <input type="text" className="form-input" value={item.role || ''} onChange={(e) => updateItemInPage('role', e.target.value)} />
                                      </div>
                                    )}
                                    {'title' in item && (
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Title</label>
                                        <input type="text" className="form-input" value={item.title || ''} onChange={(e) => updateItemInPage('title', e.target.value)} />
                                      </div>
                                    )}
                                    {'year' in item && (
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Date / Year</label>
                                        <input type="text" className="form-input" value={item.year || ''} onChange={(e) => updateItemInPage('year', e.target.value)} />
                                      </div>
                                    )}
                                    {'badge' in item && (
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Badge / Time</label>
                                        <input type="text" className="form-input" value={item.badge || ''} onChange={(e) => updateItemInPage('badge', e.target.value)} />
                                      </div>
                                    )}
                                    {'time' in item && (
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Time</label>
                                        <input type="text" className="form-input" value={item.time || ''} onChange={(e) => updateItemInPage('time', e.target.value)} />
                                      </div>
                                    )}
                                    {'question' in item && (
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Question</label>
                                        <input type="text" className="form-input" value={item.question || ''} onChange={(e) => updateItemInPage('question', e.target.value)} />
                                      </div>
                                    )}
                                    {'bio' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Bio</label>
                                        <input type="text" className="form-input" value={item.bio || ''} onChange={(e) => updateItemInPage('bio', e.target.value)} />
                                      </div>
                                    )}
                                    {'funFact' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Fun Fact</label>
                                        <input type="text" className="form-input" value={item.funFact || ''} onChange={(e) => updateItemInPage('funFact', e.target.value)} />
                                      </div>
                                    )}
                                    {'description' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Description</label>
                                        <input type="text" className="form-input" value={item.description || ''} onChange={(e) => updateItemInPage('description', e.target.value)} />
                                      </div>
                                    )}
                                    {'answer' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Answer</label>
                                        <input type="text" className="form-input" value={item.answer || ''} onChange={(e) => updateItemInPage('answer', e.target.value)} />
                                      </div>
                                    )}
                                    {'caption' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Photo Caption</label>
                                        <input type="text" className="form-input" value={item.caption || ''} onChange={(e) => updateItemInPage('caption', e.target.value)} />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE: 5 ROMANTIC GOTHIC THEMES STUDIO                             */}
        {/* ================================================================= */}
        {studioMode === 'themes' && cmsDb && (
          <div className="cms-scroll-body">
            <div className="section-header-box" style={{ marginBottom: '2rem' }}>
              <span className="section-kicker">Atmospheric Aesthetic Gallery</span>
              <h2 className="section-title" style={{ fontSize: '2.4rem' }}>
                5 Romantic Gothic Noir Themes
              </h2>
              <GothicRoseArchOrnament width={220} />
              <p className="section-subtitle">
                Click any of the 5 curated Gothic Noir & Romantic themes below to preview it immediately across your entire wedding website, then click <strong>Publish All Changes Live</strong> in the top bar.
              </p>
            </div>

            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
              {GOTHIC_THEMES.map((thm) => {
                const currentTheme = cmsDb.siteSettings?.theme || 'cathedral-roses';
                const isSelected = currentTheme === thm.id || (currentTheme === 'fall-goth' && thm.id === 'cathedral-roses');
                return (
                  <div
                    key={thm.id}
                    onClick={() => {
                      const updatedSettings = {
                        ...cmsDb.siteSettings,
                        theme: thm.id,
                        customColors: {
                          ...(cmsDb.siteSettings.customColors || {}),
                          enabled: false
                        }
                      };
                      setHasUnsavedChanges(true);
                      setCmsDb({ ...cmsDb, siteSettings: updatedSettings });
                      applyThemeAndCustomColors(updatedSettings);
                    }}
                    style={{
                      borderRadius: '140px 140px 20px 20px',
                      overflow: 'hidden',
                      border: isSelected ? '2.5px solid var(--accent-secondary)' : '1.5px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      boxShadow: isSelected ? 'var(--shadow-elevated)' : 'var(--shadow-soft)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Archway Gradient Header Preview */}
                    <div
                      style={{
                        background: thm.previewGrad,
                        padding: '2.25rem 1.5rem 1.5rem',
                        textAlign: 'center',
                        borderBottom: '1px solid var(--border-gold)'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'Cinzel, serif',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          background: 'rgba(0,0,0,0.55)',
                          color: thm.swatches[3],
                          border: `1px solid ${thm.swatches[3]}`
                        }}
                      >
                        {thm.badge}
                      </span>
                      <h3
                        className="goth-display"
                        style={{
                          fontSize: '1.35rem',
                          color: thm.swatches[4],
                          marginTop: '0.75rem',
                          marginBottom: '0.35rem'
                        }}
                      >
                        {thm.name}
                      </h3>
                      {/* Color Swatch Pills */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', marginTop: '0.75rem' }}>
                        {thm.swatches.map((hex, i) => (
                          <div
                            key={i}
                            title={hex}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: hex,
                              border: '2px solid rgba(255,255,255,0.35)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ padding: '1.35rem 1.5rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.1rem' }}>
                        {thm.tagline}
                      </p>
                      <button
                        type="button"
                        className={isSelected ? 'btn-primary' : 'btn-secondary'}
                        style={{ width: '100%' }}
                      >
                        {isSelected ? '✓ Active Gothic Theme' : 'Activate This Theme'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Hex Color Override Card */}
            <div className="surface-card" style={{ maxWidth: '760px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.5rem' }}>Custom Hex Color Overrides (Optional)</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Want to fine-tune any shade on top of the active theme? Enable custom color overrides below:
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={cmsDb.siteSettings.customColors?.enabled || false}
                    onChange={(e) => {
                      const updatedSettings = {
                        ...cmsDb.siteSettings,
                        customColors: {
                          ...(cmsDb.siteSettings.customColors || {}),
                          enabled: e.target.checked
                        }
                      };
                      setHasUnsavedChanges(true);
                      setCmsDb({ ...cmsDb, siteSettings: updatedSettings });
                      applyThemeAndCustomColors(updatedSettings);
                    }}
                  />
                  <span>Enable Custom Hex Colors</span>
                </label>
              </div>

              {cmsDb.siteSettings.customColors?.enabled && (
                <div className="grid-3">
                  {[
                    { key: 'bgPrimary', label: 'Main Noir Background' },
                    { key: 'bgCard', label: 'Card Surface' },
                    { key: 'accentPrimary', label: 'Primary Rose / Wine Accent' },
                    { key: 'accentSecondary', label: 'Gold / Silver Filigree' },
                    { key: 'textPrimary', label: 'Primary Alabaster Text' }
                  ].map((clr) => (
                    <div key={clr.key} className="form-group">
                      <label className="form-label">{clr.label}</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={cmsDb.siteSettings.customColors?.[clr.key] || '#090608'}
                          onChange={(e) => {
                            const updatedSettings = {
                              ...cmsDb.siteSettings,
                              customColors: {
                                ...cmsDb.siteSettings.customColors,
                                [clr.key]: e.target.value
                              }
                            };
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: updatedSettings });
                            applyThemeAndCustomColors(updatedSettings);
                          }}
                          style={{ width: '42px', height: '42px', border: 'none', background: 'none', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={cmsDb.siteSettings.customColors?.[clr.key] || ''}
                          onChange={(e) => {
                            const updatedSettings = {
                              ...cmsDb.siteSettings,
                              customColors: {
                                ...cmsDb.siteSettings.customColors,
                                [clr.key]: e.target.value
                              }
                            };
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: updatedSettings });
                            applyThemeAndCustomColors(updatedSettings);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 1: 3-PANE VISUAL DRAG & DROP PAGE BUILDER                    */}
        {/* ================================================================= */}
        {studioMode === 'builder' && cmsDb && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr 420px',
              flex: 1,
              overflow: 'hidden'
            }}
          >
            {/* LEFT PANE */}
            <aside
              style={{
                background: '#070508',
                borderRight: '1px solid var(--border-color)',
                padding: '1.15rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem'
              }}
            >
              <div>
                <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                  1. Select Page / Area to Edit
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {[
                    { id: 'heroTabs', label: '00 • ★ Home Hero Banner, Names & Tabs', icon: Layout },
                    { id: 'aboutUs', label: '01 • Home / About Us Page', icon: Heart },
                    { id: 'ceremony', label: '02 • Ceremony Page', icon: Sparkles },
                    { id: 'reception', label: '03 • Reception & Menu Page', icon: Wine },
                    { id: 'rsvpPage', label: '04 • QR Code RSVP Page', icon: QrCode },
                    { id: 'weddingPartyPage', label: '05 • Wedding Party VIP Page', icon: Crown }
                  ].map((pg) => {
                    const IconC = pg.icon;
                    const active = builderPage === pg.id;
                    return (
                      <button
                        key={pg.id}
                        type="button"
                        onClick={() => setBuilderPage(pg.id)}
                        style={{
                          textAlign: 'left',
                          padding: '0.68rem 0.85rem',
                          borderRadius: '10px',
                          border: active ? '1px solid var(--border-gold)' : '1px solid transparent',
                          background: active ? 'linear-gradient(135deg, var(--accent-primary), #3d0815)' : 'var(--bg-secondary)',
                          color: active ? '#fff' : 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem'
                        }}
                      >
                        <IconC size={15} color="var(--accent-secondary)" />
                        <span>{pg.label}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setStudioMode('themes')}
                    style={{
                      textAlign: 'left',
                      padding: '0.68rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px dashed var(--border-gold)',
                      background: 'var(--bg-accent-subtle)',
                      color: 'var(--accent-secondary)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem'
                    }}
                  >
                    <Palette size={15} />
                    <span>Explore 5 Gothic Noir Themes →</span>
                  </button>
                </div>
              </div>

              {/* ALWAYS-VISIBLE HOME HERO COUPLE NAMES & MOON TAGLINE IN LEFT SIDEBAR */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-gold)',
                  borderRadius: '12px',
                  padding: '0.85rem'
                }}
              >
                <div
                  className="form-label"
                  style={{
                    marginBottom: '0.45rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--accent-secondary)'
                  }}
                >
                  <span>★ Home Hero Names & Moon Tagline</span>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.18rem 0.45rem', fontSize: '0.68rem' }}
                    onClick={() => setSelectedBlockId('__HERO_BANNER__')}
                  >
                    Full Hero
                  </button>
                </div>
                <div style={{ marginBottom: '0.45rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.18rem' }}>
                    Couple Full Names (Hero Heading)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cmsDb.siteSettings?.coupleNames || ''}
                    onChange={(e) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: { ...cmsDb.siteSettings, coupleNames: e.target.value }
                      });
                    }}
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem', fontWeight: 700 }}
                  />
                </div>
                <div style={{ marginBottom: '0.45rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.18rem' }}>
                    Top Hero Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cmsDb.siteSettings?.heroEyebrow || ''}
                    onChange={(e) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: { ...cmsDb.siteSettings, heroEyebrow: e.target.value }
                      });
                    }}
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.78rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.18rem' }}>
                    Hero Tagline / Moon Quote Under Names
                  </label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={cmsDb.siteSettings?.heroTagline || ''}
                    onChange={(e) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: { ...cmsDb.siteSettings, heroTagline: e.target.value }
                      });
                    }}
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              {/* ALWAYS-VISIBLE WEDDING DATE & COUNTDOWN PICKER IN LEFT SIDEBAR */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-gold)',
                  borderRadius: '12px',
                  padding: '0.85rem'
                }}
              >
                <div
                  className="form-label"
                  style={{
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--accent-secondary)'
                  }}
                >
                  <Calendar size={14} /> Wedding Date & Countdown
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.22rem' }}>
                    Pick Date & Ceremony Time (Calendar)
                  </label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={toDateTimeLocalValue(cmsDb.siteSettings?.weddingDate)}
                    onChange={(e) => {
                      const isoVal = e.target.value;
                      const formatted = formatIsoToHumanDate(isoVal);
                      setHasUnsavedChanges(true);
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: {
                          ...cmsDb.siteSettings,
                          weddingDate: isoVal,
                          weddingDateDisplay: formatted || cmsDb.siteSettings.weddingDateDisplay
                        }
                      });
                    }}
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', colorScheme: 'dark' }}
                  />
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.22rem' }}>
                    Displayed Date Text on Website
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cmsDb.siteSettings?.weddingDateDisplay || ''}
                    onChange={(e) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: {
                          ...cmsDb.siteSettings,
                          weddingDateDisplay: e.target.value
                        }
                      });
                    }}
                    placeholder="Saturday, October 23, 2027"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.22rem' }}>
                    RSVP Deadline (Pick Date or Type)
                  </label>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings?.rsvpDeadline || ''}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: {
                            ...cmsDb.siteSettings,
                            rsvpDeadline: e.target.value
                          }
                        });
                      }}
                      placeholder="September 15, 2027"
                      style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', flex: 1 }}
                    />
                    <input
                      type="date"
                      className="form-input"
                      title="Pick RSVP Deadline from Calendar"
                      onChange={(e) => {
                        const formatted = formatSimpleDateToHuman(e.target.value);
                        if (formatted) {
                          setHasUnsavedChanges(true);
                          setCmsDb({
                            ...cmsDb,
                            siteSettings: {
                              ...cmsDb.siteSettings,
                              rsvpDeadline: formatted
                            }
                          });
                        }
                      }}
                      style={{ width: '42px', padding: '0.35rem', colorScheme: 'dark', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {isBlockPage && currentPageObj && (
                <>
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '0.85rem'
                    }}
                  >
                    <div className="form-label" style={{ marginBottom: '0.45rem' }}>
                      Page Title & Header
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Page Kicker"
                      value={currentPageObj.kicker || ''}
                      onChange={(e) => updatePageField(builderPage, 'kicker', e.target.value)}
                      style={{ marginBottom: '0.45rem', padding: '0.48rem 0.7rem', fontSize: '0.82rem' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Main Page Headline"
                      value={currentPageObj.headline || ''}
                      onChange={(e) => updatePageField(builderPage, 'headline', e.target.value)}
                      style={{ marginBottom: '0.45rem', padding: '0.48rem 0.7rem', fontSize: '0.86rem', fontWeight: 700 }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Divider (e.g. ✦ 🥀 ✦)"
                      value={currentPageObj.divider || ''}
                      onChange={(e) => updatePageField(builderPage, 'divider', e.target.value)}
                      style={{ marginBottom: '0.45rem', padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                    />
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="Page Subheadline"
                      value={currentPageObj.subheadline || ''}
                      onChange={(e) => updatePageField(builderPage, 'subheadline', e.target.value)}
                      style={{ padding: '0.48rem 0.7rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* DRAG AND DROP SECTION LAYERS */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                      <span className="form-label" style={{ margin: 0 }}>
                        2. Drag & Drop Page Sections
                      </span>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '0.32rem 0.68rem', fontSize: '0.75rem' }}
                        onClick={() => setShowAddBlockDrawer(!showAddBlockDrawer)}
                      >
                        <Plus size={13} /> Add Section
                      </button>
                    </div>

                    {showAddBlockDrawer && (
                      <div
                        style={{
                          background: 'var(--bg-card)',
                          border: '1.5px solid var(--accent-secondary)',
                          borderRadius: '12px',
                          padding: '0.75rem',
                          marginBottom: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                            Choose a Block to Drop In:
                          </strong>
                          <button
                            type="button"
                            onClick={() => setShowAddBlockDrawer(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {BLOCK_LIBRARY.map((tmpl) => (
                          <button
                            key={tmpl.type}
                            type="button"
                            onClick={() => handleAddBlock(builderPage, tmpl)}
                            style={{
                              textAlign: 'left',
                              padding: '0.55rem 0.7rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                              + {tmpl.label}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{tmpl.desc}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {/* 00. HOME HERO BANNER & COUPLE NAMES ITEM */}
                      <div
                        onClick={() => setSelectedBlockId('__HERO_BANNER__')}
                        style={{
                          padding: '0.65rem 0.75rem',
                          borderRadius: '10px',
                          background: selectedBlockId === '__HERO_BANNER__' ? 'var(--bg-accent-subtle)' : 'var(--bg-secondary)',
                          border:
                            selectedBlockId === '__HERO_BANNER__'
                              ? '1.5px solid var(--accent-secondary)'
                              : '1px solid var(--border-gold)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            ★ Home Hero: “{cmsDb.siteSettings?.coupleNames || 'Couple Names'}”
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            HERO ARCHWAY, MOON TAGLINE, PHOTO, TOP BAR & TABS
                          </div>
                        </div>
                      </div>

                      {/* 0. PAGE TITLE & TOP HEADER ITEM */}
                      <div
                        onClick={() => setSelectedBlockId('__PAGE_HEADER__')}
                        style={{
                          padding: '0.65rem 0.75rem',
                          borderRadius: '10px',
                          background: selectedBlockId === '__PAGE_HEADER__' ? 'var(--bg-accent-subtle)' : 'var(--bg-secondary)',
                          border:
                            selectedBlockId === '__PAGE_HEADER__'
                              ? '1.5px solid var(--accent-secondary)'
                              : '1px solid var(--border-gold)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            0. ★ Page Title: “{currentPageObj.headline || 'Untitled'}”
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            PAGE TOP HEADER, SUBTITLE & BOTTOM BANNER
                          </div>
                        </div>
                      </div>

                      {currentBlocks.map((block, idx) => {
                        const isSelected = selectedBlockId === block.id;
                        const isDragOver = treeDragOverIdx === idx;
                        return (
                          <div
                            key={block.id}
                            draggable
                            onDragStart={() => setTreeDragIdx(idx)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              if (treeDragOverIdx !== idx) setTreeDragOverIdx(idx);
                            }}
                            onDragLeave={() => setTreeDragOverIdx(null)}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (treeDragIdx !== null && treeDragIdx !== idx) {
                                handleDragReorderBlocks(builderPage, treeDragIdx, idx);
                              }
                              setTreeDragIdx(null);
                              setTreeDragOverIdx(null);
                            }}
                            onClick={() => setSelectedBlockId(block.id)}
                            style={{
                              padding: '0.65rem 0.75rem',
                              borderRadius: '10px',
                              background: isSelected ? 'var(--bg-accent-subtle)' : 'var(--bg-secondary)',
                              border: isSelected
                                ? '1.5px solid var(--accent-secondary)'
                                : isDragOver
                                ? '1.5px dashed var(--accent-secondary)'
                                : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '0.5rem',
                              opacity: block.visible === false ? 0.5 : 1
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflow: 'hidden' }}>
                              <GripVertical size={15} color="var(--accent-secondary)" style={{ cursor: 'grab', flexShrink: 0 }} />
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {idx + 1}. {block.title || block.type}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                  {block.type.replace('_', ' ')} {block.items?.length ? `• ${block.items.length} items` : ''}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                title={block.visible === false ? 'Show Section' : 'Hide Section'}
                                onClick={() => handleToggleBlockVisibility(builderPage, block.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}
                              >
                                {block.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                              <button
                                type="button"
                                title="Delete Section"
                                onClick={() => handleDeleteBlock(builderPage, block.id)}
                                style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: '0.2rem' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </aside>

            {/* CENTER PANE: INTERACTIVE LIVE DRAG-AND-DROP CANVAS PREVIEW */}
            <div
              style={{
                overflowY: 'auto',
                padding: '1.5rem',
                background: 'var(--bg-primary)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.8rem'
                }}
              >
                <span>
                  <strong style={{ color: 'var(--accent-secondary)' }}>Interactive Visual Canvas:</strong> Drag sections to reorder, or click any section to inspect & line up portraits on the right!
                </span>
                {isBlockPage && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.32rem 0.75rem', fontSize: '0.76rem' }}
                    onClick={() => setShowAddBlockDrawer(true)}
                  >
                    <Plus size={13} /> Add Section Block
                  </button>
                )}
              </div>

              {/* ALWAYS RENDER INTERACTIVE HOME HERO BANNER & BIG TABS AT TOP OF VISUAL CANVAS */}
              <div
                onClick={() => setSelectedBlockId('__HERO_BANNER__')}
                style={{
                  position: 'relative',
                  marginBottom: '1.5rem',
                  borderRadius: '20px',
                  border:
                    selectedBlockId === '__HERO_BANNER__' || builderPage === 'heroTabs'
                      ? '2.5px solid var(--accent-secondary)'
                      : '1.5px dashed rgba(212, 168, 83, 0.5)',
                  padding: '0.75rem',
                  background:
                    selectedBlockId === '__HERO_BANNER__' || builderPage === 'heroTabs'
                      ? 'rgba(158, 27, 50, 0.12)'
                      : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#080508',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '10px',
                    padding: '0.42rem 0.75rem',
                    marginBottom: '0.75rem',
                    fontSize: '0.76rem'
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    ★ HOME PAGE HERO BANNER (“{cmsDb.siteSettings?.coupleNames}”) & MOON TAGLINE
                  </span>
                  <span
                    style={{
                      background: 'var(--accent-secondary)',
                      color: '#090608',
                      padding: '0.22rem 0.55rem',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.72rem'
                    }}
                  >
                    Click to Edit Names, Moon Quote, Photo & Tabs →
                  </span>
                </div>

                <header
                  className="wedding-hero"
                  style={{
                    borderRadius: '18px',
                    marginBottom: '1rem',
                    padding: '2rem 1.25rem 2.35rem',
                    backgroundImage: `url(${cmsDb.siteSettings?.heroBannerUrl})`,
                    backgroundPosition: `${cmsDb.siteSettings?.heroBannerCrop?.x ?? 50}% ${cmsDb.siteSettings?.heroBannerCrop?.y ?? 50}%`
                  }}
                >
                  <div className="hero-gothic-arch-frame">
                    <span className="hero-eyebrow">{cmsDb.siteSettings?.heroEyebrow}</span>
                    <h1 className="hero-couple-names" style={{ fontSize: '2.35rem' }}>
                      {cmsDb.siteSettings?.coupleNames}
                    </h1>
                    <GothicRoseArchOrnament width={180} />
                    <p className="hero-tagline">{cmsDb.siteSettings?.heroTagline}</p>
                    <div className="hero-meta-pills">
                      <span className="hero-pill">
                        <Calendar size={14} color="var(--accent-secondary)" /> {cmsDb.siteSettings?.weddingDateDisplay}
                      </span>
                      <span className="hero-pill">
                        <MapPin size={14} color="var(--accent-secondary)" /> {cmsDb.siteSettings?.locationSummary}
                      </span>
                    </div>
                  </div>
                </header>

                <div className="big-tabs-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.55rem' }}>
                  {(cmsDb.siteSettings?.bigTabs || []).map((tab) => {
                    const tabPageMap = {
                      about: 'aboutUs',
                      ceremony: 'ceremony',
                      reception: 'reception',
                      rsvp: 'rsvpPage'
                    };
                    const targetPg = tabPageMap[tab.id] || 'aboutUs';
                    const isActiveTab = builderPage === targetPg;
                    return (
                      <div
                        key={tab.id}
                        className={`big-tab-card ${isActiveTab ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setBuilderPage(targetPg);
                        }}
                        style={{
                          padding: '0.75rem',
                          opacity: tab.visible === false ? 0.45 : 1,
                          cursor: 'pointer'
                        }}
                      >
                        <div className="big-tab-top">
                          <span className="big-tab-step" style={{ fontSize: '0.65rem' }}>{tab.step}</span>
                        </div>
                        <div>
                          <div className="big-tab-title" style={{ fontSize: '1.05rem' }}>{tab.title}</div>
                          <div className="big-tab-subtitle" style={{ fontSize: '0.72rem' }}>{tab.subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isBlockPage && currentPageObj && (
                <PageBlockRenderer
                  pageData={currentPageObj}
                  siteSettings={cmsDb.siteSettings}
                  editMode={true}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={(id) => setSelectedBlockId(id)}
                  onMoveBlock={(idx, dir) => handleMoveBlock(builderPage, idx, dir)}
                  onToggleBlockVisibility={(id) => handleToggleBlockVisibility(builderPage, id)}
                  onDuplicateBlock={(id) => handleDuplicateBlock(builderPage, id)}
                  onDeleteBlock={(id) => handleDeleteBlock(builderPage, id)}
                  onDragReorderBlocks={(fromIdx, toIdx) => handleDragReorderBlocks(builderPage, fromIdx, toIdx)}
                />
              )}
            </div>

            {/* RIGHT PANE: DEEP PROPERTY INSPECTOR */}
            <aside
              style={{
                background: '#070508',
                borderLeft: '1px solid var(--border-color)',
                padding: '1.25rem',
                overflowY: 'auto'
              }}
            >
              {(builderPage === 'heroTabs' || selectedBlockId === '__HERO_BANNER__') && (
                <div
                  style={{
                    marginBottom: '1.35rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '2px solid var(--border-gold)'
                  }}
                >
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.35rem', color: 'var(--accent-secondary)' }}>
                    ★ Home Page Hero Banner, Couple Names & Big Tabs
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.15rem' }}>
                    Edit the couple names (“Elena Vance & Julian Sterling”), the moon/harvest tagline, hero photo, top bar, footer, and Big Tabs.
                  </p>

                  <div className="form-group">
                    <label className="form-label">Hero Eyebrow Badge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.heroEyebrow || ''}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, heroEyebrow: e.target.value } });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Couple Full Names</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.coupleNames || ''}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, coupleNames: e.target.value } });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Names</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.shortNames || ''}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, shortNames: e.target.value } });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hero Invitation Tagline</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={cmsDb.siteSettings.heroTagline || ''}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, heroTagline: e.target.value } });
                      }}
                    />
                  </div>

                  <ImageFieldUploader
                    label="Hero Background Image (Upload & Line Up)"
                    value={cmsDb.siteSettings.heroBannerUrl}
                    cropValue={cmsDb.siteSettings.heroBannerCrop}
                    onChange={(val) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, heroBannerUrl: val } });
                    }}
                    onCropChange={(c) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, heroBannerCrop: c } });
                    }}
                  />

                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '12px',
                      padding: '0.9rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <div className="form-label" style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                      <Calendar size={14} /> Wedding Date, Countdown & RSVP Deadline
                    </div>
                    <div className="grid-2" style={{ gap: '0.6rem' }}>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label">Pick Wedding Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          style={{ colorScheme: 'dark' }}
                          value={toDateTimeLocalValue(cmsDb.siteSettings.weddingDate)}
                          onChange={(e) => {
                            const isoVal = e.target.value;
                            const formatted = formatIsoToHumanDate(isoVal);
                            setHasUnsavedChanges(true);
                            setCmsDb({
                              ...cmsDb,
                              siteSettings: {
                                ...cmsDb.siteSettings,
                                weddingDate: isoVal,
                                weddingDateDisplay: formatted || cmsDb.siteSettings.weddingDateDisplay
                              }
                            });
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label">Display Date Text</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cmsDb.siteSettings.weddingDateDisplay || ''}
                          onChange={(e) => {
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, weddingDateDisplay: e.target.value } });
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: '0.6rem' }}>
                      <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                        <label className="form-label">Location Summary</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cmsDb.siteSettings.locationSummary || ''}
                          onChange={(e) => {
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, locationSummary: e.target.value } });
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                        <label className="form-label">RSVP Deadline</label>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={cmsDb.siteSettings.rsvpDeadline || ''}
                            onChange={(e) => {
                              setHasUnsavedChanges(true);
                              setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, rsvpDeadline: e.target.value } });
                            }}
                          />
                          <input
                            type="date"
                            className="form-input"
                            style={{ width: '44px', padding: '0.35rem', colorScheme: 'dark', cursor: 'pointer' }}
                            title="Pick RSVP Deadline from Calendar"
                            onChange={(e) => {
                              const formatted = formatSimpleDateToHuman(e.target.value);
                              if (formatted) {
                                setHasUnsavedChanges(true);
                                setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, rsvpDeadline: formatted } });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: '0.6rem' }}>
                      <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                        <label className="form-label">Wedding Hashtag</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cmsDb.siteSettings.hashtag || ''}
                          onChange={(e) => {
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, hashtag: e.target.value } });
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                        <label className="form-label">Top Utility Bar Subtitle</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cmsDb.siteSettings.topBarText ?? 'Wedding Celebration'}
                          onChange={(e) => {
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, topBarText: e.target.value } });
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: '0.6rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Top Bar VIP Button Text</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cmsDb.siteSettings.weddingPartyBtnText || 'Wedding Party Portal'}
                          onChange={(e) => {
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, weddingPartyBtnText: e.target.value } });
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Footer Motto / Quote</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cmsDb.siteSettings.footerText || ''}
                          onChange={(e) => {
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, footerText: e.target.value } });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Draggable Big Tabs Editor */}
                  <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.15rem' }}>
                    <label className="form-label">Drag & Drop Big Tabs Order & Labels</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                      {(cmsDb.siteSettings.bigTabs || []).map((tab, idx) => (
                        <div
                          key={tab.id}
                          draggable
                          onDragStart={() => setTabDragIdx(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (tabDragIdx === null || tabDragIdx === idx) return;
                            const next = [...(cmsDb.siteSettings.bigTabs || [])];
                            const [moved] = next.splice(tabDragIdx, 1);
                            next.splice(idx, 0, moved);
                            setHasUnsavedChanges(true);
                            setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, bigTabs: next } });
                            setTabDragIdx(null);
                          }}
                          style={{
                            padding: '0.85rem',
                            borderRadius: '12px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-secondary)', cursor: 'grab' }}>
                              <GripVertical size={14} /> Tab #{idx + 1} ({tab.id})
                            </span>
                            <select
                              className="form-select"
                              style={{ width: '120px', padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                              value={tab.icon || 'Heart'}
                              onChange={(e) => {
                                const next = [...cmsDb.siteSettings.bigTabs];
                                next[idx] = { ...next[idx], icon: e.target.value };
                                setHasUnsavedChanges(true);
                                setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, bigTabs: next } });
                              }}
                            >
                              {AVAILABLE_ICONS.map((ic) => (
                                <option key={ic} value={ic}>{ic}</option>
                              ))}
                            </select>
                          </div>
                          <div className="grid-2" style={{ gap: '0.5rem' }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Step Badge"
                              value={tab.step || ''}
                              onChange={(e) => {
                                const next = [...cmsDb.siteSettings.bigTabs];
                                next[idx] = { ...next[idx], step: e.target.value };
                                setHasUnsavedChanges(true);
                                setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, bigTabs: next } });
                              }}
                            />
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Tab Title"
                              value={tab.title || ''}
                              onChange={(e) => {
                                const next = [...cmsDb.siteSettings.bigTabs];
                                next[idx] = { ...next[idx], title: e.target.value };
                                setHasUnsavedChanges(true);
                                setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, bigTabs: next } });
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            className="form-input"
                            style={{ marginTop: '0.45rem' }}
                            placeholder="Tab Subtitle"
                            value={tab.subtitle || ''}
                            onChange={(e) => {
                              const next = [...cmsDb.siteSettings.bigTabs];
                              next[idx] = { ...next[idx], subtitle: e.target.value };
                              setHasUnsavedChanges(true);
                              setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, bigTabs: next } });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ALWAYS-ACCESSIBLE PAGE TITLE & TOP HEADER INSPECTOR ON RIGHT PANE */}
              {isBlockPage && currentPageObj && (
                <div
                  style={{
                    background:
                      selectedBlockId === '__PAGE_HEADER__' || !selectedBlock
                        ? 'var(--bg-accent-subtle)'
                        : 'var(--bg-secondary)',
                    border:
                      selectedBlockId === '__PAGE_HEADER__' || !selectedBlock
                        ? '2px solid var(--accent-secondary)'
                        : '1.5px solid var(--border-gold)',
                    borderRadius: '14px',
                    padding: '1.05rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.65rem'
                    }}
                  >
                    <div>
                      <span className="section-kicker" style={{ marginBottom: '0.1rem' }}>
                        0. ★ Page Top Header & Title
                      </span>
                      <h4 style={{ fontSize: '1.22rem', color: 'var(--accent-secondary)' }}>
                        Edit Page Title (“{currentPageObj.headline || 'Page Title'}”)
                      </h4>
                    </div>
                    {selectedBlockId !== '__PAGE_HEADER__' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.28rem 0.6rem', fontSize: '0.72rem' }}
                        onClick={() => setSelectedBlockId('__PAGE_HEADER__')}
                      >
                        Full Header Settings
                      </button>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                    <label className="form-label">Main Page Title / Headline (e.g. “The Twilight Ceremony”)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentPageObj.headline || ''}
                      onChange={(e) => updatePageField(builderPage, 'headline', e.target.value)}
                      style={{ fontWeight: 700, fontSize: '0.96rem', borderColor: 'var(--border-gold)' }}
                    />
                  </div>

                  <div className="grid-2" style={{ gap: '0.55rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                      <label className="form-label">Small Top Eyebrow / Kicker</label>
                      <input
                        type="text"
                        className="form-input"
                        value={currentPageObj.kicker ?? ''}
                        onChange={(e) => updatePageField(builderPage, 'kicker', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                      <label className="form-label">Ornamental Divider</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="✦ 🥀 ✦ (leave blank for Rose Arch)"
                        value={currentPageObj.divider ?? ''}
                        onChange={(e) => updatePageField(builderPage, 'divider', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                    <label className="form-label">Page Intro Subtitle / Description</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={currentPageObj.subheadline ?? ''}
                      onChange={(e) => updatePageField(builderPage, 'subheadline', e.target.value)}
                    />
                  </div>

                  {(selectedBlockId === '__PAGE_HEADER__' || !selectedBlock || builderPage === 'rsvpPage') && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(currentPageObj.hideHeader)}
                          onChange={(e) => updatePageField(builderPage, 'hideHeader', e.target.checked)}
                        />
                        <span>Hide Top Page Title Box on This Page</span>
                      </label>

                      {/* RSVP PAGE SPECIFIC SCANNER & CARD TEXTS */}
                      {builderPage === 'rsvpPage' && (
                        <div
                          style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-gold)',
                            borderRadius: '12px',
                            padding: '0.85rem',
                            marginBottom: '0.85rem'
                          }}
                        >
                          <div className="form-label" style={{ color: 'var(--accent-secondary)', marginBottom: '0.55rem' }}>
                            QR Scanner Banner & Invitation Code Card Texts
                          </div>
                          <div className="grid-2" style={{ gap: '0.5rem' }}>
                            <div className="form-group">
                              <label className="form-label">Scanner Pill Badge</label>
                              <input
                                type="text"
                                className="form-input"
                                value={currentPageObj.scannerBadge ?? 'Instant QR Code Access'}
                                onChange={(e) => updatePageField('rsvpPage', 'scannerBadge', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Scanner Heading</label>
                              <input
                                type="text"
                                className="form-input"
                                value={currentPageObj.scannerTitle ?? 'Have Your Wedding QR Card?'}
                                onChange={(e) => updatePageField('rsvpPage', 'scannerTitle', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Scanner Instructions Paragraph</label>
                            <textarea
                              rows={2}
                              className="form-textarea"
                              value={currentPageObj.scannerSubtitle ?? ''}
                              onChange={(e) => updatePageField('rsvpPage', 'scannerSubtitle', e.target.value)}
                            />
                          </div>
                          <div className="grid-2" style={{ gap: '0.5rem' }}>
                            <div className="form-group">
                              <label className="form-label">Camera Button Text</label>
                              <input
                                type="text"
                                className="form-input"
                                value={currentPageObj.cameraBtnText ?? 'Scan QR with Camera'}
                                onChange={(e) => updatePageField('rsvpPage', 'cameraBtnText', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Upload Button Text</label>
                              <input
                                type="text"
                                className="form-input"
                                value={currentPageObj.uploadBtnText ?? 'Upload QR Image'}
                                onChange={(e) => updatePageField('rsvpPage', 'uploadBtnText', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid-2" style={{ gap: '0.5rem' }}>
                            <div className="form-group">
                              <label className="form-label">Code Box Label</label>
                              <input
                                type="text"
                                className="form-input"
                                value={currentPageObj.codeInputLabel ?? 'Enter Unique Invitation Code'}
                                onChange={(e) => updatePageField('rsvpPage', 'codeInputLabel', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Unlock Button Text</label>
                              <input
                                type="text"
                                className="form-input"
                                value={currentPageObj.unlockBtnText ?? 'Unlock RSVP'}
                                onChange={(e) => updatePageField('rsvpPage', 'unlockBtnText', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Code Help Hint Below Input</label>
                            <input
                              type="text"
                              className="form-input"
                              value={currentPageObj.codeInputHint ?? ''}
                              onChange={(e) => updatePageField('rsvpPage', 'codeInputHint', e.target.value)}
                            />
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem' }}>
                            <input
                              type="checkbox"
                              checked={currentPageObj.showSampleTray !== false}
                              onChange={(e) => updatePageField('rsvpPage', 'showSampleTray', e.target.checked)}
                            />
                            <span>Show Sample Guest QR Preview Tray on RSVP Page</span>
                          </label>
                        </div>
                      )}

                      {/* BOTTOM CALL-TO-ACTION BANNER EDITOR FOR ANY PAGE */}
                      <div
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '0.85rem'
                        }}
                      >
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: '0.55rem' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(currentPageObj.showBottomBanner)}
                            onChange={(e) => updatePageField(builderPage, 'showBottomBanner', e.target.checked)}
                          />
                          <span>Show Bottom Call-to-Action Banner on This Page</span>
                        </label>

                        {currentPageObj.showBottomBanner && (
                          <>
                            <div className="form-group">
                              <label className="form-label">Bottom Banner Title</label>
                              <input
                                type="text"
                                className="form-input"
                                value={currentPageObj.bottomBannerTitle ?? 'Join Us Under the October Moon'}
                                onChange={(e) => updatePageField(builderPage, 'bottomBannerTitle', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Bottom Banner Subtitle</label>
                              <textarea
                                rows={2}
                                className="form-textarea"
                                value={
                                  currentPageObj.bottomBannerSubtitle ??
                                  'Explore our candlelit ceremony details, autumn feast menu, or scan your invitation QR code to RSVP.'
                                }
                                onChange={(e) => updatePageField(builderPage, 'bottomBannerSubtitle', e.target.value)}
                              />
                            </div>
                            <div className="grid-2" style={{ gap: '0.5rem' }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Button 1 Text</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={currentPageObj.bottomBannerPrimaryText ?? 'View Twilight Ceremony'}
                                  onChange={(e) => updatePageField(builderPage, 'bottomBannerPrimaryText', e.target.value)}
                                />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Button 2 Text</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={currentPageObj.bottomBannerSecondaryText ?? 'Open QR Code RSVP'}
                                  onChange={(e) => updatePageField(builderPage, 'bottomBannerSecondaryText', e.target.value)}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* INSPECTOR FOR SELECTED SECTION BLOCK */}
              {isBlockPage && selectedBlock && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="section-kicker" style={{ marginBottom: '0.1rem' }}>
                        Section Inspector • {selectedBlock.type.replace('_', ' ')}
                      </span>
                      <h4 style={{ fontSize: '1.4rem' }}>{selectedBlock.title || 'Section Properties'}</h4>
                    </div>
                    <button
                      type="button"
                      className="btn-danger"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => handleDeleteBlock(builderPage, selectedBlock.id)}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>

                  {selectedBlock.type !== 'venue_showcase' && selectedBlock.type !== 'quote_countdown' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Section Kicker (Small Top Label)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={selectedBlock.kicker || ''}
                          onChange={(e) => updateSelectedBlock(builderPage, { kicker: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Section Headline</label>
                        <input
                          type="text"
                          className="form-input"
                          value={selectedBlock.title || ''}
                          onChange={(e) => updateSelectedBlock(builderPage, { title: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Section Subtitle</label>
                        <textarea
                          rows={2}
                          className="form-textarea"
                          value={selectedBlock.subtitle || ''}
                          onChange={(e) => updateSelectedBlock(builderPage, { subtitle: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {['couple_profiles', 'wedding_party', 'gallery', 'order_cards', 'feature_grid', 'dinner_menu', 'accommodations', 'faq_grid'].includes(
                    selectedBlock.type
                  ) && (
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Columns size={14} /> Grid Columns Layout
                      </label>
                      <select
                        className="form-select"
                        value={selectedBlock.settings?.columns || 3}
                        onChange={(e) =>
                          updateSelectedBlock(builderPage, (b) => {
                            b.settings = { ...(b.settings || {}), columns: Number(e.target.value) };
                            return b;
                          })
                        }
                      >
                        <option value={2}>2 Columns Per Row</option>
                        <option value={3}>3 Columns Per Row</option>
                        <option value={4}>4 Columns Per Row</option>
                      </select>
                    </div>
                  )}

                  {selectedBlock.type === 'couple_profiles' && (
                    <div className="form-group">
                      <label className="form-label">Portrait Image Frame Shape</label>
                      <select
                        className="form-select"
                        value={selectedBlock.settings?.frameStyle || 'gothic-arch'}
                        onChange={(e) =>
                          updateSelectedBlock(builderPage, (b) => {
                            b.settings = { ...(b.settings || {}), frameStyle: e.target.value };
                            return b;
                          })
                        }
                      >
                        <option value="gothic-arch">Cathedral Gothic Archway (Signature)</option>
                        <option value="rounded">Classic Rounded Portrait</option>
                        <option value="circle">Circular Medallion</option>
                      </select>
                    </div>
                  )}

                  {selectedBlock.type === 'gallery' && (
                    <div className="form-group">
                      <label className="form-label">Photo Aspect Ratio</label>
                      <select
                        className="form-select"
                        value={selectedBlock.settings?.aspectRatio || 'landscape'}
                        onChange={(e) =>
                          updateSelectedBlock(builderPage, (b) => {
                            b.settings = { ...(b.settings || {}), aspectRatio: e.target.value };
                            return b;
                          })
                        }
                      >
                        <option value="landscape">Landscape Arch</option>
                        <option value="portrait">Tall Cathedral Arch</option>
                        <option value="square">Square Arch</option>
                      </select>
                    </div>
                  )}

                  {selectedBlock.type === 'quote_countdown' && (
                    <>
                      <div
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-gold)',
                          borderRadius: '12px',
                          padding: '0.9rem',
                          marginBottom: '1rem'
                        }}
                      >
                        <div
                          className="form-label"
                          style={{
                            color: 'var(--accent-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            marginBottom: '0.55rem'
                          }}
                        >
                          <Calendar size={14} /> Set Wedding Date & Countdown Timer
                        </div>
                        <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                          <label className="form-label">Pick Wedding Date & Time (Calendar)</label>
                          <input
                            type="datetime-local"
                            className="form-input"
                            style={{ colorScheme: 'dark' }}
                            value={toDateTimeLocalValue(cmsDb.siteSettings?.weddingDate)}
                            onChange={(e) => {
                              const isoVal = e.target.value;
                              const formatted = formatIsoToHumanDate(isoVal);
                              setHasUnsavedChanges(true);
                              setCmsDb({
                                ...cmsDb,
                                siteSettings: {
                                  ...cmsDb.siteSettings,
                                  weddingDate: isoVal,
                                  weddingDateDisplay: formatted || cmsDb.siteSettings.weddingDateDisplay
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Displayed Date Text (Auto-formats or type custom)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={cmsDb.siteSettings?.weddingDateDisplay || ''}
                            onChange={(e) => {
                              setHasUnsavedChanges(true);
                              setCmsDb({
                                ...cmsDb,
                                siteSettings: {
                                  ...cmsDb.siteSettings,
                                  weddingDateDisplay: e.target.value
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Top Note Label</label>
                        <input
                          type="text"
                          className="form-input"
                          value={selectedBlock.settings?.noteLabel || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), noteLabel: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Romantic Quote</label>
                        <textarea
                          rows={2}
                          className="form-textarea"
                          value={selectedBlock.settings?.quote || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), quote: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Subtext Below Quote</label>
                        <input
                          type="text"
                          className="form-input"
                          value={selectedBlock.settings?.subtext || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), subtext: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.86rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedBlock.settings?.showCountdown !== false}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), showCountdown: e.target.checked };
                              return b;
                            })
                          }
                        />
                        <span>Display Live Days/Hours/Minutes Countdown</span>
                      </label>
                    </>
                  )}

                  {selectedBlock.type === 'venue_showcase' && (
                    <>
                      <div className="grid-2" style={{ gap: '0.6rem' }}>
                        <div className="form-group">
                          <label className="form-label">Top Badge</label>
                          <input
                            type="text"
                            className="form-input"
                            value={selectedBlock.settings?.badge || ''}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), badge: e.target.value };
                                return b;
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Photo Alignment</label>
                          <select
                            className="form-select"
                            value={selectedBlock.settings?.imagePosition || 'left'}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), imagePosition: e.target.value };
                                return b;
                              })
                            }
                          >
                            <option value="left">Photo on Left</option>
                            <option value="right">Photo on Right</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Venue Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={selectedBlock.settings?.venueName || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), venueName: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Venue Address</label>
                        <input
                          type="text"
                          className="form-input"
                          value={selectedBlock.settings?.venueAddress || selectedBlock.settings?.address || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), venueAddress: e.target.value, address: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Venue Description / Notes Paragraph (Optional)</label>
                        <textarea
                          rows={2}
                          className="form-textarea"
                          placeholder="Add optional notes about the venue, attire, or arrival..."
                          value={selectedBlock.settings?.description || selectedBlock.settings?.attireNote || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), description: e.target.value, attireNote: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <ImageFieldUploader
                        label="Venue Showcase Image (Line Up / Crop)"
                        value={selectedBlock.settings?.heroImage || selectedBlock.settings?.venueImageUrl}
                        cropValue={selectedBlock.settings?.heroImageCrop || selectedBlock.settings?.venueImageCrop}
                        onChange={(val) =>
                          updateSelectedBlock(builderPage, (b) => {
                            b.settings = { ...(b.settings || {}), heroImage: val, venueImageUrl: val };
                            return b;
                          })
                        }
                        onCropChange={(c) =>
                          updateSelectedBlock(builderPage, (b) => {
                            b.settings = { ...(b.settings || {}), heroImageCrop: c, venueImageCrop: c };
                            return b;
                          })
                        }
                      />
                      <div className="grid-2" style={{ gap: '0.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">Google Maps Link</label>
                          <input
                            type="text"
                            className="form-input"
                            value={selectedBlock.settings?.mapUrl || ''}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), mapUrl: e.target.value };
                                return b;
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Maps Button Label</label>
                          <input
                            type="text"
                            className="form-input"
                            value={selectedBlock.settings?.mapButtonText ?? 'Open in Google Maps'}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), mapButtonText: e.target.value };
                                return b;
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid-2" style={{ gap: '0.5rem' }}>
                        <div className="form-group">
                          <label className="form-label">2nd Action Button Text</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. See Reception Details"
                            value={selectedBlock.settings?.ctaText ?? ''}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), ctaText: e.target.value };
                                return b;
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">2nd Button Target Tab</label>
                          <select
                            className="form-select"
                            value={selectedBlock.settings?.ctaTargetTab || 'reception'}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), ctaTargetTab: e.target.value };
                                return b;
                              })
                            }
                          >
                            <option value="about">About Us Tab</option>
                            <option value="ceremony">Ceremony Tab</option>
                            <option value="reception">Reception Tab</option>
                            <option value="rsvp">QR Code RSVP Tab</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label className="form-label" style={{ margin: 0 }}>Key Highlight Stats</label>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.22rem 0.55rem', fontSize: '0.72rem' }}
                            onClick={() =>
                              updateSelectedBlock(builderPage, (b) => {
                                const nextH = [...(b.settings?.highlights || []), { label: 'Highlight', value: 'Details' }];
                                b.settings = { ...(b.settings || {}), highlights: nextH };
                                return b;
                              })
                            }
                          >
                            <Plus size={12} /> Add Stat
                          </button>
                        </div>
                        {(selectedBlock.settings?.highlights || []).map((hl, hIdx) => (
                          <div key={hIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.45rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Label"
                              value={hl.label || ''}
                              onChange={(e) =>
                                updateSelectedBlock(builderPage, (b) => {
                                  const nextH = [...(b.settings?.highlights || [])];
                                  nextH[hIdx] = { ...nextH[hIdx], label: e.target.value };
                                  b.settings = { ...b.settings, highlights: nextH };
                                  return b;
                                })
                              }
                            />
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Value"
                              value={hl.value || ''}
                              onChange={(e) =>
                                updateSelectedBlock(builderPage, (b) => {
                                  const nextH = [...(b.settings?.highlights || [])];
                                  nextH[hIdx] = { ...nextH[hIdx], value: e.target.value };
                                  b.settings = { ...b.settings, highlights: nextH };
                                  return b;
                                })
                              }
                            />
                            <button
                              type="button"
                              title="Remove Stat"
                              onClick={() =>
                                updateSelectedBlock(builderPage, (b) => {
                                  const nextH = (b.settings?.highlights || []).filter((_, i) => i !== hIdx);
                                  b.settings = { ...b.settings, highlights: nextH };
                                  return b;
                                })
                              }
                              style={{ background: 'rgba(220,38,38,0.2)', border: 'none', color: '#fca5a5', padding: '0.35rem 0.45rem', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {(selectedBlock.type === 'split_media' || selectedBlock.type === 'rich_banner') && (
                    <>
                      {selectedBlock.type === 'split_media' && (
                        <>
                          <div className="form-group">
                            <label className="form-label">Image Side</label>
                            <select
                              className="form-select"
                              value={selectedBlock.settings?.imagePosition || 'left'}
                              onChange={(e) =>
                                updateSelectedBlock(builderPage, (b) => {
                                  b.settings = { ...(b.settings || {}), imagePosition: e.target.value };
                                  return b;
                                })
                              }
                            >
                              <option value="left">Image on Left</option>
                              <option value="right">Image on Right</option>
                            </select>
                          </div>
                          <ImageFieldUploader
                            label="Feature Image (Line Up / Crop)"
                            value={selectedBlock.settings?.imageUrl}
                            cropValue={selectedBlock.settings?.imageUrlCrop}
                            onChange={(val) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), imageUrl: val };
                                return b;
                              })
                            }
                            onCropChange={(c) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), imageUrlCrop: c };
                                return b;
                              })
                            }
                          />
                        </>
                      )}
                      <div className="form-group">
                        <label className="form-label">Body Paragraph Text</label>
                        <textarea
                          rows={4}
                          className="form-textarea"
                          value={selectedBlock.settings?.bodyText || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), bodyText: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="grid-2" style={{ gap: '0.6rem' }}>
                        <div className="form-group">
                          <label className="form-label">CTA Button Label (Optional)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={selectedBlock.settings?.buttonText || ''}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), buttonText: e.target.value };
                                return b;
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Button Target Tab</label>
                          <select
                            className="form-select"
                            value={selectedBlock.settings?.buttonTab || 'rsvp'}
                            onChange={(e) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), buttonTab: e.target.value };
                                return b;
                              })
                            }
                          >
                            <option value="about">About Us Tab</option>
                            <option value="ceremony">Ceremony Tab</option>
                            <option value="reception">Reception Tab</option>
                            <option value="rsvp">QR RSVP Tab</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {renderInspectorItemsEditor(selectedBlock)}
                </div>
              )}
            </aside>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 2: GUEST LIST & UNIQUE QR CODE STUDIO                        */}
        {/* ================================================================= */}
        {studioMode === 'guests' && cmsDb && (
          <div className="cms-scroll-body">
            {analytics && (
              <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
                <div className="surface-card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Invited Households (QR Codes)
                  </div>
                  <div className="serif-font" style={{ fontSize: '2.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {analytics.totalHouseholds}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {analytics.totalInvitedSeats} total individual seats
                  </div>
                </div>

                <div className="surface-card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 700 }}>
                    Joyfully Attending
                  </div>
                  <div className="serif-font" style={{ fontSize: '2.3rem', fontWeight: 700, color: '#34d399' }}>
                    {analytics.attendingCount}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Confirmed guests attending
                  </div>
                </div>

                <div className="surface-card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                    Awaiting RSVP
                  </div>
                  <div className="serif-font" style={{ fontSize: '2.3rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {analytics.pendingSeats}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Across {analytics.pendingHouseholds} pending households
                  </div>
                </div>

                <div className="surface-card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                    Entrée Breakdown
                  </div>
                  <div style={{ fontSize: '0.82rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {Object.entries(analytics.mealCounts || {}).map(([meal, count]) => (
                      <div key={meal} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '175px' }}>
                          {meal}:
                        </span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div
              className="surface-card"
              style={{
                padding: '1.15rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search household, guest, or QR code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '260px', padding: '0.55rem 0.85rem' }}
                />
                <select
                  className="form-select"
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value)}
                  style={{ width: '160px', padding: '0.55rem 0.85rem' }}
                >
                  <option value="all">All RSVP Status</option>
                  <option value="responded">Responded ✓</option>
                  <option value="pending">Pending RSVP</option>
                </select>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ width: '195px', padding: '0.55rem 0.85rem' }}
                >
                  <option value="all">All Guest Categories</option>
                  <option value="wedding-party">👑 Wedding Party Only</option>
                  {GUEST_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      Category: {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={exportGuestsCsv}>
                  <Download size={16} /> Export CSV
                </button>
                <button className="btn-secondary" onClick={() => setStudioMode('print-qrs')}>
                  <Printer size={16} /> Print QR Cards
                </button>
                <button className="btn-primary" onClick={() => setShowNewGuestModal(true)}>
                  <Plus size={17} /> Add Guest & Generate QR Code
                </button>
              </div>
            </div>

            {showNewGuestModal && (
              <form
                onSubmit={handleCreateGuest}
                className="surface-card"
                style={{
                  marginBottom: '1.75rem',
                  border: '2px solid var(--accent-secondary)',
                  background: 'var(--bg-accent-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.6rem' }}>Create New Household Invitation & Unique QR Code</h4>
                  <button type="button" className="btn-secondary" onClick={() => setShowNewGuestModal(false)}>
                    Cancel
                  </button>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Household / Envelope Title *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g., The Harrison Family"
                      value={newGuestForm.householdName}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, householdName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Guest Category *</label>
                    <select
                      className="form-select"
                      value={newGuestForm.category || 'Friend'}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, category: e.target.value })}
                    >
                      {GUEST_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Wedding Party Access</label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.62rem 0.85rem',
                        borderRadius: '10px',
                        background: newGuestForm.isWeddingParty ? 'rgba(212, 168, 83, 0.18)' : 'var(--bg-primary)',
                        border: newGuestForm.isWeddingParty ? '1.5px solid var(--border-gold)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        color: newGuestForm.isWeddingParty ? 'var(--accent-secondary)' : 'var(--text-primary)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(newGuestForm.isWeddingParty)}
                        onChange={(e) => setNewGuestForm({ ...newGuestForm, isWeddingParty: e.target.checked })}
                      />
                      <Crown size={15} color="var(--accent-secondary)" />
                      <span>Wedding Party (Unlocks VIP Page)</span>
                    </label>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Unique QR Code (Leave blank to auto-generate)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., RAVEN-2027"
                      value={newGuestForm.code}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, code: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Table Assignment (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Table 6 • Nightshade"
                      value={newGuestForm.tableNumber}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, tableNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Named Guests in This Party</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {newGuestForm.memberNames.map((name, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder={`Guest ${idx + 1} Full Name`}
                            value={name}
                            onChange={(e) => {
                              const updated = [...newGuestForm.memberNames];
                              updated[idx] = e.target.value;
                              setNewGuestForm({ ...newGuestForm, memberNames: updated });
                            }}
                          />
                          {newGuestForm.memberNames.length > 1 && (
                            <button
                              type="button"
                              className="btn-danger"
                              onClick={() => {
                                setNewGuestForm({
                                  ...newGuestForm,
                                  memberNames: newGuestForm.memberNames.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ alignSelf: 'flex-start', marginTop: '0.5rem', padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                      onClick={() =>
                        setNewGuestForm({
                          ...newGuestForm,
                          memberNames: [...newGuestForm.memberNames, '']
                        })
                      }
                    >
                      <Plus size={14} /> Add Another Named Guest
                    </button>
                  </div>

                  <div
                    className="form-group"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1.5px solid var(--border-gold)',
                      borderRadius: '14px',
                      padding: '1rem'
                    }}
                  >
                    <label
                      className="form-label"
                      style={{
                        color: 'var(--accent-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <UserPlus size={15} /> +1 Guest Option (Guest Fills Out Who They Bring)
                    </label>
                    <select
                      className="form-select"
                      value={newGuestForm.plusOnesAllowed || 0}
                      onChange={(e) =>
                        setNewGuestForm({
                          ...newGuestForm,
                          plusOnesAllowed: Number(e.target.value)
                        })
                      }
                    >
                      <option value={0}>No +1 Option (Only Named Guests Above)</option>
                      <option value={1}>Allow +1 Guest (Guest Fills Out Their Date's Name)</option>
                      <option value={2}>Allow +2 Additional Guests (Guest Fills Out Names)</option>
                      <option value={3}>Allow +3 Additional Guests (Guest Fills Out Names)</option>
                      <option value={4}>Allow +4 Additional Guests (Guest Fills Out Names)</option>
                    </select>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      When enabled, scanning their QR code shows a dedicated <strong>"+1 Guest Option"</strong> section where they choose whether they are bringing someone, type their +1's full name, and pick their +1's dinner entrée.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Personal Note Shown When They Scan Their QR Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., We cannot wait to celebrate with you by candlelight!"
                    value={newGuestForm.personalNote}
                    onChange={(e) => setNewGuestForm({ ...newGuestForm, personalNote: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary">
                    <QrCode size={17} /> Generate Unique QR Code & Save Household
                  </button>
                </div>
              </form>
            )}

            {editingGuest && (
              <form
                onSubmit={handleUpdateGuest}
                className="surface-card"
                style={{
                  marginBottom: '1.75rem',
                  border: '2px solid var(--accent-secondary)',
                  background: 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.6rem' }}>
                    Editing Household: {editingGuest.householdName} ({editingGuest.code})
                  </h4>
                  <button type="button" className="btn-secondary" onClick={() => setEditingGuest(null)}>
                    Cancel
                  </button>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Household Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingGuest.householdName}
                      onChange={(e) => setEditingGuest({ ...editingGuest, householdName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guest Category</label>
                    <select
                      className="form-select"
                      value={editingGuest.category || 'Friend'}
                      onChange={(e) => setEditingGuest({ ...editingGuest, category: e.target.value })}
                    >
                      {GUEST_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Wedding Party Access</label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.62rem 0.85rem',
                        borderRadius: '10px',
                        background: editingGuest.isWeddingParty ? 'rgba(212, 168, 83, 0.18)' : 'var(--bg-primary)',
                        border: editingGuest.isWeddingParty ? '1.5px solid var(--border-gold)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        color: editingGuest.isWeddingParty ? 'var(--accent-secondary)' : 'var(--text-primary)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(editingGuest.isWeddingParty)}
                        onChange={(e) => setEditingGuest({ ...editingGuest, isWeddingParty: e.target.checked })}
                      />
                      <Crown size={15} color="var(--accent-secondary)" />
                      <span>Wedding Party Member</span>
                    </label>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Unique QR Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingGuest.code}
                      onChange={(e) => setEditingGuest({ ...editingGuest, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Table Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingGuest.tableNumber || ''}
                      onChange={(e) => setEditingGuest({ ...editingGuest, tableNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Personal Welcome Message on RSVP Page</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingGuest.personalNote || ''}
                      onChange={(e) => setEditingGuest({ ...editingGuest, personalNote: e.target.value })}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{
                      marginBottom: 0,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '12px',
                      padding: '0.75rem'
                    }}
                  >
                    <label className="form-label" style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <UserPlus size={14} /> +1 Guest Option Allowed for This QR Code
                    </label>
                    <select
                      className="form-select"
                      value={
                        editingGuest.plusOnesAllowed !== undefined
                          ? editingGuest.plusOnesAllowed
                          : (editingGuest.members || []).filter((m) => m.isPlusOne).length
                      }
                      onChange={(e) => {
                        const targetCount = Number(e.target.value);
                        const existingMembers = editingGuest.members || [];
                        const named = existingMembers.filter((m) => !m.isPlusOne);
                        const plusOnes = existingMembers.filter((m) => m.isPlusOne);
                        while (plusOnes.length < targetCount) {
                          plusOnes.push({
                            id: `plusone-${Date.now()}-${plusOnes.length}`,
                            name: '',
                            isPlusOne: true,
                            attending: null,
                            mealChoice: '',
                            dietary: ''
                          });
                        }
                        setEditingGuest({
                          ...editingGuest,
                          plusOnesAllowed: targetCount,
                          members: [...named, ...plusOnes.slice(0, targetCount)]
                        });
                      }}
                    >
                      <option value={0}>No +1 Option (0)</option>
                      <option value={1}>+1 Guest Allowed (Guest Fills Name)</option>
                      <option value={2}>+2 Additional Guests Allowed</option>
                      <option value={3}>+3 Additional Guests Allowed</option>
                      <option value={4}>+4 Additional Guests Allowed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Party Members & +1 Slots</label>
                  {(editingGuest.members || []).map((m, idx) => (
                    <div
                      key={m.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 2fr 1fr 2fr auto',
                        gap: '0.6rem',
                        marginBottom: '0.5rem',
                        alignItems: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.32rem 0.55rem',
                          borderRadius: '6px',
                          background: m.isPlusOne ? 'rgba(212, 168, 83, 0.2)' : 'var(--bg-secondary)',
                          color: m.isPlusOne ? 'var(--accent-secondary)' : 'var(--text-muted)',
                          border: m.isPlusOne ? '1px solid var(--border-gold)' : '1px solid var(--border-color)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {m.isPlusOne ? '+1 SLOT' : `GUEST #${idx + 1}`}
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder={m.isPlusOne ? '+1 Name (Guest fills out on RSVP)' : 'Guest Full Name'}
                        value={m.name}
                        onChange={(e) => {
                          const next = [...editingGuest.members];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setEditingGuest({ ...editingGuest, members: next });
                        }}
                      />
                      <select
                        className="form-select"
                        value={m.attending === true ? 'yes' : m.attending === false ? 'no' : 'pending'}
                        onChange={(e) => {
                          const val = e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null;
                          const next = [...editingGuest.members];
                          next[idx] = { ...next[idx], attending: val };
                          setEditingGuest({ ...editingGuest, members: next });
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="yes">Attending</option>
                        <option value="no">Declined</option>
                      </select>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Entrée choice"
                        value={m.mealChoice || ''}
                        onChange={(e) => {
                          const next = [...editingGuest.members];
                          next[idx] = { ...next[idx], mealChoice: e.target.value };
                          setEditingGuest({ ...editingGuest, members: next });
                        }}
                      />
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => {
                          const updatedMembers = editingGuest.members.filter((_, i) => i !== idx);
                          setEditingGuest({
                            ...editingGuest,
                            plusOnesAllowed: updatedMembers.filter((mem) => mem.isPlusOne).length,
                            members: updatedMembers
                          });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() =>
                        setEditingGuest({
                          ...editingGuest,
                          members: [
                            ...(editingGuest.members || []),
                            { id: `m-${Date.now()}`, name: 'New Guest', isPlusOne: false, attending: null, mealChoice: '', dietary: '' }
                          ]
                        })
                      }
                    >
                      <Plus size={14} /> Add Named Member
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.8rem',
                        borderColor: 'var(--border-gold)',
                        color: 'var(--accent-secondary)'
                      }}
                      onClick={() => {
                        const nextMembers = [
                          ...(editingGuest.members || []),
                          { id: `plusone-${Date.now()}`, name: '', isPlusOne: true, attending: null, mealChoice: '', dietary: '' }
                        ];
                        setEditingGuest({
                          ...editingGuest,
                          plusOnesAllowed: nextMembers.filter((m) => m.isPlusOne).length,
                          members: nextMembers
                        });
                      }}
                    >
                      <UserPlus size={14} /> Add a +1 Guest Slot
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="submit" className="btn-primary">
                    <Save size={16} /> Save Household Changes
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="surface-card"
                  style={{
                    padding: '1.35rem 1.5rem',
                    display: 'grid',
                    gridTemplateColumns: '130px 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    {qrImages[guest.code] && (
                      <img
                        src={qrImages[guest.code]}
                        alt={guest.code}
                        style={{
                          width: '112px',
                          height: '112px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-gold)',
                          padding: '4px',
                          background: '#fff'
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: 'var(--accent-secondary)',
                        marginTop: '0.25rem'
                      }}
                    >
                      {guest.code}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '1.5rem' }}>{guest.householdName}</h4>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '999px',
                          background: guest.rsvpStatus === 'responded' ? 'rgba(16,185,129,0.2)' : 'rgba(217,119,6,0.2)',
                          color: guest.rsvpStatus === 'responded' ? '#a7f3d0' : '#fde68a'
                        }}
                      >
                        {guest.rsvpStatus === 'responded' ? '✓ Responded' : 'Pending RSVP'}
                      </span>
                      {guest.tableNumber && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          • {guest.tableNumber}
                        </span>
                      )}

                      {/* Quick Category Selector Directly on the Guest Card */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '999px',
                          padding: '0.15rem 0.6rem',
                          fontSize: '0.74rem'
                        }}
                      >
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Category:</span>
                        <select
                          value={guest.category || 'Friend'}
                          onChange={(e) => handleQuickUpdateGuestMeta(guest, { category: e.target.value })}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-secondary)',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          {GUEST_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} style={{ background: '#120b10' }}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick Wedding Party Checkbox Directly on the Guest Card */}
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: guest.isWeddingParty ? 'rgba(212, 168, 83, 0.2)' : 'var(--bg-secondary)',
                          border: guest.isWeddingParty ? '1px solid var(--border-gold)' : '1px solid var(--border-color)',
                          borderRadius: '999px',
                          padding: '0.15rem 0.65rem',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: guest.isWeddingParty ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(guest.isWeddingParty)}
                          onChange={(e) => handleQuickUpdateGuestMeta(guest, { isWeddingParty: e.target.checked })}
                        />
                        <Crown size={12} color="var(--accent-secondary)" />
                        <span>Wedding Party</span>
                      </label>

                      {/* Quick +1 Selector Directly on the Guest Card */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'var(--bg-accent-subtle)',
                          border: '1px solid var(--border-gold)',
                          borderRadius: '999px',
                          padding: '0.15rem 0.6rem',
                          fontSize: '0.74rem'
                        }}
                      >
                        <UserPlus size={12} color="var(--accent-secondary)" />
                        <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>+1 Option:</span>
                        <select
                          value={
                            guest.plusOnesAllowed !== undefined
                              ? guest.plusOnesAllowed
                              : (guest.members || []).filter((m) => m.isPlusOne).length
                          }
                          onChange={(e) => handleQuickUpdateGuestMeta(guest, { plusOnesAllowed: Number(e.target.value) })}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value={0} style={{ background: '#120b10' }}>No +1</option>
                          <option value={1} style={{ background: '#120b10' }}>+1 Allowed</option>
                          <option value={2} style={{ background: '#120b10' }}>+2 Allowed</option>
                          <option value={3} style={{ background: '#120b10' }}>+3 Allowed</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                      {(guest.members || []).map((m) => (
                        <div
                          key={m.id}
                          style={{
                            fontSize: '0.82rem',
                            padding: '0.3rem 0.7rem',
                            borderRadius: '8px',
                            background: m.isPlusOne ? 'rgba(212, 168, 83, 0.12)' : 'var(--bg-secondary)',
                            border: m.isPlusOne ? '1px solid var(--border-gold)' : '1px solid var(--border-color)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          {m.isPlusOne && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: 'var(--accent-secondary)',
                                textTransform: 'uppercase'
                              }}
                            >
                              +1:
                            </span>
                          )}
                          <strong>
                            {m.name || (m.isPlusOne ? 'Guest Name TBD (Fills on RSVP)' : 'Unnamed Guest')}
                          </strong>
                          {m.attending === true && (
                            <span style={{ color: '#34d399', fontWeight: 600 }}>
                              (Attending{m.mealChoice ? ` • ${m.mealChoice}` : ''})
                            </span>
                          )}
                          {m.attending === false && (
                            <span style={{ color: '#f87171', fontWeight: 600 }}>
                              ({m.isPlusOne ? 'Not Bringing +1' : 'Declined'})
                            </span>
                          )}
                          {m.attending === null && (
                            <span style={{ color: 'var(--text-muted)' }}>(Pending)</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {(guest.songRequest || guest.messageToCouple) && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {guest.songRequest && (
                          <span style={{ marginRight: '1rem' }}>
                            🎵 <strong>Song:</strong> {guest.songRequest}
                          </span>
                        )}
                        {guest.messageToCouple && (
                          <span>
                            💬 <strong>Note:</strong> “{guest.messageToCouple}”
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: '175px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
                      onClick={() => onSimulateQrScan(guest.code)}
                    >
                      <ExternalLink size={14} /> Test Guest QR View
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => downloadQrPng(guest)}
                    >
                      <Download size={14} /> Download QR PNG
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => copyInviteLink(guest.code)}
                    >
                      {copiedCode === guest.code ? (
                        <>
                          <Check size={14} /> Copied QR URL!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy QR Link
                        </>
                      )}
                    </button>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ flex: 1, padding: '0.4rem', fontSize: '0.78rem' }}
                        onClick={() => setEditingGuest(structuredClone(guest))}
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        style={{ padding: '0.4rem 0.65rem' }}
                        onClick={() => handleDeleteGuest(guest.id, guest.householdName)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 3: PRINTABLE QR CARDS SHEET                                  */}
        {/* ================================================================= */}
        {studioMode === 'print-qrs' && cmsDb && (
          <div className="cms-scroll-body">
            <div
              className="surface-card no-print"
              style={{
                marginBottom: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                background: 'var(--bg-accent-subtle)'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.5rem' }}>Ready-to-Print Gothic Arch QR Enclosure Cards</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Print these personalized arched QR cards for your physical invitation envelopes, or download individual PNGs in the Guest Studio.
                </p>
              </div>
              <button className="btn-primary" onClick={() => window.print()}>
                <Printer size={17} /> Print All QR Cards Now
              </button>
            </div>

            <div className="qr-print-grid printable-qr-area">
              {(cmsDb.guests || []).map((guest) => (
                <div key={guest.id} className="qr-stationery-card">
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--accent-secondary)', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {cmsDb.siteSettings?.shortNames} • Wedding RSVP
                  </div>
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.2rem' }}>{guest.householdName}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {(guest.members || [])
                      .map((m) => (m.isPlusOne ? m.name || '+1 Guest Invited' : m.name))
                      .join(' • ')}
                  </p>
                  {qrImages[guest.code] && (
                    <img
                      src={qrImages[guest.code]}
                      alt={guest.code}
                      style={{ width: '155px', height: '155px', marginBottom: '0.6rem', background: '#fff', padding: '6px', borderRadius: '10px' }}
                    />
                  )}
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      padding: '0.3rem 0.85rem',
                      borderRadius: '999px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-gold)',
                      color: 'var(--accent-secondary)',
                      marginBottom: '0.45rem'
                    }}
                  >
                    CODE: {guest.code}
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Scan with your phone camera to unlock your personalized RSVP & entrée selection by {cmsDb.siteSettings?.rsvpDeadline}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 4: ACTIVITY LOG & FACTORY RESET                              */}
        {/* ================================================================= */}
        {studioMode === 'revisions' && cmsDb && (
          <div className="cms-scroll-body">
            <div className="surface-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.5rem' }}>Recent CMS Edits & Guest RSVP Activity</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    All edits and guest RSVPs are stored in <code>C:\docker\wedding-website\data\db.json</code> and preserved across updates.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={async () => {
                    if (!window.confirm('Reset all wedding website content, sections, and sample guests to factory defaults?')) return;
                    const res = await fetch('/api/admin/reset', {
                      method: 'POST',
                      headers: { 'x-admin-passcode': passcode }
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setCmsDb(data.db);
                      setAnalytics(data.analytics);
                      setHasUnsavedChanges(false);
                      applyThemeAndCustomColors(data.db.siteSettings);
                      if (onContentUpdated) onContentUpdated();
                    }
                  }}
                >
                  <RotateCcw size={15} /> Reset to Factory Defaults
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(cmsDb.revisions || []).map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.88rem'
                    }}
                  >
                    <div>
                      <span className="role-badge" style={{ marginRight: '0.65rem', marginBottom: 0 }}>
                        {rev.section}
                      </span>
                      <strong>{rev.summary}</strong>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(rev.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
