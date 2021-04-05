import React, {useState, useEffect} from "react";
import './update_activity.css';
import axios from "axios";


const UpdateActivity = (props) => {

    const [cities, setCities] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedPlace, setSelectedPlace] = useState('');
    const [places, setPlaces] = useState([]);
    const [actState, setActState] = useState('');
    const [createdState] = useState('/api/states/1');
    const [publishedState] = useState('/api/states/2');
    const [connectedUser, setConnectedUser] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [dateNow, setDateNow] = useState('');
    const [maxDateRegistration, setMaxDateRegistration] = useState('');
    const [activity] = useState(props.location.state.activity);
    const [startDate, setStartDate] = useState('');
    const [timeStart, setTimeStart] = useState('');

    const handleChangeForm = () => {
        setIsSaved(false);
        setIsPublished(false);
    }
    const handleSave = () => {
        setActState(createdState);
    }
    const handlePublish = () => {
        setActState(publishedState);
    }
    const handleTimeChange = (e) => {
      setMaxDateRegistration(e.target.value);
    }
    const handleDelete = () => {
        axios.delete(`https://127.0.0.1:8000${activity["@id"]}`)
            .catch(error => {
                setError(true);
                setMessage(error.response.data.violations[0].message);
            })
            .then(() => {
                setError(false);
                setMessage('La sortie a bien été supprimée ! Vous allez être redirigé vers l\'accueil...');
                setTimeout(() => props.history.push('/app/accueil'), 2000);
            })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.target.elements.namedItem('act_city').value === "" || e.target.elements.namedItem('act_place').value === "") {
            setError(true);
            setMessage('Selectionnez une ville et un lieu');
        } else {
        const dateStart =e.target.elements.namedItem('act_startdate').value + ' ' + e.target.elements.namedItem('act_start_time').value;
        axios.put(`https://127.0.0.1:8000${activity["@id"]}`, {
            "name" : e.target.elements.namedItem('act_name').value,
            "dateTimeStart" : dateStart,
            "duration" : parseInt(e.target.elements.namedItem('act_duration').value),
            "registrationDeadline" : e.target.elements.namedItem('act_maxdate').value,
            "registrationsMax" : parseInt(e.target.elements.namedItem('act_maxplaces').value),
            "description" : e.target.elements.namedItem('act_infos').value,
            "promoter" : `/api/participants/${connectedUser.id}`,
            "campus" : `/api/campuses/${connectedUser.campus.id}`,
            "state" :  actState,
            "place" : e.target.elements.namedItem('act_place').value,
        })
            .catch(error => {
                setError(true);
                setMessage(error.response.data.violations[0].message);
            })
            .then(response => {
                if(response) {
                    setIsSaved(true);
                    setIsPublished(true);
                    setError(false);
                    setMessage('La sortie a bien été modifiée ! Vous allez être redirigé vers l\'accueil...');
                    setTimeout(() => props.history.push('/app/accueil'), 2000)
                }
            })

        }
    }
    const handleChange = (e) => {

            axios.get(`https://127.0.0.1:8000` + e.target.value)
                .catch(() => {
                    setError(true);
                    setMessage('Un problème est survenue, veuillez reesayer plus tard');
                })
                .then(res => {
                    const selectCity = res.data;
                    setSelectedCity(selectCity);
                    axios.get(`https://127.0.0.1:8000/api/places?city.id=` + selectCity.id)
                        .catch(() => {
                            setError(true);
                            setMessage('Un problème est survenue, veuillez reesayer plus tard');
                        })
                        .then(res => {
                                const place = res.data['hydra:member'];
                                setPlaces(place);
                                setSelectedPlace("");
                            }
                        )
                })


    }
    const handlePlaceChange = (e) => {
        axios.get(`https://127.0.0.1:8000`+e.target.value)
            .catch(() => {
                setError(true);
                setMessage('Veuillez choisir un lieu valide');
            })
            .then(res => {
                    const selectPlace = res.data;
                    setSelectedPlace(selectPlace);
                    setMessage('');
                }
            )
    }

    useEffect(() => {
        const deadline = activity.registrationDeadline;
        setMaxDateRegistration(deadline.substr(0, 10))
        setStartDate(activity.dateTimeStart.substr(0, 10))
        setTimeStart(activity.dateTimeStart.substr(11, 5))


        axios.get(`https://127.0.0.1:8000/api/cities`)
            .catch(() => {
                setError(true);
                setMessage('Un problème est survenue, veuillez reesayer plus tard')
            })
            .then(res => {
                const city = res.data['hydra:member'];
                setCities(city);
            })
            .then(() => {
                axios.get(`https://127.0.0.1:8000/getuser`)
                    .catch(()=> {
                        setError(true);
                        setMessage('Impossible de récuperer l\'utilisateur');
                    })
                    .then(res => {
                        const connectUser = res.data;
                        setConnectedUser(connectUser);
                        setDateNow(new Date().toISOString().substr(0, 10));
                    })
            })


    }, [])

    return(
        <div className="create_act_container">
            <h2 className="create_act_title animate__animated animate__backInDown">Modifier une sortie</h2>
            <p className={ error ? 'profile_message_error' : 'profile_message_success' }>{message}</p>
            <div className="create_act_form_container">
                <form onSubmit={handleSubmit} onChange={handleChangeForm} >
                    <div className="create_act_form">
                        <div className="form_left_col form_act_box">
                            <div className="create_act_box">
                                <label htmlFor="act_name">Nom de la sortie :</label>
                                <input type="text" name="act_name" id="act_name" required="required" defaultValue={activity.name}/>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_startdate">Date et heure du début de la sortie :</label>
                                <input defaultValue={startDate} min={dateNow}  type="date" id="act_startdate" name="act_startdate" required="required" onChange={handleTimeChange}/>
                                <input defaultValue={timeStart} type="time" id="act_start_time" name="act_start_time" required="required"/>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_maxdate">Date limite d'inscription :</label>
                                <input defaultValue={maxDateRegistration} max={startDate} min={dateNow} type="date" id="act_maxdate" name="act_maxdate" required="required"/>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_maxplaces">Nombres de places (<em>hors organisateur</em>):</label>
                                <input type="number" id="act_maxplaces" name="act_maxplaces" required="required" defaultValue={activity.registrationsMax}/>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_duration">Durée :</label>
                                <input type="number" id="act_duration" name="act_duration" required="required" defaultValue={activity.duration}/>
                            </div>
                            <div className="create_act_box">
                                <label className="textarea_label" htmlFor="act_infos">Description et infos :</label>
                                <textarea name="act_infos" id="act_infos" cols="30" rows="5" required="required" defaultValue={activity.description}/>
                            </div>
                        </div>
                        <div className="form_right_col form_act_box">
                            <div className="create_act_box">
                                <label>Campus :</label>
                                <em>{activity.campus.name}</em>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_city">Ville :</label>
                                <select name="act_city" id="act_city" onChange={handleChange} required="required" defaultValue="">
                                    <option disabled={true} value="">Selectionnez une ville</option>
                                    {cities.map(city =>
                                        <option key={city.name} value={city["@id"]}>{city.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_place">Lieu :</label>
                                <select name="act_place" id="act_place" onChange={handlePlaceChange} required="required" defaultValue={selectedPlace.id ? 'api/places/'+ selectedPlace.id : ""}>
                                    <option value="">Selectionnez un lieu</option>
                                    {places.map(place =>
                                        <option key={place.name} value={place["@id"]}>{ place.name }</option>
                                    )}
                                </select>
                            </div>
                            <div className="create_act_box">
                                <label>Rue :</label>
                                <em>{selectedPlace.street}</em>
                            </div>
                            <div className="create_act_box">
                                <label>Code postal :</label>
                                <em>{selectedCity.postalCode}</em>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_latitude">Latitude :</label>
                                <input value={selectedPlace.latitude} name="act_latitude" id="act_latitude" type="text" disabled="disabled"/>
                            </div>
                            <div className="create_act_box">
                                <label htmlFor="act_longitude">Longitude :</label>
                                <input value={selectedPlace.longitude} type="text" name="act_longitude" id="act_longitude" disabled="disabled"/>
                            </div>
                        </div>
                    </div>
                    <div className="create_act_box_button">
                        <button disabled={isSaved} onClick={handleSave} type="submit">Enregistrer</button>
                        <button disabled={isPublished} type='submit' name="publishButton" className="publishButton" onClick={handlePublish}>Publier la sortie</button>
                        <button type='button' className="publishButton" onClick={handleDelete}>Supprimer la sortie</button>
                        <button onClick={() => props.history.push('/app/accueil')} type="button">Annuler</button>
                    </div>
                </form>
            </div>


        </div>
    )
}
export default UpdateActivity