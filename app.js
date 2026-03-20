/* =============================================
   ESPLORATORI A NETTUNO — Application Logic
   ============================================= */

(function () {
  'use strict';

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

    window._tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
  // VISIT COUNTER (counterapi.dev)
  // ========================
  (function initCounter() {
    var counterEl = document.getElementById('counter-value');
    if (!counterEl) return;

    // Use counterapi.dev REST API — free, no signup needed
    var apiUrl = 'https://api.counterapi.dev/v1/esploratori-nettuno/visits/up';

    fetch(apiUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && typeof data.count === 'number') {
          counterEl.textContent = data.count.toLocaleString('it-IT');
        } else {
          counterEl.textContent = '—';
        }
      })
      .catch(function () {
        counterEl.textContent = '—';
      });
  })();

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
