let map;
let marker;
let selectedUser;

const socket = io();

function initMap() {
  const map = L.map('mapid').setView([0, 0], 2);
  map.invalidateSize();
  L.tileLayer('https://{s}.{base}.maps.ls.hereapi.com/maptile/2.1/{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?apiKey={apiKey}', {
    attribution: 'Map &copy; 1987-' + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
    subdomains: '1234',
    mapID: 'newest',
    apiKey: 'pRmorT5MRKqeWDOMDXNAia7H6WYSH7PKomV9VNhh4UY',
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
    alert("A geolocalocalização não é suportada por este navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("update_location", location);
  });
}

socket.on("users_update", (users) => {
  const userTable = document.getElementById("userTable");
  userTable.innerHTML = "";

  users.forEach((user, index) => {
    const row = userTable.insertRow();
    const cell = row.insertCell();

    cell.textContent = user.name;
    row.onclick = () => {
      selectUser(index);
    };
  });
});

socket.on("selected_user_location", (location) => {
  if (marker) {
    marker.remove();
  }

  const latlng = [location.latitude, location.longitude];
  map.setView(latlng, 13);
  marker = L.marker(latlng).addTo(map);
});

function selectUser(index) {
  selectedUser = index;
  socket.emit("select_user", index);
}

initMap();
registerUser("Nome do Usuário", { latitude: -23.5505, longitude: -46.6333 });
updateLocation();
setInterval(updateLocation, 10000);