import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import photo from "../../images/licorne.png";

export default class ViewParticipantProfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pseudo: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            campusName: '',
        };
    }

    componentDidMount() {
        const url = window.location.href.replace('app', 'api')

        axios.get(url, {
            withCredentials: true
        }).catch(error => {
            this.setState({error: true})
            this.setState({message: 'Un problème est survenue, veuillez reesayer plus tard'})
        }).then(res => {
            const person = res.data
            this.setState({
                pseudo: person.pseudo,
                firstName: person.firstName,
                lastName: person.lastName,
                phoneNumber: person.phoneNumber,
                email: person.mail,
                campusName: person.campus.name
            })
        });
    }

    render() {
        return (
            <div>
                <div className="container-pro">

                    <div className="profile-pic-view animate__animated animate__bounceInUp">
                        <img src={photo} width="250"  alt="photo de profil"/>
                    </div>
                    <div className="hate_css">
                        <h2 className="profile-view-title">{this.state.pseudo}</h2>
                        <p className={this.state.error ? 'profile_message_error' : 'profile_message_success'}>{this.state.message}</p>
                        <div className="profile-box">
                            <label>Prenom :</label><span>{this.state.firstName}</span>
                        </div>
                        <div className="profile-box">
                            <label>Nom :</label><span>{this.state.lastName}</span>
                        </div>
                        <div className="profile-box">
                            <label>Téléphone :</label><span>{this.state.phoneNumber}</span>
                        </div>
                        <div className="profile-box">
                            <label>Email :</label><span>{this.state.email}</span>
                        </div>
                        <div className="profile-box">
                            <label>Campus :</label><span>{this.state.campusName}</span>
                        </div>
                        <div className="btn-pro">
                            <Link to="/app/accueil"><button>Retour</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}