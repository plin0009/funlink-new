import React from 'react';
import '../styles/styles.scss';

class Layout extends React.Component {
    render() {
        return (
            <>
                <section className="section has-background-dark">
                    <div className="container">
                        <h1 className="title is-1">funlink</h1> {/* todo: replace with logo */}
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