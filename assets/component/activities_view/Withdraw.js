import React, {Component} from 'react';
import axios from "axios";


class Withdraw extends Component {

    state = {
        message: '',
        error: false
    }


    withdraw = () => {

        const participants = this.props.activity.participants;
        let IRIs = [];

        let userIRI = this.props.user["@id"];


        for(let i=0; i < participants.length; i++) {
            IRIs.push(participants[i]["@id"]);
        }


        IRIs = IRIs.filter(item => item !== userIRI);


        let state = (this.props.activity.registrationsMax === IRIs.length) ? "/api/states/3" : "/api/states/2";


        const activityIRI = this.props.activity["@id"];

        axios.put(`https://127.0.0.1:8000${activityIRI}`, {
            "participants": IRIs,
            "state": state,
        }).catch(() => {
            this.setState({error : true})
            this.setState({message : "Une erreur s'est produite lors du désistement"})
        }).then()


        if(this.state.error) {
            document.getElementById("error-message-activities").innerText = this.state.message;
        }

        this.props.withdraw();

    }

    render() {

        return (
                <a onClick={this.withdraw}>Se désister</a>
        );
    }
}


export default Withdraw;