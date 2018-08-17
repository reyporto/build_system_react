import React, { Component } from 'react';
import Header from '../header/Header';

class Cart extends Component {
    state = {
        products: [],
        empty: true,
        total: 0,
        errorMessage: false,
        disabled: false
    };

    componentWillMount() {
        let cart = localStorage.getItem('cart');
        let products = [];
        let total = 0;

        if (cart !== null) {
            products = JSON.parse(cart);
            
            for (let product of products) {
                total += (product.price * product.quantity);
            }
        }

        this.setState({
            products: products,
            empty: total === 0,
            total: total
        });
    }

    pay(e) {
        e.preventDefault();
        if (!this.state.empty) {
            this.setState({
                disabled: true
            });

            this.updateStock(this.state.products).then((update) => {
                if (update) {
                    localStorage.removeItem('products');
                    localStorage.setItem('cart', JSON.stringify([]));
                    
                    this.setTimeout().then(() => {
                        this.setState({
                            disabled: false
                        });
                        window.location = '/catalog';
                    });
                } else {
                    this.setState({
                        errorMessage: true,
                        disabled: false
                    });
                }
            }).catch((error) => {
                this.setState({
                    errorMessage: true,
                    disabled: false
                });
                console.log(error);
            });
        }
    }

    updateStock(products) {
        return new Promise((resolve, reject) => {
            let firestore = window.firebase.firestore();
            firestore.settings({ 
                timestampsInSnapshots: true
            });

            firestore.collection('products').get().then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    for (let product of products) {
                        for (let doc of querySnapshot.docs) {
                            if (doc.id === product.id) {
                                firestore.collection('products').doc(doc.id).update({
                                    stock: product.stock
                                });
                                
                                break;
                            }
                        }
                    }
                    
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    cancel(e) {
        e.preventDefault();
        window.location = '/catalog';
    }

    setTimeout() {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve();
            }, 1500);
        });
    }

    render() {
        return(
            <div className="background background-catalog">
                <Header quantity={0}></Header>
                <div className="container container-background-white">
                    {this.state.empty ? (
                        <div className="col-12">
                            <div className="row mb-3">
                                <div className="col-12">
                                    <h1 className="mt-5em">Carro de compras vacío!</h1>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-12">
                            <div className="row mb-3">
                                <div className="col-12 bb-1">
                                    <h1 className="mt-5em">Carro de compras</h1>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-6 products-container mb-2">
                                            {this.state.products.map((product, key) => {
                                                return(
                                                    <div key={key} className="row mb-2">
                                                        <div className="col-lg-3">
                                                            <img className="cart-product-img" src={'../assets/images/' + product.image} />
                                                        </div>
                                                        <div className="col-lg-9">
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    {product.name}
                                                                </div>
                                                                <div className="row">
                                                                    <strong>Unidades:</strong>&nbsp;{product.quantity}
                                                                </div>
                                                                <div className="row">
                                                                    <strong>Subtotal:</strong>&nbsp;${product.price}.00
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="offset-lg-1 col-lg-5">
                                            <div className="row">
                                                <h3>Total:&nbsp;${this.state.total}.00</h3>
                                            </div>
                                            <div className="row mb-1">
                                                <div className="btn-group" role="group">
                                                    <button type="button" className="btn btn-light" onClick={this.cancel.bind(this)}>Cancelar</button>
                                                    <button type="button" className="btn btn-light"
                                                    disabled={this.state.disabled} onClick={this.pay.bind(this)}>Pagar</button>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {this.state.errorMessage ? (
                                                    <div className="row">
                                                        <div className="alert alert-danger" role="alert">
                                                            Ha ocurrido un error al Pagar. Por favor, intente de nuevo.
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                                {this.state.disabled ? (
                                                    <div className="alert alert-info" role="alert">
                                                        Cargando...
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Cart;