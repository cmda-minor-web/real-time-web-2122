require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT

// Doe dan Miranda.
app.set('view engine', 'ejs')
app.set('views', './views')

// Maak een route voor de index
app.get('/', function (req, res) {
    res.render('index')
})

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});