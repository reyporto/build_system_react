import React, { Component } from 'react';

class Header extends Component {
    state = {
        quantity: 0
    };

    componentWillMount() {
        let cart = localStorage.getItem('cart');

        if (cart !== null) {
            cart = JSON.parse(cart);
            this.setState({
                quantity: cart.length
            });
        }
    }

    signOut(e) {
        e.preventDefault();
        this.firebaseSignOut().then(() => {
            localStorage.removeItem('uid');
            localStorage.removeItem('products');
            localStorage.removeItem('cart');
            window.location = '/';
        }).catch((error) => {
            console.log('Error', error);
        });
    }

    goTo(page, e) {
        window.location = '/' + page;
    }

    firebaseSignOut() {
        return new Promise((resolve, reject) => {
            window.firebase.auth().signOut().then(function() {
                resolve();
            }).catch(function(error) {
                reject(error);
            });
        });
    }

    render() {
        const quantity = this.props.quantity === 0 ? this.state.quantity : this.props.quantity;

        return(
            <header className="container container-background-white mb-3 brb-5">
                <div className="col-12">
                    <nav className="navbar navbar-light">
                        <a className="navbar-brand">La Bodega</a>
                        <div className="form-inline">
                            <button className="navbar-toggler" type="button" onClick={this.goTo.bind(this, 'catalog')}>
                                <i className="ion ion-md-apps"></i>
                            </button>
                            <button className="navbar-toggler" type="button" onClick={this.goTo.bind(this, 'cart')}>
                                <i className="ion ion-md-cart"></i>
                                <span className="badge badge-danger">{quantity}</span>
                            </button>
                            <button className="navbar-toggler" type="button" onClick={this.signOut.bind(this)}>
                                <i className="ion ion-md-exit"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;