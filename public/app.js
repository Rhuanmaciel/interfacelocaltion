let map;
let marker;
let selectedUser;

const socket = io.connect('http://your-websocket-server.com');

// Iniciar o mapa
function initMap() {
    map = L.map('mapid').setView([0, 0], 2);
    L.tileLayer('https://{s}.{base}.maps.ls.hereapi.com/maptile/2.1/{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?apiKey={apiKey}', {
        attribution: 'Map &copy; 1987-' + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
        subdomains: '1234',
        mapID: 'newest',
        apiKey: 'XDR6IxYlZY2IYG7Y0djDapRmorT5MRKqeWDOMDXNAia7H6WYSH7PKomV9VNhh4UY', // substitua por sua própria chave de API
        base: 'base',
        variant: 'normal.day',
        maxZoom: 19,
        type: 'maptile',
        size: '256',
        format: 'png8',
        id: 'map'
    }).addTo(map);
}


// Atualizar o mapa com a nova localização
function updateMap(location) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([location.coords.latitude, location.coords.longitude]).addTo(map)
        .bindPopup(`<b>${selectedUser}</b><br>Última atualização: ${new Date().toLocaleString()}`)
        .openPopup();
    map.setView([location.coords.latitude, location.coords.longitude], 10, {animate: true});
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
