import React, {useState} from "react";
import './cancel.css';
import axios from 'axios';

const Cancel = (props) =>{

    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [activity] = useState(props.location.state.activity);
    const [cancelState] = useState('/api/states/6')


    const handleSubmit = (e) => {
        e.preventDefault();
        if(e.target.elements.namedItem('cancel_motif').value === ""){
            setError(true);
            setMessage('Veuillez saisir un motif d\'annulation');
        } else {
            axios.put(`https://127.0.0.1:8000${activity['@id']}`, {
                "state": cancelState,
                "description" : activity.description + ' ' + 'Motif d\'annulation : ' + e.target.elements.namedItem('cancel_motif').value
            }).catch(err => {
                setError(true);
                setMessage(err.response.data.violations[0].message);
            }).then(() => {
                setError(false);
                setMessage(`La sortie a bien été annulée vous allez être redirigé vers l'accueil`);
                setTimeout(() =>props.history.push('/app/accueil'), 2000);
            })
        }

    }

        return (
            <div className="cancel_container">
               <h2 className="cancel_title animate__animated animate__backInDown">Annuler une sortie</h2>
               <p className={ error ? 'profile_message_error' : 'profile_message_success' }>{message}</p>
               <form onSubmit={handleSubmit} className="cancel_form_container">
                    <div className="cancel_form">
                        <div className="cancel_box">
                            <label className="info_label">Nom de la sortie :</label>
                            <span>{activity.name}</span>
                        </div>
                        <div className="cancel_box">
                            <label className="info_label">Date de la sortie :</label>
                            <span>{new Date(activity.dateTimeStart).toLocaleDateString()}</span>
                        </div>
                        <div className="cancel_box">
                            <label className="info_label" htmlFor="act_name">Campus :</label>
                            <span>{activity.campus.name}</span>
                        </div>
                        <div className="cancel_box">
                            <label id="address_label" htmlFor="act_name">Lieu :</label>
                            <div className="cancel_address">
                                <span>{activity.place.name + ' ' + activity.place.street + ' ' + activity.place.city.postalCode + ' ' + activity.place.city.name}</span>
                            </div>
                        </div>
                        <div className="cancel_box">
                            <label className="info_label" htmlFor="cancel_motif">Motif :</label>
                            <textarea name="cancel_motif" id="cancel_motif" cols="30" rows="10"/>
                        </div>
                        <div className="button_box_cancel">
                            <button type="submit">Enregistrer</button>
                            <button type="button" onClick={() => props.history.push('/app/accueil')}>Annuler</button>
                        </div>
                    </div>

               </form>
            </div>


        )
}

export default Cancel