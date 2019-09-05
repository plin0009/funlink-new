const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rfid = require('random-friendly-id');
const settings = require('./settings');

const port = process.env.PORT || 3000;
const rooms = {};

const newRoom = () => {
    let funcode = rfid();
    while (rooms[funcode])  funcode = rfid();   // on the off-chance that 
    rooms[funcode] = {
        playersList: [],
        players: {},
        inactivity: setTimeout(() => deleteRoom(namespace, funcode), settings.inactivityTimeout)
    };
    const namespace = io.of(`/${funcode}`); // create socket.io namespace with funcode
    namespace.on('connect', socket => {     // when someone connects
        if (rooms[funcode].inactivity) {    // cancel the inactivity timer
            clearTimeout(rooms[funcode].inactivity);
            delete rooms[funcode].inactivity;
        }
        socket.on('join', n => {     // when a nickname is chosen (person becomes player)
            console.log(`${n} joined ${funcode}`);
            rooms[funcode].players[socket.id] = {
                id: socket.id,
                nickname: n
            };
            if (!rooms[funcode].playersList.length) {              // if no one here, 
                rooms[funcode].players[socket.id].role = 'leader'; // make this player the leader
                rooms[funcode].leader = socket.id;
            }
            rooms[funcode].playersList.push(socket.id);
            
            socket.emit('joined', rooms[funcode]);  // give player room details
            socket.broadcast.emit('new player', rooms[funcode].players[socket.id]) // tell other players about new player
        });
        
        // socket.on('choose game', data => {});
        socket.on('send message', m => {
            socket.broadcast.emit('sent message', { // sender already has a copy of the message
                sender: rooms[funcode].players[socket.id].nickname,
                message: m
            });
        });
        
        socket.on('disconnect', () => {
            if (rooms[funcode].players[socket.id]) {    // if it was a player who disconnected
                let player = rooms[funcode].players[socket.id];
                console.log(`${player.nickname} disconnected from funlink ${funcode}`);
                socket.broadcast.emit('player left', socket.id);                        // tell other players somebody's leaving
                delete rooms[funcode].players[socket.id];                               // delete player data
                rooms[funcode].playersList.splice(rooms[funcode].playersList.indexOf(socket.id), 1);    // delete from player list
            
                if (player.role === 'leader' && rooms[funcode].players.length) {    // if old player was the leader
                    const leaderId = rooms[funcode].playersList[0];
                    rooms[funcode].leader = leaderId;
                    rooms[funcode].players[leaderId].role = 'leader';
                    socket.broadcast.emit('new leader', leaderId);  // tell everybody else there's a new leader in town
                }
            }
            if (!Object.keys(namespace.connected).length) { // if no one's here, start the self-destruct timer
                console.log(`no one in ${funcode}`);
                rooms[funcode].inactivity = setTimeout(() => deleteRoom(namespace, funcode), settings.inactivityTimeout);
            }
        });
    });
    return funcode;
}
const deleteRoom = (namespace, funcode) => {
    namespace.removeAllListeners();
    delete rooms[funcode];
    delete io.nsps[`/${funcode}`];
}
app.post('/room-create', (req, res) => {
    console.log('creating room');
    if (Object.keys(rooms).length >= settings.roomsLimit) {
        res.send({error: 'Too many rooms exist.'});
        return;
    }
    res.send({funcode: newRoom()});
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/:id', (req, res) => {
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