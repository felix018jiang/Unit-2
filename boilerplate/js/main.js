// Add all scripts to the JS folder
var map = L.map('map').setView([51.505, -0.09], 13);

//Example 1.1 line 5...add tile layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);
L.tileLayer('http://c.tile.openstreetmap.org/12/1031/1503.png').addTo(map);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);