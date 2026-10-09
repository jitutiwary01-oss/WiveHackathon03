/**
 * IIT (ISM) DHANBAD — INTERACTIVE 2D CAMPUS MAP CONTROLLER
 * Geographically verified campus landmark navigator powered by Leaflet.js
 */

// Embedded fallback data for guaranteed zero-downtime offline / file:// protocol resilience
const DEFAULT_CAMPUS_PLACES = [
  {
    "id": "heritage-building",
    "name": "Main Heritage Building",
    "category": "administrative",
    "lat": 23.81434,
    "lng": 86.44115,
    "image": "assets/images/heritage-building.jpg",
    "tag": "Inaugurated 1926",
    "description": "The monumental colonial-era building inaugurated on 9 December 1926 by Lord Irwin, then Viceroy of India. Features iconic red-brick architecture, arched corridors, and houses the offices of the Director, Deputy Director, and Registrar.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "central-library",
    "name": "Central Library",
    "category": "academic",
    "lat": 23.81372,
    "lng": 86.44195,
    "image": "assets/images/central-library.jpg",
    "tag": "7-Storey Modern Facility",
    "description": "One of the largest automated institutional libraries in Eastern India. Spans seven floors equipped with RFID automated kiosks, over 1.5 lakh physical volumes, and continuous access to world-renowned research journals and e-resources.",
    "officialUrl": "https://library.iitism.ac.in/"
  },
  {
    "id": "new-academic-complex",
    "name": "New Academic Complex (NAC)",
    "category": "academic",
    "lat": 23.81530,
    "lng": 86.43980,
    "image": "assets/images/new-academic-complex.jpg",
    "tag": "Academic Core",
    "description": "Multistorey complex housing modern multimedia lecture halls, smart classrooms, departmental faculty chambers, and high-performance computational facilities for undergraduate and postgraduate students.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "golden-jubilee-theatre",
    "name": "Golden Jubilee Lecture Theatre (GJLT)",
    "category": "academic",
    "lat": 23.81485,
    "lng": 86.44020,
    "image": "assets/images/golden-jubilee-lecture-theatre.jpg",
    "tag": "Lecture Complex",
    "description": "Flagship multi-theatre lecture complex built to mark the institute's Golden Jubilee. Hosts large foundational course lectures, national conferences, academic workshops, and keynote addresses.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "central-research-facility",
    "name": "Central Research Facility (CRF / iRh)",
    "category": "research",
    "lat": 23.81590,
    "lng": 86.44070,
    "image": "assets/images/science-block.jpg",
    "tag": "Centralized Instrumentation",
    "description": "State-of-the-art analytical research hub housing major instruments including FESEM, HRTEM, Powder XRD, Single Crystal XRD, VSM, Raman Spectrometer, and the advanced Cell Culture Laboratory.",
    "officialUrl": "https://people.iitism.ac.in/~research/crf/"
  },
  {
    "id": "mme-lab",
    "name": "Materials & Metallurgical Engg. Labs",
    "category": "research",
    "lat": 23.81490,
    "lng": 86.44210,
    "image": "assets/images/mme-lab.jpg",
    "tag": "Advanced Metallurgy",
    "description": "Specialized laboratory facilities equipped for metallography, mechanical testing, XRD characterization, corrosion analysis, and material synthesis, serving core metallurgical research.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "central-workshop",
    "name": "Central Workshop & Micro-Machining Lab",
    "category": "research",
    "lat": 23.81620,
    "lng": 86.44210,
    "image": "assets/images/workshop-building.jpg",
    "tag": "Fabrication & Machining",
    "description": "Comprehensive engineering fabrication hub including machining, foundry, smithy, welding, and Dr. Vivek Bajpai's dedicated Micro-Machining and Micro-Fabrication Laboratory.",
    "officialUrl": "https://people.iitism.ac.in/~vivek/lab.html"
  },
  {
    "id": "student-activity-centre",
    "name": "Student Activity Centre (SAC)",
    "category": "sports",
    "lat": 23.81240,
    "lng": 86.43890,
    "image": "assets/images/student-activity-centre.jpg",
    "tag": "Student Life & Clubs",
    "description": "The energetic nerve centre of student societies, cultural chapters, music rooms, dramatics studios, debate societies, robotics clubs, and the Student Senate council offices.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "oval-ground",
    "name": "Oval Ground & Heritage Lawns",
    "category": "sports",
    "lat": 23.81380,
    "lng": 86.44070,
    "image": "assets/images/oval-ground.jpg",
    "tag": "Historic Athletic Ground",
    "description": "The expansive, picturesque green oval directly facing the Heritage Building. Venue for inter-IIT sports tournaments, annual athletic meets, ceremonial parades, and convocation festivities.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "management-dept",
    "name": "Department of Management Studies & Industrial Engg.",
    "category": "academic",
    "lat": 23.81510,
    "lng": 86.44260,
    "image": "assets/images/management-department.jpg",
    "tag": "MBA & Industrial Engg.",
    "description": "Houses NIRF top-ranked management faculty, modern case discussion rooms, business analytics labs, and executive development seminar chambers.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "diamond-hostel",
    "name": "Diamond Hostel (Built 1926)",
    "category": "hostel",
    "lat": 23.81280,
    "lng": 86.44220,
    "image": "assets/images/diamond-hostel.jpg",
    "tag": "Founding Heritage Residence",
    "description": "Built alongside the founding of the Indian School of Mines in 1926. Renowned for spacious colonial corridors, 15-foot high ceilings, historic inner quadrangle, and an unbroken legacy of student camaraderie.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "jasper-hostel",
    "name": "Jasper Hostel",
    "category": "hostel",
    "lat": 23.81750,
    "lng": 86.43850,
    "image": "assets/images/jasper-hostel.jpg",
    "tag": "Contemporary Hall of Residence",
    "description": "One of the largest modern student residential towers on campus, featuring high-speed optical fiber connectivity, dining halls, reading rooms, and indoor recreational areas.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "rosaline-hostel",
    "name": "Rosaline Hostel",
    "category": "hostel",
    "lat": 23.81820,
    "lng": 86.44150,
    "image": "assets/images/rosaline-hostel.jpg",
    "tag": "Women Scholar Residence",
    "description": "Modern multi-storey hostel providing safe, comfortable, and vibrant residential facilities for undergraduate, postgraduate, and doctoral women scholars.",
    "officialUrl": "https://www.iitism.ac.in/"
  },
  {
    "id": "admin-block",
    "name": "Administrative Block Wing",
    "category": "administrative",
    "lat": 23.81400,
    "lng": 86.44150,
    "image": "assets/images/admin-block.jpg",
    "tag": "Governance & Academic Section",
    "description": "Adjoins the central complex, housing Dean of Academic Affairs, Dean of Student Welfare, International Relations cell, and Finance & Accounts sections.",
    "officialUrl": "https://www.iitism.ac.in/"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initCampusMap();
});

async function initCampusMap() {
  const mapElement = document.getElementById('campusMap');
  const directoryContainer = document.getElementById('mapDirectoryList');
  const searchInput = document.getElementById('mapSearchInput');
  const categoryPills = document.querySelectorAll('.map-category-pill');
  const detailDrawer = document.getElementById('mapDetailDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('mapDrawerBackdrop');
  const fallbackBanner = document.getElementById('mapFallbackBanner');
  const placeCountDisplay = document.getElementById('placeCountDisplay');

  if (!mapElement || !directoryContainer) return;

  // 1. Initialise data with guaranteed embedded records
  let placesData = [...DEFAULT_CAMPUS_PLACES];

  // Try fetching fresh data from JSON without blocking map initialization
  try {
    const res = await fetch('assets/data/campus-places.json');
    if (res.ok) {
      const fetched = await res.json();
      if (Array.isArray(fetched) && fetched.length > 0) {
        placesData = fetched;
      }
    }
  } catch (err) {
    console.info('Using verified campus fallback dataset:', err.message);
  }

  // 2. Load settings from centralized Map API configuration module (js/map-config.js)
  const config = window.CAMPUS_MAP_CONFIG || {};
  const geoConfig = config.geo || {};
  const CAMPUS_CENTER = geoConfig.center || [23.8144, 86.4412];
  const DEFAULT_ZOOM = geoConfig.defaultZoom || 16;
  const MIN_ZOOM = geoConfig.minZoom || 14;
  const MAX_ZOOM = geoConfig.maxZoom || 19;

  // Category Colors
  const categoryClassMap = {
    academic: 'pin-academic',
    administrative: 'pin-administrative',
    research: 'pin-research',
    hostel: 'pin-hostel',
    sports: 'pin-sports'
  };

  const markers = {};
  let currentActiveId = null;
  let map = null;

  // 3. Initialize Leaflet Map if L is available
  if (typeof L !== 'undefined') {
    try {
      map = L.map('campusMap', {
        center: CAMPUS_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Set geographic boundary restrictions if defined
      if (geoConfig.bounds) {
        map.setMaxBounds(geoConfig.bounds);
      }

      // Initialize base tile layer via map-config module
      let primaryTiles = null;
      if (typeof config.createTileLayer === 'function') {
        primaryTiles = config.createTileLayer();
      }

      // Safe fallback if tile factory didn't initialize
      if (!primaryTiles) {
        primaryTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a> | IIT (ISM) Dhanbad'
        });
      }
      primaryTiles.addTo(map);

      // Mount interactive base layer switcher if enabled in config
      if (config.layerSwitcher && config.layerSwitcher.enabled && typeof config.getBaseLayers === 'function') {
        const baseLayers = config.getBaseLayers(primaryTiles);
        if (Object.keys(baseLayers).length > 1) {
          L.control.layers(baseLayers, null, {
            position: config.layerSwitcher.position || 'topleft',
            collapsed: true
          }).addTo(map);
        }
      }

      // Handle tile load errors smoothly with fallback to secondary OSM tile layer
      let failedTilesCount = 0;
      primaryTiles.on('tileerror', () => {
        failedTilesCount++;
        if (failedTilesCount > 4) {
          console.warn('Primary tile layer encounterd errors. Switching to secondary OSM tile layer...');
          try {
            map.removeLayer(primaryTiles);
          } catch (_) {}
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors | IIT (ISM) Dhanbad'
          }).addTo(map);
        }
      });

      // Force Leaflet to calculate container dimensions accurately across re-renders
      setTimeout(() => { if (map) map.invalidateSize(); }, 80);
      setTimeout(() => { if (map) map.invalidateSize(); }, 350);
      setTimeout(() => { if (map) map.invalidateSize(); }, 800);
      window.addEventListener('resize', () => { if (map) map.invalidateSize(); });

      // Observe map container resize events to prevent grey tile gaps
      if (window.ResizeObserver && mapElement) {
        const ro = new ResizeObserver(() => {
          if (map) map.invalidateSize();
        });
        ro.observe(mapElement);
      }

      // Add Markers
      placesData.forEach(place => {
        const pinClass = categoryClassMap[place.category] || 'pin-academic';
        
        const customIcon = L.divIcon({
          className: `custom-map-pin ${pinClass}`,
          html: `<span>&#9733;</span>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
        
        marker.bindTooltip(`<strong>${place.name}</strong><br><small style="color:#A83224;font-weight:700;">${place.tag}</small>`, {
          direction: 'top',
          offset: [0, -12],
          className: 'leaflet-custom-tooltip'
        });

        marker.on('click', () => {
          selectPlace(place.id, true);
        });

        markers[place.id] = marker;
      });

    } catch (mapErr) {
      console.error('Leaflet Map initialization error:', mapErr);
      if (fallbackBanner) fallbackBanner.style.display = 'block';
      renderStaticMapFallback();
    }
  } else {
    console.warn('Leaflet library L is not loaded yet.');
    renderStaticMapFallback();
  }

  // Render static SVG campus map if Leaflet is not available
  function renderStaticMapFallback() {
    mapElement.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:550px; padding:2rem; background:linear-gradient(135deg, #F3EBD8 0%, #E8DFC8 100%); text-align:center;">
        <div style="font-size:3rem; margin-bottom:1rem;">🗺️</div>
        <h3 style="color:var(--ocean-navy); margin-bottom:0.5rem; font-family:var(--font-heading);">Interactive Campus Navigation</h3>
        <p style="color:var(--charcoal-muted); max-width:480px; font-size:0.92rem; margin-bottom:1.5rem;">
          GPS Coordinates: <strong>23.8144° N, 86.4412° E</strong> • 393-Acre Heritage Campus.<br>
          Select any landmark from the directory on the left to view verified photographs, departmental descriptions, and official portals.
        </p>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center;">
          <button id="fallbackSwitchToGoogle" class="btn btn-primary btn-sm">Switch to Google Maps Live View &rarr;</button>
          <a href="https://maps.google.com/?q=IIT+(ISM)+Dhanbad" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">Open in Google Maps</a>
        </div>
      </div>
    `;

    const fallbackBtn = document.getElementById('fallbackSwitchToGoogle');
    const modeGoogleBtn = document.getElementById('mapModeGoogle');
    if (fallbackBtn && modeGoogleBtn) {
      fallbackBtn.addEventListener('click', () => {
        modeGoogleBtn.click();
      });
    }
  }

  // State Management
  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    const filtered = placesData.filter(place => {
      const matchCat = (activeCategory === 'all') || 
                       (place.category === activeCategory) ||
                       (activeCategory === 'academic' && place.category === 'academic') ||
                       (activeCategory === 'research' && place.category === 'research') ||
                       (activeCategory === 'hostel' && place.category === 'hostel') ||
                       (activeCategory === 'administrative' && place.category === 'administrative') ||
                       (activeCategory === 'sports' && place.category === 'sports');

      const q = searchTerm.toLowerCase();
      const matchSearch = place.name.toLowerCase().includes(q) ||
                          place.tag.toLowerCase().includes(q) ||
                          place.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    renderDirectory(filtered);

    // Update markers visibility
    if (map) {
      placesData.forEach(p => {
        const isVisible = filtered.some(f => f.id === p.id);
        if (markers[p.id]) {
          if (isVisible) {
            if (!map.hasLayer(markers[p.id])) map.addLayer(markers[p.id]);
          } else {
            if (map.hasLayer(markers[p.id])) map.removeLayer(markers[p.id]);
          }
        }
      });
    }

    if (placeCountDisplay) {
      placeCountDisplay.textContent = `${filtered.length} Landmarks`;
    }
  }

  function renderDirectory(items) {
    if (items.length === 0) {
      directoryContainer.innerHTML = `
        <div class="map-empty-state">
          <h4>No Locations Match</h4>
          <p>No verified campus landmark matches your search query. Try removing filters or searching for "Library", "Hostel", "Lab", etc.</p>
        </div>
      `;
      return;
    }

    directoryContainer.innerHTML = items.map(p => `
      <li class="map-directory-item ${p.id === currentActiveId ? 'active' : ''}" data-id="${p.id}">
        <div class="map-item-header">
          <span class="map-item-name">${p.name}</span>
          <span class="map-item-tag">${p.category.toUpperCase()}</span>
        </div>
        <p class="map-item-desc">${p.description}</p>
      </li>
    `).join('');

    // Attach click handlers to directory items
    directoryContainer.querySelectorAll('.map-directory-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        selectPlace(id, false);
      });
    });
  }

  function selectPlace(id, fromMarkerClick = false) {
    const place = placesData.find(p => p.id === id);
    if (!place) return;

    currentActiveId = id;

    // Highlight directory item
    document.querySelectorAll('.map-directory-item').forEach(el => {
      if (el.getAttribute('data-id') === id) {
        el.classList.add('active');
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        el.classList.remove('active');
      }
    });

    // Pan map to marker
    if (map && !fromMarkerClick) {
      map.flyTo([place.lat, place.lng], 18, { duration: 0.8 });

      // On mobile/tablet screens, scroll map canvas into view
      if (window.innerWidth <= 860) {
        const canvasContainer = document.querySelector('.map-canvas-container');
        if (canvasContainer) {
          canvasContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    // Open detail drawer
    showDetailDrawer(place);
  }

  function showDetailDrawer(place) {
    if (!detailDrawer) return;

    const img = document.getElementById('drawerImage');
    const title = document.getElementById('drawerTitle');
    const tag = document.getElementById('drawerTag');
    const desc = document.getElementById('drawerDesc');
    const coords = document.getElementById('drawerCoords');
    const link = document.getElementById('drawerLink');
    const focusBtn = document.getElementById('drawerFocusBtn');

    if (img) {
      img.src = place.image || 'assets/images/heritage-building.jpg';
      img.alt = place.name;
    }
    if (title) title.textContent = place.name;
    if (tag) tag.textContent = `${place.tag} • ${place.category.toUpperCase()}`;
    if (desc) desc.textContent = place.description;
    if (coords) coords.textContent = `${place.lat.toFixed(5)}° N, ${place.lng.toFixed(5)}° E`;
    if (link) link.href = place.officialUrl;

    if (focusBtn && map) {
      focusBtn.onclick = () => {
        map.flyTo([place.lat, place.lng], 18, { duration: 0.8 });
      };
    }

    detailDrawer.classList.add('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
  }

  // Close Drawer
  function closeDrawer() {
    if (detailDrawer) detailDrawer.classList.remove('is-open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Filter Category Pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-cat') || 'all';
      applyFilters();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      applyFilters();
    });
  }

  // Map View Mode Switcher (2D Campus Navigator vs Google Maps Live View)
  const modeInteractiveBtn = document.getElementById('mapModeInteractive');
  const modeGoogleBtn = document.getElementById('mapModeGoogle');
  const campusMapEl = document.getElementById('campusMap');
  const googleMapsViewEl = document.getElementById('googleMapsView');
  const modeStatusEl = document.getElementById('mapModeStatus');

  if (modeInteractiveBtn && modeGoogleBtn) {
    modeInteractiveBtn.addEventListener('click', () => {
      modeInteractiveBtn.classList.add('active');
      modeInteractiveBtn.setAttribute('aria-selected', 'true');
      modeGoogleBtn.classList.remove('active');
      modeGoogleBtn.setAttribute('aria-selected', 'false');

      if (campusMapEl) campusMapEl.style.display = 'block';
      if (googleMapsViewEl) googleMapsViewEl.style.display = 'none';
      if (modeStatusEl) modeStatusEl.textContent = '393-Acre Campus • GPS: 23.8144° N, 86.4412° E';

      if (map) {
        setTimeout(() => map.invalidateSize(), 50);
      }
    });

    modeGoogleBtn.addEventListener('click', () => {
      modeGoogleBtn.classList.add('active');
      modeGoogleBtn.setAttribute('aria-selected', 'true');
      modeInteractiveBtn.classList.remove('active');
      modeInteractiveBtn.setAttribute('aria-selected', 'false');

      if (campusMapEl) campusMapEl.style.display = 'none';
      if (googleMapsViewEl) googleMapsViewEl.style.display = 'block';
      if (modeStatusEl) modeStatusEl.textContent = 'Official Google Maps • Satellite, 3D & Street View';
      if (detailDrawer) detailDrawer.classList.remove('is-open');
    });
  }

  // Initial render
  applyFilters();
}
