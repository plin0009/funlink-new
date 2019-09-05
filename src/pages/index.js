import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';
import rfid from 'random-friendly-id';

const createRoom = () => {
    fetch('/room-create', { method: 'POST' })
        .then(res => res.json())
        .then(data => window.location.href += data.funcode);
}

ReactDOM.render(
    <Layout>
        <section className="section">
            <div className="container">
                <div className="columns is-centered is-multiline">
                    <div className="column is-6">
                        <div className="box has-text-centered">
                            <h1 className="title">Need a room?</h1>
                            <button className="button is-large is-primary has-text-dark" onClick={createRoom}>Create a funlink</button>
                        </div>
                    </div>
                    <div className="column">
                        <div className="box has-text-centered">
                            <h1 className="title">Have a funcode?</h1>
                            <div className="columns is-mobile">
                                <div className="column">
                                    <div className="field">
                                        <div className="control">
                                            <input className="input is-large" type="text" placeholder={`${rfid()}`}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-narrow">
                                    <button className="button is-large is-primary has-text-dark">Join the fun!</button>                            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    </Layout>,
    document.getElementById("root")
);