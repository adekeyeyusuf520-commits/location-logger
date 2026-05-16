const statusEl = document.getElementById("status");
const locationsEl = document.getElementById("locations");
const sendButton = document.getElementById("sendLocation");

const formatTimestamp = (value) => {
  const date = new Date(value);
  return date.toLocaleString();
};

const showStatus = (message, isError = false) => {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b91c1c" : "#1e3a8a";
};

const renderLocations = (data) => {
  if (!data.locations.length) {
    locationsEl.innerHTML = "<p>No locations saved yet.</p>";
    return;
  }

  locationsEl.innerHTML = data.locations
    .map((item) => {
      return `
        <div class="card">
          <div><strong>Latitude:</strong> <span class="code">${item.latitude}</span></div>
          <div><strong>Longitude:</strong> <span class="code">${item.longitude}</span></div>
          <div><strong>Accuracy:</strong> <span class="code">${item.accuracy ?? "n/a"}</span></div>
          <div><strong>Time:</strong> ${formatTimestamp(item.timestamp)}</div>
          ${item.label ? `<div><strong>Label:</strong> ${item.label}</div>` : ""}
        </div>
      `;
    })
    .join("");
};

const loadLocations = async () => {
  try {
    const response = await fetch("/api/locations");
    const data = await response.json();
    renderLocations(data);
  } catch (error) {
    showStatus("Unable to load locations.", true);
  }
};

const sendLocation = () => {
  if (!navigator.geolocation) {
    showStatus("Geolocation is not supported by your browser.", true);
    return;
  }

  showStatus("Getting current location...");
  navigator.geolocation.getCurrentPosition(async (position) => {
    const payload = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };

    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to save location.");
      }

      showStatus(`Location saved. Total saved: ${result.count}`);
      loadLocations();
    } catch (error) {
      showStatus(error.message, true);
    }
  }, (error) => {
    showStatus(`Geolocation error: ${error.message}`, true);
  });
};

sendButton.addEventListener("click", sendLocation);
loadLocations();
