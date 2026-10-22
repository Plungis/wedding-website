import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import PageBlockRenderer, {
  GothicRoseArchOrnament,
  RichText,
  formatRichHtml,
  stripHtmlToPlain
} from './PageBlockRenderer.jsx';
import UnderConstructionView from './UnderConstructionView.jsx';
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
  MapPin,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Send,
  Clock,
  UserCheck,
  LogOut,
  AlertCircle
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

// ============================================================================
// RICH WYSIWYG EDITOR + 1-CLICK LINE BREAK COMPONENT FOR CMS TEXT BOXES
// ============================================================================
function triggerReactInputChange(el, nextValue) {
  if (!el) return;
  const proto =
    el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(el, nextValue);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function WysiwygEditor({
  value = '',
  onChange,
  rows = 3,
  placeholder = 'Type here... (Press Enter or click ↵ Line Break for a new line)',
  compact = false,
  style = {}
}) {
  const [mode, setMode] = useState('visual'); // 'visual' | 'source'
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const isFocusedRef = useRef(false);

  // Sync external value into contentEditable when not actively typing inside it
  useEffect(() => {
    if (mode !== 'visual' || !editorRef.current) return;
    const html = formatRichHtml(value || '');
    if (!isFocusedRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [value, mode]);

  function emitVisualChange() {
    if (!editorRef.current) return;
    const rawHtml = editorRef.current.innerHTML;
    const cleaned = rawHtml === '<br>' ? '' : rawHtml;
    onChange(cleaned);
  }

  function runCommand(cmd, arg = null) {
    if (mode === 'visual' && editorRef.current) {
      editorRef.current.focus();
      document.execCommand(cmd, false, arg);
      emitVisualChange();
      return;
    }

    // Source / Plain textarea fallback
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart ?? (value || '').length;
    const end = ta.selectionEnd ?? (value || '').length;
    const str = String(value || '');
    const selected = str.slice(start, end);
    let replacement = selected;

    if (cmd === 'insertLineBreak') {
      replacement = `${selected}\n`;
    } else if (cmd === 'bold') {
      replacement = `<b>${selected || 'Bold Text'}</b>`;
    } else if (cmd === 'italic') {
      replacement = `<i>${selected || 'Italic Text'}</i>`;
    } else if (cmd === 'underline') {
      replacement = `<u>${selected || 'Underlined Text'}</u>`;
    } else if (cmd === 'foreColor') {
      replacement = `<span style="color: ${arg}">${selected || 'Colored Text'}</span>`;
    } else if (cmd === 'fontSize') {
      const sizeMap = { 2: '0.85em', 3: '1em', 5: '1.25em', 6: '1.55em' };
      replacement = `<span style="font-size: ${sizeMap[arg] || '1.2em'}">${selected || 'Sized Text'}</span>`;
    } else if (cmd === 'justifyLeft') {
      replacement = `<div style="text-align: left">${selected || str}</div>`;
      onChange(replacement);
      return;
    } else if (cmd === 'justifyCenter') {
      replacement = `<div style="text-align: center">${selected || str}</div>`;
      onChange(replacement);
      return;
    } else if (cmd === 'justifyRight') {
      replacement = `<div style="text-align: right">${selected || str}</div>`;
      onChange(replacement);
      return;
    } else if (cmd === 'insertUnorderedList') {
      const lines = (selected || 'Item 1\nItem 2').split(/\r?\n/).filter(Boolean);
      replacement = `<ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul>`;
    } else if (cmd === 'insertText') {
      replacement = `${selected}${arg || ''}`;
    } else if (cmd === 'removeFormat') {
      onChange(stripHtmlToPlain(str));
      return;
    }

    const nextVal = str.slice(0, start) + replacement + str.slice(end);
    onChange(nextVal);
  }

  const btnStyle = {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '5px',
    padding: compact ? '0.16rem 0.38rem' : '0.22rem 0.45rem',
    fontSize: compact ? '0.68rem' : '0.72rem',
    fontWeight: 700,
    cursor: 'pointer',
    lineHeight: 1.2,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem'
  };

  const minHeightPx = compact ? 42 : Math.max(58, rows * 24);

  return (
    <div
      className="wysiwyg-editor-shell"
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* WYSIWYG Formatting & Line-Break Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.25rem',
          padding: compact ? '0.28rem 0.45rem' : '0.35rem 0.55rem',
          background: '#080508',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setMode(mode === 'visual' ? 'source' : 'visual');
          }}
          style={{
            ...btnStyle,
            background: mode === 'visual' ? 'rgba(158, 27, 50, 0.38)' : 'rgba(255,255,255,0.08)',
            borderColor: 'var(--border-gold)',
            color: 'var(--accent-secondary)'
          }}
          title="Switch between Visual WYSIWYG Editor and Raw Text/HTML mode"
        >
          {mode === 'visual' ? '✨ Visual' : '</> Text'}
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('insertLineBreak');
          }}
          style={{
            ...btnStyle,
            background: 'rgba(212, 168, 83, 0.2)',
            borderColor: 'var(--border-gold)',
            color: 'var(--accent-secondary)'
          }}
          title="Insert a Line Break (or press Enter inside the box)"
        >
          ↵ Line Break
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('bold');
          }}
          style={{ ...btnStyle, fontWeight: 900 }}
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('italic');
          }}
          style={{ ...btnStyle, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('underline');
          }}
          style={{ ...btnStyle, textDecoration: 'underline' }}
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        {/* Color Swatches */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('foreColor', '#d4a853');
          }}
          style={{ ...btnStyle, color: '#d4a853', borderColor: 'rgba(212,168,83,0.45)' }}
          title="Gold Filigree Text Color"
        >
          ● Gold
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('foreColor', '#e11d48');
          }}
          style={{ ...btnStyle, color: '#fb7185', borderColor: 'rgba(225,29,72,0.45)' }}
          title="Crimson Rose Text Color"
        >
          ● Rose
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('foreColor', '#f5eee6');
          }}
          style={{ ...btnStyle, color: '#f5eee6' }}
          title="Alabaster Ivory Text Color"
        >
          ● Ivory
        </button>

        {!compact && (
          <>
            {/* Text Size */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('fontSize', '2');
              }}
              style={btnStyle}
              title="Small Text Size"
            >
              S
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('fontSize', '3');
              }}
              style={btnStyle}
              title="Normal Text Size"
            >
              M
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('fontSize', '5');
              }}
              style={btnStyle}
              title="Large Text Size"
            >
              L
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('fontSize', '6');
              }}
              style={btnStyle}
              title="Extra Large Text Size"
            >
              XL
            </button>

            {/* Alignment */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('justifyLeft');
              }}
              style={btnStyle}
              title="Align Left"
            >
              ⬅
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('justifyCenter');
              }}
              style={btnStyle}
              title="Align Center"
            >
              ⬌
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('justifyRight');
              }}
              style={btnStyle}
              title="Align Right"
            >
              ➡
            </button>

            {/* Bullet List & Gothic Ornaments */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                runCommand('insertUnorderedList');
              }}
              style={btnStyle}
              title="Bullet List"
            >
              • List
            </button>
          </>
        )}

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('insertText', '✦');
          }}
          style={btnStyle}
          title="Insert Gothic Star ✦"
        >
          ✦
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('insertText', '🌹');
          }}
          style={btnStyle}
          title="Insert Rose 🌹"
        >
          🌹
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('removeFormat');
          }}
          style={{ ...btnStyle, color: 'var(--text-muted)' }}
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editable Area */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onFocus={() => {
            isFocusedRef.current = true;
          }}
          onBlur={() => {
            isFocusedRef.current = false;
            emitVisualChange();
          }}
          onInput={emitVisualChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              document.execCommand('insertLineBreak');
              emitVisualChange();
            }
          }}
          style={{
            minHeight: `${minHeightPx}px`,
            padding: compact ? '0.45rem 0.65rem' : '0.6rem 0.75rem',
            fontSize: compact ? '0.84rem' : '0.88rem',
            lineHeight: 1.55,
            color: 'var(--text-primary)',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            cursor: 'text'
          }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          rows={compact ? 2 : rows}
          className="form-textarea"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: 'none',
            borderRadius: 0,
            minHeight: `${minHeightPx}px`,
            padding: compact ? '0.45rem 0.65rem' : '0.6rem 0.75rem',
            fontSize: compact ? '0.82rem' : '0.86rem',
            background: 'transparent'
          }}
        />
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
  const [username, setUsername] = useState('admin');
  const [passcode, setPasscode] = useState('wedding2026');
  const [currentUser, setCurrentUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Top-level studio mode: 'builder' | 'all-text' | 'themes' | 'guests' | 'print-qrs' | 'approvals' | 'users' | 'revisions'
  const [studioMode, setStudioMode] = useState('builder');
  const [globalTextFilter, setGlobalTextFilter] = useState('');

  // User management & Approval flow state
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    passcode: '',
    displayName: '',
    role: 'editor'
  });
  const [editorProposalNote, setEditorProposalNote] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [rejectingProposalId, setRejectingProposalId] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');

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
    if (isOpen && authenticated && !hasUnsavedChanges) {
      fetchAdminData();
    }
  }, [isOpen, authenticated]);

  // Mirror every CMS state update to browser localStorage & auto-save to server after 850ms
  useEffect(() => {
    if (!cmsDb || !authenticated) return;
    try {
      window.localStorage.setItem('wedding_cms_local_backup_v1', JSON.stringify(cmsDb));
    } catch {
      // ignore storage quota errors
    }
    if (!hasUnsavedChanges) return;
    const timer = setTimeout(() => {
      publishAllChanges({ silentAutoSave: true });
    }, 850);
    return () => clearTimeout(timer);
  }, [cmsDb, hasUnsavedChanges, authenticated]);

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

  async function maybeAutoRecoverFromLocalStorage(serverDb) {
    try {
      const rawLocal = window.localStorage.getItem('wedding_cms_local_backup_v1');
      if (!rawLocal) return null;
      const localDb = JSON.parse(rawLocal);
      const serverIsDefault =
        serverDb?.siteSettings?.coupleNames === 'Elena Vance & Julian Sterling' &&
        (serverDb?.revisions || []).length <= 1;
      const localIsCustomized =
        localDb?.siteSettings?.coupleNames !== 'Elena Vance & Julian Sterling' ||
        (localDb?.revisions || []).length > 1;
      if (serverIsDefault && localIsCustomized) {
        const res = await fetch('/api/admin/import-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-passcode': passcode
          },
          body: JSON.stringify({ db: localDb })
        });
        const restored = await res.json();
        if (res.ok && restored.db) {
          setSavingStatus('✓ Auto-restored your saved edits from browser backup!');
          if (onContentUpdated) onContentUpdated();
          setTimeout(() => setSavingStatus(''), 4000);
          return restored;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  async function handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          passcode: passcode.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid credentials');
      } else {
        setCurrentUser(data.user);
        setAuthenticated(true);
        const recovered = await maybeAutoRecoverFromLocalStorage(data.db);
        const activeData = recovered || data;
        setCmsDb(activeData.db);
        setAnalytics(activeData.analytics);
        setSelectedBlockId('__HERO_BANNER__');
      }
    } catch {
      setAuthError('Could not connect to CMS server.');
    }
  }

  async function fetchAdminData() {
    try {
      const res = await fetch('/api/admin/data', {
        headers: {
          'x-admin-passcode': passcode,
          'x-cms-username': currentUser?.username || username
        }
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user) setCurrentUser(data.user);
        const recovered = await maybeAutoRecoverFromLocalStorage(data.db);
        const activeData = recovered || data;
        setCmsDb(activeData.db);
        setAnalytics(activeData.analytics);
      }
    } catch {
      // ignore
    }
  }

  async function publishAllChanges(options = {}) {
    if (!cmsDb) return;
    const silent = Boolean(options?.silentAutoSave);
    const isEditor = currentUser?.role === 'editor';
    if (silent && isEditor) {
      // Don't auto-save draft proposals on editor typing
      return;
    }
    setSavingStatus(
      isEditor
        ? 'Submitting change proposal for Admin approval...'
        : silent
        ? 'Auto-saving to disk...'
        : 'Publishing changes live...'
    );
    try {
      const res = await fetch('/api/admin/publish-all', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
          'x-cms-username': currentUser?.username || username
        },
        body: JSON.stringify({
          siteSettings: cmsDb.siteSettings,
          aboutUs: cmsDb.aboutUs,
          ceremony: cmsDb.ceremony,
          reception: cmsDb.reception,
          weddingPartyPage: cmsDb.weddingPartyPage,
          rsvpPage: cmsDb.rsvpPage,
          changeSummary: editorProposalNote || 'Visual layout and content update'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        applyThemeAndCustomColors(cmsDb.siteSettings);
        setHasUnsavedChanges(false);
        if (data.pendingApproval) {
          setSavingStatus('✓ Change proposal submitted to Admin Approval Queue!');
          setShowProposalModal(false);
          setEditorProposalNote('');
        } else {
          setSavingStatus(silent ? '✓ Auto-Saved to Disk' : '✓ All Changes Published Live! (Auto-Approved)');
        }
        if (onContentUpdated) onContentUpdated();
        setTimeout(() => setSavingStatus(''), 3500);
      } else {
        setSavingStatus(`Error: ${data.error}`);
      }
    } catch {
      setSavingStatus('Error saving changes.');
    }
  }

  async function handleApproveProposal(proposalId) {
    try {
      const res = await fetch(`/api/admin/proposals/${proposalId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
          'x-cms-username': currentUser?.username || username
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        applyThemeAndCustomColors(data.db.siteSettings);
        setSavingStatus('✓ Proposal approved & published live!');
        if (onContentUpdated) onContentUpdated();
        setTimeout(() => setSavingStatus(''), 3500);
      } else {
        alert(data.error || 'Failed to approve proposal');
      }
    } catch {
      alert('Error approving proposal.');
    }
  }

  async function handleRejectProposal(proposalId) {
    try {
      const res = await fetch(`/api/admin/proposals/${proposalId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
          'x-cms-username': currentUser?.username || username
        },
        body: JSON.stringify({ reviewNote: rejectionNote })
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        setRejectingProposalId(null);
        setRejectionNote('');
        setSavingStatus('Proposal rejected.');
        setTimeout(() => setSavingStatus(''), 3000);
      } else {
        alert(data.error || 'Failed to reject proposal');
      }
    } catch {
      alert('Error rejecting proposal.');
    }
  }

  async function handleDeleteProposal(proposalId) {
    try {
      const res = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passcode': passcode,
          'x-cms-username': currentUser?.username || username
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setSavingStatus('Proposal removed.');
        setTimeout(() => setSavingStatus(''), 2500);
      }
    } catch {
      // ignore
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
          'x-cms-username': currentUser?.username || username
        },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setShowNewUserModal(false);
        setNewUserForm({ username: '', passcode: '', displayName: '', role: 'editor' });
        setSavingStatus(`✓ User account created!`);
        setTimeout(() => setSavingStatus(''), 3000);
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch {
      alert('Error creating user.');
    }
  }

  async function handleDeleteUser(userId, userToDelete) {
    if (!window.confirm(`Delete CMS user account "${userToDelete}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passcode': passcode,
          'x-cms-username': currentUser?.username || username
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setSavingStatus(`✓ User account deleted.`);
        setTimeout(() => setSavingStatus(''), 3000);
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch {
      alert('Error deleting user.');
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

  // Login Gate for /cmsdesk
  if (!authenticated) {
    return (
      <div className="cms-overlay">
        <div
          className="surface-card"
          style={{
            maxWidth: '490px',
            width: '100%',
            margin: 'auto',
            textAlign: 'center',
            padding: '2.5rem 2.25rem',
            border: '1.5px solid var(--border-gold)',
            borderRadius: '180px 180px 22px 22px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.92)'
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
              margin: '0 auto 1.15rem'
            }}
          >
            <Lock size={26} />
          </div>
          <span className="section-kicker">Private CMS Portal • /cmsdesk</span>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '0.35rem' }}>Gothic Noir CMS Desk</h2>
          <GothicRoseArchOrnament width={170} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.35rem' }}>
            Sign in with your role-based credentials. <strong>Admins</strong> have automatic live approval. <strong>Editors</strong> submit draft change proposals for review.
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '0.85rem' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Username</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)' }}>admin or editor</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or editor"
                required
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label className="form-label">Passcode / Password</label>
              <input
                type="password"
                className="form-input"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode"
                required
              />
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                marginBottom: '1.25rem',
                fontSize: '0.74rem',
                textAlign: 'left',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>
                Quick Logins:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.22rem 0.55rem', fontSize: '0.72rem' }}
                  onClick={() => {
                    setUsername('admin');
                    setPasscode('wedding2026');
                  }}
                >
                  👑 Admin (Auto-Approve)
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.22rem 0.55rem', fontSize: '0.72rem' }}
                  onClick={() => {
                    setUsername('editor');
                    setPasscode('edit2026');
                  }}
                >
                  📝 Editor (Approval Flow)
                </button>
              </div>
            </div>

            {authError && (
              <div style={{ color: '#f87171', fontSize: '0.86rem', marginBottom: '1rem', fontWeight: 600 }}>
                {authError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                Exit to Website
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Sign In to CMS Desk
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
                    <label className="form-label">Bio (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={3} value={item.bio || ''} onChange={(val) => updateItem(idx, 'bio', val)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fun Fact</label>
                    <WysiwygEditor compact value={item.funFact || ''} onChange={(val) => updateItem(idx, 'funFact', val)} />
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
                    <WysiwygEditor compact value={item.title || ''} onChange={(val) => updateItem(idx, 'title', val)} />
                  </div>
                  <ImageFieldUploader
                    label="Milestone Photo"
                    value={item.image}
                    cropValue={item.imageCrop}
                    onChange={(val) => updateItem(idx, 'image', val)}
                    onCropChange={(c) => updateItem(idx, 'imageCrop', c)}
                  />
                  <div className="form-group">
                    <label className="form-label">Story Description (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={3} value={item.description || ''} onChange={(val) => updateItem(idx, 'description', val)} />
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
                    <label className="form-label">Bio (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={2} value={item.bio || ''} onChange={(val) => updateItem(idx, 'bio', val)} />
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
                    <label className="form-label">Caption (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor compact value={item.caption || ''} onChange={(val) => updateItem(idx, 'caption', val)} />
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
                    <WysiwygEditor compact value={item.title || ''} onChange={(val) => updateItem(idx, 'title', val)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={2} value={item.description || item.detail || ''} onChange={(val) => updateItem(idx, 'description', val)} />
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
                    <WysiwygEditor compact value={item.title || ''} onChange={(val) => updateItem(idx, 'title', val)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Text (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={3} value={item.description || ''} onChange={(val) => updateItem(idx, 'description', val)} />
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
                    <label className="form-label">Dish Description (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={2} value={item.description || ''} onChange={(val) => updateItem(idx, 'description', val)} />
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
                    <WysiwygEditor compact value={item.title || ''} onChange={(val) => updateItem(idx, 'title', val)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={2} value={item.description || ''} onChange={(val) => updateItem(idx, 'description', val)} />
                  </div>
                </>
              )}

              {block.type === 'accommodations' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Hotel Name</label>
                    <WysiwygEditor compact value={item.name || ''} onChange={(val) => updateItem(idx, 'name', val)} />
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
                    <label className="form-label">Notes (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={2} value={item.notes || ''} onChange={(val) => updateItem(idx, 'notes', val)} />
                  </div>
                </>
              )}

              {block.type === 'faq_grid' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Question</label>
                    <WysiwygEditor compact value={item.question || ''} onChange={(val) => updateItem(idx, 'question', val)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Answer (WYSIWYG & Line Breaks)</label>
                    <WysiwygEditor rows={3} value={item.answer || ''} onChange={(val) => updateItem(idx, 'answer', val)} />
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
                onClick={() => setStudioMode('approvals')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: studioMode === 'approvals' ? 'var(--accent-primary)' : 'transparent',
                  color: studioMode === 'approvals' ? '#fff' : 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <ShieldCheck size={15} />
                <span>Approvals</span>
                {Boolean((cmsDb?.pendingProposals || []).filter((p) => p.status === 'pending').length) && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      marginLeft: '0.2rem'
                    }}
                  >
                    {(cmsDb?.pendingProposals || []).filter((p) => p.status === 'pending').length}
                  </span>
                )}
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => setStudioMode('users')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '9px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    background: studioMode === 'users' ? 'var(--accent-primary)' : 'transparent',
                    color: studioMode === 'users' ? '#fff' : 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Users size={15} /> CMS Logins ({cmsDb?.cmsUsers?.length || 0})
                </button>
              )}

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {/* Logged in User & Role Pill */}
            {currentUser && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.34rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  background:
                    currentUser.role === 'admin' ? 'rgba(212, 168, 83, 0.16)' : 'rgba(59, 130, 246, 0.16)',
                  border:
                    currentUser.role === 'admin' ? '1px solid var(--border-gold)' : '1px solid #3b82f6',
                  color: currentUser.role === 'admin' ? 'var(--accent-secondary)' : '#93c5fd'
                }}
              >
                {currentUser.role === 'admin' ? <Crown size={13} /> : <Edit3 size={13} />}
                <span>
                  <strong>{currentUser.displayName || currentUser.username}</strong> (
                  {currentUser.role === 'admin' ? 'Admin • Auto-Approved' : 'Editor • Approval Required'})
                </span>
              </div>
            )}

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

            {/* 1-Click Under Construction Mode Toggle + Edit Button */}
            {cmsDb && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: cmsDb.siteSettings?.underConstruction?.enabled
                    ? 'rgba(212, 168, 83, 0.2)'
                    : 'var(--bg-secondary)',
                  border: cmsDb.siteSettings?.underConstruction?.enabled
                    ? '1.5px solid var(--accent-secondary)'
                    : '1px solid var(--border-color)',
                  padding: '0.32rem 0.7rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem'
                }}
              >
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.38rem', cursor: 'pointer', fontWeight: 700, color: cmsDb.siteSettings?.underConstruction?.enabled ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(cmsDb.siteSettings?.underConstruction?.enabled)}
                    onChange={(e) => {
                      const nextEnabled = e.target.checked;
                      setHasUnsavedChanges(true);
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: {
                          ...cmsDb.siteSettings,
                          underConstruction: {
                            ...(cmsDb.siteSettings?.underConstruction || {}),
                            enabled: nextEnabled
                          }
                        }
                      });
                      if (nextEnabled) {
                        setStudioMode('builder');
                        setBuilderPage('underConstruction');
                      }
                    }}
                  />
                  <span>
                    🚧 Under Construction: {cmsDb.siteSettings?.underConstruction?.enabled ? 'ON' : 'OFF'}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStudioMode('builder');
                    setBuilderPage('underConstruction');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-secondary)',
                    textDecoration: 'underline',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Customize
                </button>
              </div>
            )}

            {currentUser?.role === 'editor' ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowProposalModal(true)}
                style={{
                  background: '#2563eb',
                  borderColor: '#3b82f6',
                  padding: '0.52rem 1.15rem',
                  fontSize: '0.84rem',
                  boxShadow: hasUnsavedChanges ? '0 0 18px rgba(37, 99, 235, 0.6)' : 'none'
                }}
              >
                <Send size={15} /> Submit for Admin Approval
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => publishAllChanges({ silentAutoSave: false })}
                style={{
                  padding: '0.52rem 1.15rem',
                  fontSize: '0.84rem',
                  boxShadow: hasUnsavedChanges ? '0 0 18px rgba(212, 168, 83, 0.6)' : 'none'
                }}
              >
                <Save size={15} /> {hasUnsavedChanges ? 'Publish Changes Live' : 'All Changes Published ✓'}
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              title="Log out of CMS Desk"
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
              onClick={() => {
                setAuthenticated(false);
                setCurrentUser(null);
              }}
            >
              <LogOut size={14} /> Log Out
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
              onClick={async () => {
                if (hasUnsavedChanges && currentUser?.role === 'admin') {
                  await publishAllChanges({ silentAutoSave: false });
                }
                onClose();
              }}
            >
              <X size={15} /> Exit Desk
            </button>
          </div>
        </header>

        {/* UNIVERSAL QUICK WYSIWYG & LINE BREAK HELPER BAR (WORKS FOR ANY FOCUSED INPUT OR WYSIWYG BOX) */}
        <div
          style={{
            background: '#0c080c',
            borderBottom: '1px solid var(--border-gold)',
            padding: '0.32rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.73rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>
              ✨ WYSIWYG & Line Break Bar:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Every multi-line editor has a built-in Visual WYSIWYG toolbar (or press <strong>Enter</strong> for a new line). For any single-line input box you click into, use these 1-click buttons:
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.28rem', flexWrap: 'wrap' }}>
            {[
              { label: '↵ Line Break', snippet: '<br />', accent: true, title: 'Insert a line break at cursor in any text input' },
              { label: 'B', wrap: ['<strong>', '</strong>'], bold: true, title: 'Wrap selected text in Bold' },
              { label: 'I', wrap: ['<em>', '</em>'], italic: true, title: 'Wrap selected text in Italic' },
              { label: 'U', wrap: ['<u>', '</u>'], underline: true, title: 'Wrap selected text in Underline' },
              { label: '● Gold', wrap: ['<span style="color: var(--accent-secondary)">', '</span>'], color: '#d4a853', title: 'Gold text color' },
              { label: '● Rose', wrap: ['<span style="color: #e63956">', '</span>'], color: '#e63956', title: 'Crimson rose text color' },
              { label: '✦', snippet: ' ✦ ', title: 'Insert Gothic star ornament' },
              { label: '🌹', snippet: ' 🌹 ', title: 'Insert Gothic rose' }
            ].map((btn, bIdx) => (
              <button
                key={bIdx}
                type="button"
                title={btn.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const el = document.activeElement;
                  if (!el) return;
                  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    const start = el.selectionStart ?? el.value.length;
                    const end = el.selectionEnd ?? el.value.length;
                    const selected = el.value.slice(start, end);
                    const replacement = btn.wrap
                      ? `${btn.wrap[0]}${selected || 'Text'}${btn.wrap[1]}`
                      : btn.snippet;
                    const nextVal = el.value.slice(0, start) + replacement + el.value.slice(end);
                    triggerReactInputChange(el, nextVal);
                    requestAnimationFrame(() => {
                      el.focus();
                      const pos = start + replacement.length;
                      try {
                        el.setSelectionRange(pos, pos);
                      } catch {
                        // ignore on inputs that don't support selectionRange
                      }
                    });
                  } else if (el.isContentEditable) {
                    if (btn.snippet === '<br />') {
                      document.execCommand('insertHTML', false, '<br><br>');
                    } else if (btn.label === 'B') {
                      document.execCommand('bold', false, null);
                    } else if (btn.label === 'I') {
                      document.execCommand('italic', false, null);
                    } else if (btn.label === 'U') {
                      document.execCommand('underline', false, null);
                    } else if (btn.snippet) {
                      document.execCommand('insertText', false, btn.snippet);
                    }
                  }
                }}
                style={{
                  background: btn.accent ? 'rgba(212, 168, 83, 0.22)' : 'rgba(255,255,255,0.05)',
                  border: btn.accent ? '1px solid var(--border-gold)' : '1px solid var(--border-color)',
                  color: btn.color || (btn.accent ? 'var(--accent-secondary)' : 'var(--text-primary)'),
                  borderRadius: '6px',
                  padding: '0.18rem 0.48rem',
                  fontSize: '0.71rem',
                  fontWeight: btn.bold || btn.accent ? 800 : 600,
                  fontStyle: btn.italic ? 'italic' : 'normal',
                  textDecoration: btn.underline ? 'underline' : 'none',
                  cursor: 'pointer'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* PERSISTENT NOTICE WHEN SIGNED IN AS EDITOR */}
        {currentUser?.role === 'editor' && (
          <div
            style={{
              background: 'rgba(37, 99, 235, 0.18)',
              borderBottom: '1px solid #3b82f6',
              padding: '0.45rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: '#bfdbfe',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={15} color="#60a5fa" />
              <span>
                <strong>Editor Mode Active:</strong> You can edit any page or text box. When you click <strong>"Submit for Admin Approval"</strong>, your proposed changes will be sent to the Change Approval Queue for an Administrator to approve and publish live.
              </span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem', borderColor: '#3b82f6', color: '#93c5fd' }}
              onClick={() => setStudioMode('approvals')}
            >
              View My Proposals ({ (cmsDb?.pendingProposals || []).filter((p) => p.status === 'pending').length } Pending) →
            </button>
          </div>
        )}

        {/* EDITOR PROPOSAL SUBMISSION MODAL */}
        {showProposalModal && (
          <div
            className="cms-modal-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <div
              className="surface-card"
              style={{
                maxWidth: '520px',
                width: '100%',
                padding: '1.75rem',
                border: '2px solid #3b82f6',
                borderRadius: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={20} color="#60a5fa" />
                  <h3 style={{ fontSize: '1.4rem', color: '#93c5fd', margin: 0 }}>
                    Submit Changes for Admin Approval
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                As an <strong>Editor</strong>, your changes will not alter the live website immediately. Instead, they are packaged into a Change Proposal for an Administrator to inspect and approve.
              </p>
              <div className="form-group">
                <label className="form-label">Brief Description of Your Changes (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Updated Ceremony schedule and cocktail bar drinks"
                  value={editorProposalNote}
                  onChange={(e) => setEditorProposalNote(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowProposalModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: '#2563eb', borderColor: '#3b82f6' }}
                  onClick={() => publishAllChanges({ silentAutoSave: false })}
                >
                  <Send size={15} /> Send Proposal to Queue
                </button>
              </div>
            </div>
          </div>
        )}
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
                          <WysiwygEditor
                            compact={!f.multiline}
                            rows={f.multiline ? 2 : 1}
                            value={cmsDb.siteSettings?.[f.key] ?? ''}
                            onChange={(val) => {
                              setHasUnsavedChanges(true);
                              setCmsDb({
                                ...cmsDb,
                                siteSettings: { ...cmsDb.siteSettings, [f.key]: val }
                              });
                            }}
                          />
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
                          <WysiwygEditor
                            compact
                            value={pageObj.headline || ''}
                            onChange={(val) => updatePageField(pg.key, 'headline', val)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Page Top Eyebrow / Kicker</label>
                          <WysiwygEditor
                            compact
                            value={pageObj.kicker || ''}
                            onChange={(val) => updatePageField(pg.key, 'kicker', val)}
                          />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                          <label className="form-label">Page Intro Subtitle (WYSIWYG & Line Breaks)</label>
                          <WysiwygEditor
                            rows={2}
                            value={pageObj.subheadline || ''}
                            onChange={(val) => updatePageField(pg.key, 'subheadline', val)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Bottom Banner Title (if enabled)</label>
                          <WysiwygEditor
                            compact
                            value={pageObj.bottomBannerTitle ?? 'Join Us Under the October Moon'}
                            onChange={(val) => updatePageField(pg.key, 'bottomBannerTitle', val)}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Bottom Banner Subtitle</label>
                          <WysiwygEditor
                            compact
                            value={pageObj.bottomBannerSubtitle ?? ''}
                            onChange={(val) => updatePageField(pg.key, 'bottomBannerSubtitle', val)}
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
                                        <label className="form-label">Bio (WYSIWYG & Line Breaks)</label>
                                        <WysiwygEditor rows={2} value={item.bio || ''} onChange={(val) => updateItemInPage('bio', val)} />
                                      </div>
                                    )}
                                    {'funFact' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Fun Fact</label>
                                        <WysiwygEditor compact value={item.funFact || ''} onChange={(val) => updateItemInPage('funFact', val)} />
                                      </div>
                                    )}
                                    {'description' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Description (WYSIWYG & Line Breaks)</label>
                                        <WysiwygEditor rows={2} value={item.description || ''} onChange={(val) => updateItemInPage('description', val)} />
                                      </div>
                                    )}
                                    {'answer' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Answer (WYSIWYG & Line Breaks)</label>
                                        <WysiwygEditor rows={2} value={item.answer || ''} onChange={(val) => updateItemInPage('answer', val)} />
                                      </div>
                                    )}
                                    {'caption' in item && (
                                      <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                                        <label className="form-label">Photo Caption</label>
                                        <WysiwygEditor compact value={item.caption || ''} onChange={(val) => updateItemInPage('caption', val)} />
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
                    { id: 'weddingPartyPage', label: '05 • Wedding Party VIP Page', icon: Crown },
                    { id: 'underConstruction', label: '06 • 🚧 Under Construction Mode', icon: Sparkles }
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
                  <WysiwygEditor
                    rows={2}
                    value={cmsDb.siteSettings?.heroTagline || ''}
                    onChange={(val) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: { ...cmsDb.siteSettings, heroTagline: val }
                      });
                    }}
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
                    <WysiwygEditor
                      rows={2}
                      placeholder="Page Subheadline"
                      value={currentPageObj.subheadline || ''}
                      onChange={(val) => updatePageField(builderPage, 'subheadline', val)}
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

              {builderPage === 'underConstruction' ? (
                <div
                  style={{
                    borderRadius: '20px',
                    border: '2px solid var(--accent-secondary)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      background: '#080508',
                      borderBottom: '1px solid var(--border-gold)',
                      padding: '0.55rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem'
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                      🚧 LIVE PREVIEW: UNDER CONSTRUCTION / SAVE-THE-DATE SCREEN
                    </span>
                    <span style={{ color: cmsDb.siteSettings?.underConstruction?.enabled ? '#34d399' : 'var(--text-muted)', fontWeight: 700 }}>
                      {cmsDb.siteSettings?.underConstruction?.enabled ? '● ACTIVE FOR VISITORS' : '○ CURRENTLY OFF (NORMAL SITE LIVE)'}
                    </span>
                  </div>
                  <UnderConstructionView
                    previewOnly={true}
                    siteSettings={cmsDb.siteSettings}
                    aboutUs={cmsDb.aboutUs}
                    rsvpPage={cmsDb.rsvpPage}
                    reception={cmsDb.reception}
                  />
                </div>
              ) : (
                <>
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
                        <span className="hero-eyebrow"><RichText text={cmsDb.siteSettings?.heroEyebrow} /></span>
                        <h1 className="hero-couple-names" style={{ fontSize: '2.35rem' }}>
                          <RichText text={cmsDb.siteSettings?.coupleNames} />
                        </h1>
                        <GothicRoseArchOrnament width={180} />
                        <p className="hero-tagline"><RichText text={cmsDb.siteSettings?.heroTagline} /></p>
                        <div className="hero-meta-pills">
                          <span className="hero-pill">
                            <Calendar size={14} color="var(--accent-secondary)" /> <RichText text={cmsDb.siteSettings?.weddingDateDisplay} />
                          </span>
                          <span className="hero-pill">
                            <MapPin size={14} color="var(--accent-secondary)" /> <RichText text={cmsDb.siteSettings?.locationSummary} />
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
                              <span className="big-tab-step" style={{ fontSize: '0.65rem' }}><RichText text={tab.step} /></span>
                            </div>
                            <div>
                              <div className="big-tab-title" style={{ fontSize: '1.05rem' }}><RichText text={tab.title} /></div>
                              <div className="big-tab-subtitle" style={{ fontSize: '0.72rem' }}><RichText text={tab.subtitle} /></div>
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
                </>
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
              {builderPage === 'underConstruction' && (
                <div>
                  <div
                    style={{
                      background: cmsDb.siteSettings?.underConstruction?.enabled
                        ? 'rgba(16, 185, 129, 0.14)'
                        : 'var(--bg-accent-subtle)',
                      border: '2px solid var(--accent-secondary)',
                      borderRadius: '14px',
                      padding: '1rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.96rem', color: 'var(--accent-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(cmsDb.siteSettings?.underConstruction?.enabled)}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({
                            ...cmsDb,
                            siteSettings: {
                              ...cmsDb.siteSettings,
                              underConstruction: {
                                ...(cmsDb.siteSettings?.underConstruction || {}),
                                enabled: e.target.checked
                              }
                            }
                          });
                        }}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>
                        🚧 Enable Under Construction / Save-the-Date Mode
                      </span>
                    </label>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem', marginBottom: 0 }}>
                      When enabled and published, visitors will see this romantic Save-the-Date & Under Construction screen with your names, countdown, and Bride & Groom portraits while you finish building your site!
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Couple Full Names (Displayed at Top)</label>
                    <WysiwygEditor
                      compact
                      rows={1}
                      value={cmsDb.siteSettings?.coupleNames || ''}
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, coupleNames: val }
                        });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Top Eyebrow Badge</label>
                    <WysiwygEditor
                      compact
                      rows={1}
                      value={cmsDb.siteSettings?.underConstruction?.eyebrow ?? '✦ Save The Date • Full Wedding Website Unveiling Soon ✦'}
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: {
                            ...cmsDb.siteSettings,
                            underConstruction: {
                              ...(cmsDb.siteSettings?.underConstruction || {}),
                              eyebrow: val
                            }
                          }
                        });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Under Construction Headline</label>
                    <WysiwygEditor
                      compact
                      rows={1}
                      value={cmsDb.siteSettings?.underConstruction?.headline ?? 'Our Wedding Website Is Currently Under Construction'}
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: {
                            ...cmsDb.siteSettings,
                            underConstruction: {
                              ...(cmsDb.siteSettings?.underConstruction || {}),
                              headline: val
                            }
                          }
                        });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Under Construction Message / Subheadline</label>
                    <WysiwygEditor
                      rows={3}
                      value={
                        cmsDb.siteSettings?.underConstruction?.subheadline ??
                        'We are busy putting the finishing touches on our ceremony details, candlelit reception menu, and travel guide. Save our date below and check back soon!'
                      }
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: {
                            ...cmsDb.siteSettings,
                            underConstruction: {
                              ...(cmsDb.siteSettings?.underConstruction || {}),
                              subheadline: val
                            }
                          }
                        });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bottom Footer Note</label>
                    <WysiwygEditor
                      compact
                      rows={1}
                      value={cmsDb.siteSettings?.underConstruction?.footerNote ?? 'Questions in the meantime? Reach out to us directly!'}
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: {
                            ...cmsDb.siteSettings,
                            underConstruction: {
                              ...(cmsDb.siteSettings?.underConstruction || {}),
                              footerNote: val
                            }
                          }
                        });
                      }}
                    />
                  </div>

                  {/* Display Toggles */}
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.84rem' }}>
                      <input
                        type="checkbox"
                        checked={cmsDb.siteSettings?.underConstruction?.showCouplePhotos !== false}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({
                            ...cmsDb,
                            siteSettings: {
                              ...cmsDb.siteSettings,
                              underConstruction: {
                                ...(cmsDb.siteSettings?.underConstruction || {}),
                                showCouplePhotos: e.target.checked
                              }
                            }
                          });
                        }}
                      />
                      <span>Display Bride & Groom Portrait Archways</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.84rem' }}>
                      <input
                        type="checkbox"
                        checked={cmsDb.siteSettings?.underConstruction?.showCountdown !== false}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({
                            ...cmsDb,
                            siteSettings: {
                              ...cmsDb.siteSettings,
                              underConstruction: {
                                ...(cmsDb.siteSettings?.underConstruction || {}),
                                showCountdown: e.target.checked
                              }
                            }
                          });
                        }}
                      />
                      <span>Display Live Days/Hours/Minutes/Seconds Countdown</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.84rem' }}>
                      <input
                        type="checkbox"
                        checked={cmsDb.siteSettings?.underConstruction?.showDateAndLocation !== false}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({
                            ...cmsDb,
                            siteSettings: {
                              ...cmsDb.siteSettings,
                              underConstruction: {
                                ...(cmsDb.siteSettings?.underConstruction || {}),
                                showDateAndLocation: e.target.checked
                              }
                            }
                          });
                        }}
                      />
                      <span>Display Wedding Date & Location Pills</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.84rem' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(cmsDb.siteSettings?.underConstruction?.allowRsvpAccess)}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({
                            ...cmsDb,
                            siteSettings: {
                              ...cmsDb.siteSettings,
                              underConstruction: {
                                ...(cmsDb.siteSettings?.underConstruction || {}),
                                allowRsvpAccess: e.target.checked
                              }
                            }
                          });
                        }}
                      />
                      <span>Allow Guests with QR Codes to Unlock Early RSVP</span>
                    </label>
                  </div>

                  {/* Direct Bride & Groom Names & Portrait Photos Editor */}
                  {(() => {
                    const coupleIdx = (cmsDb.aboutUs?.blocks || []).findIndex((b) => b.type === 'couple_profiles');
                    const coupleBlock = coupleIdx !== -1 ? cmsDb.aboutUs.blocks[coupleIdx] : null;
                    if (!coupleBlock) return null;

                    const updatePartnerItem = (pIdx, field, val) => {
                      const nextBlocks = [...cmsDb.aboutUs.blocks];
                      const nextItems = [...(nextBlocks[coupleIdx].items || [])];
                      nextItems[pIdx] = { ...nextItems[pIdx], [field]: val };
                      nextBlocks[coupleIdx] = { ...nextBlocks[coupleIdx], items: nextItems };
                      updateBlocksForPage('aboutUs', nextBlocks);
                    };

                    return (
                      <div
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-gold)',
                          borderRadius: '14px',
                          padding: '0.95rem'
                        }}
                      >
                        <div className="form-label" style={{ color: 'var(--accent-secondary)', marginBottom: '0.65rem' }}>
                          Bride & Groom Names & Portraits (Used on Under Construction & About Us)
                        </div>
                        {(coupleBlock.items || []).map((person, pIdx) => (
                          <div
                            key={person.id || pIdx}
                            style={{
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '12px',
                              padding: '0.8rem',
                              marginBottom: '0.75rem'
                            }}
                          >
                            <div className="grid-2" style={{ gap: '0.5rem' }}>
                              <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={person.name || ''}
                                  onChange={(e) => updatePartnerItem(pIdx, 'name', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Role Badge</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={person.role || ''}
                                  onChange={(e) => updatePartnerItem(pIdx, 'role', e.target.value)}
                                />
                              </div>
                            </div>
                            <ImageFieldUploader
                              label="Portrait Photo (Upload & Line Up / Crop)"
                              value={person.photo}
                              cropValue={person.photoCrop}
                              onChange={(val) => updatePartnerItem(pIdx, 'photo', val)}
                              onCropChange={(c) => updatePartnerItem(pIdx, 'photoCrop', c)}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {(builderPage === 'heroTabs' || (selectedBlockId === '__HERO_BANNER__' && builderPage !== 'underConstruction')) && (
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
                    <WysiwygEditor
                      compact
                      rows={1}
                      value={cmsDb.siteSettings.heroEyebrow || ''}
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, heroEyebrow: val } });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Couple Full Names</label>
                    <WysiwygEditor
                      compact
                      rows={1}
                      value={cmsDb.siteSettings.coupleNames || ''}
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, coupleNames: val } });
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
                    <WysiwygEditor
                      rows={2}
                      value={cmsDb.siteSettings.heroTagline || ''}
                      onChange={(val) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, heroTagline: val } });
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
                    <WysiwygEditor
                      compact
                      rows={1}
                      value={currentPageObj.headline || ''}
                      onChange={(val) => updatePageField(builderPage, 'headline', val)}
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
                    <WysiwygEditor
                      rows={2}
                      value={currentPageObj.subheadline ?? ''}
                      onChange={(val) => updatePageField(builderPage, 'subheadline', val)}
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
                            <WysiwygEditor
                              rows={2}
                              value={currentPageObj.scannerSubtitle ?? ''}
                              onChange={(val) => updatePageField('rsvpPage', 'scannerSubtitle', val)}
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
                              <WysiwygEditor
                                compact
                                rows={1}
                                value={currentPageObj.bottomBannerTitle ?? 'Join Us Under the October Moon'}
                                onChange={(val) => updatePageField(builderPage, 'bottomBannerTitle', val)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Bottom Banner Subtitle</label>
                              <WysiwygEditor
                                rows={2}
                                value={
                                  currentPageObj.bottomBannerSubtitle ??
                                  'Explore our candlelit ceremony details, autumn feast menu, or scan your invitation QR code to RSVP.'
                                }
                                onChange={(val) => updatePageField(builderPage, 'bottomBannerSubtitle', val)}
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
                        <WysiwygEditor
                          compact
                          rows={1}
                          value={selectedBlock.kicker || ''}
                          onChange={(val) => updateSelectedBlock(builderPage, { kicker: val })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Section Headline</label>
                        <WysiwygEditor
                          compact
                          rows={1}
                          value={selectedBlock.title || ''}
                          onChange={(val) => updateSelectedBlock(builderPage, { title: val })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Section Subtitle</label>
                        <WysiwygEditor
                          rows={2}
                          value={selectedBlock.subtitle || ''}
                          onChange={(val) => updateSelectedBlock(builderPage, { subtitle: val })}
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
                        <WysiwygEditor
                          compact
                          rows={1}
                          value={selectedBlock.settings?.noteLabel || ''}
                          onChange={(val) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), noteLabel: val };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Romantic Quote</label>
                        <WysiwygEditor
                          rows={2}
                          value={selectedBlock.settings?.quote || ''}
                          onChange={(val) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), quote: val };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Subtext Below Quote</label>
                        <WysiwygEditor
                          compact
                          rows={1}
                          value={selectedBlock.settings?.subtext || ''}
                          onChange={(val) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), subtext: val };
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
                        <WysiwygEditor
                          compact
                          rows={1}
                          value={selectedBlock.settings?.venueName || ''}
                          onChange={(val) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), venueName: val };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Venue Address</label>
                        <WysiwygEditor
                          compact
                          rows={1}
                          value={selectedBlock.settings?.venueAddress || selectedBlock.settings?.address || ''}
                          onChange={(val) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), venueAddress: val, address: val };
                              return b;
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Venue Description / Notes Paragraph (Optional)</label>
                        <WysiwygEditor
                          rows={2}
                          placeholder="Add optional notes about the venue, attire, or arrival..."
                          value={selectedBlock.settings?.description || selectedBlock.settings?.attireNote || ''}
                          onChange={(val) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), description: val, attireNote: val };
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
                        <WysiwygEditor
                          rows={4}
                          value={selectedBlock.settings?.bodyText || ''}
                          onChange={(val) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), bodyText: val };
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.5rem' }}>Recent CMS Edits, Backups & Guest RSVP Activity</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    All edits auto-save to <code>C:\docker\wedding-data\db.json</code> (outside the code folder) + your browser backup so updates never touch your data.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(cmsDb, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `wedding-website-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download size={15} /> Download Backup (.json)
                  </button>

                  <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={15} /> Restore Backup (.json)
                    <input
                      type="file"
                      accept=".json,application/json"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const text = await file.text();
                          const parsed = JSON.parse(text);
                          const res = await fetch('/api/admin/import-db', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-admin-passcode': passcode
                            },
                            body: JSON.stringify({ db: parsed })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setCmsDb(data.db);
                            setAnalytics(data.analytics);
                            setHasUnsavedChanges(false);
                            applyThemeAndCustomColors(data.db.siteSettings);
                            setSavingStatus('✓ Backup file restored & saved to disk!');
                            if (onContentUpdated) onContentUpdated();
                            setTimeout(() => setSavingStatus(''), 4000);
                          }
                        } catch {
                          alert('Invalid backup JSON file.');
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    className="btn-danger"
                    onClick={async () => {
                      if (!window.confirm('Reset all wedding website content, sections, and sample guests to factory defaults?')) return;
                      window.localStorage.removeItem('wedding_cms_local_backup_v1');
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

        {/* ================================================================= */}
        {/* MODE 5: CHANGE APPROVAL QUEUE (ADMIN & EDITOR FLOW)               */}
        {/* ================================================================= */}
        {studioMode === 'approvals' && cmsDb && (
          <div className="cms-scroll-body">
            <div className="section-header-box" style={{ marginBottom: '1.5rem' }}>
              <span className="section-kicker">Multi-Role Governance</span>
              <h2 className="section-title" style={{ fontSize: '2.3rem' }}>
                Change Approval Queue
              </h2>
              <GothicRoseArchOrnament width={210} />
              <p className="section-subtitle">
                {currentUser?.role === 'admin'
                  ? 'Review, approve, or reject website changes submitted by Editors. Approved proposals are published live immediately.'
                  : 'Track the status of your submitted change proposals. Once an Administrator approves your proposal, it goes live automatically.'}
              </p>
            </div>

            <div style={{ maxWidth: '980px', margin: '0 auto' }}>
              {(!cmsDb.pendingProposals || cmsDb.pendingProposals.length === 0) ? (
                <div
                  className="surface-card"
                  style={{
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    border: '1px dashed var(--border-gold)'
                  }}
                >
                  <ShieldCheck size={40} color="var(--accent-secondary)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>No Proposals in Queue</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {currentUser?.role === 'admin'
                      ? 'No editor changes are currently pending review. When an Editor submits changes, they will appear here.'
                      : 'You have not submitted any change proposals yet. Edit any page in the Visual Builder and click "Submit for Admin Approval" to send a draft.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {cmsDb.pendingProposals.map((proposal) => {
                    const isPending = proposal.status === 'pending';
                    const isApproved = proposal.status === 'approved';
                    const isRejected = proposal.status === 'rejected';
                    const sections = Object.keys(proposal.proposedData || {});

                    return (
                      <div
                        key={proposal.id}
                        className="surface-card"
                        style={{
                          border: isPending
                            ? '1.5px solid var(--border-gold)'
                            : isApproved
                            ? '1px solid #10b981'
                            : '1px solid #ef4444',
                          background: isPending
                            ? 'var(--bg-accent-subtle)'
                            : 'var(--bg-card)',
                          padding: '1.25rem 1.5rem'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.35rem' }}>
                              <span
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  padding: '0.22rem 0.65rem',
                                  borderRadius: '999px',
                                  background: isPending
                                    ? 'rgba(217, 119, 6, 0.25)'
                                    : isApproved
                                    ? 'rgba(16, 185, 129, 0.25)'
                                    : 'rgba(239, 68, 68, 0.25)',
                                  color: isPending ? '#fde68a' : isApproved ? '#a7f3d0' : '#fca5a5',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                              >
                                {isPending && <Clock size={12} />}
                                {isApproved && <CheckCircle2 size={12} />}
                                {isRejected && <XCircle size={12} />}
                                <span>
                                  {isPending ? 'Pending Admin Review' : isApproved ? 'Approved & Published Live' : 'Rejected'}
                                </span>
                              </span>

                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {new Date(proposal.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '1.35rem', margin: '0 0 0.35rem 0' }}>
                              {proposal.summary || 'Content & Layout Update Proposal'}
                            </h4>

                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              Submitted by <strong>{proposal.submittedBy?.displayName || 'Editor'}</strong> (
                              @{proposal.submittedBy?.username || 'editor'}) • Role: {proposal.submittedBy?.role || 'editor'}
                            </div>
                          </div>

                          {currentUser?.role === 'admin' && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-primary"
                                    style={{
                                      background: '#059669',
                                      borderColor: '#10b981',
                                      padding: '0.45rem 0.95rem',
                                      fontSize: '0.8rem'
                                    }}
                                    onClick={() => handleApproveProposal(proposal.id)}
                                  >
                                    <Check size={14} /> Approve & Publish Live
                                  </button>

                                  <button
                                    type="button"
                                    className="btn-danger"
                                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                                    onClick={() => setRejectingProposalId(proposal.id)}
                                  >
                                    <X size={14} /> Reject
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                title="Delete proposal record"
                                className="btn-secondary"
                                style={{ padding: '0.45rem 0.65rem' }}
                                onClick={() => handleDeleteProposal(proposal.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        {sections.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                              Affected Sections:
                            </span>
                            {sections.map((sec) => (
                              <span
                                key={sec}
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '6px',
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--accent-secondary)'
                                }}
                              >
                                {sec}
                              </span>
                            ))}
                          </div>
                        )}

                        {proposal.reviewNote && (
                          <div
                            style={{
                              marginTop: '0.75rem',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              fontSize: '0.8rem',
                              color: '#fca5a5'
                            }}
                          >
                            <strong>Reviewer Note:</strong> {proposal.reviewNote}
                          </div>
                        )}

                        {proposal.reviewedBy && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Reviewed by {proposal.reviewedBy.displayName} (@{proposal.reviewedBy.username}) on{' '}
                            {new Date(proposal.reviewedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rejection Note Modal */}
            {rejectingProposalId && (
              <div
                className="cms-modal-backdrop"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.85)',
                  zIndex: 99999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
              >
                <div className="surface-card" style={{ maxWidth: '480px', width: '100%', padding: '1.5rem', border: '2px solid #ef4444' }}>
                  <h4 style={{ fontSize: '1.3rem', color: '#fca5a5', marginBottom: '0.5rem' }}>
                    Reject Change Proposal
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Optionally add a note explaining why this proposal was rejected so the Editor knows what to adjust.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Feedback / Reason for Rejection</label>
                    <textarea
                      rows={3}
                      className="form-textarea"
                      placeholder="e.g. Please keep the dinner entrée count as 3 options instead of 4..."
                      value={rejectionNote}
                      onChange={(e) => setRejectionNote(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setRejectingProposalId(null);
                        setRejectionNote('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleRejectProposal(rejectingProposalId)}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 6: CMS USER ACCOUNTS & ROLES (ADMIN ONLY)                    */}
        {/* ================================================================= */}
        {studioMode === 'users' && currentUser?.role === 'admin' && cmsDb && (
          <div className="cms-scroll-body">
            <div className="section-header-box" style={{ marginBottom: '1.5rem' }}>
              <span className="section-kicker">Access Management</span>
              <h2 className="section-title" style={{ fontSize: '2.3rem' }}>
                CMS Logins & Access Roles
              </h2>
              <GothicRoseArchOrnament width={210} />
              <p className="section-subtitle">
                Create and manage logins with specific roles. <strong>Administrators</strong> have automatic live approval and full settings access. <strong>Editors</strong> can edit all sections and submit change proposals for Admin review.
              </p>
            </div>

            <div style={{ maxWidth: '980px', margin: '0 auto' }}>
              <div
                className="surface-card"
                style={{
                  padding: '1rem 1.4rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>
                    Active CMS User Accounts ({cmsDb.cmsUsers?.length || 0})
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Logins are accessible exclusively via <code>/cmsdesk</code>.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowNewUserModal(true)}
                  style={{ padding: '0.48rem 0.95rem', fontSize: '0.82rem' }}
                >
                  <Plus size={15} /> Add New CMS User
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {(cmsDb.cmsUsers || []).map((user) => {
                  const isAdmin = user.role === 'admin';
                  return (
                    <div
                      key={user.id}
                      className="surface-card"
                      style={{
                        padding: '1.25rem',
                        border: isAdmin ? '1.5px solid var(--border-gold)' : '1px solid #3b82f6',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            padding: '0.22rem 0.65rem',
                            borderRadius: '999px',
                            background: isAdmin ? 'rgba(212, 168, 83, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: isAdmin ? 'var(--accent-secondary)' : '#93c5fd',
                            border: isAdmin ? '1px solid var(--border-gold)' : '1px solid #3b82f6',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          {isAdmin ? <Crown size={13} /> : <Edit3 size={13} />}
                          <span>{isAdmin ? 'Administrator (Auto-Approval)' : 'Editor (Approval Required)'}</span>
                        </span>

                        {(cmsDb.cmsUsers || []).filter((u) => u.role === 'admin').length > 1 || !isAdmin ? (
                          <button
                            type="button"
                            title="Delete user"
                            className="btn-danger"
                            style={{ padding: '0.3rem 0.5rem' }}
                            onClick={() => handleDeleteUser(user.id, user.username)}
                          >
                            <Trash2 size={13} />
                          </button>
                        ) : null}
                      </div>

                      <h4 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>
                        {user.displayName || user.username}
                      </h4>

                      <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                        <div>
                          <strong>Username:</strong> <span style={{ color: 'var(--text-primary)' }}>{user.username}</span>
                        </div>
                        <div>
                          <strong>Passcode:</strong> <span style={{ color: 'var(--accent-secondary)', fontFamily: 'monospace' }}>{user.passcode}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                          Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Initial Setup'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Create New User Modal */}
            {showNewUserModal && (
              <div
                className="cms-modal-backdrop"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.85)',
                  zIndex: 99999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
              >
                <form
                  onSubmit={handleCreateUser}
                  className="surface-card"
                  style={{
                    maxWidth: '480px',
                    width: '100%',
                    padding: '1.75rem',
                    border: '2px solid var(--accent-secondary)',
                    borderRadius: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserPlus size={20} color="var(--accent-secondary)" />
                      <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Create New CMS Account</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewUserModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username (lowercase, no spaces) *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. weddingplanner"
                      value={newUserForm.username}
                      onChange={(e) =>
                        setNewUserForm({ ...newUserForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passcode / Password *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. plan2027"
                      value={newUserForm.passcode}
                      onChange={(e) => setNewUserForm({ ...newUserForm, passcode: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Name (e.g. Jane • Wedding Coordinator)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Jane Planner"
                      value={newUserForm.displayName}
                      onChange={(e) => setNewUserForm({ ...newUserForm, displayName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Access Role *</label>
                    <select
                      className="form-select"
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    >
                      <option value="editor">
                        📝 Editor — Can edit pages & submit change proposals (Requires Admin Approval)
                      </option>
                      <option value="admin">
                        👑 Administrator — Full access, live auto-approval, and reviews editor proposals
                      </option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowNewUserModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Plus size={15} /> Create User Account
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
