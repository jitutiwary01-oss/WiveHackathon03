/**
 * IIT (ISM) DHANBAD — MAP API & LAYER CONFIGURATION MODULE
 * 
 * Centralized API management for campus maps.
 * Supports free open-source providers (Carto, OpenStreetMap, ESRI Satellite)
 * as well as API-key-based providers (MapTiler, Mapbox, Stadia Maps, Google).
 * 
 * HOW TO USE / CONFIGURE YOUR API KEY:
 * 1. To use a custom provider (e.g., MapTiler or Mapbox):
 *    - Insert your key in `apiKeys.maptiler` or `apiKeys.mapbox`.
 *    - Set `activeProvider` to 'maptiler' or 'mapbox'.
 * 2. If no API key is provided, the map automatically defaults to
 *    zero-cost, keyless high-performance tiles (Carto Voyager & OSM).
 */

(function () {
  'use strict';

  const CAMPUS_MAP_CONFIG = {
    // -------------------------------------------------------------
    // 1. API Keys (Insert your API credentials here if required)
    // -------------------------------------------------------------
    apiKeys: {
      maptiler: '',       // e.g., 'your_maptiler_key_here'
      mapbox: '',         // e.g., 'pk.eyJ1IjoieW91ci11c2VybmFtZSI...'
      stadia: '',         // e.g., 'your_stadia_key_here'
      google: ''          // Reserved for Google Maps JavaScript API integration
    },

    // -------------------------------------------------------------
    // 2. Active Provider Selection
    // Options: 'carto' | 'osm' | 'esriSatellite' | 'maptiler' | 'mapbox' | 'stadia'
    // -------------------------------------------------------------
    activeProvider: 'carto',

    // -------------------------------------------------------------
    // 3. Geographic Coordinates & Zoom Extents
    // -------------------------------------------------------------
    geo: {
      // IIT (ISM) Dhanbad Main Campus GPS Center
      center: [23.8144, 86.4412],
      defaultZoom: 16,
      minZoom: 14,
      maxZoom: 19,
      // Optional geographic bounds around Dhanbad to prevent panning too far
      bounds: [
        [23.8000, 86.4200], // Southwest
        [23.8300, 86.4600]  // Northeast
      ]
    },

    // -------------------------------------------------------------
    // 4. Layer Switcher Configuration
    // Allows interactive switching between map styles (e.g. Street vs Satellite)
    // -------------------------------------------------------------
    layerSwitcher: {
      enabled: true,
      position: 'topright' // 'topright' | 'topleft' | 'bottomright' | 'bottomleft'
    },

    // -------------------------------------------------------------
    // 5. Tile Providers Registry
    // -------------------------------------------------------------
    providers: {
      // CARTO Voyager: Clean, modern, highly readable, no key required
      carto: {
        name: 'Campus Street (CARTO)',
        requiresKey: false,
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        options: {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a> | IIT (ISM) Dhanbad'
        }
      },

      // OpenStreetMap Standard: Classic community cartography, no key required
      osm: {
        name: 'OpenStreetMap Standard',
        requiresKey: false,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | IIT (ISM) Dhanbad'
        }
      },

      // ESRI World Imagery: High-res aerial satellite photography, no key required
      esriSatellite: {
        name: 'Satellite Aerial View (ESRI)',
        requiresKey: false,
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 19,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community | IIT (ISM) Dhanbad'
        }
      },

      // MapTiler: Requires MapTiler Cloud API key
      maptiler: {
        name: 'MapTiler Streets',
        requiresKey: true,
        getUrl: function (key) {
          return `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`;
        },
        options: {
          maxZoom: 19,
          tileSize: 512,
          zoomOffset: -1,
          attribution: '&copy; <a href="https://www.maptiler.com/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        }
      },

      // Mapbox Raster Tiles: Requires Mapbox Public Access Token
      mapbox: {
        name: 'Mapbox Streets',
        requiresKey: true,
        getUrl: function (key) {
          return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${key}`;
        },
        options: {
          maxZoom: 19,
          tileSize: 512,
          zoomOffset: -1,
          attribution: '&copy; <a href="https://www.mapbox.com/" target="_blank">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        }
      },

      // Stadia Maps: Requires Stadia Maps API Key
      stadia: {
        name: 'Stadia Alidade Smooth',
        requiresKey: true,
        getUrl: function (key) {
          return `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${key}`;
        },
        options: {
          maxZoom: 20,
          attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        }
      }
    },

    // -------------------------------------------------------------
    // 6. Layer Factory Helper Methods
    // -------------------------------------------------------------
    /**
     * Resolves the primary tile layer based on provider configuration
     * Automatically falls back to 'carto' if a requested provider requires a key that is missing.
     * @param {string} providerName Optional specific provider key
     * @returns {L.TileLayer|null}
     */
    createTileLayer: function (providerName) {
      if (typeof L === 'undefined') return null;

      const providerId = providerName || this.activeProvider;
      const provider = this.providers[providerId];

      if (!provider) {
        console.warn(`[MapConfig] Unknown provider "${providerId}". Falling back to 'carto'.`);
        return this.createTileLayer('carto');
      }

      if (provider.requiresKey) {
        const key = this.apiKeys[providerId];
        if (!key || key.trim() === '') {
          console.warn(`[MapConfig] Provider "${providerId}" requires an API key in map-config.js. Falling back to keyless 'carto' layer.`);
          return this.createTileLayer('carto');
        }
        const tileUrl = provider.getUrl(key.trim());
        return L.tileLayer(tileUrl, provider.options);
      }

      return L.tileLayer(provider.url, provider.options);
    },

    /**
     * Creates dictionary of base layers for Leaflet Layer Control
     * @param {L.TileLayer} [activeLayerInstance] The active layer already added to the map
     * @returns {Object<string, L.TileLayer>}
     */
    getBaseLayers: function (activeLayerInstance) {
      if (typeof L === 'undefined') return {};

      const baseLayers = {};

      // 1. Street layer (Active or Carto) - reuse the active instance
      const primaryLayer = activeLayerInstance || this.createTileLayer(this.activeProvider);
      if (primaryLayer) {
        const primaryName = this.providers[this.activeProvider]?.name || 'Street Map';
        baseLayers[`🗺️ ${primaryName}`] = primaryLayer;
      }

      // 2. High-res Satellite layer
      const satLayer = this.createTileLayer('esriSatellite');
      if (satLayer) {
        baseLayers['🛰️ Satellite Aerial'] = satLayer;
      }

      // 3. OpenStreetMap
      if (this.activeProvider !== 'osm') {
        const osmLayer = this.createTileLayer('osm');
        if (osmLayer) {
          baseLayers['🌐 OpenStreetMap'] = osmLayer;
        }
      }

      // 4. Include MapTiler/Mapbox if user populated keys
      if (this.apiKeys.maptiler && this.activeProvider !== 'maptiler') {
        baseLayers['🎨 MapTiler'] = this.createTileLayer('maptiler');
      }
      if (this.apiKeys.mapbox && this.activeProvider !== 'mapbox') {
        baseLayers['🧭 Mapbox'] = this.createTileLayer('mapbox');
      }

      return baseLayers;
    }
  };

  // Expose globally to window
  window.CAMPUS_MAP_CONFIG = CAMPUS_MAP_CONFIG;
})();
