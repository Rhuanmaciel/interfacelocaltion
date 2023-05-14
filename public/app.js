let map;
let marker;
let selectedUser;

const socket = io.connect('http://your-websocket-server.com');

// Iniciar o mapa
function initMap() {
    map = L.map('mapid').setView([0, 0], 2);
    L.tileLayer('https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=YOUR_API_KEY', {
        maxZoom: 19,
    }).addTo(map);
}

// Atualizar o mapa com a nova localização
function updateMap(location) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([location.coords.latitude, location.coords.longitude]).addTo(map);
    map.setView([location.coords.latitude, location.coords.longitude], 10);
}

// Quando o servidor envia uma atualização de localização
socket.on('location_update', (data) => {
    if (data.id === selectedUser) {
        updateMap(data.location);
    }
});

// Quando o servidor envia uma atualização da lista de usuários
socket.on('user_update', (users) => {
    const userList = document.getElementById('users');
    userList.innerHTML = '';
    users.forEach((user) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.textContent = user.name;
        userDiv.setAttribute('data-id', user.id);
        userDiv.addEventListener('click', () => {
            selectedUser = user.id;
            updateMap(user.location);
        });
        userList.appendChild(userDiv);
    });
});

initMap();