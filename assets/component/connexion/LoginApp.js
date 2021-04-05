import React, {useState, useEffect} from 'react';
import './connexion.css';
import axios from 'axios';
import LoginForm from './LoginForm';


const LoginApp = () => {

    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [getUser, setGetUser] = useState(false);

    useEffect(
        () => {
            if (redirect && getUser) {
                window.location.href = '/app/accueil';
            }
        }
    )

    const handleFormSubmit = (event) => {
        event.preventDefault();
        axios.post('/login', {
            pseudo: pseudo,
            password: password,
            withCredentials: true
        }).catch(() => {
                setMessage('mot de passe ou login invalide');
            }).then(() => {
                setRedirect(true);
            }).then(() => {
                axios.get(`/getuser`, {
                    withCredentials: true
                }).catch(() => {
                    setMessage('mot de passe ou login invalide');
                }).then(res => {
                    const loggedUser = res.data;
                    localStorage.setItem('id', loggedUser.id);
                    localStorage.setItem('pseudo', loggedUser.pseudo);
                    setGetUser(true);
                })
            });
    }

    const handleChangePassword = (pass) => {
        setPassword(pass);
    }

    const handleChangePseudo = (pse) => {
        setPseudo(pse);
    }


        return (
            <div className="container">
                <p className="error_message">{message}</p>
                <LoginForm
                    loginListener={handleFormSubmit}
                    pseudoChange={handleChangePseudo}
                    pseudo={pseudo}
                    passwordChange={handleChangePassword}
                    password={password}
                />
            </div>
        );
}

export default LoginApp;