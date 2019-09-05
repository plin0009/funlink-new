import React from 'react';
import socket from 'socket.io-client';

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            message: '',
            messages: [],
            room: false,
            socket: socket(document.location.pathname)
        };
    }
    componentDidMount() {
        this.state.socket.on('connect', () => {
            console.log('socket connected');
            this.state.socket.on('joined', r => {
                this.setState({room: r});
                
                this.state.socket.on('new player', p => {
                    this.setState({
                        room: {
                            ...this.state.room,
                            players: {
                                ...this.state.room.players,
                                [p.id]: p
                            },
                            playersList: [...this.state.room.playersList, p.id]
                        }
                    });
                    this.addMessage(`${p.nickname} joined the room.`);
                });
                this.state.socket.on('sent message', m => this.addMessage(m));
                this.state.socket.on('player left', id => {
                    let newRoom = this.state.room;
                    let nickname = newRoom.players[id].nickname;
                    delete newRoom.players[id];
                    newRoom.playersList.splice(newRoom.playersList.indexOf(id), 1);
                    this.setState({
                        room: newRoom
                    });
                    this.addMessage(`${nickname} left the room.`);
                });
                this.state.socket.on('new leader', id => {
                    this.setState({
                        room: {
                            ...this.state.room,
                            [id]: {
                                ...this.state.room[id],
                                role: 'leader'
                            }
                        },
                        leader: id
                    });
                    this.addMessage(`${this.state.room.players[id].nickname} is the new leader.`);
                });
            });
        });
    }
    handleChange(event, property) {
        this.setState({[property]:event.target.value});
    }
    emit(name, data) {
        this.state.socket.emit(name, data);
    }
    sendMessage() {
        this.emit('send message', this.state.message);
        this.setState({message: ''});
        this.addMessage({
            sender: this.state.room.players[this.state.socket.id].nickname,
            message: this.state.message
        });
    }
    addMessage(message) {
        console.log('hi111');
        this.setState({
            messages: [...this.state.messages, message]
        }, () => {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight; // when there's a new message, scroll to bottom
            console.log('hi');
        });
        console.log('hi2');
    }
    join(nickname) {
        if (nickname === '') {} // todo: prevent blank nicknames
        // todo: prevent duplicate nicknames (or add extensions)
        this.emit('join', nickname);
    }
    render() {
        return (
            <section className="section">
                <div className="container">
                    { !this.state.room ? (
                        <div className="field is-grouped">
                            <div className="control is-expanded">
                                <input type="text" className="input is-large" value={this.state.nickname} onChange={e => this.handleChange(e, 'nickname')} placeholder="Nickname"/>
                            </div>
                            <div className="control">
                                <button className="button is-large is-primary has-text-dark" onClick={() => this.join(this.state.nickname)}>Join!</button>
                            </div>
                        </div>
                    ) : (
                        <div className="box has-background-primary">
                            <div className="chatbox">
                                <div id="chat-messages" className="chat-messages">
                                    {this.state.messages.map((item, index) => item.sender ? 
                                        (<div key={index} className="chat-message">
                                            <span className="sender">{item.sender}</span>{item.message}
                                        </div>) : 
                                        (<div key={index} className="chat-message has-text-centered">
                                            {item}
                                        </div>)
                                    )}
                                </div>
                                <div className="field is-grouped">
                                    <div className="control is-expanded">
                                        <input type="text" className="input is-large" value={this.state.message} onChange={e => this.handleChange(e, 'message')} placeholder='Be nice!'/>
                                    </div>
                                    <div className="control">
                                        <button className="button is-large is-info" onClick={() => this.sendMessage()}>Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    }
}

export default Lobby;