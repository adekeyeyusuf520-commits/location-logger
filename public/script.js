const statusEl = document.getElementById("status");
const locationsEl = document.getElementById("locations");
const sendButton = document.getElementById("sendLocation");

let map;
let markers = [];

const showStatus = (msg, error=false) => {
  statusEl.textContent = msg;
  statusEl.style.color = error ? "red" : "green";
};

/* ---------- INIT MAP ---------- */
const initMap = () => {
  map = L.map("map").setView([7.3775, 3.9470], 13); // Ibadan default

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
    }
  ).addTo(map);
};

/* ---------- RENDER LOCATIONS ---------- */
const renderLocations = (data) => {

  locationsEl.innerHTML = "";

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  if (!data.locations.length) {
    locationsEl.innerHTML = "<p>No locations saved yet.</p>";
    return;
  }

  data.locations.forEach(loc => {

    // CARD UI
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <strong>Latitude:</strong> ${loc.latitude}<br>
      <strong>Longitude:</strong> ${loc.longitude}<br>
      <strong>Accuracy:</strong> ${loc.accuracy ?? "n/a"}<br>
      <strong>Time:</strong> ${new Date(loc.timestamp).toLocaleString()}
    `;

    locationsEl.appendChild(card);

    // MAP MARKER
    const marker = L.marker([loc.latitude, loc.longitude])
      .addTo(map)
      .bindPopup(`
        <b>Saved Location</b><br>
        Lat: ${loc.latitude}<br>
        Lng: ${loc.longitude}
      `);

    markers.push(marker);
  });

  // Focus map on latest location
  const last = data.locations[data.locations.length - 1];
  map.setView([last.latitude, last.longitude], 15);
};

/* ---------- LOAD ---------- */
const loadLocations = async () => {
  const res = await fetch("/api/locations");
  const data = await res.json();
  renderLocations(data);
};

/* ---------- SEND LOCATION ---------- */
const sendLocation = () => {

  if (!navigator.geolocation) {
    showStatus("Geolocation not supported", true);
    return;
  }

  showStatus("Getting location...");

  navigator.geolocation.getCurrentPosition(async pos => {

    const payload = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp
    };

    const res = await fetch("/api/location", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    showStatus("Location Saved ✅");

    loadLocations();

  }, err => {
    showStatus(err.message, true);
  });
};

sendButton.addEventListener("click", sendLocation);

initMap();
loadLocations();
