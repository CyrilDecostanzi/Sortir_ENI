import React, {useState} from 'react';
import axios from "axios";

const Publish = (props) => {

    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const iriStatePublished = '/api/states/2';

    const publish = () => {

        axios.put(`https://127.0.0.1:8000${props.activity["@id"]}`, {
            "state": iriStatePublished
        }).catch(() => {
            setError(true);
            setMessage("Une erreur s'est produite a la publication");
        }).then()

        props.publish();

    }

        return (
            <a onClick={publish}>Publier</a>
        );
}

export default Publish;