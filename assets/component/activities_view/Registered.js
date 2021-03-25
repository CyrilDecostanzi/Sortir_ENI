

import React, {Component} from 'react';
import axios from "axios";

class Registered extends Component {

    state = {
        message: '',
        error: false
    }

    register = () => {

        const participants = this.props.activity.participants;
        const IRIs = [];

        if(participants.length === 0) {
            IRIs.push(this.props.user["@id"]);
        } else {

            for(let i=0; i < participants.length; i++) {
                IRIs.push(participants[i]["@id"]);
            }
            IRIs.push(this.props.user["@id"]);
        }

        let state = (this.props.activity.registrationsMax === IRIs.length) ? "/api/states/3" : "/api/states/2";

        const activityIRI = this.props.activity["@id"];


        axios.put(`https://127.0.0.1:8000${activityIRI}`, {
            "participants": IRIs,
            "state": state,
        }).catch(() => {
            this.setState({error : true})
            this.setState({message : "Une erreur s'est produite lors de l'inscription"})
        }).then()

        if(this.state.error) {
            document.getElementById("error-message-activities").innerText = this.state.message;
        }

        this.props.register();

}

    render() {
        return (
            <a onClick={this.register}>S'inscrire</a>
        );
    }
}

export default Registered;