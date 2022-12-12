function initMap() {
    const map = L.map('map').setView([39.0851, 117.1994], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map;
  }

async function mainEvent() {
    const map = initMap();
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());
