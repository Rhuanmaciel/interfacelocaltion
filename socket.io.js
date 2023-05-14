const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Lista de usuários (isso seria substituído por uma lista dinâmica no seu caso)
let users = [];

// Cada usuário seria um objeto assim: {id: 'abc', name: 'Usuário ABC'}

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    socket.emit('user_update', users); // Enviar a lista de usuários para novos clientes

    // Quando o cliente envia uma atualização de localização
    socket.on('location_update', (data) => {
        console.log(`Recebida atualização de localização de ${data.id}`);
        io.emit('location_update', data); // Transmitir a atualização de localização para todos os clientes
    });

    // Quando o cliente envia uma atualização de localização
    socket.on('location_update', (data) => {
        const user = users.find(user => user.token === data.token);
        if (user) {
            console.log(`Recebida atualização de localização de ${user.id}`);
            user.location = data.location;
            io.emit('location_update', user); // Transmitir a atualização de localização para todos os clientes
        }
    });


    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Servidor WebSocket escutando na porta ' + (process.env.PORT || 3000));
});

