import React, {Component} from 'react';
import './connexion.css';
import axios from 'axios';
import LoginForm from './LoginForm';


class LoginApp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            pseudo: '',
            password: '',
            isAdmin: '',
            message: '',
            connexion: '',
            redirect: false,
            getUser: false,
            push: '',
            password: ''
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChangePseudo = this.handleChangePseudo.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleFormSubmit(event) {
        event.preventDefault();
        axios.post('/login', {
            pseudo: this.state.pseudo,
            password: this.state.password,
            withCredentials: true
        }).catch(() => {
                const message = 'mot de passe ou login invalide';
                this.setState({message: message});
            }).then(response => {
                const connexion = response.data;
                this.setState({connexion: connexion});
                this.setState({
                    redirect: true
                })
            }).then(() => {
                axios.get(`/getuser`, {
                    withCredentials: true
                }).catch(() => {
                    const message = 'mot de passe ou login invalide';
                    this.setState({message: message});
                }).then(res => {
                    const loggedUser = res.data;
                    localStorage.setItem('id', loggedUser.id);
                    localStorage.setItem('pseudo', loggedUser.pseudo);
                    localStorage.setItem('isAdmin', loggedUser.isAdmin);
                    this.setState({
                        getUser: true
                    })

                    if (this.state.redirect && this.state.getUser) {
                        window.location.href = '/app/accueil';
                    }
                })
            });
    }

    handleChangePassword(password) {
        this.setState({password: password});
    }

    handleChangePseudo(pseudo) {
        this.setState({pseudo: pseudo});
    }

    render() {
        const pseudo = this.state.pseudo;
        const password = this.state.password;

        return (
            <div className="container">
                <p className="error_message">{this.state.message}</p>
                <LoginForm
                    loginListener={this.handleFormSubmit}
                    pseudoChange={this.handleChangePseudo}
                    pseudo={pseudo}
                    passwordChange={this.handleChangePassword}
                    password={password}
                />
            </div>
        );
    }
}

export default LoginApp;