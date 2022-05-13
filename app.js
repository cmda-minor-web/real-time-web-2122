const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 8000
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const res = require('express/lib/response')

// EJS
app.set('view engine', 'ejs')
app.set('views', 'views')


// Stel een static map in 
app.use(express.static(path.resolve('public')))

http.listen(8000, () => {
  console.log('listening on 8000')
})


// Random woorden API aanroepen
const url = 'https://random-words5.p.rapidapi.com/getMultipleRandom?count=1';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
    'X-RapidAPI-Key': '30b13160bemshcbd2a9d5b3937aap149dc0jsn0218510b1dd0'
  }
};

// Username aangeven
app.get('/', (req, res) => {
  res.render('index')
})

// Na de get wordt het woord gerenderd in de ejs index
app.get('/draw', (req, res) => {

  // res.render('draw', {
  //   data: 'boom'
  // })

  fetch(url, options)
    .then(response => response.json())
    .then(woord => {
      console.log(woord);
      res.render('draw', {
        data: woord
      })
    })
    .catch(err => console.error('error:' + err));
})


// Socket.io
io.on('connection', (socket) => {
    console.log('a user connected')
  
    socket.on('message', (message) => {
      io.emit('message', message)
    })
  
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })



  




