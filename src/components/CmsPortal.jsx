import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import PageBlockRenderer from './PageBlockRenderer.jsx';
import {
  X,
  Lock,
  QrCode,
  Settings,
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
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Upload,
  Columns,
  CheckCircle2
} from 'lucide-react';

const BLOCK_LIBRARY = [
  {
    type: 'rich_banner',
    label: 'Rich Story / Callout Banner',
    desc: 'Full-width velvet banner with headline, text & optional CTA button',
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
    label: 'Split Image + Text Block',
    desc: 'Side-by-side photo and text card (reversible left/right layout)',
    create: () => ({
      id: `block-${Date.now()}`,
      type: 'split_media',
      kicker: 'Autumn Lookbook',
      title: 'Velvet, Lace & Dark Botanicals',
      subtitle: '',
      visible: true,
      settings: {
        imagePosition: 'left',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
        bodyText: 'We invite our guests to dress in moody autumn hues—think obsidian black, oxblood crimson, deep plum, emerald velvet, and antique gold accents.',
        buttonText: '',
        buttonTab: 'rsvp',
        buttonUrl: ''
      },
      items: []
    })
  },
  {
    type: 'feature_grid',
    label: 'Icon Feature Cards Grid',
    desc: '2, 3, or 4 column cards with customizable icons & descriptions',
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
          title: 'Candlelit Atmosphere',
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
    label: 'Photo Gallery Grid',
    desc: '2, 3, or 4 column photo gallery with captions & aspect ratio control',
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
          caption: 'October twilight in the woods'
        },
        {
          id: `gal-${Date.now()}-2`,
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
          caption: 'At the manor gates'
        },
        {
          id: `gal-${Date.now()}-3`,
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
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
          image: 'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=900&q=80'
        }
      ]
    })
  },
  {
    type: 'order_cards',
    label: 'Event Steps / Order Cards',
    desc: 'Time-badged cards for ceremony steps or weekend events',
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
    desc: 'Large split venue card with photo, 4 highlight stats & Google Maps link',
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
        imagePosition: 'left',
        mapUrl: 'https://maps.google.com',
        ctaText: 'Go to QR RSVP',
        ctaTargetTab: 'rsvp',
        highlights: [
          { label: 'Date', value: 'October 23, 2027' },
          { label: 'Doors Open', value: '4:30 PM' },
          { label: 'Attire', value: 'Autumn Black-Tie' },
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
    desc: 'Circular portrait cards for bridesmaids, groomsmen, or family',
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
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
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

// Helper component for URL input + Drag-and-Drop Image Upload
function ImageFieldUploader({ label, value, onChange }) {
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onChange(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Paste image URL or upload file ->"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <label
          className="btn-secondary"
          title="Upload image from your computer"
          style={{ padding: '0.65rem 0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          <Upload size={15} /> Upload
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
      </div>
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

  // Top-level studio mode: 'builder' | 'guests' | 'print-qrs' | 'revisions'
  const [studioMode, setStudioMode] = useState('builder');

  // Active page inside the Visual Drag & Drop Builder: 'aboutUs' | 'ceremony' | 'reception' | 'heroTabs' | 'themeColors'
  const [builderPage, setBuilderPage] = useState('aboutUs');
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [showAddBlockDrawer, setShowAddBlockDrawer] = useState(false);

  // Drag-and-drop state for the left sidebar block tree
  const [treeDragIdx, setTreeDragIdx] = useState(null);
  const [treeDragOverIdx, setTreeDragOverIdx] = useState(null);

  // Drag-and-drop state for items inside the right inspector
  const [itemDragIdx, setItemDragIdx] = useState(null);
  const [itemDragOverIdx, setItemDragOverIdx] = useState(null);

  // Drag-and-drop state for Big Tabs
  const [tabDragIdx, setTabDragIdx] = useState(null);

  const [cmsDb, setCmsDb] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Guest & QR Studio State
  const [qrImages, setQrImages] = useState({});
  const [copiedCode, setCopiedCode] = useState('');
  const [guestFilter, setGuestFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [newGuestForm, setNewGuestForm] = useState({
    householdName: '',
    code: '',
    email: '',
    tableNumber: '',
    personalNote: '',
    memberNames: ['']
  });

  useEffect(() => {
    if (isOpen && authenticated) {
      fetchAdminData();
    }
  }, [isOpen, authenticated]);

  // Select first block automatically when switching pages in the visual builder
  useEffect(() => {
    if (!cmsDb) return;
    if (['aboutUs', 'ceremony', 'reception'].includes(builderPage)) {
      const blocks = cmsDb[builderPage]?.blocks || [];
      if (blocks.length > 0 && !blocks.some((b) => b.id === selectedBlockId)) {
        setSelectedBlockId(blocks[0].id);
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
            color: { dark: '#1e2a22', light: '#ffffff' }
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
        if (data.db?.aboutUs?.blocks?.[0]) {
          setSelectedBlockId(data.db.aboutUs.blocks[0].id);
        }
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
          reception: cmsDb.reception
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
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

  // Page & Block Manipulation Helpers for Visual Drag-and-Drop Builder
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
          email: newGuestForm.email,
          tableNumber: newGuestForm.tableNumber,
          personalNote: newGuestForm.personalNote,
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
          email: '',
          tableNumber: '',
          personalNote: '',
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
        'RSVP Status',
        'Table',
        'Guest Member Name',
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
          g.rsvpStatus,
          `"${(g.tableNumber || '').replace(/"/g, '""')}"`,
          `"${(m.name || '').replace(/"/g, '""')}"`,
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
            border: '1px solid var(--border-gold)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
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
          <span className="section-kicker">Visual Drag & Drop Website Builder</span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>CMS & QR Guest Studio</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Unlock the visual drag-and-drop builder to reorder sections, add new blocks, customize colors, and manage guest QR codes.
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
                Launch Drag & Drop Studio
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const isBlockPage = ['aboutUs', 'ceremony', 'reception'].includes(builderPage);
  const currentPageObj = isBlockPage ? cmsDb?.[builderPage] : null;
  const currentBlocks = currentPageObj?.blocks || [];
  const selectedBlock = currentBlocks.find((b) => b.id === selectedBlockId) || null;

  const filteredGuests = (cmsDb?.guests || []).filter((g) => {
    if (guestFilter === 'responded' && g.rsvpStatus !== 'responded') return false;
    if (guestFilter === 'pending' && g.rsvpStatus !== 'pending') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHousehold = g.householdName?.toLowerCase().includes(q);
      const matchCode = g.code?.toLowerCase().includes(q);
      const matchMember = (g.members || []).some((m) => m.name?.toLowerCase().includes(q));
      return matchHousehold || matchCode || matchMember;
    }
    return true;
  });

  // Render deep item fields inside the Right Inspector based on block.type
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
            image: 'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=900&q=80'
          };
        } else if (b.type === 'wedding_party') {
          blank = {
            id,
            name: 'New Party Member',
            role: 'Bridesmaid / Groomsman',
            relation: 'Friend of the Couple',
            bio: 'How you know each other...',
            photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
          };
        } else if (b.type === 'gallery') {
          blank = {
            id,
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
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
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Drag any card by its ⠿ handle to reorder it inside this section:
        </p>

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
              {/* Item Drag Header */}
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

              {/* Fields per item type */}
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
                  <ImageFieldUploader label="Portrait Photo" value={item.photo} onChange={(val) => updateItem(idx, 'photo', val)} />
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
                      <input type="text" className="form-input" value={item.year || ''} onChange={(e) => updateItem(idx, 'year', e.target.value)} />
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
                  <ImageFieldUploader label="Milestone Photo" value={item.image} onChange={(val) => updateItem(idx, 'image', val)} />
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
                      <label className="form-label">Role (e.g. Best Man)</label>
                      <input type="text" className="form-input" value={item.role || ''} onChange={(e) => updateItem(idx, 'role', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Relation</label>
                      <input type="text" className="form-input" value={item.relation || ''} onChange={(e) => updateItem(idx, 'relation', e.target.value)} />
                    </div>
                  </div>
                  <ImageFieldUploader label="Portrait Photo" value={item.photo} onChange={(val) => updateItem(idx, 'photo', val)} />
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea rows={2} className="form-textarea" value={item.bio || ''} onChange={(e) => updateItem(idx, 'bio', e.target.value)} />
                  </div>
                </>
              )}

              {block.type === 'gallery' && (
                <>
                  <ImageFieldUploader label="Photo URL or Upload" value={item.url} onChange={(val) => updateItem(idx, 'url', val)} />
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
    <div className="cms-overlay" style={{ padding: '0.65rem' }}>
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
          boxShadow: '0 25px 80px rgba(0,0,0,0.85)'
        }}
      >
        {/* TOP STUDIO BAR */}
        <header
          className="no-print"
          style={{
            background: '#0b070d',
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
              <span className="goth-display" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                DRAG & DROP WEDDING CMS STUDIO
              </span>
            </div>

            {/* Studio Mode Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
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
                <Layout size={15} /> Visual Page Builder
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
                <QrCode size={15} /> Guest List & QR Studio ({cmsDb?.guests?.length || 0})
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
                <History size={15} /> Activity & Reset
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
                boxShadow: hasUnsavedChanges ? '0 0 18px rgba(209, 142, 71, 0.55)' : 'none'
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
        {/* MODE 1: 3-PANE VISUAL DRAG & DROP PAGE BUILDER                    */}
        {/* ================================================================= */}
        {studioMode === 'builder' && cmsDb && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr 410px',
              flex: 1,
              overflow: 'hidden'
            }}
          >
            {/* LEFT PANE: PAGE SELECTOR & DRAGGABLE SECTION BLOCK TREE */}
            <aside
              style={{
                background: '#0e0911',
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
                    { id: 'aboutUs', label: '01 • About Us Page', icon: Heart },
                    { id: 'ceremony', label: '02 • Ceremony Page', icon: Sparkles },
                    { id: 'reception', label: '03 • Reception & Menu Page', icon: Wine },
                    { id: 'heroTabs', label: 'Hero Banner & Big Tabs Deck', icon: Layout },
                    { id: 'themeColors', label: 'Theme & Custom Color Picker', icon: Palette }
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
                          background: active ? 'linear-gradient(135deg, var(--accent-primary), #4d1020)' : 'var(--bg-secondary)',
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
                </div>
              </div>

              {/* If editing About Us, Ceremony, or Reception: Show Page Header + Draggable Section Layers */}
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
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.45rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Divider (e.g. ✦ 🥀 ✦)"
                        value={currentPageObj.divider || ''}
                        onChange={(e) => updatePageField(builderPage, 'divider', e.target.value)}
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
                      />
                    </div>
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
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                      Grab ⠿ to drag & reorder sections, or click any section to edit its content on the right:
                    </p>

                    {/* Add Block Library Drawer */}
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

                    {/* Draggable Layer List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8rem'
                }}
              >
                <span>
                  <strong style={{ color: 'var(--accent-secondary)' }}>Interactive Visual Canvas:</strong> Drag sections directly on the page below to reorder, or click any section to inspect & edit it!
                </span>
                {isBlockPage && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.32rem 0.75rem', fontSize: '0.76rem' }}
                    onClick={() => setShowAddBlockDrawer(true)}
                  >
                    <Plus size={13} /> Add Block to This Page
                  </button>
                )}
              </div>

              {isBlockPage && currentPageObj ? (
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
              ) : (
                /* Preview Hero & Big Tabs when editing Hero/Tabs or Theme */
                <div>
                  <header
                    className="wedding-hero"
                    style={{
                      borderRadius: '20px',
                      marginBottom: '1.5rem',
                      padding: '2.5rem 1.5rem 3rem',
                      backgroundImage: `url(${cmsDb.siteSettings?.heroBannerUrl})`
                    }}
                  >
                    <div className="wedding-hero-inner">
                      <span className="hero-eyebrow">{cmsDb.siteSettings?.heroEyebrow}</span>
                      <h1 className="hero-couple-names" style={{ fontSize: '2.8rem' }}>
                        {cmsDb.siteSettings?.coupleNames}
                      </h1>
                      <p className="hero-tagline">{cmsDb.siteSettings?.heroTagline}</p>
                    </div>
                  </header>

                  <div className="big-tabs-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    {(cmsDb.siteSettings?.bigTabs || []).map((tab) => (
                      <div key={tab.id} className="big-tab-card" style={{ opacity: tab.visible === false ? 0.4 : 1 }}>
                        <div className="big-tab-top">
                          <span className="big-tab-step">{tab.step}</span>
                        </div>
                        <div>
                          <div className="big-tab-title">{tab.title}</div>
                          <div className="big-tab-subtitle">{tab.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANE: DEEP PROPERTY INSPECTOR */}
            <aside
              style={{
                background: '#0e0911',
                borderLeft: '1px solid var(--border-color)',
                padding: '1.25rem',
                overflowY: 'auto'
              }}
            >
              {/* INSPECTOR FOR HERO & BIG TABS */}
              {builderPage === 'heroTabs' && (
                <div>
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.35rem', color: 'var(--accent-secondary)' }}>
                    Hero Banner & Big Tabs Inspector
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.15rem' }}>
                    Edit the main wedding header and drag-and-drop the Big Tabs navigation cards.
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
                    label="Hero Background Image"
                    value={cmsDb.siteSettings.heroBannerUrl}
                    onChange={(val) => {
                      setHasUnsavedChanges(true);
                      setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, heroBannerUrl: val } });
                    }}
                  />

                  <div className="grid-2" style={{ gap: '0.6rem' }}>
                    <div className="form-group">
                      <label className="form-label">Display Date</label>
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
                    <div className="form-group">
                      <label className="form-label">Countdown ISO Date</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.siteSettings.weddingDate || ''}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, weddingDate: e.target.value } });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '0.6rem' }}>
                    <div className="form-group">
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
                    <div className="form-group">
                      <label className="form-label">RSVP Deadline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.siteSettings.rsvpDeadline || ''}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, rsvpDeadline: e.target.value } });
                        }}
                      />
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

              {/* INSPECTOR FOR THEME & CUSTOM COLOR PICKER */}
              {builderPage === 'themeColors' && (
                <div>
                  <h4 style={{ fontSize: '1.45rem', marginBottom: '0.35rem', color: 'var(--accent-secondary)' }}>
                    Theme & Custom Color Studio
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Choose a curated Fall Goth palette or enable custom color pickers to dial in your exact wedding colors.
                  </p>

                  <div className="form-group">
                    <label className="form-label">Preset Palette Theme</label>
                    <select
                      className="form-select"
                      value={cmsDb.siteSettings.theme || 'fall-goth'}
                      onChange={(e) => {
                        const nextTheme = e.target.value;
                        document.documentElement.setAttribute('data-theme', nextTheme);
                        setHasUnsavedChanges(true);
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, theme: nextTheme }
                        });
                      }}
                    >
                      <option value="fall-goth">Fall Goth • Velvet Plum, Oxblood & Burnished Copper</option>
                      <option value="victorian-noir">Victorian Noir • Midnight Manor & Antique Gold</option>
                      <option value="harvest-twilight">Harvest Twilight • Deep Espresso, Crimson & Amber</option>
                      <option value="sage-gold">Daylight Botanical • Sage & Champagne Gold</option>
                    </select>
                  </div>

                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '1rem',
                      borderRadius: '14px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-gold)'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={cmsDb.siteSettings.customColors?.enabled || false}
                        onChange={(e) => {
                          setHasUnsavedChanges(true);
                          setCmsDb({
                            ...cmsDb,
                            siteSettings: {
                              ...cmsDb.siteSettings,
                              customColors: {
                                ...(cmsDb.siteSettings.customColors || {}),
                                enabled: e.target.checked
                              }
                            }
                          });
                        }}
                      />
                      <span>Enable Custom Hex Color Overrides</span>
                    </label>

                    {cmsDb.siteSettings.customColors?.enabled && (
                      <div className="grid-2" style={{ gap: '0.75rem' }}>
                        {[
                          { key: 'bgPrimary', label: 'Main Background' },
                          { key: 'bgCard', label: 'Card Surface' },
                          { key: 'accentPrimary', label: 'Primary Accent (Oxblood)' },
                          { key: 'accentSecondary', label: 'Gold / Copper Highlight' },
                          { key: 'textPrimary', label: 'Primary Text' }
                        ].map((clr) => (
                          <div key={clr.key} className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>{clr.label}</label>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={cmsDb.siteSettings.customColors?.[clr.key] || '#120d14'}
                                onChange={(e) => {
                                  setHasUnsavedChanges(true);
                                  setCmsDb({
                                    ...cmsDb,
                                    siteSettings: {
                                      ...cmsDb.siteSettings,
                                      customColors: {
                                        ...cmsDb.siteSettings.customColors,
                                        [clr.key]: e.target.value
                                      }
                                    }
                                  });
                                }}
                                style={{ width: '38px', height: '38px', border: 'none', background: 'none', cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                className="form-input"
                                value={cmsDb.siteSettings.customColors?.[clr.key] || ''}
                                onChange={(e) => {
                                  setHasUnsavedChanges(true);
                                  setCmsDb({
                                    ...cmsDb,
                                    siteSettings: {
                                      ...cmsDb.siteSettings,
                                      customColors: {
                                        ...cmsDb.siteSettings.customColors,
                                        [clr.key]: e.target.value
                                      }
                                    }
                                  });
                                }}
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.82rem' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{ marginTop: '1.25rem' }}>
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

                  <div className="form-group">
                    <label className="form-label">Admin CMS Passcode</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.adminPasscode || ''}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setCmsDb({ ...cmsDb, siteSettings: { ...cmsDb.siteSettings, adminPasscode: e.target.value } });
                      }}
                    />
                  </div>
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

                  {/* Common Block Header Fields */}
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

                  {/* Layout Columns Selector for Grid Blocks */}
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

                  {/* Couple Portrait Frame Style */}
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
                        <option value="gothic-arch">Gothic Arch Frame (Fall Goth Signature)</option>
                        <option value="rounded">Classic Rounded Portrait</option>
                        <option value="circle">Circular Medallion</option>
                      </select>
                    </div>
                  )}

                  {/* Gallery Aspect Ratio */}
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
                        <option value="landscape">Landscape</option>
                        <option value="portrait">Tall Portrait</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                  )}

                  {/* Quote & Countdown Specific Settings */}
                  {selectedBlock.type === 'quote_countdown' && (
                    <>
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

                  {/* Venue Showcase Specific Settings */}
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
                          value={selectedBlock.settings?.venueAddress || ''}
                          onChange={(e) =>
                            updateSelectedBlock(builderPage, (b) => {
                              b.settings = { ...(b.settings || {}), venueAddress: e.target.value };
                              return b;
                            })
                          }
                        />
                      </div>
                      <ImageFieldUploader
                        label="Venue Showcase Image"
                        value={selectedBlock.settings?.heroImage}
                        onChange={(val) =>
                          updateSelectedBlock(builderPage, (b) => {
                            b.settings = { ...(b.settings || {}), heroImage: val };
                            return b;
                          })
                        }
                      />
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
                        <label className="form-label">4 Key Highlight Stats</label>
                        {(selectedBlock.settings?.highlights || []).map((hl, hIdx) => (
                          <div key={hIdx} className="grid-2" style={{ gap: '0.5rem', marginBottom: '0.45rem' }}>
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
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Split Media & Rich Banner Settings */}
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
                            label="Feature Image"
                            value={selectedBlock.settings?.imageUrl}
                            onChange={(val) =>
                              updateSelectedBlock(builderPage, (b) => {
                                b.settings = { ...(b.settings || {}), imageUrl: val };
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

                  {/* Render Draggable Sub-Items Editor */}
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

            {/* Toolbar */}
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
                  style={{ width: '170px', padding: '0.55rem 0.85rem' }}
                >
                  <option value="all">All Households</option>
                  <option value="responded">Responded ✓</option>
                  <option value="pending">Pending RSVP</option>
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

                <div className="form-group">
                  <label className="form-label">Individual Guests in This Party</label>
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
                    <Plus size={14} /> Add Another Party Member
                  </button>
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

                <div className="form-group">
                  <label className="form-label">Personal Welcome Message on RSVP Page</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingGuest.personalNote || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, personalNote: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Party Members & Individual Attendance</label>
                  {(editingGuest.members || []).map((m, idx) => (
                    <div
                      key={m.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 2fr auto',
                        gap: '0.6rem',
                        marginBottom: '0.5rem',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="text"
                        className="form-input"
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
                          setEditingGuest({
                            ...editingGuest,
                            members: editingGuest.members.filter((_, i) => i !== idx)
                          });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ alignSelf: 'flex-start', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() =>
                      setEditingGuest({
                        ...editingGuest,
                        members: [
                          ...(editingGuest.members || []),
                          { id: `m-${Date.now()}`, name: 'New Guest', attending: null, mealChoice: '', dietary: '' }
                        ]
                      })
                    }
                  >
                    <Plus size={14} /> Add Member
                  </button>
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
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                      {(guest.members || []).map((m) => (
                        <div
                          key={m.id}
                          style={{
                            fontSize: '0.82rem',
                            padding: '0.3rem 0.7rem',
                            borderRadius: '8px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <strong>{m.name}</strong>
                          {m.attending === true && (
                            <span style={{ color: '#34d399', fontWeight: 600 }}>
                              (Attending{m.mealChoice ? ` • ${m.mealChoice}` : ''})
                            </span>
                          )}
                          {m.attending === false && (
                            <span style={{ color: '#f87171', fontWeight: 600 }}>(Declined)</span>
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
                <h4 style={{ fontSize: '1.5rem' }}>Ready-to-Print Wedding QR Enclosure Cards</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Print these personalized QR cards for your physical invitation envelopes, or download individual PNGs in the Guest Studio.
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
                    {(guest.members || []).map((m) => m.name).join(' • ')}
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
                    Every drag-and-drop layout change and RSVP response is saved to <code>server/data/db.json</code>.
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
