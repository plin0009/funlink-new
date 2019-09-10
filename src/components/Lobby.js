import React from 'react';
import socket from 'socket.io-client';

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            joinError: '',
            message: '',
            messages: [],
            room: false,
            socket: socket(document.location.pathname)
        };
    }
    componentDidMount() {
        this.state.socket.on('connect', () => {
            console.log('socket connected');
            this.state.socket.on('join error', e => {
                this.setState({joinError: e});
            });
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
    }
    addMessage(message) {
        this.setState({
            messages: [...this.state.messages, message]
        }, () => {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight; // when there's a new message, scroll to bottom
        });
    }
    join(nickname) {
        // server will either emit 'join error' or 'joined'
        this.emit('join', nickname);
    }
    possiblySubmit(e, submit) {
        console.log(`you pressed key ${e.keyCode}, possibly submitting`);
        if (e.keyCode === 13)   submit();
    }
    render() {
        return (
            <section className="section">
                <div className="container">
                    { !this.state.room ? (
                        <div>
                            {this.state.joinError && (
                                <div className="box has-background-danger">
                                    {this.state.joinError}
                                </div>
                            )}
                            <div className="field is-grouped">
                                <div className="control is-expanded">
                                    <input type="text" className="input is-large" value={this.state.nickname} onChange={e => this.handleChange(e, 'nickname')} onKeyDown={e => this.possiblySubmit(e, () => this.join(this.state.nickname))} placeholder="Nickname"/>
                                </div>
                                <div className="control">
                                    <button className="button is-large is-primary has-text-dark" onClick={() => this.join(this.state.nickname)}>Join!</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div id="lobby">
                            <div className="columns">
                                <div className="column is-narrow">
                                    <div className="box has-background-primary">
                                        <div id="players">
                                            <h1 className="title has-text-dark">Players ({this.state.room.playersList.length})</h1>
                                            <ul>
                                                {this.state.room.playersList.map(id => (
                                                    <li key={id}>{this.state.room.players[id].nickname}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
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
                                                    <input type="text" className="input is-large" value={this.state.message} onChange={e => this.handleChange(e, 'message', () => this.sendMessage())} onKeyDown={e => this.possiblySubmit(e, () => this.sendMessage())} placeholder='Be nice!'/>
                                                </div>
                                                <div className="control">
                                                    <button className="button is-large is-info" onClick={() => this.sendMessage()}>Send</button>
                                                </div>
                                            </div>
                                        </div>
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