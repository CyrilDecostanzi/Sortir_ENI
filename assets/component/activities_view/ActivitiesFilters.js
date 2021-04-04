import React, {Component, Fragment} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import Register from "./Registered";
import Withdraw from "./Withdraw";
import Publish from "../Publish/Publish";

class ActivitiesFilters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campusList : [],
            campus : '',
            searchActivityName : '',
            startDate : '',
            endDate : '',
            promoter : '',
            registered : '',
            notRegistered : '',
            pastActivities : '',
            activitiesList : [],
            date : new Date().toISOString(),
            activity : '',
            inscription : 0,
            message: '',
            error: false,
            withdraw : 0,
            publish: 0,
            notRegisteredFilter : '',
            cancelLink : '/app/annuler-une-sortie',
            updateLink : '/app/modifier-une-sortie',
            detailLink : '/app/detail-sortie'
        }
    }

    componentDidMount() {


        axios.get(`https://127.0.0.1:8000/api/campuses?page=1`)
            .catch(() => {
                this.setState({error : true})
                this.setState({message : "Erreur lors du chargement des campus"})
            })
            .then(res => {
                const campusList = res.data['hydra:member'];
                this.setState({
                    campusList : campusList
                });
            })

        axios.get(`https://127.0.0.1:8000/api/activities?page=1`)
            .catch(() => {
                this.setState({error : true})
                this.setState({message : "Erreur lors du chargement de la liste d'activités"})
            })
            .then(res => {
                const activitiesList = res.data['hydra:member'];
                this.setState({
                    activitiesList : activitiesList
                });
            })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {


        if(this.state.inscription || this.state.withdraw || this.state.publish) {

            if(prevState.inscription !== this.state.inscription || prevState.withdraw !== this.state.withdraw || prevState.publish !== this.state.publish) {

                axios.get(`https://127.0.0.1:8000/api/activities?page=1`)
                    .catch(() => {
                        this.setState({error : true})
                        this.setState({message : "Erreur lors de l'actualisation de la liste d'activités"})
                    })
                    .then(res => {
                        const activitiesList = res.data['hydra:member'];
                        this.setState({
                            activitiesList : activitiesList
                        });
                    })

            }

        }

    }

    handleCampus = e => {
        this.setState({
            campus : e.target.value,
        })
    }

    handleSearchName = e => {
        this.setState({
            searchActivityName : e.target.value,
        })
    }

    handleStartDate = e => {
        this.setState({
            startDate : e.target.value,
        })
    }

    handleEndDate = e => {
        this.setState({
            endDate : e.target.value,
        })
    }

    handlePromoter = () => {

        this.state.promoter ? (this.setState({promoter : false})) : (this.setState({promoter : true}));
        if (document.getElementById("promoter").checked) {
            document.getElementById("registered").disabled = true;
            document.getElementById("not-registered").disabled = true;
        } else {
            document.getElementById("registered").disabled = false;
            document.getElementById("not-registered").disabled = false;
        }
    }

    handlePastActivities = () => {

        this.state.pastActivities ? (this.setState({pastActivities : false})) : (this.setState({pastActivities : true}));

    }

    handleRegistered = () => {

        this.state.registered ? (this.setState({registered: false})) : (this.setState({registered: true}));

        if (document.getElementById("registered").checked) {
            document.getElementById("promoter").disabled = true;
            document.getElementById("not-registered").disabled = true;
        } else {
            document.getElementById("promoter").disabled = false;
            document.getElementById("not-registered").disabled = false;
        }
    }

    handleNotRegistered = () => {

        this.state.notRegistered ? (this.setState({notRegistered: false})) : (this.setState({notRegistered: true}));

        if (document.getElementById("not-registered").checked) {
            document.getElementById("registered").disabled = true;
            document.getElementById("promoter").disabled = true;
        } else {
            document.getElementById("registered").disabled = false;
            document.getElementById("promoter").disabled = false;
        }

    }

    handleSubmit = e => {
        e.preventDefault();
        const name = this.state.searchActivityName;
        const campus = this.state.campus;
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        const promoter = this.state.promoter;
        const pastActivities = this.state.pastActivities;
        const registered = this.state.registered;


        this.actualisation(campus, name, startDate, endDate, promoter, pastActivities, registered);


    }

    actualisation = (campus, name, startDate, endDate, promoter, pastActivities, registered) => {

        let date = this.state.date;
        let nameFilter = name ? (`&name=${name}`) : ("") ;
        let campusFilter = campus ? (`&campus.name=${campus}`) : ("") ;
        let endDateFilter = endDate ? (`&dateTimeStart%5Bbefore%5D=${endDate}`) : ("");
        let startDateFilter = startDate ? (`&dateTimeStart%5Bafter%5D=${startDate}`) : ("") ;
        let promoterFilter = promoter ? (`&promoter.pseudo=${this.props.user.pseudo}`) : ("");
        let pastActivitiesFilter = pastActivities ? (`&dateTimeStart%5Bstrictly_before%5D=${date}`) : ("") ;
        let registeredFilter = registered ? (`&participants.pseudo=${this.props.user.pseudo}`) : ("") ;

        axios.get(`https://127.0.0.1:8000/api/activities?page=1${nameFilter}${endDateFilter}${startDateFilter}${startDate}${campusFilter}${promoterFilter}${pastActivitiesFilter}${registeredFilter}`)
            .catch(() => {
                this.setState({error : true})
                this.setState({message : "Echec lors du filtre des activités"})
            })
            .then(res => {
                const activitiesList = res.data['hydra:member'];
                this.setState({
                    activitiesList : activitiesList
                })

                if(this.state.notRegistered) {

                    let newList3 = this.notRegistered(this.state.activitiesList);
                    this.setState({
                        activitiesList : newList3
                    })
                }

            });

    }

    isRegistered = (activity) => {

        let user = this.props.user;
        const participants = activity.participants;

        let res;

        if(participants.length === 0) {
            return " ";

        } else {
            let exist = 0;

            for(let i=0; i < participants.length; i++) {
                if(participants[i]["@id"] === user["@id"] ) {
                    exist += 1;
                }
            }

            res = (exist !== 0) ? ("X") : (" ");
        }
        return res;
    }

    notRegistered = (activityList) => {

        let newActivitiesList = [];

        for (let i = 0; i < activityList.length; i++) {

            let participants = activityList[i].participants;


            if(participants.length === 0 && activityList[i].promoter.pseudo !== this.props.user.pseudo) {
                newActivitiesList.push(activityList[i]);
            }
            else if (participants.length >= 1 && activityList[i].promoter.pseudo !== this.props.user.pseudo) {

                let participantsIRI = [];
                for(let j=0; j < participants.length; j++) {
                    participantsIRI.push(participants[j].pseudo);
                }

                if(participantsIRI.indexOf(this.props.user.pseudo) === -1) {

                    newActivitiesList.push(activityList[i]);

                }
            }
        }

        return newActivitiesList;

    }

    handleInscription = () => {

        this.setState(
            (prevState) => ({ inscription : prevState.inscription + 1 })
        )
    }

    handleWithdraw = () => {

        this.setState(
            (prevState) => ({ withdraw : prevState.withdraw + 1 })
        )

    }
    handlePublish = () => {

        this.setState(
            (prevState) => ({ publish : prevState.publish + 1 })
        )

    }
    actions = (activity) => {

        const userConnected = this.props.user;
        const registered = this.isRegistered(activity);
        let registeredBool = (registered === "X");

        if(activity.promoter.pseudo === userConnected.pseudo) {

            if(activity.state.id === 2 || activity.state.id === 3) {
                return <span><Link to={{ pathname: this.state.detailLink, state: {activity: activity}}}>Afficher</Link> - <Link to={{ pathname: this.state.cancelLink, state: {activity: activity} }}>Annuler</Link></span>;
            } else if (activity.state.id === 1) {
                return <span><Link to={{ pathname: this.state.updateLink, state: {activity: activity} }}>Modifier</Link> - <Publish activity={activity} publish={this.handlePublish}/></span>;
            } else {
                return <span><Link to={{ pathname: this.state.detailLink, state: {activity: activity}}}>Afficher</Link></span>;
            }

        } else if(activity.promoter.pseudo !== userConnected.pseudo && registeredBool) {

            if(activity.state.id === 2 || activity.state.id === 3) {
                return <span><Link to={{ pathname: this.state.detailLink, state: {activity: activity}}}>Afficher</Link> - <Withdraw activity={activity} user={this.props.user} withdraw={this.handleWithdraw}/></span>;
            } else if((activity.state.id === 4 || activity.state.id === 5 || activity.state.id === 6)) {
                return <span><Link to={{ pathname: this.state.detailLink, state: {activity: activity}}}>Afficher</Link></span>;
            } else /*if (activity.state.id === 1)*/ {
                return <span>Pas d'actions</span>;
            }

        } else if(activity.promoter.pseudo !== userConnected.pseudo && !registeredBool) {

            if(activity.state.id === 2 && activity.participants.length < activity.registrationsMax) {
                return <span><Link to={{ pathname: this.state.detailLink, state: {activity: activity}}}>Afficher</Link> - <Register activity={activity} user={this.props.user} register={this.handleInscription}/></span>;
            } else if(activity.state.id === 1) {
                return <span>Pas d'actions</span>;
            } else {
                return <span><Link to={{ pathname: this.state.detailLink, state: {activity: activity}}}>Afficher</Link></span>;
            }
        }
    }

    cleanList = (activity) => {

        let newActivitiesList = [];

        for(let i=0; i < activity.length; i++) {

            const date2 = activity[i].dateTimeStart;
            const date = new Date();
            const newDate = new Date(date.setMonth(date.getMonth()-1)).toISOString();

            if(activity[i].promoter.pseudo === this.props.user.pseudo && newDate < date2) {
                newActivitiesList.push(activity[i]);
            }
            else if (activity[i].state.id !== 1 && newDate < date2) {
                newActivitiesList.push(activity[i]);
            }

        }

        return newActivitiesList;
    }


    render() {


        const activity = this.state.activitiesList;
        const newList = this.cleanList(activity);

        return (

            <Fragment>
                <h3 className="filters-title">Filtrer les sorties</h3>

                <form onSubmit={this.handleSubmit} id="trip-filters">

                    <div className="col col1">
                        <div className="row">
                            <label>Campus : </label>
                            <select value={this.state.campus} onChange={this.handleCampus}>
                                {this.state.campusList.map(campus => <option key={campus.name}>{campus.name}</option>)}
                                <option key="key" value="">Tous les campus</option>
                            </select>
                        </div>
                        <div className="row">
                            <label>Le nom de la sortie contient : </label>
                            <input type="text" value={this.state.searchActivityName} onChange={this.handleSearchName}/>
                        </div>
                        <div className="row">
                            Entre <input type="date" value={this.state.startDate} onChange={this.handleStartDate}/> et <input type="date" value={this.state.endDate} onChange={this.handleEndDate}/>
                        </div>
                    </div>

                    <div className="col">
                        <div>
                            <input type="checkbox" id="promoter" onChange={this.handlePromoter} value={this.state.promoter}/>
                            <label htmlFor="coding">Sorties dont je suis l'organisateur.trice</label>
                        </div>
                        <div>
                            <input type="checkbox" id="registered" onChange={this.handleRegistered} value={this.state.registered}/>
                            <label htmlFor="music">Sorties auxquelles je suis inscrit.e</label>
                        </div>
                        <div>
                            <input type="checkbox" id="not-registered" onChange={this.handleNotRegistered}/>
                            <label htmlFor="music">Sorties auxquelles je ne suis pas inscrit.e</label>
                        </div>
                        <div>
                            <input type="checkbox" onClick={this.checked} onChange={this.handlePastActivities} value={this.state.pastActivities}/>
                            <label htmlFor="music">Sorties passées</label>
                        </div>
                    </div>
                    <button className="animate__animated animate__bounceInDown" type="submit" value={this.state} onSubmit={this.handleSubmit}>Rechercher</button>
                </form>

                <div className="test" id="trip-list">

                    <div>
                        <p id="error-message-activities" className={ this.state.error ? 'profile_message_error' : 'profile_message_success' }>{this.state.message}</p>
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
                            <td key={activity.registrationsMax}>{this.isRegistered(activity)}</td>
                            <td key={activity.promoter.pseudo}><Link to={`/app/participants/${activity.promoter.id}`}>{activity.promoter.pseudo}</Link></td>
                            <td key={activity.duration}>{this.actions(activity)}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </Fragment>

        );
    }
}

export default ActivitiesFilters;
