import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ActivitiesFilters from "./ActivitiesFilters";
import '/assets/styles/activities_view.css'
import axios from "axios";



class ActivitiesView extends Component {

    state = {
        user : '',
        name:'',


    }

    componentDidMount() {
        axios.get(`https://127.0.0.1:8000/getuser` )
            .then(res => {
                const user = res.data;
                this.setState({
                    user : user
                })
            })
            .then(() => {
                axios.get(`https://127.0.0.1:8000/api/participants/${this.state.user.id}`)
                    .then(res => {
                        const user = res.data;
                        this.setState({
                            user : user
                        })
                    })
            })
    }


    render() {

        let date = new Date().toLocaleDateString();
        const user = this.state.user;

        return (
            <div id="trip-view">
                <div id="trip-view-info">
                    <label>Date : </label><strong>{date}</strong><br/>
                    <label>Participant : </label><strong>{user.pseudo}</strong><br/>
                </div>

                <ActivitiesFilters user={user} date={date}/>

                <Link to="/app/ajouter-une-sortie"><button>Créer une sortie</button></Link>
            </div>
        );
    }
}



export default ActivitiesView;