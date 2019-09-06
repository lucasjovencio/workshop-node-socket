const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const socketio = require('socket.io');

// APP_KEY deve estar em .env
const APP_KEY = 'c32d1e78f101470dbcaa4c5e001283509881f3ba4a544521a8c1116ed0a432e2d444c0fc24814b2396d7fd4f9a7cea88'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const params = req.body;
    if (params.app_key != APP_KEY) throw Error('API KEY INVALiD');
    return next();
});

const server = app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});

const io = socketio(server);
const client = [];

io.on('connection', (socket) => {
    client.push(socket.id);
    console.log(`Cliente conectado: ${socket.id}`)
    // io.emit('new_notification', { data: "Nova conexão" , id:socket.id });
})

app.post('/notification', (req, res) => {
    const params = req.body;
    console.log(params.data)
    // const data = JSON.parse(params.data);
    io.emit('new_notification', { data:params.data , id: new Date() });
    res.send({ success: true })
});

