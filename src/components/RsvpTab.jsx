import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {
  QrCode,
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  Sparkles,
  Music,
  Heart,
  Utensils,
  Search,
  RefreshCw,
  AlertCircle,
  Eye
} from 'lucide-react';

function extractCodeFromRawText(rawText = '') {
  const trimmed = rawText.trim();
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const rsvpParam = url.searchParams.get('rsvp') || url.searchParams.get('code');
      if (rsvpParam) return rsvpParam.trim().toUpperCase();
    }
  } catch {
    // Fallback to regex extraction
  }
  const match = trimmed.match(/[?&](?:rsvp|code)=([A-Za-z0-9-_]+)/i);
  if (match && match[1]) {
    return match[1].toUpperCase();
  }
  return trimmed.toUpperCase();
}

export default function RsvpTab({
  initialCode,
  sampleInvites = [],
  menuOptions = [],
  rsvpDeadline,
  coupleShortNames,
  onRsvpSubmitted
}) {
  const [inputCode, setInputCode] = useState(initialCode || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestData, setGuestData] = useState(null);
  const [availableMeals, setAvailableMeals] = useState(menuOptions);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [guestQrImage, setGuestQrImage] = useState('');

  // Camera Scanner State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanFrameRef = useRef(null);
  const streamRef = useRef(null);

  // Demo QR previews for testing
  const [showDemoTray, setShowDemoTray] = useState(true);
  const [demoQrMap, setDemoQrMap] = useState({});

  useEffect(() => {
    async function buildDemoQrs() {
      const map = {};
      const origin = window.location.origin;
      for (const item of sampleInvites.slice(0, 5)) {
        try {
          const url = `${origin}/?rsvp=${encodeURIComponent(item.code)}`;
          map[item.code] = await QRCode.toDataURL(url, {
            width: 160,
            margin: 1,
            color: { dark: '#1e2a22', light: '#ffffff' }
          });
        } catch {
          // ignore
        }
      }
      setDemoQrMap(map);
    }
    if (sampleInvites.length > 0) {
      buildDemoQrs();
    }
  }, [sampleInvites]);

  useEffect(() => {
    if (initialCode) {
      setInputCode(initialCode);
      lookupInvitation(initialCode);
    }
  }, [initialCode]);

  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  async function lookupInvitation(rawCode) {
    const cleanCode = extractCodeFromRawText(rawCode);
    if (!cleanCode) {
      setError('Please enter your unique invitation code or scan your QR card.');
      return;
    }

    setLoading(true);
    setError('');
    setSaveSuccess('');

    try {
      const res = await fetch(`/api/rsvp/${encodeURIComponent(cleanCode)}`);
      const data = await res.json();
      if (!res.ok) {
        setGuestData(null);
        setError(data.error || 'Could not find an invitation with that code.');
      } else {
        // Initialize default attending/mealChoice if pending
        const normalizedMembers = (data.guest.members || []).map((m) => ({
          ...m,
          attending: m.attending === null || m.attending === undefined ? true : m.attending,
          mealChoice:
            m.mealChoice ||
            (data.menuOptions && data.menuOptions[0] ? data.menuOptions[0].name : '')
        }));

        setGuestData({
          ...data.guest,
          members: normalizedMembers
        });
        if (data.menuOptions?.length) {
          setAvailableMeals(data.menuOptions);
        }

        // Generate QR badge for their pass
        const passUrl = `${window.location.origin}/?rsvp=${encodeURIComponent(data.guest.code)}`;
        const qrDataUrl = await QRCode.toDataURL(passUrl, {
          width: 220,
          margin: 2,
          color: { dark: '#1e2a22', light: '#ffffff' }
        });
        setGuestQrImage(qrDataUrl);
      }
    } catch (err) {
      setError('Unable to reach the wedding RSVP server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function startCameraScanner() {
    setCameraError('');
    setScannerOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        await videoRef.current.play();
        requestAnimationFrame(tickCameraScan);
      }
    } catch (err) {
      setCameraError(
        'Camera access was denied or no camera was detected. You can upload a photo of your QR code or type your code below!'
      );
    }
  }

  function stopCameraScanner() {
    if (scanFrameRef.current) {
      cancelAnimationFrame(scanFrameRef.current);
      scanFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScannerOpen(false);
  }

  function tickCameraScan() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (qrResult && qrResult.data) {
        const extracted = extractCodeFromRawText(qrResult.data);
        stopCameraScanner();
        setInputCode(extracted);
        lookupInvitation(extracted);
        return;
      }
    }
    scanFrameRef.current = requestAnimationFrame(tickCameraScan);
  }

  function handleQrImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrResult = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrResult && qrResult.data) {
          const extracted = extractCodeFromRawText(qrResult.data);
          setInputCode(extracted);
          lookupInvitation(extracted);
        } else {
          setError('Could not detect a valid QR code in that image. Please try another photo or enter your code directly.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function updateMemberField(memberId, field, value) {
    if (!guestData) return;
    setGuestData({
      ...guestData,
      members: guestData.members.map((m) =>
        m.id === memberId ? { ...m, [field]: value } : m
      )
    });
  }

  async function handleSubmitRsvp(e) {
    e.preventDefault();
    if (!guestData) return;

    setSaving(true);
    setError('');
    setSaveSuccess('');

    try {
      const res = await fetch(`/api/rsvp/${encodeURIComponent(guestData.code)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: guestData.email,
          phone: guestData.phone,
          members: guestData.members,
          dietaryNotes: guestData.dietaryNotes,
          songRequest: guestData.songRequest,
          messageToCouple: guestData.messageToCouple
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save your RSVP.');
      } else {
        setGuestData(data.guest);
        setSaveSuccess('Your RSVP has been recorded! You can update your selections anytime before the deadline using your QR code.');
        if (onRsvpSubmitted) onRsvpSubmitted();
      }
    } catch (err) {
      setError('Network error saving your RSVP. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rsvp-tab-content">
      <div className="section-header-box">
        <span className="section-kicker">04 • Personalized QR Invitation</span>
        <h2 className="section-title">Respond to Your Invitation</h2>
        <p className="section-subtitle">
          Scan the unique QR code included with your wedding invitation—or enter your personal invitation code below—to unlock your household’s RSVP card.
          {rsvpDeadline ? ` Kindly respond by ${rsvpDeadline}.` : ''}
        </p>
      </div>

      {/* QR Code Lookup & Scanner Banner */}
      <div className="qr-lookup-banner" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.16)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
              <QrCode size={15} /> Instant QR Code Access
            </div>
            <h3 style={{ fontSize: '2.1rem', marginBottom: '0.5rem', color: '#fff' }}>
              Have Your Wedding QR Card?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.86)', fontSize: '0.94rem', marginBottom: '1.25rem' }}>
              Point your phone’s camera at the QR code on your paper invitation to open your RSVP automatically, use our built-in camera scanner, or type your 9-character code (e.g., <strong>ROSE-4829</strong>).
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {!scannerOpen ? (
                <button
                  type="button"
                  onClick={startCameraScanner}
                  className="btn-secondary"
                  style={{ background: '#ffffff', color: 'var(--text-primary)', border: 'none' }}
                >
                  <Camera size={17} /> Scan QR with Camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCameraScanner}
                  className="btn-danger"
                >
                  Stop Camera Scanner
                </button>
              )}

              <label
                className="btn-secondary"
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer'
                }}
              >
                <Upload size={17} /> Upload QR Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Code Input Card */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookupInvitation(inputCode);
            }}
            style={{
              background: '#ffffff',
              color: 'var(--text-primary)',
              padding: '1.6rem',
              borderRadius: '18px',
              boxShadow: '0 14px 34px rgba(0,0,0,0.18)'
            }}
          >
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Enter Unique Invitation Code
            </label>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ROSE-4829"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              />
              <button type="submit" className="btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                <Search size={17} /> {loading ? 'Checking...' : 'Unlock RSVP'}
              </button>
            </div>
            <p style={{ fontSize: '0.79rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
              Your unique code is printed directly below the QR square on your physical RSVP insert card.
            </p>
          </form>
        </div>

        {/* Live Camera Viewfinder if active */}
        {scannerOpen && (
          <div
            style={{
              marginTop: '1.5rem',
              background: 'rgba(0,0,0,0.35)',
              padding: '1.25rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}
          >
            {cameraError ? (
              <p style={{ color: '#fecaca', fontSize: '0.92rem' }}>{cameraError}</p>
            ) : (
              <div>
                <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  Hold your invitation's QR code steady in front of your camera...
                </p>
                <video
                  ref={videoRef}
                  style={{
                    width: '100%',
                    maxWidth: '380px',
                    borderRadius: '14px',
                    border: '3px solid var(--accent-secondary)'
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Demo QR Tray so the user can test scanning or clicking sample guest QR codes */}
      {sampleInvites.length > 0 && (
        <div
          className="surface-card"
          style={{
            marginBottom: '2.25rem',
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-secondary)',
            borderStyle: 'dashed'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <QrCode size={19} color="var(--accent-primary)" />
              <div>
                <strong style={{ fontSize: '0.95rem' }}>Interactive Guest QR Code Preview Tray</strong>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginLeft: '0.6rem' }}>
                  Scan any QR below with your phone camera or click a guest card to test their personalized RSVP view:
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => setShowDemoTray(!showDemoTray)}
            >
              <Eye size={14} /> {showDemoTray ? 'Hide Sample QRs' : 'Show Sample QRs'}
            </button>
          </div>

          {showDemoTray && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.9rem',
                marginTop: '1.15rem'
              }}
            >
              {sampleInvites.map((inv) => {
                const isSelected = guestData?.code === inv.code;
                return (
                  <div
                    key={inv.code}
                    onClick={() => {
                      setInputCode(inv.code);
                      lookupInvitation(inv.code);
                    }}
                    style={{
                      background: isSelected ? 'var(--accent-primary)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      borderRadius: '14px',
                      padding: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.16s ease'
                    }}
                  >
                    {demoQrMap[inv.code] && (
                      <img
                        src={demoQrMap[inv.code]}
                        alt={`QR for ${inv.householdName}`}
                        style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          background: '#fff',
                          padding: '4px'
                        }}
                      />
                    )}
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                      {inv.householdName}
                    </div>
                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: isSelected ? 'var(--accent-light)' : 'var(--accent-secondary)'
                      }}
                    >
                      CODE: {inv.code}
                    </div>
                    <div style={{ fontSize: '0.73rem', opacity: 0.8, marginTop: '0.2rem' }}>
                      {inv.memberCount} {inv.memberCount === 1 ? 'Guest' : 'Guests'} •{' '}
                      {inv.rsvpStatus === 'responded' ? 'Responded ✓' : 'Awaiting RSVP'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '1rem 1.25rem',
            borderRadius: '14px',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 500
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Banner */}
      {saveSuccess && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1.5px solid #6ee7b7',
            color: '#065f46',
            padding: '1.25rem 1.5rem',
            borderRadius: '16px',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '1.05rem' }}>{saveSuccess}</div>
            <div style={{ fontSize: '0.84rem', fontWeight: 400, marginTop: '0.15rem' }}>
              We have updated your household status for {coupleShortNames || 'the couple'}.
            </div>
          </div>
        </div>
      )}

      {/* Personalized Invitation Form once unlocked */}
      {guestData && (
        <form onSubmit={handleSubmitRsvp} className="surface-card">
          {/* Personalized Welcome Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingBottom: '1.75rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="role-badge" style={{ marginBottom: 0 }}>
                  Invitation Code: {guestData.code}
                </span>
                {guestData.tableNumber && (
                  <span className="role-badge" style={{ marginBottom: 0, background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    {guestData.tableNumber}
                  </span>
                )}
                <span
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.7rem',
                    borderRadius: '999px',
                    background: guestData.rsvpStatus === 'responded' ? '#dcfce7' : '#fef3c7',
                    color: guestData.rsvpStatus === 'responded' ? '#166534' : '#92400e'
                  }}
                >
                  {guestData.rsvpStatus === 'responded' ? '✓ RSVP Confirmed' : 'Awaiting Response'}
                </span>
              </div>

              <h3 style={{ fontSize: '2.35rem', marginBottom: '0.4rem' }}>
                Welcome, {guestData.householdName}
              </h3>

              {guestData.personalNote && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    background: 'var(--bg-accent-subtle)',
                    padding: '0.95rem 1.2rem',
                    borderRadius: '14px',
                    borderLeft: '4px solid var(--accent-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    fontStyle: 'italic'
                  }}
                >
                  “{guestData.personalNote}”
                </div>
              )}
            </div>

            {guestQrImage && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.9rem',
                  borderRadius: '16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <img
                  src={guestQrImage}
                  alt="Your Personal RSVP QR Code"
                  style={{ width: '115px', height: '115px', display: 'block', margin: '0 auto 0.35rem', borderRadius: '8px' }}
                />
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  {guestData.code}
                </div>
              </div>
            )}
          </div>

          {/* Individual Party Member Responses */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
              1. Attendance & Entrée Selections ({guestData.members?.length || 0}{' '}
              {guestData.members?.length === 1 ? 'Guest' : 'Guests'} in Your Party)
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              Please indicate whether each member of your party will attend and choose their plated dinner entrée.
            </p>

            {(guestData.members || []).map((member, idx) => (
              <div key={member.id || idx} className="rsvp-member-row">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.25rem',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Guest {idx + 1}
                    </span>
                    <div className="serif-font" style={{ fontSize: '1.65rem', fontWeight: 700 }}>
                      {member.name}
                    </div>
                  </div>

                  <div className="attendance-toggle-group">
                    <button
                      type="button"
                      className={`attendance-btn yes ${member.attending === true ? 'selected' : ''}`}
                      onClick={() => updateMemberField(member.id, 'attending', true)}
                    >
                      <CheckCircle2 size={18} /> Joyfully Accepts
                    </button>
                    <button
                      type="button"
                      className={`attendance-btn no ${member.attending === false ? 'selected' : ''}`}
                      onClick={() => updateMemberField(member.id, 'attending', false)}
                    >
                      <XCircle size={18} /> Regretfully Declines
                    </button>
                  </div>
                </div>

                {member.attending === true && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '1rem',
                      marginTop: '1.15rem',
                      paddingTop: '1.15rem',
                      borderTop: '1px dashed var(--border-color)'
                    }}
                  >
                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                        <Utensils size={13} /> Plated Dinner Entrée Selection
                      </label>
                      <select
                        className="form-select"
                        value={member.mealChoice || ''}
                        onChange={(e) => updateMemberField(member.id, 'mealChoice', e.target.value)}
                      >
                        <option value="">-- Choose an Entrée --</option>
                        {availableMeals.map((meal) => (
                          <option key={meal.id || meal.name} value={meal.name}>
                            {meal.name} ({meal.tag})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                        Dietary Restrictions / Allergies (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Gluten-free, nut allergy, vegan..."
                        value={member.dietary || ''}
                        onChange={(e) => updateMemberField(member.id, 'dietary', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Household Contact, Song Request & Note to Couple */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1.65rem', marginBottom: '1rem' }}>
              2. Final Touches & Dance Floor Request
            </h4>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Confirmation Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={guestData.email || ''}
                  onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Music size={14} /> Song That Will Get You on the Dance Floor
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., September - Earth, Wind & Fire"
                  value={guestData.songRequest || ''}
                  onChange={(e) => setGuestData({ ...guestData, songRequest: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Heart size={14} /> Personal Note or Wishes for the Couple
              </label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Leave a note, marriage advice, or travel plans..."
                value={guestData.messageToCouple || ''}
                onChange={(e) => setGuestData({ ...guestData, messageToCouple: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '0.95rem 2rem', fontSize: '1rem' }}>
              <Sparkles size={18} />
              {saving ? 'Saving Your RSVP...' : 'Submit Official RSVP Response'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
