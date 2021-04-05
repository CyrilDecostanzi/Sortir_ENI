import React from "react";
import './connexion.css';

const LoginForm = (props) => {

    const handlePseudoChange = (event) => {
        props.pseudoChange(event.target.value);
    }

    const handlePasswordChange = (event) => {
        props.passwordChange(event.target.value);
    }

        const pseudo = props.pseudo;
        const password = props.password;

        return (
            <div className="login animate__animated animate__backInDown">
                <div className="inline-form">
                    <legend>Identifiant :</legend>
                    <input type="text"
                           value={pseudo}
                           onChange={handlePseudoChange}
                           required="required"/>
                </div>
                <div className="inline-form">
                    <legend>Mot de passe :</legend>
                    <input type="password"
                           value={password}
                           onChange={handlePasswordChange}
                           required="required"/>
                </div>
                <div className="btn-container">
                    <button type="submit" className="submit-button" onClick={props.loginListener}>Connexion</button>
                    <div className="remember-me">
                        <input type="checkbox" id="remember_me" name="_remember_me"/>
                        <label htmlFor="remember_me">Se souvenir de moi</label>
                    </div>
                </div>
               </div>
        );
}

export default LoginForm