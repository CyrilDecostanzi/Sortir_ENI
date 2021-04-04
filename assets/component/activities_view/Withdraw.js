import React, {useState} from 'react';
import axios from "axios";


const Withdraw = (props) => {

    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');


    const withdraw = () => {

        const participants = props.activity.participants;
        let IRIs = [];

        let userIRI = props.user["@id"];


        for(let i=0; i < participants.length; i++) {
            IRIs.push(participants[i]["@id"]);
        }


        IRIs = IRIs.filter(item => item !== userIRI);


        let state = (props.activity.registrationsMax === IRIs.length) ? "/api/states/3" : "/api/states/2";


        const activityIRI = props.activity["@id"];

        axios.put(`https://127.0.0.1:8000${activityIRI}`, {
            "participants": IRIs,
            "state": state,
        }).catch(() => {
            setError(true);
            setMessage("Une erreur s'est produite lors du désistement");
        }).then()


        if(error) {
            document.getElementById("error-message-activities").innerText = message;
        }

        props.withdraw();

    }
        return (
                <a onClick={withdraw}>Se désister</a>
        );
}


export default Withdraw;