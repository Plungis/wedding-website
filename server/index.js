import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { defaultDatabase } from './defaultData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const DB_BACKUP_PATH = path.join(DATA_DIR, 'db.backup.json');
const DB_TMP_PATH = path.join(DATA_DIR, 'db.json.tmp');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

function syncReceptionMenuOptions(db) {
  if (db?.reception?.blocks) {
    const menuBlock = db.reception.blocks.find((b) => b.type === 'dinner_menu');
    if (menuBlock && Array.isArray(menuBlock.items)) {
      db.reception.menuOptions = menuBlock.items;
    }
  }
}

function normalizeGuestPlusOnes(guest) {
  if (!guest) return guest;
  const rawMembers = Array.isArray(guest.members) ? guest.members : [];
  const normalized = rawMembers.map((m, i) => {
    const looksLikePlusOne =
      Boolean(m.isPlusOne) ||
      /\(plus one\)|\+1 guest|^plus one$/i.test((m.name || '').trim());
    const cleanedName =
      looksLikePlusOne && /^(\+1 guest|plus one|guest \d+|alex rivera \(plus one\))$/i.test((m.name || '').trim())
        ? ''
        : (m.name || '').trim();
    return {
      ...m,
      id: m.id || `m-${Date.now()}-${i}`,
      isPlusOne: looksLikePlusOne,
      name: cleanedName
    };
  });

  const existingPlusOnes = normalized.filter((m) => m.isPlusOne);
  const targetPlusOnes =
    guest.plusOnesAllowed !== undefined && guest.plusOnesAllowed !== null
      ? Math.max(0, Number(guest.plusOnesAllowed))
      : existingPlusOnes.length;

  const namedMembers = normalized.filter((m) => !m.isPlusOne);
  const finalPlusOnes = [...existingPlusOnes];

  while (finalPlusOnes.length < targetPlusOnes) {
    finalPlusOnes.push({
      id: `plusone-${Date.now()}-${finalPlusOnes.length}`,
      name: '',
      isPlusOne: true,
      attending: null,
      mealChoice: '',
      dietary: ''
    });
  }

  const trimmedPlusOnes = finalPlusOnes.slice(0, targetPlusOnes);
  return {
    ...guest,
    category: guest.category || 'Friend',
    isWeddingParty: Boolean(guest.isWeddingParty),
    plusOnesAllowed: targetPlusOnes,
    members: [...namedMembers, ...trimmedPlusOnes]
  };
}

function readValidJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    if (!raw || !raw.trim()) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Ensure data directory and database file exist
function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let parsed =
      readValidJsonFile(DB_PATH) ||
      readValidJsonFile(DB_BACKUP_PATH) ||
      readValidJsonFile(DB_TMP_PATH);

    if (!parsed) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDatabase, null, 2), 'utf-8');
      return structuredClone(defaultDatabase);
    }
    const merged = {
      ...structuredClone(defaultDatabase),
      ...parsed,
      siteSettings: {
        ...structuredClone(defaultDatabase.siteSettings),
        ...(parsed.siteSettings || {}),
        underConstruction: {
          ...structuredClone(defaultDatabase.siteSettings.underConstruction),
          ...(parsed.siteSettings?.underConstruction || {})
        }
      },
      aboutUs: {
        ...structuredClone(defaultDatabase.aboutUs),
        ...(parsed.aboutUs || {}),
        blocks: parsed.aboutUs?.blocks || structuredClone(defaultDatabase.aboutUs.blocks)
      },
      ceremony: {
        ...structuredClone(defaultDatabase.ceremony),
        ...(parsed.ceremony || {}),
        blocks: parsed.ceremony?.blocks || structuredClone(defaultDatabase.ceremony.blocks)
      },
      reception: {
        ...structuredClone(defaultDatabase.reception),
        ...(parsed.reception || {}),
        blocks: parsed.reception?.blocks || structuredClone(defaultDatabase.reception.blocks)
      },
      weddingPartyPage: {
        ...structuredClone(defaultDatabase.weddingPartyPage),
        ...(parsed.weddingPartyPage || {}),
        blocks: parsed.weddingPartyPage?.blocks || structuredClone(defaultDatabase.weddingPartyPage.blocks)
      },
      rsvpPage: {
        ...structuredClone(defaultDatabase.rsvpPage),
        ...(parsed.rsvpPage || {}),
        blocks: parsed.rsvpPage?.blocks || structuredClone(defaultDatabase.rsvpPage.blocks)
      }
    };
    if (!merged.siteSettings.theme || merged.siteSettings.theme === 'fall-goth') {
      merged.siteSettings.theme = 'cathedral-roses';
    }
    if (Array.isArray(merged.guests)) {
      merged.guests = merged.guests.map((g) => normalizeGuestPlusOnes(g));
    }
    syncReceptionMenuOptions(merged);
    return merged;
  } catch (err) {
    console.error('Error loading database, falling back to default:', err);
    return structuredClone(defaultDatabase);
  }
}

function saveDatabase(db, revisionSummary = null, section = 'cms') {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (revisionSummary) {
    db.revisions = [
      {
        id: `rev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        section,
        summary: revisionSummary
      },
      ...(db.revisions || []).slice(0, 49)
    ];
  }
  const serialized = JSON.stringify(db, null, 2);
  try {
    fs.writeFileSync(DB_TMP_PATH, serialized, 'utf-8');
    fs.renameSync(DB_TMP_PATH, DB_PATH);
  } catch {
    // Fallback for Windows Docker volume bind mounts where renameSync over an existing file can throw EBUSY/EPERM
    fs.writeFileSync(DB_PATH, serialized, 'utf-8');
  }
  try {
    fs.writeFileSync(DB_BACKUP_PATH, serialized, 'utf-8');
  } catch {
    // ignore backup write error
  }
}

function computeAnalytics(guests = [], menuOptions = []) {
  let totalHouseholds = guests.length;
  let respondedHouseholds = 0;
  let pendingHouseholds = 0;
  let totalInvitedSeats = 0;
  let attendingCount = 0;
  let declinedCount = 0;
  let pendingSeats = 0;
  const mealCounts = {};

  menuOptions.forEach((m) => {
    mealCounts[m.name] = 0;
  });

  guests.forEach((guest) => {
    if (guest.rsvpStatus === 'responded') {
      respondedHouseholds += 1;
    } else {
      pendingHouseholds += 1;
    }
    (guest.members || []).forEach((member) => {
      totalInvitedSeats += 1;
      if (member.attending === true) {
        attendingCount += 1;
        if (member.mealChoice) {
          mealCounts[member.mealChoice] = (mealCounts[member.mealChoice] || 0) + 1;
        }
      } else if (member.attending === false) {
        declinedCount += 1;
      } else {
        pendingSeats += 1;
      }
    });
  });

  return {
    totalHouseholds,
    respondedHouseholds,
    pendingHouseholds,
    totalInvitedSeats,
    attendingCount,
    declinedCount,
    pendingSeats,
    mealCounts
  };
}

function requireAdmin(req, res, next) {
  const db = loadDatabase();
  const provided = req.headers['x-admin-passcode'] || req.query.passcode || req.body?.passcode;
  const expected = db.siteSettings?.adminPasscode || 'wedding2026';
  if (provided !== expected) {
    return res.status(401).json({ error: 'Invalid admin passcode. Default passcode is wedding2026.' });
  }
  req.db = db;
  next();
}

const CODE_PREFIXES = ['ROSE', 'OLIVE', 'CHAMP', 'VELVET', 'GARDEN', 'LILY', 'VINE', 'GOLD', 'PEONY', 'CYPRESS'];

function generateUniqueGuestCode(existingGuests = []) {
  const existingCodes = new Set(existingGuests.map((g) => (g.code || '').toUpperCase()));
  for (let i = 0; i < 100; i++) {
    const prefix = CODE_PREFIXES[Math.floor(Math.random() * CODE_PREFIXES.length)];
    const digits = Math.floor(1000 + Math.random() * 9000);
    const candidate = `${prefix}-${digits}`;
    if (!existingCodes.has(candidate)) {
      return candidate;
    }
  }
  return `INV-${Date.now().toString().slice(-4)}`;
}

// 1. Public content endpoint
app.get('/api/content', (req, res) => {
  const db = loadDatabase();
  const { adminPasscode, ...publicSettings } = db.siteSettings || {};
  // Provide demo guest codes list (just code + householdName) so users testing the site can see how QR codes work
  const sampleInvites = (db.guests || []).map((g) => ({
    code: g.code,
    householdName: g.householdName,
    category: g.category || 'Friend',
    isWeddingParty: Boolean(g.isWeddingParty),
    rsvpStatus: g.rsvpStatus,
    memberCount: (g.members || []).length,
    plusOnesAllowed: g.plusOnesAllowed || (g.members || []).filter((m) => m.isPlusOne).length
  }));

  res.json({
    siteSettings: publicSettings,
    aboutUs: db.aboutUs,
    ceremony: db.ceremony,
    reception: db.reception,
    weddingPartyPage: db.weddingPartyPage,
    rsvpPage: db.rsvpPage,
    sampleInvites
  });
});

// 2. Public QR Code lookup for RSVP
app.get('/api/rsvp/:code', (req, res) => {
  const db = loadDatabase();
  const rawInput = (req.params.code || '').trim().toUpperCase();
  const guest = (db.guests || []).find((g) => (g.code || '').toUpperCase() === rawInput);

  if (!guest) {
    return res.status(404).json({
      error: `We couldn't find an invitation matching code "${rawInput}". Please double-check your invitation card or scan your QR code again.`
    });
  }

  res.json({
    guest,
    menuOptions: db.reception?.menuOptions || [],
    rsvpDeadline: db.siteSettings?.rsvpDeadline || ''
  });
});

// 3. Submit RSVP using unique QR code
app.post('/api/rsvp/:code', (req, res) => {
  const db = loadDatabase();
  const rawInput = (req.params.code || '').trim().toUpperCase();
  const guestIndex = (db.guests || []).findIndex((g) => (g.code || '').toUpperCase() === rawInput);

  if (guestIndex === -1) {
    return res.status(404).json({ error: 'Invitation code not found.' });
  }

  const existing = db.guests[guestIndex];
  const { members, dietaryNotes, songRequest, messageToCouple, email, phone } = req.body;

  const updatedMembers = Array.isArray(members)
    ? members.map((m, idx) => {
        const isPlusOne = Boolean(m.isPlusOne);
        return {
          id: m.id || `m-${Date.now()}-${idx}`,
          name: (m.name || (isPlusOne ? '' : `Guest ${idx + 1}`)).trim(),
          isPlusOne,
          attending: m.attending === true ? true : m.attending === false ? false : false,
          mealChoice: m.attending ? m.mealChoice || '' : '',
          dietary: (m.dietary || '').trim()
        };
      })
    : existing.members;

  const updatedGuest = {
    ...existing,
    email: email !== undefined ? email : existing.email,
    phone: phone !== undefined ? phone : existing.phone,
    members: updatedMembers,
    dietaryNotes: dietaryNotes !== undefined ? dietaryNotes : existing.dietaryNotes,
    songRequest: songRequest !== undefined ? songRequest : existing.songRequest,
    messageToCouple: messageToCouple !== undefined ? messageToCouple : existing.messageToCouple,
    rsvpStatus: 'responded',
    respondedAt: new Date().toISOString()
  };

  db.guests[guestIndex] = updatedGuest;
  const attendingTotal = updatedMembers.filter((m) => m.attending).length;
  saveDatabase(
    db,
    `RSVP received from ${updatedGuest.householdName} (${ updatedGuest.code }): ${attendingTotal}/${updatedMembers.length} attending`,
    'rsvp'
  );

  res.json({
    message: 'Your RSVP has been saved! Thank you for responding.',
    guest: updatedGuest
  });
});

// 4. Generate QR code image & SVG for any guest code
app.get('/api/qr/:code', async (req, res) => {
  try {
    const code = (req.params.code || '').trim().toUpperCase();
    const baseUrl = req.query.baseUrl || 'http://localhost:5173';
    const cleanBase = baseUrl.replace(/\/$/, '');
    const targetUrl = `${cleanBase}/?rsvp=${encodeURIComponent(code)}`;

    const dataUrl = await QRCode.toDataURL(targetUrl, {
      width: 360,
      margin: 2,
      color: {
        dark: '#1f2d24',
        light: '#ffffff'
      }
    });

    const svg = await QRCode.toString(targetUrl, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#1f2d24',
        light: '#ffffff'
      }
    });

    res.json({
      code,
      targetUrl,
      dataUrl,
      svg
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code', details: err.message });
  }
});

// 5. Admin Authentication & Full CMS Data Load
app.post('/api/admin/login', (req, res) => {
  const db = loadDatabase();
  const { passcode } = req.body || {};
  const expected = db.siteSettings?.adminPasscode || 'wedding2026';

  if (passcode !== expected) {
    return res.status(401).json({ error: 'Incorrect passcode. Try "wedding2026".' });
  }

  res.json({
    authenticated: true,
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

app.get('/api/admin/data', requireAdmin, (req, res) => {
  const db = req.db;
  res.json({
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 6. Update CMS Section (siteSettings, aboutUs, ceremony, reception, weddingPartyPage, rsvpPage)
app.put('/api/admin/section/:sectionName', requireAdmin, (req, res) => {
  const db = req.db;
  const { sectionName } = req.params;
  const allowedSections = ['siteSettings', 'aboutUs', 'ceremony', 'reception', 'weddingPartyPage', 'rsvpPage'];

  if (!allowedSections.includes(sectionName)) {
    return res.status(400).json({ error: `Invalid section: ${sectionName}` });
  }

  db[sectionName] = req.body.data;
  syncReceptionMenuOptions(db);
  saveDatabase(db, `Updated ${sectionName} layout & content via Drag-and-Drop CMS`, sectionName);

  res.json({
    message: `${sectionName} updated successfully`,
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 6b. Publish Full CMS State (All Pages + Site Settings at once)
app.put('/api/admin/publish-all', requireAdmin, (req, res) => {
  const db = req.db;
  const { siteSettings, aboutUs, ceremony, reception, weddingPartyPage, rsvpPage } = req.body || {};

  if (siteSettings) db.siteSettings = siteSettings;
  if (aboutUs) db.aboutUs = aboutUs;
  if (ceremony) db.ceremony = ceremony;
  if (reception) db.reception = reception;
  if (weddingPartyPage) db.weddingPartyPage = weddingPartyPage;
  if (rsvpPage) db.rsvpPage = rsvpPage;

  syncReceptionMenuOptions(db);
  saveDatabase(db, 'Published visual drag-and-drop changes across website sections', 'visual-builder');

  res.json({
    message: 'All website sections published live!',
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 7. Create a new Guest Household & Unique QR Code
app.post('/api/admin/guests', requireAdmin, (req, res) => {
  const db = req.db;
  const payload = req.body || {};

  const customCode = (payload.code || '').trim().toUpperCase();
  const code = customCode || generateUniqueGuestCode(db.guests);

  if (db.guests.some((g) => g.code.toUpperCase() === code)) {
    return res.status(400).json({ error: `Invitation code "${code}" is already in use.` });
  }

  const plusOnesAllowed = Math.max(0, Number(payload.plusOnesAllowed || 0));

  const namedMembers = Array.isArray(payload.members) && payload.members.length > 0
    ? payload.members.map((m, i) => ({
        id: m.id || `m-${Date.now()}-${i}`,
        name: (m.name || (m.isPlusOne ? '' : `Guest ${i + 1}`)).trim(),
        isPlusOne: Boolean(m.isPlusOne),
        attending: m.attending ?? null,
        mealChoice: m.mealChoice || '',
        dietary: m.dietary || ''
      }))
    : [
        {
          id: `m-${Date.now()}-0`,
          name: payload.householdName || 'Primary Guest',
          isPlusOne: false,
          attending: null,
          mealChoice: '',
          dietary: ''
        }
      ];

  const newGuest = normalizeGuestPlusOnes({
    id: `guest-${Date.now()}`,
    code,
    householdName: (payload.householdName || 'New Guest Household').trim(),
    category: payload.category || 'Friend',
    isWeddingParty: Boolean(payload.isWeddingParty),
    plusOnesAllowed,
    email: (payload.email || '').trim(),
    phone: (payload.phone || '').trim(),
    tableNumber: (payload.tableNumber || '').trim(),
    personalNote: (payload.personalNote || '').trim(),
    rsvpStatus: payload.rsvpStatus || 'pending',
    respondedAt: payload.rsvpStatus === 'responded' ? new Date().toISOString() : null,
    dietaryNotes: payload.dietaryNotes || '',
    songRequest: payload.songRequest || '',
    messageToCouple: payload.messageToCouple || '',
    members: namedMembers
  });

  db.guests.unshift(newGuest);
  saveDatabase(db, `Added guest household "${newGuest.householdName}" with QR code ${newGuest.code}`, 'guests');

  res.status(201).json({
    guest: newGuest,
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 8. Update Guest Household or regenerate QR code
app.put('/api/admin/guests/:id', requireAdmin, (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const idx = db.guests.findIndex((g) => g.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Guest household not found.' });
  }

  const payload = req.body || {};
  const newCode = (payload.code || db.guests[idx].code).trim().toUpperCase();

  const duplicate = db.guests.some((g, i) => i !== idx && g.code.toUpperCase() === newCode);
  if (duplicate) {
    return res.status(400).json({ error: `QR code "${newCode}" is already assigned to another household.` });
  }

  db.guests[idx] = normalizeGuestPlusOnes({
    ...db.guests[idx],
    ...payload,
    code: newCode
  });

  saveDatabase(db, `Updated guest household "${db.guests[idx].householdName}" (${newCode})`, 'guests');

  res.json({
    guest: db.guests[idx],
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 9. Delete Guest Household
app.delete('/api/admin/guests/:id', requireAdmin, (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const target = db.guests.find((g) => g.id === id);

  if (!target) {
    return res.status(404).json({ error: 'Guest household not found.' });
  }

  db.guests = db.guests.filter((g) => g.id !== id);
  saveDatabase(db, `Removed guest household "${target.householdName}" (${target.code})`, 'guests');

  res.json({
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 10. Reset CMS to Default Data
app.post('/api/admin/reset', requireAdmin, (req, res) => {
  const fresh = structuredClone(defaultDatabase);
  saveDatabase(fresh, 'Reset all CMS content and guest data to factory defaults', 'system');
  res.json({
    db: fresh,
    analytics: computeAnalytics(fresh.guests, fresh.reception?.menuOptions)
  });
});

// 11. Import / Restore Full Database Backup (or Auto-Recover from Browser LocalStorage)
app.post('/api/admin/import-db', requireAdmin, (req, res) => {
  const incoming = req.body?.db;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Invalid database backup payload.' });
  }
  const merged = {
    ...structuredClone(defaultDatabase),
    ...incoming,
    siteSettings: {
      ...structuredClone(defaultDatabase.siteSettings),
      ...(incoming.siteSettings || {}),
      underConstruction: {
        ...structuredClone(defaultDatabase.siteSettings.underConstruction),
        ...(incoming.siteSettings?.underConstruction || {})
      }
    }
  };
  if (Array.isArray(merged.guests)) {
    merged.guests = merged.guests.map((g) => normalizeGuestPlusOnes(g));
  }
  syncReceptionMenuOptions(merged);
  saveDatabase(merged, 'Restored full website & guest database from backup', 'backup-restore');
  const reloaded = loadDatabase();
  res.json({
    message: 'Full database backup restored and saved to disk!',
    db: reloaded,
    analytics: computeAnalytics(reloaded.guests, reloaded.reception?.menuOptions)
  });
});

// Serve compiled React frontend in production / Docker
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  loadDatabase();
  console.log(`Wedding CMS & QR RSVP Server running at http://0.0.0.0:${PORT}`);
});

