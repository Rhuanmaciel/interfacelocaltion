let map;
let marker;
let selectedUser;

const socket = io.connect('http://your-websocket-server.com');

// Iniciar o mapa
function initMap() {
    map = L.map('mapid').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '';
    users.forEach((user) => {
        const option = document.createElement('option');
        option.text = user.name;
        option.value = user.id;
        userSelect.add(option);
    });
});

// Quando o usuário selecionado muda
document.getElementById('userSelect').addEventListener('change', (event) => {
    selectedUser = event.target.value;
});

initMap();
