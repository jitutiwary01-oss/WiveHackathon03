# IIT (ISM) Dhanbad — Official Website & Centenary Portal

A complete, responsive, editorial institutional website for the **Indian Institute of Technology (Indian School of Mines), Dhanbad**, built from scratch for the centenary milestone (1926–2026).

---

## 1. Quick Start / How to Run Locally

### Option A: Using Node.js (Recommended)
```bash
# In the project root:
npm start
# or
npx serve -l 3000 .
```
Open [http://localhost:3000](http://localhost:3000) in any web browser.

### Option B: Using Python
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000).

### Run Automated QA Test Suite
```bash
node scripts/test_site.js
```
*(Runs 261 automated tests verifying all pages, data schemas, image assets, internal hyperlinks, and HTTP server status codes).*

---

## 2. Project Architecture & File Organization

```
WIVE HACKATHON/
├── index.html                   # Home (Scroll-scrubbing video hero & heritage transition)
├── about.html                   # About & Heritage (Timeline, 1920 McPherson to 2016 IIT Act)
├── academics.html               # Academics (17 Departments, Degree pathways, Curricula)
├── campus.html                  # Campus Facilities (393-Acre campus, Hostels, SAC, Library)
├── map.html                     # Real Interactive 2D Campus Map (Leaflet.js + OpenStreetMap)
├── research.html                # Research & Labs (CRF, MME Lab, Cell Culture, Micro-Machining)
├── faculty.html                 # Faculty Directory (Searchable, Department filters, Official links)
├── admissions.html              # Admissions (JEE Adv, GATE, CAT, JAM + Professor Zoro Modal)
├── contact.html                 # Institutional Contacts, Validated Form, Transit Guide
├── package.json                 # Project configuration and local dev scripts
├── ASSET_MANIFEST.md            # Comprehensive image provenance, licensing, and attribution
├── README.md                    # System documentation and deliverables report
├── css/
│   ├── style.css                # Editorial university design system (Parchment/Navy/Teal/Rust)
│   └── map.css                  # Specialized stylesheet for the interactive 2D map
├── js/
│   ├── main.js                  # Mobile nav, video scroll-scrubber, form validation, back-to-top
│   ├── map-config.js            # Centralized Map API & Layer manager (Keys, styles, tile providers)
│   ├── map.js                   # Leaflet.js engine, markers, directory search, drawer
│   ├── faculty.js               # Dynamic faculty directory live filter & search
│   └── admissions.js            # Professor Zoro welcome popup controller & session storage
├── assets/
│   ├── images/                  # Genuine photographs from verified institutional repositories
│   │   ├── heritage-building.jpg
│   │   ├── central-library.jpg
│   │   ├── new-academic-complex.jpg
│   │   ├── golden-jubilee-lecture-theatre.jpg
│   │   ├── student-activity-centre.jpg
│   │   ├── oval-ground.jpg
│   │   ├── management-department.jpg
│   │   ├── science-block.jpg
│   │   ├── workshop-building.jpg
│   │   ├── mme-lab.jpg
│   │   ├── diamond-hostel.jpg
│   │   ├── jasper-hostel.jpg
│   │   ├── rosaline-hostel.jpg
│   │   ├── admin-block.jpg
│   │   └── iitism-logo.svg
│   ├── video/                   # Landing video location (awaiting friend's video)
│   │   └── landing-animation.mp4
│   └── data/
│       ├── manifest.json        # Machine-readable asset metadata
│       ├── campus-places.json   # Verified GPS coordinates and facility descriptions
│       └── faculty.json         # Verified faculty appointments and research areas
└── scripts/
    ├── download_assets.py       # Script that fetched and cataloged verified authentic photos
    └── test_site.js             # Automated 261-check regression test suite
```

---

## 3. Strict Authenticity & Zero-AI-Imagery Policy

In accordance with strict institutional and hackathon specifications:
1. **Zero AI-Generated or Cartoon Images**: No Gemini-generated pictures, Midjourney outputs, cartoon illustrations, synthetic campus renderings, or fake faculty portraits are used.
2. **Real Physical Photographs**: All 14 campus photographs are authentic physical images of IIT (ISM) Dhanbad landmarks and laboratories sourced from Wikimedia Commons under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
3. **Official Vector Insignia**: The official vector emblem of the institute is used with proper attribution.
4. **Honest Editorial Placeholders**: Where high-resolution photographs of specialized cleanrooms (e.g. CRF Cell Culture or Single Crystal XRD) are pending official licensing, clean and honest text-based placeholders with verified technical equipment specifications are displayed.
5. See [ASSET_MANIFEST.md](file:///c:/Users/Jitesh%20Tiwary/Documents/WIVE%20HACKATHON/ASSET_MANIFEST.md) for full licensing details.

---

## 4. Landing Video & Admissions Zoro Integration

### Landing Page Video
- **Expected Path**: `assets/video/landing-animation.mp4`
- **Features**:
  * Scroll-frame scrubbing: advances video playback synchronously as the visitor scrolls down and reverses when scrolling up.
  * Natural transition directly into the authentic photograph of the IIT (ISM) Dhanbad heritage building.
  * Graceful fallback: If reduced motion is requested or file is pending, normal muted playback or a clean file picker is presented.
  * Skippable button provided so users can jump directly to the main campus sections.

### Professor Zoro Admissions Popup
- **Location**: Displayed naturally on `admissions.html`.
- **Character Role**: Explicitly declared as a playful fictional collegiate easter egg; not represented as a real faculty member or admissions officer.
- **Dialogue**:
  > *“Oi, welcome aboard! IIT (ISM) Dhanbad mein admission lene ka soch rahe ho? Sahi jagah aaye ho. Chalo, programmes aur admission details check karte hain.”*
  > *“Confused ho? Koi baat nahi. Pehle apna programme explore karo, phir aage badhna.”*
- **Asset**: Looks for `assets/images/zoro.png`. If pending, displays an intentional, elegant dark crest avatar badge.
- **Controls**: "LET'S EXPLORE" (smoothly navigates to the programmes section and closes), "MAYBE LATER", Close button, and Escape key dismissal with `sessionStorage` persistence.

---

## 5. Fully Functional Features

- [x] **Video-Based Opening Hero**: Scroll scrubbing frame controller, skippable control, and heritage photo crossfade.
- [x] **Verified Institutional History**: McPherson Committee (1920) to 2016 IIT conversion timeline with citations.
- [x] **2D Interactive Campus Map**: Powered by Leaflet.js, centered precisely on `23.8144° N, 86.4412° E`, featuring 14 custom markers, category filtering (Academic, Research, Hostel, Admin, Sports), live search, empty state handling, and interactive location detail drawer.
- [x] **Searchable Faculty Directory**: Live search and 11 department filters rendering verified faculty appointments with official institute links.
- [x] **Admissions Pathways**: Clear categorization of JEE (Advanced), JoSAA, GATE, COAP, CAT, JAM, and Ph.D. routes.
- [x] **Professor Zoro Modal**: Compact, accessible modal dialog with dialogue, keybindings, and persistent dismissal.
- [x] **Validated Contact & Inquiry Form**: Full client-side field validation with clear demo notifications.
- [x] **Responsive Navigation & Layouts**: Fluid breakpoints for desktop, tablet, and mobile devices.
- [x] **Automated QA Test Suite**: Node.js test script verifying 261 regression checkpoints.

---

## 6. Features Requiring User Assets or Backend Configuration

1. **Friend's Landing Video**:
   * Drop the video file into `assets/video/landing-animation.mp4`.
2. **Professor Zoro Portrait**:
   * Drop the preferred character image into `assets/images/zoro.png` (or use the included elegant crest badge).
3. **Backend Form Dispatch**:
   * The contact form in `contact.html` is fully validated on the client side. Connecting an external REST API or SMTP email gateway is required for live server delivery.
4. **Map API Keys & Providers (Optional)**:
   * To activate commercial or custom tile providers (MapTiler, Mapbox, or Stadia Maps), supply your key in `js/map-config.js` (`CAMPUS_MAP_CONFIG.apiKeys`).
   * By default, the map runs out-of-the-box with free, keyless, and high-performance Carto Voyager, OpenStreetMap, and ESRI World Satellite imagery.
