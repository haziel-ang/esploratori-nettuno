/* =============================================
   ESPLORATORI A NETTUNO — Application Logic
   ============================================= */

(function () {
  'use strict';

  // ========================
  // DARK MODE TOGGLE
  // ========================
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateToggleIcon();
      // Re-apply map tiles if needed
      if (window._tileLayer) {
        window._tileLayer.setUrl(getMapTileUrl());
      }
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Passa al tema ' + (theme === 'dark' ? 'chiaro' : 'scuro'));
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  function getMapTileUrl() {
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }

  // ========================
  // LOCATIONS DATA
  // ========================
  var locations = [
    {
      id: 1,
      name: "L'Ospedale del Frate Fortissimo",
      lat: 41.456223,
      lng: 12.649635,
      address: 'Via San Benedetto Menni',
      emoji: '🏥',
      popup: '<strong>🏥 L\'Ospedale del Frate Fortissimo</strong><br>Ex Sanatorio / Casa Divina Provvidenza<br><em>Via San Benedetto Menni</em>'
    },
    {
      id: 2,
      name: 'La Cantina nella Roccia',
      lat: 41.476555,
      lng: 12.682936,
      address: 'Via dei Frati 140',
      emoji: '🍇',
      popup: '<strong>🍇 La Cantina nella Roccia</strong><br>Azienda Agricola Divina Provvidenza<br><em>Via dei Frati 140</em>'
    },
    {
      id: 3,
      name: 'La Casa delle Suore Spagnole',
      lat: 41.455952,
      lng: 12.651249,
      address: 'Via Antonio Gramsci 71',
      emoji: '🌊',
      popup: '<strong>🌊 La Casa delle Suore Spagnole</strong><br>Villa Miramare<br><em>Via Antonio Gramsci 71</em>'
    },
    {
      id: 4,
      name: 'La Farmacia del Frate',
      lat: 41.458313,
      lng: 12.655627,
      address: 'Piazza Cavalieri di Vittorio Veneto',
      emoji: '⚗️',
      popup: '<strong>⚗️ La Farmacia del Frate</strong><br>Farmacia Orsenigo<br><em>Piazza Cavalieri di Vittorio Veneto</em>'
    }
  ];

  // ========================
  // MAP INITIALIZATION
  // ========================
  var mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
    // Center on the midpoint of all locations
    var avgLat = locations.reduce(function (s, l) { return s + l.lat; }, 0) / locations.length;
    var avgLng = locations.reduce(function (s, l) { return s + l.lng; }, 0) / locations.length;

    var map = L.map('map', {
      scrollWheelZoom: false,
      tap: true
    }).setView([avgLat, avgLng], 14);

    window._tileLayer = L.tileLayer(getMapTileUrl(), {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    // Custom numbered markers
    locations.forEach(function (loc) {
      var icon = L.divIcon({
        className: 'custom-marker',
        html: '<span>' + loc.id + '</span>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -18]
      });

      var marker = L.marker([loc.lat, loc.lng], { icon: icon })
        .addTo(map)
        .bindPopup(loc.popup);

      // Click on card scrolls to marker and opens popup
      var card = document.getElementById('luogo-' + loc.id);
      if (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('a')) return; // Don't intercept link clicks
          map.setView([loc.lat, loc.lng], 16);
          marker.openPopup();
        });
      }
    });

    // Fit bounds to show all markers
    var bounds = L.latLngBounds(locations.map(function (l) { return [l.lat, l.lng]; }));
    map.fitBounds(bounds.pad(0.15));
  }

  // ========================
  // QR CODE GENERATION
  // ========================
  var qrEl = document.getElementById('qrcode');
  if (qrEl && typeof QRCode !== 'undefined') {
    var pageUrl = 'https://haziel-ang.github.io/esploratori-nettuno/';
    new QRCode(qrEl, {
      text: pageUrl,
      width: 180,
      height: 180,
      colorDark: getComputedStyle(root).getPropertyValue('--color-primary').trim() || '#b8860b',
      colorLight: getComputedStyle(root).getPropertyValue('--color-surface-2').trim() || '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // ========================
  // SCROLL REVEAL (IntersectionObserver)
  // ========================
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

})();
