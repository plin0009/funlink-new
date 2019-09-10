import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';
import RoomBoxes from '../components/RoomBoxes';
import Lobby from '../components/Lobby';
import '../styles/styles.scss';

ReactDOM.render(
    <Layout>
        <RoomBoxes/>
        <Lobby/>
    </Layout>,
    document.getElementById("root")
);