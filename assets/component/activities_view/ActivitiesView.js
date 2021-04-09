import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import ActivitiesFilters from "./ActivitiesFilters";
import '/assets/styles/activities_view.css'
import axios from "axios";



const ActivitiesView = () => {

    const [user, setUser] = useState('');



    useEffect(() => {
        axios.get(`https://127.0.0.1:8000/getuser` )
            .then(res => {
                const resultGet = res.data;
                axios.get(`https://127.0.0.1:8000/api/participants/${resultGet.id}`)
                    .then(res => {
                        const result = res.data;
                        setUser(result);
                    })
            })
    }, [])


        let date = new Date().toLocaleDateString();

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



export default ActivitiesView;