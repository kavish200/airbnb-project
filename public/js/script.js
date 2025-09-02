// Step 1: Initialize the map and select the container
// 'map' is the ID of your div element from the HTML
const map = L.map('map'); 

// Step 2: Set the initial view (latitude, longitude, and zoom level)
// Example: New Delhi, India
map.setView([28.6139, 77.2090], 13); 

// Step 3: Add the tile layer (the actual map)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// At this point, you should see a basic interactive map of New Delhi.