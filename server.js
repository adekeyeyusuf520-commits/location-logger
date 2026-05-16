const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const locations = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/location", (req, res) => {
  const { latitude, longitude, accuracy, timestamp, label } = req.body;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ error: "latitude and longitude are required as numbers." });
  }

  const entry = {
    latitude,
    longitude,
    accuracy: typeof accuracy === "number" ? accuracy : null,
    timestamp: timestamp || Date.now(),
    label: label || null,
  };

  locations.push(entry);
  return res.json({ status: "ok", entry, count: locations.length });
});

app.get("/api/locations", (req, res) => {
  return res.json({ count: locations.length, locations });
});

app.listen(port, () => {
  console.log(`Location Logger running on http://localhost:${port}`);
});
