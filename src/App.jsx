import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  Sparkles,
  Wine,
  QrCode,
  Calendar,
  MapPin,
  Settings,
  Hash,
  Crown
} from 'lucide-react';
import AboutTab from './components/AboutTab.jsx';
import CeremonyTab from './components/CeremonyTab.jsx';
import ReceptionTab from './components/ReceptionTab.jsx';
import RsvpTab from './components/RsvpTab.jsx';
import WeddingPartyTab from './components/WeddingPartyTab.jsx';
import UnderConstructionView from './components/UnderConstructionView.jsx';
import CmsPortal from './components/CmsPortal.jsx';
import { renderDynamicIcon, GothicRoseArchOrnament, RichText } from './components/PageBlockRenderer.jsx';

const DEFAULT_BIG_TABS = [
  {
    id: 'about',
    step: '01 • Kindred Spirits',
    title: 'About Us',
    subtitle: 'Our autumn story, portraits & wedding party',
    icon: 'Heart',
    visible: true
  },
  {
    id: 'ceremony',
    step: '02 • Twilight Vows',
    title: 'Ceremony',
    subtitle: 'Candlelit manor gardens, attire & shuttles',
    icon: 'Sparkles',
    visible: true
  },
  {
    id: 'reception',
    step: '03 • The Feast',
    title: 'Reception',
    subtitle: 'Conservatory banquet, apothecary bar & hotels',
    icon: 'Wine',
    visible: true
  },
  {
    id: 'rsvp',
    step: '04 • Respond',
    title: 'QR Code RSVP',
    subtitle: 'Scan your invitation QR or enter your code',
    icon: 'QrCode',
    visible: true
  }
];

export function applyThemeAndCustomColors(siteSettings) {
  const theme = siteSettings?.theme || 'cathedral-roses';
  document.documentElement.setAttribute('data-theme', theme);
  const root = document.documentElement;
  const cc = siteSettings?.customColors;
  if (cc && cc.enabled) {
    if (cc.bgPrimary) root.style.setProperty('--bg-primary', cc.bgPrimary);
    if (cc.bgCard) root.style.setProperty('--bg-card', cc.bgCard);
    if (cc.accentPrimary) root.style.setProperty('--accent-primary', cc.accentPrimary);
    if (cc.accentSecondary) root.style.setProperty('--accent-secondary', cc.accentSecondary);
    if (cc.textPrimary) root.style.setProperty('--text-primary', cc.textPrimary);
  } else {
    root.style.removeProperty('--bg-primary');
    root.style.removeProperty('--bg-card');
    root.style.removeProperty('--accent-primary');
    root.style.removeProperty('--accent-secondary');
    root.style.removeProperty('--text-primary');
  }
}

function checkIsCmsDesk() {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  return path === '/cmsdesk' || window.location.search.includes('cmsdesk') || window.location.hash === '#cmsdesk';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeFromUrl, setQrCodeFromUrl] = useState('');
  const [cmsOpen, setCmsOpen] = useState(() => checkIsCmsDesk());
  const [unlockedWeddingPartyGuest, setUnlockedWeddingPartyGuest] = useState(null);
  const [adminBypassConstruction, setAdminBypassConstruction] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (res.ok) {
        setSiteData(data);
        applyThemeAndCustomColors(data.siteSettings);
      }
    } catch (err) {
      console.error('Failed to fetch wedding content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();

    function onLocationChange() {
      if (checkIsCmsDesk()) {
        setCmsOpen(true);
      }
    }
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);

    const params = new URLSearchParams(window.location.search);
    const scannedCode = params.get('rsvp') || params.get('code');
    if (scannedCode) {
      setQrCodeFromUrl(scannedCode.trim().toUpperCase());
      setActiveTab('rsvp');
    }

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, [loadContent]);

  function handleCloseCms() {
    setCmsOpen(false);
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (path === '/cmsdesk' || window.location.hash === '#cmsdesk') {
        window.history.pushState({}, '', '/');
      }
    }
  }

  function handleSelectTab(tabId) {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSimulateQrScan(code) {
    setCmsOpen(false);
    setQrCodeFromUrl(code);
    setActiveTab('rsvp');
    const url = new URL(window.location.href);
    url.searchParams.set('rsvp', code);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading && !siteData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem' }}>
        <Heart size={36} color="var(--accent-secondary)" />
        <div className="serif-font" style={{ fontSize: '1.75rem' }}>Loading Gothic Noir Celebration...</div>
      </div>
    );
  }

  const { siteSettings, aboutUs, ceremony, reception, weddingPartyPage, rsvpPage, sampleInvites } = siteData || {};
  const isUnderConstruction = Boolean(siteSettings?.underConstruction?.enabled);

  if (isUnderConstruction && !adminBypassConstruction) {
    return (
      <>
        <UnderConstructionView
          siteSettings={siteSettings}
          aboutUs={aboutUs}
          rsvpPage={rsvpPage}
          reception={reception}
          sampleInvites={sampleInvites}
          initialCode={qrCodeFromUrl}
          onPreviewFullSite={() => setAdminBypassConstruction(true)}
          onRsvpSubmitted={loadContent}
          onUnlockWeddingParty={(guest) => setUnlockedWeddingPartyGuest(guest)}
        />
        <CmsPortal
          isOpen={cmsOpen}
          onClose={handleCloseCms}
          onContentUpdated={loadContent}
          onSimulateQrScan={handleSimulateQrScan}
        />
      </>
    );
  }

  const baseTabs = (siteSettings?.bigTabs || DEFAULT_BIG_TABS).filter((t) => t.visible !== false);
  const visibleTabs = unlockedWeddingPartyGuest || activeTab === 'wedding-party'
    ? [
        ...baseTabs,
        {
          id: 'wedding-party',
          step: weddingPartyPage?.tabStep || '05 • Inner Circle',
          title: weddingPartyPage?.tabTitle || 'Wedding Party',
          subtitle: weddingPartyPage?.tabSubtitle || 'Exclusive rehearsal, call times & VIP info',
          icon: 'Star',
          visible: true
        }
      ]
    : baseTabs;
  const heroCrop = siteSettings?.heroBannerCrop || { x: 50, y: 50, zoom: 1 };

  return (
    <div className="wedding-app-wrapper">
      {isUnderConstruction && adminBypassConstruction && (
        <div
          className="no-print"
          style={{
            background: 'linear-gradient(90deg, #5e1123, #2b0912)',
            borderBottom: '1.5px solid var(--border-gold)',
            padding: '0.55rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.82rem'
          }}
        >
          <span style={{ color: '#fff', fontWeight: 600 }}>
            🚧 <strong style={{ color: 'var(--accent-secondary)' }}>Under Construction Mode is ACTIVE for Visitors</strong> — You are currently previewing the full site in Admin Bypass mode.
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.28rem 0.75rem', fontSize: '0.75rem' }}
              onClick={() => setAdminBypassConstruction(false)}
            >
              View Under Construction Screen
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.28rem 0.75rem', fontSize: '0.75rem' }}
              onClick={() => setCmsOpen(true)}
            >
              Edit in CMS Studio
            </button>
          </div>
        </div>
      )}
      {/* Top Bar with Quick CMS Studio Access */}
      <div className="top-utility-bar no-print">
        <div className="top-utility-left">
          <span>
            <strong><RichText text={siteSettings?.shortNames || 'Elena & Julian'} /></strong>
            {siteSettings?.topBarText !== '' ? (
              <>
                {' • '}
                <RichText text={siteSettings?.topBarText || 'Wedding Celebration'} />
              </>
            ) : (
              ''
            )}
          </span>
          {siteSettings?.hashtag && (
            <span style={{ opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-secondary)' }}>
              <Hash size={13} />
              <RichText text={siteSettings.hashtag.replace(/^#/, '')} />
            </span>
          )}
        </div>

        <div className="top-utility-actions" style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '0.36rem 0.85rem',
              fontSize: '0.76rem',
              borderColor: 'var(--border-gold)',
              color: 'var(--accent-secondary)'
            }}
            onClick={() => handleSelectTab('wedding-party')}
          >
            <Crown size={13} />{' '}
            {unlockedWeddingPartyGuest
              ? `${siteSettings?.weddingPartyBtnText || 'Wedding Party Portal'} (Unlocked ✓)`
              : siteSettings?.weddingPartyBtnText || 'Wedding Party Portal'}
          </button>
        </div>
      </div>

      {/* Gothic Noir Cathedral Archway Hero Banner */}
      <header
        className="wedding-hero no-print"
        style={{
          backgroundImage: `url(${
            siteSettings?.heroBannerUrl ||
            'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=85'
          })`,
          backgroundPosition: `${heroCrop.x ?? 50}% ${heroCrop.y ?? 50}%`
        }}
      >
        <div className="hero-gothic-arch-frame">
          <span className="hero-eyebrow">
            <RichText text={siteSettings?.heroEyebrow || '✦ Cathedral Roses & Twilight Vows • Till Death Do Us Party ✦'} />
          </span>
          <h1 className="hero-couple-names">
            <RichText text={siteSettings?.coupleNames || 'Elena Vance & Julian Sterling'} />
          </h1>
          <GothicRoseArchOrnament width={240} />
          <p className="hero-tagline">
            <RichText
              text={
                siteSettings?.heroTagline ||
                'Beneath the stone cathedral archways and crimson baccara roses, we invite you to celebrate our union.'
              }
            />
          </p>

          <div className="hero-meta-pills">
            <span className="hero-pill">
              <Calendar size={15} color="var(--accent-secondary)" />{' '}
              <RichText text={siteSettings?.weddingDateDisplay || 'Saturday, October 23, 2027'} />
            </span>
            <span className="hero-pill">
              <MapPin size={15} color="var(--accent-secondary)" />{' '}
              <RichText text={siteSettings?.locationSummary || 'Tarrytown • Hudson Valley, NY'} />
            </span>
          </div>
        </div>
      </header>

      {/* BIG TABS AS THE MAIN DISPLAY */}
      <nav className="big-tabs-shell no-print" aria-label="Main Wedding Sections">
        <div
          className="big-tabs-grid"
          style={{
            gridTemplateColumns: `repeat(${Math.min(visibleTabs.length, 5)}, 1fr)`
          }}
        >
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`big-tab-card ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectTab(tab.id)}
              >
                <div className="big-tab-top">
                  <div className="big-tab-icon-wrap">
                    {renderDynamicIcon(tab.icon || 'Heart', 22)}
                  </div>
                  <span className="big-tab-step"><RichText text={tab.step} /></span>
                </div>

                <div>
                  <div className="big-tab-title"><RichText text={tab.title} /></div>
                  <div className="big-tab-subtitle"><RichText text={tab.subtitle} /></div>
                </div>

                <div className="big-tab-active-bar" />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Active Page Stage */}
      <main className="page-stage no-print" key={activeTab}>
        {activeTab === 'about' && (
          <AboutTab
            aboutUs={aboutUs}
            siteSettings={siteSettings}
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === 'ceremony' && (
          <CeremonyTab
            ceremony={ceremony}
            siteSettings={siteSettings}
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === 'reception' && (
          <ReceptionTab
            reception={reception}
            siteSettings={siteSettings}
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === 'rsvp' && (
          <RsvpTab
            rsvpPage={rsvpPage}
            siteSettings={siteSettings}
            initialCode={qrCodeFromUrl}
            sampleInvites={sampleInvites}
            menuOptions={reception?.menuOptions || []}
            rsvpDeadline={siteSettings?.rsvpDeadline}
            coupleShortNames={siteSettings?.shortNames}
            onRsvpSubmitted={loadContent}
            onUnlockWeddingParty={(guest) => setUnlockedWeddingPartyGuest(guest)}
            onSelectTab={handleSelectTab}
          />
        )}

        {activeTab === 'wedding-party' && (
          <WeddingPartyTab
            weddingPartyPage={weddingPartyPage}
            siteSettings={siteSettings}
            unlockedGuest={unlockedWeddingPartyGuest}
            onUnlockWeddingParty={(guest) => setUnlockedWeddingPartyGuest(guest)}
            sampleInvites={sampleInvites}
            onSelectTab={handleSelectTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className="no-print"
        style={{
          borderTop: '1px solid var(--border-gold)',
          background: 'var(--bg-secondary)',
          padding: '2.75rem 1.5rem',
          textAlign: 'center'
        }}
      >
        <GothicRoseArchOrnament width={200} />
        {siteSettings?.footerText && (
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--accent-secondary)', marginBottom: '0.35rem' }}>
            <RichText text={siteSettings.footerText} />
          </div>
        )}
        <div className="serif-font" style={{ fontSize: '2.1rem', marginBottom: '0.35rem' }}>
          <RichText text={siteSettings?.coupleNames} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.15rem' }}>
          <RichText text={siteSettings?.weddingDateDisplay} /> • <RichText text={siteSettings?.locationSummary} />
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => handleSelectTab('rsvp')}>
            <QrCode size={15} /> QR Code RSVP
          </button>
        </div>
      </footer>

      {/* Robust Drag-and-Drop Back-End CMS Studio (Accessible via /cmsdesk) */}
      <CmsPortal
        isOpen={cmsOpen}
        onClose={handleCloseCms}
        onContentUpdated={loadContent}
        onSimulateQrScan={handleSimulateQrScan}
      />
    </div>
  );
}
