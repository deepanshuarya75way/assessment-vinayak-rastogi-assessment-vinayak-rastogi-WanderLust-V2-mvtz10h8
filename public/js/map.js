import * as L from "https://esm.sh/leaflet@1.9.4";


if (!listingCoords || listingCoords.length !== 2) {
  throw new Error("Invalid listing coordinates");
}

const lat = listingCoords[1];
const lng = listingCoords[0];
const map = L.map("map").setView([lat, lng], 12);



L.tileLayer(
  "https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?lang=en&apiKey=" + GEOAPIFY_KEY,
  {
    attribution: "© Geoapify",
    maxZoom: 19
  }
).addTo(map);



//to add maker on map
const faIcon = L.divIcon({
  html: `<i class="fa-solid fa-map-pin"></i>`,
  className: "fa-marker",
  iconSize: [30, 30],
  iconAnchor: [15, 40]
});

const marker = L.marker([lat, lng], { icon: faIcon, draggable:true }).addTo(map).bindPopup(`<h4>${listingTitle}</h4><p>Exact Location provided after booking</p>`);


