import React, {Fragment, useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import Register from "./Registered";
import Withdraw from "./Withdraw";
import Publish from "../Publish/Publish";

const ActivitiesFilters = (props) => {

    const [campusList, setCampusList] = useState([]);
    const [campus, setCampus] = useState('');
    const [searchActivityName, setSearchActivityName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [promoter, setPromoter] = useState('');
    const [registered, setRegistered] = useState('');
    const [notRegistered, setNotRegistered] = useState('');
    const [pastActivities, setPastActivities] = useState('');
    const [activitiesList, setActivitiesList] = useState([]);
    const [date] = useState(new Date().toISOString());
    const [inscription, setInscription] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [withdraw, setWithdraw] = useState(0);
    const [publish, setPublish] = useState(0);
    const [cancelLink] = useState('/app/annuler-une-sortie');
    const [updateLink] = useState('/app/modifier-une-sortie');
    const [detailLink] = useState('/app/detail-sortie');

    useEffect(() => {
        axios.get(`https://127.0.0.1:8000/api/campuses?page=1`)
            .catch(() => {
                setError(true);
                setMessage("Erreur lors du chargement des campus");
            })
            .then(res => {
                const campusesList = res.data['hydra:member'];
                setCampusList(campusesList);
            })
        axios.get(`https://127.0.0.1:8000/api/activities?page=1`)
            .catch(() => {
                setError(true);
                setMessage("Erreur lors du chargement de la liste d'activités");
            })
            .then(res => {
                const activityList = res.data['hydra:member'];
                setActivitiesList(activityList);
            })
    }, [])


    useEffect(() => {
        axios.get(`https://127.0.0.1:8000/api/activities?page=1`)
            .catch(() => {
                setError(true);
                setMessage("Erreur lors de l'actualisation de la liste d'activités");
            })
            .then(res => {
                const activities = res.data['hydra:member'];
                setActivitiesList(activities);
            })
    }, [inscription, withdraw, publish])

    const handleCampus = e => {
        setCampus(e.target.value);
    }

    const handleSearchName = e => {
        setSearchActivityName(e.target.value);
    }

    const handleStartDate = e => {
        setStartDate(e.target.value);
    }

    const handleEndDate = e => {
        setEndDate(e.target.value);
    }

    const handlePromoter = () => {

        promoter ? setPromoter(false) : setPromoter(true);
        if (document.getElementById("promoter").checked) {
            document.getElementById("registered").disabled = true;
            document.getElementById("not-registered").disabled = true;
        } else {
            document.getElementById("registered").disabled = false;
            document.getElementById("not-registered").disabled = false;
        }
    }

    const handlePastActivities = () => {
        pastActivities ? setPastActivities(false) : setPastActivities(true);
    }

    const handleRegistered = () => {

        registered ? setRegistered(false) : setRegistered(true);

        if (document.getElementById("registered").checked) {
            document.getElementById("promoter").disabled = true;
            document.getElementById("not-registered").disabled = true;
        } else {
            document.getElementById("promoter").disabled = false;
            document.getElementById("not-registered").disabled = false;
        }
    }

    const handleNotRegistered = () => {

        notRegistered ? setNotRegistered(false) : setNotRegistered(true);

        if (document.getElementById("not-registered").checked) {
            document.getElementById("registered").disabled = true;
            document.getElementById("promoter").disabled = true;
        } else {
            document.getElementById("registered").disabled = false;
            document.getElementById("promoter").disabled = false;
        }

    }

    const handleSubmit = e => {
        e.preventDefault();
        actualisation(campus, searchActivityName, startDate, endDate, promoter, pastActivities, registered);
    }

    const actualisation = (campus, name, startDate, endDate, promoter, pastActivities, registered) => {

        let nameFilter = name ? (`&name=${name}`) : ("");
        let campusFilter = campus ? (`&campus.name=${campus}`) : ("");
        let endDateFilter = endDate ? (`&dateTimeStart%5Bbefore%5D=${endDate}`) : ("");
        let startDateFilter = startDate ? (`&dateTimeStart%5Bafter%5D=${startDate}`) : ("");
        let promoterFilter = promoter ? (`&promoter.pseudo=${props.user.pseudo}`) : ("");
        let pastActivitiesFilter = pastActivities ? (`&dateTimeStart%5Bstrictly_before%5D=${date}`) : ("");
        let registeredFilter = registered ? (`&participants.pseudo=${props.user.pseudo}`) : ("");

        axios.get(`https://127.0.0.1:8000/api/activities?page=1${nameFilter}${endDateFilter}${startDateFilter}${startDate}${campusFilter}${promoterFilter}${pastActivitiesFilter}${registeredFilter}`)
            .catch(() => {
                setError(true);
                setMessage("Echec lors du filtre des activités");
            })
            .then(res => {
                const activities = res.data['hydra:member'];
                setActivitiesList(activities);

                if (notRegistered) {
                    let newList3 = notRegister(activitiesList);
                    setActivitiesList(newList3);
                }

            });

    }

    const isRegistered = (activity) => {

        let user = props.user;
        const participants = activity.participants;
        let res;
        if (participants.length === 0) {
            return " ";
        } else {
            let exist = 0;
            for (let i = 0; i < participants.length; i++) {
                if (participants[i]["@id"] === user["@id"]) {
                    exist += 1;
                }
            }

            res = (exist !== 0) ? ("X") : (" ");
        }
        return res;
    }

    const notRegister = (activityList) => {

        let newActivitiesList = [];

        for (let i = 0; i < activityList.length; i++) {

            let participants = activityList[i].participants;


            if (participants.length === 0 && activityList[i].promoter.pseudo !== props.user.pseudo) {
                newActivitiesList.push(activityList[i]);
            } else if (participants.length >= 1 && activityList[i].promoter.pseudo !== props.user.pseudo) {

                let participantsIRI = [];
                for (let j = 0; j < participants.length; j++) {
                    participantsIRI.push(participants[j].pseudo);
                }

                if (participantsIRI.indexOf(props.user.pseudo) === -1) {

                    newActivitiesList.push(activityList[i]);

                }
            }
        }
        return newActivitiesList;
    }

    const handleInscription = () => {
        setInscription(inscription + 1);
    }

    const handleWithdraw = () => {
        setWithdraw(withdraw + 1);
    }
    const handlePublish = () => {
        setPublish(publish + 1);
    }
    const actions = (activity) => {

        const userConnected = props.user;
        const registered = isRegistered(activity);
        let registeredBool = (registered === "X");

        if (activity.promoter.pseudo === userConnected.pseudo) {

            if (activity.state.id === 2 || activity.state.id === 3) {
                return <span><Link
                    to={{pathname: detailLink, state: {activity: activity}}}>Afficher</Link> - <Link
                    to={{pathname: cancelLink, state: {activity: activity}}}>Annuler</Link></span>;
            } else if (activity.state.id === 1) {
                return <span><Link
                    to={{pathname: updateLink, state: {activity: activity}}}>Modifier</Link> - <Publish
                    activity={activity} publish={handlePublish}/></span>;
            } else {
                return <span><Link
                    to={{pathname: detailLink, state: {activity: activity}}}>Afficher</Link></span>;
            }

        } else if (activity.promoter.pseudo !== userConnected.pseudo && registeredBool) {

            if (activity.state.id === 2 || activity.state.id === 3) {
                return <span><Link
                    to={{pathname: detailLink, state: {activity: activity}}}>Afficher</Link> - <Withdraw
                    activity={activity} user={props.user} withdraw={handleWithdraw}/></span>;
            } else if ((activity.state.id === 4 || activity.state.id === 5 || activity.state.id === 6)) {
                return <span><Link
                    to={{pathname: detailLink, state: {activity: activity}}}>Afficher</Link></span>;
            } else /*if (activity.state.id === 1)*/ {
                return <span>Pas d'actions</span>;
            }

        } else if (activity.promoter.pseudo !== userConnected.pseudo && !registeredBool) {

            if (activity.state.id === 2 && activity.participants.length < activity.registrationsMax) {
                return <span><Link
                    to={{pathname: detailLink, state: {activity: activity}}}>Afficher</Link> - <Register
                    activity={activity} user={props.user} register={handleInscription}/></span>;
            } else if (activity.state.id === 1) {
                return <span>Pas d'actions</span>;
            } else {
                return <span><Link
                    to={{pathname: detailLink, state: {activity: activity}}}>Afficher</Link></span>;
            }
        }
    }

    const cleanList = (activity) => {

        let newActivitiesList = [];

        for (let i = 0; i < activity.length; i++) {

            const date2 = activity[i].dateTimeStart;
            const date = new Date();
            const newDate = new Date(date.setMonth(date.getMonth() - 1)).toISOString();

            if (activity[i].promoter.pseudo === props.user.pseudo && newDate < date2) {
                newActivitiesList.push(activity[i]);
            } else if (activity[i].state.id !== 1 && newDate < date2) {
                newActivitiesList.push(activity[i]);
            }

        }

        return newActivitiesList;
    }

    const newList = cleanList(activitiesList);

    return (

        <Fragment>
            <h3 className="filters-title">Filtrer les sorties</h3>

            <form onSubmit={handleSubmit} id="trip-filters">

                <div className="col col1">
                    <div className="row">
                        <label>Campus : </label>
                        <select value={campus} onChange={handleCampus}>
                            {campusList.map(campus => <option key={campus.name}>{campus.name}</option>)}
                            <option key="key" value="">Tous les campus</option>
                        </select>
                    </div>
                    <div className="row">
                        <label>Le nom de la sortie contient : </label>
                        <input type="text" value={searchActivityName} onChange={handleSearchName}/>
                    </div>
                    <div className="row">
                        Entre <input type="date" value={startDate}
                                     onChange={handleStartDate}/> et <input type="date"
                                                                                 value={endDate}
                                                                                 onChange={handleEndDate}/>
                    </div>
                </div>

                <div className="col">
                    <div>
                        <input type="checkbox" id="promoter" onChange={handlePromoter}
                               value={promoter}/>
                        <label htmlFor="coding">Sorties dont je suis l'organisateur.trice</label>
                    </div>
                    <div>
                        <input type="checkbox" id="registered" onChange={handleRegistered}
                               value={registered}/>
                        <label htmlFor="music">Sorties auxquelles je suis inscrit.e</label>
                    </div>
                    <div>
                        <input type="checkbox" id="not-registered" onChange={handleNotRegistered}/>
                        <label htmlFor="music">Sorties auxquelles je ne suis pas inscrit.e</label>
                    </div>
                    <div>
                        <input type="checkbox" onChange={handlePastActivities}
                               value={pastActivities}/>
                        <label htmlFor="music">Sorties passées</label>
                    </div>
                </div>
                <button className="animate__animated animate__bounceInDown" type="submit"
                        onSubmit={handleSubmit}>Rechercher
                </button>
            </form>

            <div className="test" id="trip-list">

                <div>
                    <p id="error-message-activities"
                       className={error ? 'profile_message_error' : 'profile_message_success'}>{message}</p>
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>Nom de la sortie</th>
                        <th>Date de la sortie</th>
                        <th>Clôture</th>
                        <th>Inscrits/Place</th>
                        <th>Etat</th>
                        <th>Inscrit</th>
                        <th>Organisateur</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {newList.map(activity => <tr key={activity.name}>
                        <td key={activity.name}>{activity.name}</td>
                        <td key={activity.dateTimeStart}>{new Date(activity.dateTimeStart).toLocaleString()}</td>
                        <td key={activity.registrationDeadline}>{new Date(activity.registrationDeadline).toLocaleDateString()}</td>
                        <td key={activity.id}>{activity.participants.length}/{activity.registrationsMax}</td>
                        <td key={activity.state.label}>{activity.state.label}</td>
                        <td key={activity.registrationsMax}>{isRegistered(activity)}</td>
                        <td key={activity.promoter.pseudo}><Link
                            to={`/app/participants/${activity.promoter.id}`}>{activity.promoter.pseudo}</Link></td>
                        <td key={activity.duration}>{actions(activity)}</td>
                    </tr>)}
                    </tbody>
                </table>
            </div>
        </Fragment>

    );
}

export default ActivitiesFilters;
