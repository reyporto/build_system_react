import React, { Component } from 'react';
import Header from '../header/Header';

class Product extends Component {
    state = {
        product: {},
        empty: true
    };

    componentWillMount() {
        const { id } = this.props.match.params;
        let productsStorage = localStorage.getItem('products');
        let product = {};

        if (productsStorage !== null) {
            let products = JSON.parse(productsStorage);
            
            if (products.length > 0) {
                for (let prod of products) {
                    if (prod.id === id) {
                        product = prod;
                        break;
                    }
                }
            }

            this.state.product = product;
            this.state.empty = Object.keys(product).length === 0;
        }
    }

    back(e) {
        e.preventDefault();
        window.location = '/catalog';
    }

    render() {
        return(
            <div className="background background-catalog">
                <Header quantity={0}></Header>
                <div className="container container-background-white">
                    {!this.state.empty ? (
                        <div className="col-12">
                            <div className="row mb-3">
                                <div className="col-12 bb-1">
                                    <h1 className="mt-5em">{this.state.product.name}</h1>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-7">
                                    <img src={'../assets/images/' + this.state.product.image} className="product-image" />
                                </div>
                                <div className="col-lg-5">
                                    <div className="row">
                                        <strong>Price:</strong>&nbsp;${this.state.product.price}.00
                                    </div>
                                    <div className="row">
                                        <strong>Stock:</strong>&nbsp;{this.state.product.stock}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <button type="button" className="btn btn-light" onClick={this.back.bind(this)}>Atrás</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-12">
                            <div className="row">
                                Cargando...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Product;