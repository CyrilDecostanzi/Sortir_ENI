import React, {useState} from 'react';
import axios from "axios";

const Registered = (props) => {

    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');

    const register = () => {
        const participants = props.activity.participants;
        const IRIs = [];

        if(participants.length === 0) {
            IRIs.push(props.user["@id"]);
        } else {

            for(let i=0; i < participants.length; i++) {
                IRIs.push(participants[i]["@id"]);
            }
            IRIs.push(props.user["@id"]);
        }

        let state = (props.activity.registrationsMax === IRIs.length) ? "/api/states/3" : "/api/states/2";

        const activityIRI = props.activity["@id"];


        axios.put(`https://127.0.0.1:8000${activityIRI}`, {
            "participants": IRIs,
            "state": state,
        }).catch(() => {
            setError(true);
            setMessage("Une erreur s'est produite lors de l'inscription");
        }).then()

        if(error) {
            document.getElementById("error-message-activities").innerText = message;
        }

        props.register();

}
        return (
            <a onClick={register}>S'inscrire</a>
        );
}

export default Registered;