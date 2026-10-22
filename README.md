# Forever Ours — React Wedding Website, Back-End CMS & QR Code RSVP Studio

A full-stack React + Node/Express wedding website featuring **Big Tab Main Display Navigation** (`About Us`, `Ceremony`, `Reception`, `QR Code RSVP`), a **Back-End CMS Studio**, and **Personalized Household QR Code RSVPs**.

## Features
- **Big Tabs Main Display**:
  - **01 • About Us**: Live wedding countdown, romantic quote, couple profiles, *Chapters of Our Story* timeline, Wedding Party bios, and Engagement Photo Gallery.
  - **02 • Ceremony**: Venue showcase with Google Maps link, schedule of vows, dress code guidance, unplugged ceremony notice, parking/shuttles, and FAQs.
  - **03 • Reception**: Cocktail hour, plated dinner menu entrées (synced live with the RSVP form), entertainment, bar details, and hotel blocks.
  - **04 • QR Code RSVP**: Guests scan their unique QR code (or use the in-browser camera scanner / image upload / 9-character code) to unlock their household's RSVP card, select attendance and dinner entrées for each member of their party, and submit song requests.
- **Robust Back-End CMS (`Passcode: wedding2026`)**:
  - Edit all page content, photos, schedules, and choose between 4 curated wedding color themes.
  - Manage Guest Households, generate/download unique PNG QR codes, print ready-to-cut QR enclosure cards, and export RSVPs to CSV.

## Running with Docker (`C:\docker\wedding-website`)
```powershell
docker compose up -d --build
```
Then open `http://localhost:3001`. All CMS edits and guest RSVPs persist in `./data/db.json`.
