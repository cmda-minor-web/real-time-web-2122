require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 1961;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.resolve('public')));

let newData;
let userList = [];

app.get('/', (req, res) => {
    fetch('https://api.le-systeme-solaire.net/rest/bodies/')
        .then(response => response.json())
        .then(data => {
            let sunData = data.bodies.find(asset => asset.englishName === 'Sun');
            data = data.bodies.filter(asset => asset.isPlanet);
            data.push(sunData)
            data.sort(function (a, b) {
                return b.perihelion - a.perihelion;
            });
            data.reverse();
            newData = data;
            res.render('index', {
                data: data,
                users: userList
            })
        })
        .catch(error => console.log(error))
});

io.on('connection', function (socket) {
    socket.emit('data', newData);
    socket.on('new user', username => {
        let object = {username: username, id: socket.id};
        userList.push(object);
        io.emit("new user", {user: object, users: userList});
        socket.on('planet position', planet => {
            io.emit("planet position", planet);
        });
    });
    socket.on('position', pos => {
        io.emit("position", pos);
    });
    socket.on('disconnect', () => {
        io.emit('user left', {id: socket.id})
        userList = userList.filter(user => user.id !== socket.id );
    });
});

http.listen(port, () => {
    console.log('listening on port ', port);
})