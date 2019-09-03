import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';

import '../styles/styles.scss';

ReactDOM.render(
    <Layout>
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-narrow">
                        <div className="box has-text-centered">
                            <h1 className="title">Invite some players!</h1>
                            <input type="text" className="input" value={window.location.href} readOnly/> {/* todo: click to copy the link */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Layout>,
    document.getElementById("root")
);