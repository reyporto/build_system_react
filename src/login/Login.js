import React, { Component } from 'react';

class Login extends Component {
    state = {
        email: '',
        password: '',
        signIn: true,
        load: false
    };

    componentWillMount() {
        let uid = localStorage.getItem('uid');

        if (uid !== null) {
            window.location = '/catalog';
        } else {
            this.setState({
                load: true
            }); 
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.firebaseAuth().then((uid) => {
            this.setState({
                signIn: true
            });

            localStorage.setItem('uid', uid);
            localStorage.setItem('cart', JSON.stringify([]));
            window.location = '/catalog';
        }).catch((error) => {
            console.log(error);
            this.setState({
                signIn: false
            });
        });
    }

    firebaseAuth() {
        return new Promise((resolve, reject) => {
            window.firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(function(data) {
                resolve(data.user.uid);
            }).catch(function(error) {
                reject(error);
            });
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return(
            <div>
                {this.state.load ? (
                    <div className="background background-login">
                        <div className="container">
                            <div className="col-12">
                                <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-xs-12">
                                    <form onSubmit={this.handleSubmit.bind(this)}>
                                        <div className="text-center">
                                            <label className="title"><strong>Inicio Sesión</strong></label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email"><strong>Correo electrónico:</strong></label>
                                            <input type="email" 
                                                value={this.state.email} 
                                                className="form-control" 
                                                id="email" 
                                                name="email" 
                                                placeholder="maria@mail.com"
                                                minLength="5" 
                                                maxLength="50"
                                                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                                required
                                                onChange={this.handleChange.bind(this)}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password"><strong>Contraseña:</strong></label>
                                            <input 
                                                type="password" 
                                                value={this.state.password} 
                                                className="form-control" 
                                                id="password" 
                                                name="password" 
                                                placeholder="*******"
                                                minLength="5" 
                                                maxLength="50" 
                                                required
                                                onChange={this.handleChange.bind(this)}/>
                                        </div>
                                        {!this.state.signIn ? (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                <span className="alert-link">Correo electrónico</span> o <span className="alert-link">Contraseña</span> incorrectos.
                                            </div>
                                        ) : (null)}
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-success">
                                                Ingresar
                                            </button>
                                        </div>
                                    </form>
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

export default Login;