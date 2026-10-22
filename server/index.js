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
    if (!Array.isArray(merged.cmsUsers) || merged.cmsUsers.length === 0) {
      merged.cmsUsers = [
        {
          id: 'user-admin-default',
          username: 'admin',
          passcode: merged.siteSettings?.adminPasscode || 'wedding2026',
          displayName: 'Primary Administrator',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 'user-editor-default',
          username: 'editor',
          passcode: 'edit2026',
          displayName: 'Wedding Editor',
          role: 'editor',
          createdAt: new Date().toISOString()
        }
      ];
    }
    if (!Array.isArray(merged.pendingProposals)) {
      merged.pendingProposals = [];
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

function authenticateUser(req) {
  const db = loadDatabase();
  const rawPasscode = req.headers['x-admin-passcode'] || req.headers['authorization'] || req.query.passcode || req.body?.passcode;
  const rawUsername = (req.headers['x-cms-username'] || req.query.username || req.body?.username || '').trim();

  if (!rawPasscode) return null;

  const users = Array.isArray(db.cmsUsers) ? db.cmsUsers : [];

  // 1. Match by username & passcode
  if (rawUsername) {
    const match = users.find(
      (u) => u.username.toLowerCase() === rawUsername.toLowerCase() && u.passcode === rawPasscode
    );
    if (match) return { user: match, db };
  }

  // 2. Match by passcode alone across existing CMS users
  const matchByPasscode = users.find((u) => u.passcode === rawPasscode);
  if (matchByPasscode) {
    return { user: matchByPasscode, db };
  }

  // 3. Fallback for legacy adminPasscode configuration
  if (rawPasscode === (db.siteSettings?.adminPasscode || 'wedding2026')) {
    const adminUser = users.find((u) => u.role === 'admin') || {
      id: 'legacy-admin',
      username: 'admin',
      displayName: 'Administrator',
      role: 'admin'
    };
    return { user: adminUser, db };
  }

  return null;
}

function requireCmsAuth(req, res, next) {
  const auth = authenticateUser(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in with a valid CMS account or passcode.' });
  }
  req.cmsUser = auth.user;
  req.db = auth.db;
  next();
}

function requireAdmin(req, res, next) {
  const auth = authenticateUser(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in with an Admin account.' });
  }
  if (auth.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required. Your account role is Editor (changes must go through Admin approval).'
    });
  }
  req.cmsUser = auth.user;
  req.db = auth.db;
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

// 5. Multi-Role CMS Authentication & Data Load
app.post('/api/admin/login', (req, res) => {
  const db = loadDatabase();
  const rawPasscode = (req.body?.passcode || '').trim();
  const rawUsername = (req.body?.username || '').trim();

  const users = Array.isArray(db.cmsUsers) ? db.cmsUsers : [];

  let matchedUser = null;
  if (rawUsername) {
    matchedUser = users.find(
      (u) => u.username.toLowerCase() === rawUsername.toLowerCase() && u.passcode === rawPasscode
    );
  } else {
    matchedUser = users.find((u) => u.passcode === rawPasscode);
  }

  if (!matchedUser && rawPasscode === (db.siteSettings?.adminPasscode || 'wedding2026')) {
    matchedUser = users.find((u) => u.role === 'admin') || {
      id: 'legacy-admin',
      username: 'admin',
      displayName: 'Administrator',
      role: 'admin'
    };
  }

  if (!matchedUser) {
    return res.status(401).json({
      error: 'Invalid credentials. Please enter a valid CMS username and passcode.'
    });
  }

  res.json({
    authenticated: true,
    user: {
      id: matchedUser.id,
      username: matchedUser.username,
      displayName: matchedUser.displayName,
      role: matchedUser.role
    },
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

app.get('/api/admin/data', requireCmsAuth, (req, res) => {
  const db = req.db;
  res.json({
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions),
    user: req.cmsUser
  });
});

// 6. Update CMS Section
app.put('/api/admin/section/:sectionName', requireCmsAuth, (req, res) => {
  const db = req.db;
  const { sectionName } = req.params;
  const allowedSections = ['siteSettings', 'aboutUs', 'ceremony', 'reception', 'weddingPartyPage', 'rsvpPage'];

  if (!allowedSections.includes(sectionName)) {
    return res.status(400).json({ error: `Invalid section: ${sectionName}` });
  }

  if (req.cmsUser.role === 'editor') {
    const proposal = {
      id: `prop-${Date.now()}`,
      timestamp: new Date().toISOString(),
      submittedBy: {
        id: req.cmsUser.id,
        username: req.cmsUser.username,
        displayName: req.cmsUser.displayName,
        role: req.cmsUser.role
      },
      summary: `Updated ${sectionName} layout & content`,
      status: 'pending',
      proposedData: {
        [sectionName]: req.body.data
      }
    };
    db.pendingProposals = [proposal, ...(db.pendingProposals || [])];
    saveDatabase(db, `Draft section update proposal submitted by Editor ${req.cmsUser.displayName}`, 'editor-proposal');
    return res.json({
      message: `Proposal submitted for ${sectionName}. Pending Admin approval.`,
      pendingApproval: true,
      proposal,
      db,
      analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
    });
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

// 6b. Publish Full CMS State (Admin: Live Auto-Approval | Editor: Pending Proposal Queue)
app.put('/api/admin/publish-all', requireCmsAuth, (req, res) => {
  const db = req.db;
  const { siteSettings, aboutUs, ceremony, reception, weddingPartyPage, rsvpPage, changeSummary } = req.body || {};

  if (req.cmsUser.role === 'editor') {
    const proposal = {
      id: `prop-${Date.now()}`,
      timestamp: new Date().toISOString(),
      submittedBy: {
        id: req.cmsUser.id,
        username: req.cmsUser.username,
        displayName: req.cmsUser.displayName,
        role: req.cmsUser.role
      },
      summary: changeSummary || 'Editor website layout and content proposal',
      status: 'pending',
      proposedData: {
        siteSettings: siteSettings || db.siteSettings,
        aboutUs: aboutUs || db.aboutUs,
        ceremony: ceremony || db.ceremony,
        reception: reception || db.reception,
        weddingPartyPage: weddingPartyPage || db.weddingPartyPage,
        rsvpPage: rsvpPage || db.rsvpPage
      }
    };
    db.pendingProposals = [proposal, ...(db.pendingProposals || [])];
    saveDatabase(db, `Pending change proposal submitted by Editor ${req.cmsUser.displayName}`, 'editor-proposal');

    return res.json({
      message: 'Your changes have been submitted to the Admin Approval Queue! Once an administrator approves them, they will be published live.',
      pendingApproval: true,
      proposal,
      db,
      analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
    });
  }

  // Admin role: Automatic live approval
  if (siteSettings) db.siteSettings = siteSettings;
  if (aboutUs) db.aboutUs = aboutUs;
  if (ceremony) db.ceremony = ceremony;
  if (reception) db.reception = reception;
  if (weddingPartyPage) db.weddingPartyPage = weddingPartyPage;
  if (rsvpPage) db.rsvpPage = rsvpPage;

  syncReceptionMenuOptions(db);
  saveDatabase(db, `Published live by Admin ${req.cmsUser.displayName}`, 'visual-builder');

  res.json({
    message: 'All website sections published live! (Admin Auto-Approved)',
    autoApproved: true,
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 6c. Approve Pending Proposal (Admin Only)
app.post('/api/admin/proposals/:id/approve', requireAdmin, (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const proposalIndex = (db.pendingProposals || []).findIndex((p) => p.id === id);

  if (proposalIndex === -1) {
    return res.status(404).json({ error: 'Proposal not found.' });
  }

  const proposal = db.pendingProposals[proposalIndex];
  const pData = proposal.proposedData || {};

  if (pData.siteSettings) db.siteSettings = pData.siteSettings;
  if (pData.aboutUs) db.aboutUs = pData.aboutUs;
  if (pData.ceremony) db.ceremony = pData.ceremony;
  if (pData.reception) db.reception = pData.reception;
  if (pData.weddingPartyPage) db.weddingPartyPage = pData.weddingPartyPage;
  if (pData.rsvpPage) db.rsvpPage = pData.rsvpPage;

  proposal.status = 'approved';
  proposal.reviewedAt = new Date().toISOString();
  proposal.reviewedBy = {
    id: req.cmsUser.id,
    username: req.cmsUser.username,
    displayName: req.cmsUser.displayName
  };

  syncReceptionMenuOptions(db);
  saveDatabase(
    db,
    `Approved & published change proposal from ${proposal.submittedBy?.displayName || 'Editor'} (${proposal.summary})`,
    'proposal-approved'
  );

  res.json({
    message: `Proposal approved and published live!`,
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 6d. Reject Pending Proposal (Admin Only)
app.post('/api/admin/proposals/:id/reject', requireAdmin, (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const { reviewNote } = req.body || {};
  const proposalIndex = (db.pendingProposals || []).findIndex((p) => p.id === id);

  if (proposalIndex === -1) {
    return res.status(404).json({ error: 'Proposal not found.' });
  }

  const proposal = db.pendingProposals[proposalIndex];
  proposal.status = 'rejected';
  proposal.reviewNote = reviewNote || '';
  proposal.reviewedAt = new Date().toISOString();
  proposal.reviewedBy = {
    id: req.cmsUser.id,
    username: req.cmsUser.username,
    displayName: req.cmsUser.displayName
  };

  saveDatabase(
    db,
    `Rejected proposal from ${proposal.submittedBy?.displayName || 'Editor'}: ${proposal.summary}`,
    'proposal-rejected'
  );

  res.json({
    message: 'Proposal has been rejected.',
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 6e. Delete / Clear Proposal Record (Admin Only)
app.delete('/api/admin/proposals/:id', requireAdmin, (req, res) => {
  const db = req.db;
  const { id } = req.params;
  db.pendingProposals = (db.pendingProposals || []).filter((p) => p.id !== id);
  saveDatabase(db, `Removed proposal record (${id})`, 'proposal-deleted');
  res.json({
    message: 'Proposal deleted.',
    db,
    analytics: computeAnalytics(db.guests, db.reception?.menuOptions)
  });
});

// 6f. User Management Endpoints (Admin Only)
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const db = req.db;
  res.json({ users: db.cmsUsers || [] });
});

app.post('/api/admin/users', requireAdmin, (req, res) => {
  const db = req.db;
  const { username, passcode, displayName, role } = req.body || {};

  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (passcode || '').trim();
  const cleanName = (displayName || '').trim();
  const cleanRole = role === 'editor' ? 'editor' : 'admin';

  if (!cleanUser || !cleanPass) {
    return res.status(400).json({ error: 'Username and passcode are required.' });
  }

  if ((db.cmsUsers || []).some((u) => u.username.toLowerCase() === cleanUser)) {
    return res.status(400).json({ error: `Username "${cleanUser}" is already taken.` });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username: cleanUser,
    passcode: cleanPass,
    displayName: cleanName || cleanUser,
    role: cleanRole,
    createdAt: new Date().toISOString()
  };

  db.cmsUsers = [...(db.cmsUsers || []), newUser];
  saveDatabase(db, `Created new CMS user account "${cleanUser}" with role "${cleanRole}"`, 'user-management');

  res.status(201).json({
    message: `User account "${cleanUser}" created successfully.`,
    user: newUser,
    db
  });
});

app.put('/api/admin/users/:id', requireAdmin, (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const { username, passcode, displayName, role } = req.body || {};

  const userIndex = (db.cmsUsers || []).findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const existing = db.cmsUsers[userIndex];
  const cleanUser = username ? username.trim().toLowerCase() : existing.username;
  const cleanPass = passcode ? passcode.trim() : existing.passcode;
  const cleanName = displayName ? displayName.trim() : existing.displayName;
  const cleanRole = role ? (role === 'editor' ? 'editor' : 'admin') : existing.role;

  if (cleanUser !== existing.username && db.cmsUsers.some((u, i) => i !== userIndex && u.username.toLowerCase() === cleanUser)) {
    return res.status(400).json({ error: `Username "${cleanUser}" is already taken.` });
  }

  // Prevent demoting the last admin to editor
  if (existing.role === 'admin' && cleanRole === 'editor') {
    const adminCount = db.cmsUsers.filter((u) => u.role === 'admin').length;
    if (adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot change role: At least one Administrator account must remain active.' });
    }
  }

  db.cmsUsers[userIndex] = {
    ...existing,
    username: cleanUser,
    passcode: cleanPass,
    displayName: cleanName,
    role: cleanRole,
    updatedAt: new Date().toISOString()
  };

  saveDatabase(db, `Updated CMS user account "${cleanUser}"`, 'user-management');

  res.json({
    message: `User account "${cleanUser}" updated successfully.`,
    user: db.cmsUsers[userIndex],
    db
  });
});

app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const target = (db.cmsUsers || []).find((u) => u.id === id);

  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (target.role === 'admin') {
    const adminCount = db.cmsUsers.filter((u) => u.role === 'admin').length;
    if (adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot delete the only Administrator account.' });
    }
  }

  db.cmsUsers = (db.cmsUsers || []).filter((u) => u.id !== id);
  saveDatabase(db, `Deleted CMS user account "${target.username}"`, 'user-management');

  res.json({
    message: `User account "${target.username}" deleted.`,
    db
  });
});

// 7. Create a new Guest Household & Unique QR Code
app.post('/api/admin/guests', requireCmsAuth, (req, res) => {
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
app.put('/api/admin/guests/:id', requireCmsAuth, (req, res) => {
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
app.delete('/api/admin/guests/:id', requireCmsAuth, (req, res) => {
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

