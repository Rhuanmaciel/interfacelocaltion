let map;
let marker;
let selectedUser;

const socket = io();

function initMap() {
  map = L.map('mapid').setView([0, 0], 2);
  L.tileLayer('https://{s}.{base}.maps.ls.hereapi.com/maptile/2.1/{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?apiKey={apiKey}', {
    attribution: 'Map &copy; 1987-' + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
    subdomains: '1234',
    mapID: 'newest',
    apiKey: '<YOUR_API_KEY>',
    base: 'base',
    variant: 'normal.day',
    maxZoom: 19,
    type: 'maptile',
    size: '256',
    format: 'png8',
    id: 'map'
  }).addTo(map);
}

function registerUser(name, location) {
  const userData = {
    name: name,
    location: location,
  };

  socket.emit("register_user", userData);
}

function updateLocation() {
  if (!navigator.geolocation) {
    alert("A geolocalização não é suportada pelo seu navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const locationData = {
      token: userToken,
      location: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      name: userName,
    };

    socket.emit("location_update", locationData);
  });
}

function onUserRegistrationSuccess(name, location) {
  registerUser(name, location);
}

function addMarker(location, name) {
  const marker = L.marker([location.lat, location.lng]).addTo(map);
  marker.bindPopup(`<b>${name}</b>`).openPopup();
}

function updateMap(location) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker([location.coords.latitude, location.coords.longitude]).addTo(map)
    .bindPopup(`<b>${selectedUser}</b><br>Última atualização: ${new Date().toLocaleString()}`)
    .openPopup();
  map.setView([location.coords.latitude, location.coords.longitude], 10, {animate: true});
}

socket.on('location_update', (data) => {
  if (data.id === selectedUser) {
    updateMap(data.location);
  }
});

socket.on('user_update', (users) => {
  const userSelect = document.getElementById('userSelect');
  userSelect.innerHTML = '';
  users.forEach((user) => {
    const option = document.createElement('option');
    option.text = user.name;
    option.value = user.id;
    userSelect.add(option);
  });
});

document.getElementById('userSelect').addEventListener('change', (event) => {
  selectedUser = event.target.value;
});

initMap();