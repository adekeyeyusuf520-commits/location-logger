const statusEl=document.getElementById("status");
const locationsEl=document.getElementById("locations");
const btn=document.getElementById("sendLocation");

let map;
let markers=[];

/* ---------- INIT MAP ---------- */
async function initMap(){

const config=await fetch("/config");
const {mapKey}=await config.json();

map=L.map("map").setView([7.3775,3.9470],13);

L.tileLayer(
`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapKey}`,
{
tileSize:512,
zoomOffset:-1,
attribution:"© MapTiler"
}
).addTo(map);

loadLocations();
}

/* ---------- LOAD LOCATIONS ---------- */
async function loadLocations(){

const res=await fetch("/api/locations");
const data=await res.json();

locationsEl.innerHTML="";

markers.forEach(m=>map.removeLayer(m));
markers=[];

data.locations.forEach(loc=>{

const card=document.createElement("div");
card.className="card";

card.innerHTML=`
Lat: ${loc.latitude}<br>
Lng: ${loc.longitude}<br>
${new Date(loc.timestamp).toLocaleString()}
`;

locationsEl.appendChild(card);

const marker=L.circleMarker(
[loc.latitude,loc.longitude],
{
radius:8,
color:"#2563eb",
fillColor:"#2563eb",
fillOpacity:0.9
}).addTo(map);

markers.push(marker);
});

if(data.locations.length){
const last=data.locations[data.locations.length-1];
map.setView([last.latitude,last.longitude],15);
}
}

/* ---------- SEND LOCATION ---------- */
btn.onclick=()=>{

navigator.geolocation.getCurrentPosition(async pos=>{

statusEl.innerText="Saving location...";

await fetch("/api/location",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
latitude:pos.coords.latitude,
longitude:pos.coords.longitude,
timestamp:Date.now()
})
});

statusEl.innerText="Location Saved ✅";

loadLocations();

});
};

initMap();
  
