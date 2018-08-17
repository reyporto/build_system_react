import React, { Component } from 'react';
import Header from '../header/Header';

class Catalog extends Component {
    state = {
        products: [],
        initialProds: [],
        load: false,
        loadProducts: false,
        quantity: 0
    };

    componentWillMount() {
        let uid = localStorage.getItem('uid');

        if (uid === null) {
            window.location = '/';
        } else {
            this.setState({
                load: true
            });

            let productsStorage = localStorage.getItem('products');

            if (productsStorage !== null) {
                this.setState({
                    products: JSON.parse(productsStorage),
                    initialProds: JSON.parse(productsStorage),
                    loadProducts: true
                });
            } else {
                this.getProducts().then((products) => {
                    localStorage.setItem('products', JSON.stringify(products));
                    this.setState({
                        products: products,
                        loadProducts: true
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            let firestore = window.firebase.firestore();
            firestore.settings({ 
                timestampsInSnapshots: true
            });

            firestore.collection('products').get().then((querySnapshot) => {
                let products = [];

                if (!querySnapshot.empty) {
                    for (let doc of querySnapshot.docs) {
                        products.push(doc.data());
                    }
                }

                resolve(products);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    addToCart(product, e) {
        e.preventDefault();
        let cart = localStorage.getItem('cart');
        let cartTemp = [];
        let quantity = parseInt(document.getElementsByClassName('prodId' + product.id)[0].value);
        
        if (cart !== null) {
            cartTemp = JSON.parse(cart);

            if (cartTemp.length > 0) {
                let change = false;

                for (let item of cartTemp) {
                    if (item.id === product.id) {
                        item.quantity = item.quantity + quantity;
                        item.stock = item.stock - quantity;
                        change = true;
                        break;
                    }
                }

                if (!change) {
                    this.setItemCart(product, cartTemp, quantity);
                } else {
                    localStorage.setItem('cart', JSON.stringify(cartTemp));
                }
            } else {
                this.setItemCart(product, cartTemp, quantity);
            }
        } else {
            this.setItemCart(product, cartTemp, quantity);
        }

        this.updateProducts();
        this.updateQuantity();
    }

    setItemCart(product, cartTemp, quantity) {
        let prodTemp = {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock - quantity,
          quantity: quantity
        }
    
        cartTemp.push(prodTemp);
        localStorage.setItem('cart', JSON.stringify(cartTemp));
    }

    updateProducts() {
        let cartStorage = localStorage.getItem('cart');
        let productsStorage = localStorage.getItem('products');

        if (cartStorage !== null && productsStorage !== null) {
            let cartTemp = JSON.parse(cartStorage);
            let productsTemp = JSON.parse(productsStorage);

            if (cartTemp.length > 0) {
                let change = false;

                for (let item of cartTemp) {
                    for (let prod of productsTemp) {
                        if (prod.id === item.id) {
                            prod.stock = item.stock;
                            change = true;
                            break;
                        }
                    }
                }

                if (change) {
                    localStorage.setItem('products', JSON.stringify(productsTemp));
                    this.setState({
                        products: productsTemp
                    });
                }
            }      
        }
    }

    updateQuantity() {
        let cart = localStorage.getItem('cart');

        if (cart !== null) {
            cart = JSON.parse(cart);
            this.setState({
                quantity: cart.length
            });
        }
    }

    filterList(e) {
        let updatedList = this.state.initialProds;

        updatedList = updatedList.filter(function(item) {
            return item.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1;
        });

        this.setState({
            products: updatedList
        });
    }

    render() {
        return(
            <div>
                {this.state.load ? (
                    <div className="background background-catalog">
                        <Header quantity={this.state.quantity}></Header>
                        <div className="container container-background-white container-search brt-5">
                            <div className="col-12">
                            <div className="row">
                                <div className="col-lg-8 mt-lg-2">
                                    <h2 className="mt-5em">Catálogo de Productos</h2>
                                </div>
                                <div className="col-lg-4 mt-lg-2">
                                    <div className="row">
                                        <div className="col-12">
                                            <p className="mb-0">¿Qué estás buscando?</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <input className="form-control mr-sm-2" type="search" placeholder="Buscar porducto" onChange={this.filterList.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="container container-background-white container-custom">
                            <div className="col-12">
                                <div className="row">
                                    <div className="container-fluid">
                                        <div className="col-12">
                                            {this.state.loadProducts ? (
                                                <div className="row">
                                                    {this.state.products.map((product, key) => {
                                                        return (
                                                            <div key={key} className="col-lg-3 col-md-4 col-xs-12">
                                                                <div className="card mb-3">
                                                                    <img className="card-img-top" src={'../assets/images/' + product.image} alt="Card image cap"/>
                                                                    <div className="card-body">
                                                                        <h5 className="card-title">{product.name}</h5>
                                                                        <p className="card-text"><strong>Precio:</strong>&nbsp;${product.price}.00</p>
                                                                        <p className="card-text"><strong>Stock:</strong>&nbsp;{product.stock}</p>
                                                                        <div className="btn-group mt-1" role="group">
                                                                            <button type="button" className="btn btn-warning mr-1 btn-color-white" onClick={this.addToCart.bind(this, product)}>
                                                                                <strong>Agregar</strong>
                                                                            </button>
                                                                            <input type="number" defaultValue={1} min="1" max={product.stock} className={'card-quantity text-center prodId' + product.id} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <a href={'/product/' + product.id} className="card-link">Ver más</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="row">
                                                    Cargando productos...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Cargando...</div>
                )}
            </div>
        );
    }
}

export default Catalog;