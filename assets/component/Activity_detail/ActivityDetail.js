import React, {useState} from "react";
import './activity_detail.css';
import {Link} from "react-router-dom";
import 'animate.css';


const ActivityDetail = (props) => {

    const [activity] = useState(props.location.state.activity);

        return (
            <div className="detail_container">
                <h2 className="detail_title animate__animated animate__backInDown">Afficher une sortie</h2>
                <div className="detail_form_container">
                    <div className="detail_form">
                        <div className="left-detail-box">
                            <div className="detail_box">
                                <label className="info_label">Nom de la sortie :</label>
                                <span>{activity.name}</span>
                            </div>
                            <div className="detail_box">
                                <label className="info_label">Date de la sortie :</label>
                                <span>{new Date(activity.dateTimeStart).toLocaleString()}</span>
                            </div>
                            <div className="detail_box">
                                <label className="info_label">Date limite d'inscription :</label>
                                <span>{new Date(activity.registrationDeadline).toLocaleDateString()}</span>
                            </div>
                            <div className="detail_box">
                                <label className="info_label">Nombre de places :</label>
                                <span>{activity.registrationsMax}</span>
                            </div>
                            <div className="detail_box">
                                <label className="info_label">Durée :</label>
                                <span>{activity.duration} minutes</span>
                            </div>
                            <div className="detail_box">
                                <label>Description et infos :</label>
                                <span className="descrip">{activity.description}</span>
                            </div>
                        </div>
                        <div className="right-detail-box">
                            <div className="detail_box">
                                <label>Campus :</label>
                                <span>{activity.campus.name}</span>
                            </div>
                            <div className="detail_box">
                                <label>Lieu :</label>
                                <span>{activity.place.name}</span>
                            </div>
                            <div className="detail_box">
                                <label>Rue :</label>
                                <span>{activity.place.street}</span>
                            </div>
                            <div className="detail_box">
                                <label>Code postal :</label>
                                <span>{activity.place.city.postalCode}</span>
                            </div>
                            <div className="detail_box">
                                <label>Latitude :</label>
                                <span>{activity.place.latitude}</span>
                            </div>
                            <div className="detail_box">
                                <label>Longitude :</label>
                                <span>{activity.place.longitude}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <legend className="label-list">Liste des participants inscrits :</legend>
                <div className="part-container">

                    <div className="tab-container">
                        <table className="part-table">
                            <thead>
                            <tr>
                                <th className="th-pseudo">Pseudo</th>
                                <th className="th-name">Nom</th>
                            </tr>
                            </thead>
                            <tbody>
                            {activity.participants.map(participant =>
                                <tr key={participant.pseudo}>
                                    <td><Link to={`/app/participants/${participant.id}`}>{participant.pseudo}</Link></td>
                                    <td>{participant.firstName} {participant.lastName}</td>
                                </tr>
                            )}
                            <tr><td/><td/></tr>
                            <tr><td/><td/></tr>
                            <tr><td/><td/></tr>
                            <tr><td/><td/></tr>
                            <tr><td/><td/></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="button_box_detail">
                        <button type="button" onClick={() => props.history.push('/app/accueil')}>Retour</button>
                    </div>
                </div>
            </div>
        )
}
export default ActivityDetail