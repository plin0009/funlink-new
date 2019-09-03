import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';

ReactDOM.render(
    <Layout>
        <section className="hero is-large">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title is-1">Not found</h1>
                    <h2 className="subtitle is-3">Sorry about that.</h2>
                </div>
            </div>
        </section>
    </Layout>,
    document.getElementById("root")
);