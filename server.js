require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* ---------- MEMORY DATABASE ---------- */
let locations = [];

/* ---------- SAVE LOCATION ---------- */
app.post("/api/location", (req,res)=>{
  locations.push(req.body);
  res.json({status:"saved"});
});

/* ---------- GET LOCATIONS ---------- */
app.get("/api/locations",(req,res)=>{
  res.json({locations});
});

/* ---------- SEND MAP KEY SECURELY ---------- */
app.get("/config",(req,res)=>{
  res.json({
    mapKey: process.env.MAP_API_KEY
  });
});

app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});
