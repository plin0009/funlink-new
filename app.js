const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rfid = require('random-friendly-id');
const settings = require('./settings');

const port = process.env.PORT || 3000;



http.listen(port, () => console.log(`listening on port ${port}`));