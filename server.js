const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rfid = require('random-friendly-id');
const settings = require('./settings');

const port = process.env.PORT || 3000;
const rooms = {
    'testid': 'room',
    'hello': 'room'
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/:id', (req, res) => {
    console.log(req.params.id);
    if (rooms[req.params.id]) {     // if room exists, open the room page
        res.sendFile(__dirname + '/client/room.html');
    } else {                        // otherwise, try to load the file
        res.sendFile(__dirname + '/client/' + req.params.id, (err) => {
            if (err) {
                console.log(err);
                res.sendFile(__dirname + `/client/${err.status}.html`);
            }
        });
    }
});

app.get('*', (req, res) => {
    console.log('404');
    res.sendFile(__dirname + `/client/404.html`);
});

http.listen(port, () => console.log(`listening on port ${port}`));