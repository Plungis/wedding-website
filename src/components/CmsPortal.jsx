import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Lock,
  QrCode,
  Users,
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
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function CmsPortal({
  isOpen,
  onClose,
  onContentUpdated,
  onSimulateQrScan
}) {
  const [passcode, setPasscode] = useState('wedding2026');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeSection, setActiveSection] = useState('guests');
  const [cmsDb, setCmsDb] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');
  const [qrImages, setQrImages] = useState({});
  const [copiedCode, setCopiedCode] = useState('');
  const [guestFilter, setGuestFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Guest Form State
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

  async function saveSection(sectionName, sectionData) {
    setSavingStatus('Saving changes...');
    try {
      const res = await fetch(`/api/admin/section/${sectionName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ data: sectionData })
      });
      const data = await res.json();
      if (res.ok) {
        setCmsDb(data.db);
        setAnalytics(data.analytics);
        // If adminPasscode was updated in siteSettings, keep local passcode in sync
        if (sectionName === 'siteSettings' && sectionData.adminPasscode) {
          setPasscode(sectionData.adminPasscode);
        }
        setSavingStatus('✓ Saved & Published Live!');
        if (onContentUpdated) onContentUpdated();
        setTimeout(() => setSavingStatus(''), 3000);
      } else {
        setSavingStatus(`Error: ${data.error}`);
      }
    } catch {
      setSavingStatus('Error saving changes.');
    }
  }

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
            padding: '2.5rem'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--bg-accent-subtle)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <Lock size={26} />
          </div>
          <span className="section-kicker">Wedding Website Back-End</span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>CMS & QR Guest Studio</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Enter your admin passcode to edit pages (About Us, Ceremony, Reception), manage your guest list, and generate unique RSVP QR codes.
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
              <div style={{ color: '#dc2626', fontSize: '0.86rem', marginBottom: '1rem', fontWeight: 600 }}>
                {authError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                Unlock CMS Studio
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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

  return (
    <div className="cms-overlay">
      <div className="cms-window">
        {/* Sidebar Navigation */}
        <aside className="cms-sidebar no-print">
          <div>
            <div style={{ padding: '0 0.5rem 1.35rem', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                Back-End CMS
              </div>
              <div className="serif-font" style={{ fontSize: '1.65rem', fontWeight: 700 }}>
                {cmsDb?.siteSettings?.shortNames || 'Wedding Studio'}
              </div>
            </div>

            <button
              className={`cms-nav-btn ${activeSection === 'guests' ? 'active' : ''}`}
              onClick={() => setActiveSection('guests')}
            >
              <QrCode size={18} /> Guest List & QR Codes
            </button>

            <button
              className={`cms-nav-btn ${activeSection === 'print-qrs' ? 'active' : ''}`}
              onClick={() => setActiveSection('print-qrs')}
            >
              <Printer size={18} /> Printable QR Stationery
            </button>

            <button
              className={`cms-nav-btn ${activeSection === 'siteSettings' ? 'active' : ''}`}
              onClick={() => setActiveSection('siteSettings')}
            >
              <Settings size={18} /> General & Theme
            </button>

            <button
              className={`cms-nav-btn ${activeSection === 'aboutUs' ? 'active' : ''}`}
              onClick={() => setActiveSection('aboutUs')}
            >
              <Heart size={18} /> Edit About Us Page
            </button>

            <button
              className={`cms-nav-btn ${activeSection === 'ceremony' ? 'active' : ''}`}
              onClick={() => setActiveSection('ceremony')}
            >
              <Sparkles size={18} /> Edit Ceremony Page
            </button>

            <button
              className={`cms-nav-btn ${activeSection === 'reception' ? 'active' : ''}`}
              onClick={() => setActiveSection('reception')}
            >
              <Wine size={18} /> Edit Reception & Menu
            </button>

            <button
              className={`cms-nav-btn ${activeSection === 'revisions' ? 'active' : ''}`}
              onClick={() => setActiveSection('revisions')}
            >
              <History size={18} /> Activity Log & Reset
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ width: '100%', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none' }}
            >
              <X size={16} /> Return to Live Website
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="cms-main">
          <header className="cms-header no-print">
            <div>
              <h3 style={{ fontSize: '1.65rem' }}>
                {activeSection === 'guests' && 'RSVP Manager & Unique Guest QR Codes'}
                {activeSection === 'print-qrs' && 'Printable Wedding Invitation QR Cards'}
                {activeSection === 'siteSettings' && 'General Wedding Settings & Color Palette'}
                {activeSection === 'aboutUs' && 'Edit "About Us" Page Content'}
                {activeSection === 'ceremony' && 'Edit "Ceremony" Page Content'}
                {activeSection === 'reception' && 'Edit "Reception" Page & Dinner Entrées'}
                {activeSection === 'revisions' && 'CMS Revision Log & Database Tools'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {savingStatus && (
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 700
                  }}
                >
                  {savingStatus}
                </span>
              )}
              <button className="btn-secondary" onClick={onClose}>
                <X size={16} /> Close Studio
              </button>
            </div>
          </header>

          <div className="cms-scroll-body">
            {/* SECTION 1: GUEST LIST & QR CODES */}
            {activeSection === 'guests' && cmsDb && (
              <div>
                {/* Analytics Bar */}
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
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#059669', fontWeight: 700 }}>
                        Joyfully Attending
                      </div>
                      <div className="serif-font" style={{ fontSize: '2.3rem', fontWeight: 700, color: '#059669' }}>
                        {analytics.attendingCount}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Confirmed guests attending
                      </div>
                    </div>

                    <div className="surface-card" style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#d97706', fontWeight: 700 }}>
                        Awaiting RSVP
                      </div>
                      <div className="serif-font" style={{ fontSize: '2.3rem', fontWeight: 700, color: '#d97706' }}>
                        {analytics.pendingSeats}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Across {analytics.pendingHouseholds} pending households
                      </div>
                    </div>

                    <div className="surface-card" style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
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

                {/* Action Toolbar */}
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
                    <button className="btn-secondary" onClick={() => setActiveSection('print-qrs')}>
                      <Printer size={16} /> Print QR Cards
                    </button>
                    <button className="btn-primary" onClick={() => setShowNewGuestModal(true)}>
                      <Plus size={17} /> Add Guest & Generate QR Code
                    </button>
                  </div>
                </div>

                {/* New Guest Creation Modal Card */}
                {showNewGuestModal && (
                  <form
                    onSubmit={handleCreateGuest}
                    className="surface-card"
                    style={{
                      marginBottom: '1.75rem',
                      border: '2px solid var(--accent-primary)',
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
                          placeholder="e.g., PEONY-2027"
                          value={newGuestForm.code}
                          onChange={(e) => setNewGuestForm({ ...newGuestForm, code: e.target.value.toUpperCase() })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Table Assignment (Optional)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g., Table 6 • Vineyard"
                          value={newGuestForm.tableNumber}
                          onChange={(e) => setNewGuestForm({ ...newGuestForm, tableNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Individual Guests in This Party (Add each person who can RSVP)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {newGuestForm.memberNames.map((name, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder={`Guest ${idx + 1} Full Name (e.g., Emma Harrison or Plus One)`}
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
                        <Plus size={14} /> Add Another Party Member / Plus-One
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Personal Note Shown When They Scan Their QR Code</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., We are so excited to celebrate with you in Napa Valley!"
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

                {/* Edit Guest Modal Card */}
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

                {/* Guest Household Cards List */}
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
                      {/* QR Preview Column */}
                      <div style={{ textAlign: 'center' }}>
                        {qrImages[guest.code] && (
                          <img
                            src={qrImages[guest.code]}
                            alt={guest.code}
                            style={{
                              width: '112px',
                              height: '112px',
                              borderRadius: '10px',
                              border: '1px solid var(--border-color)',
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
                            color: 'var(--accent-primary)',
                            marginTop: '0.25rem'
                          }}
                        >
                          {guest.code}
                        </div>
                      </div>

                      {/* Household & Members Column */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <h4 style={{ fontSize: '1.5rem' }}>{guest.householdName}</h4>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.65rem',
                              borderRadius: '999px',
                              background: guest.rsvpStatus === 'responded' ? '#dcfce7' : '#fef3c7',
                              color: guest.rsvpStatus === 'responded' ? '#166534' : '#92400e'
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

                        {/* Members Chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                          {(guest.members || []).map((m) => (
                            <div
                              key={m.id}
                              style={{
                                fontSize: '0.82rem',
                                padding: '0.3rem 0.7rem',
                                borderRadius: '8px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                              }}
                            >
                              <strong>{m.name}</strong>
                              {m.attending === true && (
                                <span style={{ color: '#059669', fontWeight: 600 }}>
                                  (Attending{m.mealChoice ? ` • ${m.mealChoice}` : ''})
                                </span>
                              )}
                              {m.attending === false && (
                                <span style={{ color: '#dc2626', fontWeight: 600 }}>(Declined)</span>
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

                      {/* QR & Household Actions */}
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

            {/* SECTION 2: PRINTABLE QR STATIONERY SHEET */}
            {activeSection === 'print-qrs' && cmsDb && (
              <div>
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
                      Print these personalized QR cards to slip inside each guest's physical invitation envelope, or download individual PNGs to place into your Canva/stationery template.
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
                          style={{ width: '155px', height: '155px', marginBottom: '0.6rem' }}
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
                          color: 'var(--accent-primary)',
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

            {/* SECTION 3: GENERAL & THEME SETTINGS */}
            {activeSection === 'siteSettings' && cmsDb && (
              <div className="surface-card">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Couple Full Names (Hero Title)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.coupleNames || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, coupleNames: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Names (Badges & Headers)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.shortNames || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, shortNames: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Wedding Date & Time (ISO for Countdown)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.weddingDate || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, weddingDate: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Wedding Date</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.weddingDateDisplay || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, weddingDateDisplay: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location Summary</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.locationSummary || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, locationSummary: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">RSVP Deadline Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.rsvpDeadline || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, rsvpDeadline: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Website Color Palette Theme</label>
                    <select
                      className="form-select"
                      value={cmsDb.siteSettings.theme || 'fall-goth'}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, theme: e.target.value }
                        })
                      }
                    >
                      <option value="fall-goth">Fall Goth • Velvet Plum, Oxblood & Burnished Copper (Default)</option>
                      <option value="victorian-noir">Victorian Noir • Midnight Manor & Antique Gold</option>
                      <option value="harvest-twilight">Harvest Twilight • Deep Espresso, Crimson & Amber</option>
                      <option value="sage-gold">Daylight Botanical • Sage & Champagne Gold</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Wedding Hashtag</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.siteSettings.hashtag || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          siteSettings: { ...cmsDb.siteSettings, hashtag: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Banner Background Image URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cmsDb.siteSettings.heroBannerUrl || ''}
                    onChange={(e) =>
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: { ...cmsDb.siteSettings, heroBannerUrl: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Invitation Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cmsDb.siteSettings.heroTagline || ''}
                    onChange={(e) =>
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: { ...cmsDb.siteSettings, heroTagline: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CMS Admin Passcode</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cmsDb.siteSettings.adminPasscode || ''}
                    onChange={(e) =>
                      setCmsDb({
                        ...cmsDb,
                        siteSettings: { ...cmsDb.siteSettings, adminPasscode: e.target.value }
                      })
                    }
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => saveSection('siteSettings', cmsDb.siteSettings)}
                >
                  <Save size={17} /> Save & Publish General Settings
                </button>
              </div>
            )}

            {/* SECTION 4: EDIT ABOUT US PAGE */}
            {activeSection === 'aboutUs' && cmsDb && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div className="surface-card">
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About Us Headline & Quote</h4>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Page Headline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.aboutUs.headline || ''}
                        onChange={(e) =>
                          setCmsDb({
                            ...cmsDb,
                            aboutUs: { ...cmsDb.aboutUs, headline: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subheadline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.aboutUs.subheadline || ''}
                        onChange={(e) =>
                          setCmsDb({
                            ...cmsDb,
                            aboutUs: { ...cmsDb.aboutUs, subheadline: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Featured Romantic Quote</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cmsDb.aboutUs.introQuote || ''}
                      onChange={(e) =>
                        setCmsDb({
                          ...cmsDb,
                          aboutUs: { ...cmsDb.aboutUs, introQuote: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                {/* Couple Profiles Editor */}
                <div className="surface-card">
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Couple Profiles</h4>
                  <div className="grid-2">
                    {(cmsDb.aboutUs.coupleProfiles || []).map((person, idx) => (
                      <div key={person.id || idx} style={{ padding: '1.15rem', borderRadius: '14px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={person.name}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.coupleProfiles];
                              next[idx] = { ...next[idx], name: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, coupleProfiles: next } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Role Badge</label>
                          <input
                            type="text"
                            className="form-input"
                            value={person.role}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.coupleProfiles];
                              next[idx] = { ...next[idx], role: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, coupleProfiles: next } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Photo URL</label>
                          <input
                            type="text"
                            className="form-input"
                            value={person.photo}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.coupleProfiles];
                              next[idx] = { ...next[idx], photo: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, coupleProfiles: next } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Bio</label>
                          <textarea
                            rows={3}
                            className="form-textarea"
                            value={person.bio}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.coupleProfiles];
                              next[idx] = { ...next[idx], bio: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, coupleProfiles: next } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Fun Fact</label>
                          <input
                            type="text"
                            className="form-input"
                            value={person.funFact || ''}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.coupleProfiles];
                              next[idx] = { ...next[idx], funFact: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, coupleProfiles: next } });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Story Timeline Editor */}
                <div className="surface-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.5rem' }}>Our Story Timeline Chapters</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setCmsDb({
                          ...cmsDb,
                          aboutUs: {
                            ...cmsDb.aboutUs,
                            storyTimeline: [
                              ...(cmsDb.aboutUs.storyTimeline || []),
                              {
                                id: `st-${Date.now()}`,
                                year: '2026',
                                title: 'New Milestone',
                                location: 'City, State',
                                description: 'Describe this special memory...',
                                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80'
                              }
                            ]
                          }
                        })
                      }
                    >
                      <Plus size={15} /> Add Story Milestone
                    </button>
                  </div>

                  {(cmsDb.aboutUs.storyTimeline || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        padding: '1.15rem',
                        borderRadius: '14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '1rem'
                      }}
                    >
                      <div className="grid-3">
                        <div className="form-group">
                          <label className="form-label">Date / Year</label>
                          <input
                            type="text"
                            className="form-input"
                            value={item.year}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.storyTimeline];
                              next[idx] = { ...next[idx], year: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, storyTimeline: next } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Milestone Title</label>
                          <input
                            type="text"
                            className="form-input"
                            value={item.title}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.storyTimeline];
                              next[idx] = { ...next[idx], title: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, storyTimeline: next } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-input"
                            value={item.location || ''}
                            onChange={(e) => {
                              const next = [...cmsDb.aboutUs.storyTimeline];
                              next[idx] = { ...next[idx], location: e.target.value };
                              setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, storyTimeline: next } });
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={2}
                          className="form-textarea"
                          value={item.description}
                          onChange={(e) => {
                            const next = [...cmsDb.aboutUs.storyTimeline];
                            next[idx] = { ...next[idx], description: e.target.value };
                            setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, storyTimeline: next } });
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Image URL"
                          value={item.image}
                          onChange={(e) => {
                            const next = [...cmsDb.aboutUs.storyTimeline];
                            next[idx] = { ...next[idx], image: e.target.value };
                            setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, storyTimeline: next } });
                          }}
                        />
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => {
                            const next = cmsDb.aboutUs.storyTimeline.filter((_, i) => i !== idx);
                            setCmsDb({ ...cmsDb, aboutUs: { ...cmsDb.aboutUs, storyTimeline: next } });
                          }}
                        >
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => saveSection('aboutUs', cmsDb.aboutUs)}
                  >
                    <Save size={17} /> Save & Publish About Us Page
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 5: EDIT CEREMONY PAGE */}
            {activeSection === 'ceremony' && cmsDb && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div className="surface-card">
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ceremony Venue & Times</h4>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Headline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.headline || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, headline: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subheadline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.subheadline || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, subheadline: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Venue Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.venueName || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, venueName: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Venue Address</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.venueAddress || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, venueAddress: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gates Open Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.doorsOpenTime || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, doorsOpenTime: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Processional Start Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.startTime || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, startTime: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Officiant Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.officiant || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, officiant: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dress Code Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.ceremony.dressCodeTitle || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, dressCodeTitle: e.target.value } })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dress Code Guidance Note</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={cmsDb.ceremony.dressCodeNote || ''}
                      onChange={(e) =>
                        setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, dressCodeNote: e.target.value } })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parking & Shuttle Details</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={cmsDb.ceremony.parkingAndShuttle || ''}
                      onChange={(e) =>
                        setCmsDb({ ...cmsDb, ceremony: { ...cmsDb.ceremony, parkingAndShuttle: e.target.value } })
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => saveSection('ceremony', cmsDb.ceremony)}
                  >
                    <Save size={17} /> Save & Publish Ceremony Page
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 6: EDIT RECEPTION PAGE & MENU */}
            {activeSection === 'reception' && cmsDb && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div className="surface-card">
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Reception Venue & Schedule Times</h4>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Headline</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.reception.headline || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, headline: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Venue Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.reception.venueName || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, venueName: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cocktail Hour Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.reception.cocktailTime || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, cocktailTime: e.target.value } })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dinner Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cmsDb.reception.dinnerTime || ''}
                        onChange={(e) =>
                          setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, dinnerTime: e.target.value } })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Menu Options Editor (Syncs with RSVP Page!) */}
                <div className="surface-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.5rem' }}>Plated Dinner Entrée Options</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Changes here automatically update both the Reception Menu display and the Guest QR RSVP Entrée dropdown!
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setCmsDb({
                          ...cmsDb,
                          reception: {
                            ...cmsDb.reception,
                            menuOptions: [
                              ...(cmsDb.reception.menuOptions || []),
                              {
                                id: `meal-${Date.now()}`,
                                name: 'New Seasonal Entrée',
                                tag: 'Chef Specialty',
                                description: 'Description of ingredients and preparation...'
                              }
                            ]
                          }
                        })
                      }
                    >
                      <Plus size={15} /> Add Entrée Option
                    </button>
                  </div>

                  {(cmsDb.reception.menuOptions || []).map((meal, idx) => (
                    <div
                      key={meal.id || idx}
                      style={{
                        padding: '1.1rem',
                        borderRadius: '14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '0.85rem'
                      }}
                    >
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Entrée Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={meal.name}
                            onChange={(e) => {
                              const next = [...cmsDb.reception.menuOptions];
                              next[idx] = { ...next[idx], name: e.target.value };
                              setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, menuOptions: next } });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Dietary Tag</label>
                          <input
                            type="text"
                            className="form-input"
                            value={meal.tag}
                            onChange={(e) => {
                              const next = [...cmsDb.reception.menuOptions];
                              next[idx] = { ...next[idx], tag: e.target.value };
                              setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, menuOptions: next } });
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-input"
                          value={meal.description}
                          onChange={(e) => {
                            const next = [...cmsDb.reception.menuOptions];
                            next[idx] = { ...next[idx], description: e.target.value };
                            setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, menuOptions: next } });
                          }}
                        />
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => {
                            const next = cmsDb.reception.menuOptions.filter((_, i) => i !== idx);
                            setCmsDb({ ...cmsDb, reception: { ...cmsDb.reception, menuOptions: next } });
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => saveSection('reception', cmsDb.reception)}
                  >
                    <Save size={17} /> Save & Publish Reception & Menu
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 7: ACTIVITY LOG & FACTORY RESET */}
            {activeSection === 'revisions' && cmsDb && (
              <div className="surface-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.5rem' }}>Recent CMS Edits & Guest RSVP Activity</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      Every RSVP response and CMS update is logged and persisted to <code>server/data/db.json</code>.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={async () => {
                      if (!window.confirm('Reset all wedding website content and sample guests to factory defaults?')) return;
                      const res = await fetch('/api/admin/reset', {
                        method: 'POST',
                        headers: { 'x-admin-passcode': passcode }
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setCmsDb(data.db);
                        setAnalytics(data.analytics);
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
                        background: 'var(--bg-primary)',
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
