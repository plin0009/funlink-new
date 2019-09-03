import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';
import rfid from 'random-friendly-id';

ReactDOM.render(
    <Layout>
        <section className="section">
            <div className="container">
                <div className="columns is-centered is-multiline">
                    <div className="column is-6">
                        <div className="box has-text-centered">
                            <h1 className="title">Need a room?</h1>
                            <button className="button is-large is-primary has-text-dark">Create a funlink</button>
                        </div>
                    </div>
                    <div className="column">
                        <div className="box has-text-centered">
                            <h1 className="title">Have a funcode?</h1>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <div className="control">
                                            <input className="input is-large" type="text" placeholder={`${rfid()}`}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-narrow has-text-centered">
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