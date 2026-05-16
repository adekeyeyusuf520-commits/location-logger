# Location Logger

A simple Node.js + Express app that logs browser geolocation data in memory and displays saved entries in a lightweight frontend.

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open your browser:
   ```
   http://localhost:3000
   ```

## 📁 Project Files

- `server.js` — Express backend API
- `public/index.html` — frontend UI
- `public/style.css` — frontend styling
- `public/script.js` — frontend logic
- `.gitignore` — files excluded from git
- `render.yaml` — Render deployment configuration

## ✅ Features

- Send current browser location to the server
- Store location entries in memory
- View saved location history in the UI
- Simple deploy-ready configuration for Render

## ⚠️ Notes

- Data is stored in memory only and is cleared when the server restarts.
- Geolocation requires browser permission and HTTPS for most browsers, except `localhost`.
- Use a browser that supports the Geolocation API.

## ☁️ Deploy on Render

Render is configured using `render.yaml`. Connect your repository to Render and deploy using the Node.js web service settings.

## 🛠️ Improvements

If you want, I can add:

- persistent storage (SQLite / file / database)
- map display with Leaflet or Google Maps
- export/import as CSV or JSON
- location labels and notes
- search and filtering for saved entries
