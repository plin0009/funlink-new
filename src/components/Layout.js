import React from 'react';
import '../styles/styles.scss';

class Layout extends React.Component {
    render() {
        return (
            <>
                <section className="section">
                    <div className="container">
                        <h1 className="title is-1">Funlink</h1>
                    </div>
                </section>
                {this.props.children}
                <section className="footer">
                    <div className="container">
                        {/* todo: add copyright, links */}
                    </div>
                </section>
            </>
        );
    }
}

export default Layout;