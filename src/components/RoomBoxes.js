import React from 'react';
class RoomBoxes extends React.Component {
    render() {
        return (
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-narrow">
                            <div className="box has-text-centered">
                                <h1 className="title">Invite some players!</h1>
                                <input type="text" className="input funlink-url" value={window.location.href} readOnly onClick={e => {
                                    e.target.select();
                                    document.execCommand('copy');
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default RoomBoxes;