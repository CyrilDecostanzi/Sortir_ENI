import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginApp from "./connexion/LoginApp";
import LoginForm from "./connexion/LoginForm";
import Profil from "./Profil/Profil";
import ViewParticipantProfil from "./Profil/ViewParticipantProfil";
import Logout from "./logout/Logout";
import ActivitiesView from "./activities_view/ActivitiesView";
import CreateActivity from "./Create_activity/CreateActivity";
import Cancel from "./Cancel/Cancel";
import Footer from "./Footer/Footer"
import Logo from "./Menu/Logo";
import Menu from "./Menu/Menu";
import UpdateActivity from "./Update_activity/UpdateActivity";
import ActivityDetail from "./Activity_detail/ActivityDetail";

const Container = () => {

        return (
            <BrowserRouter>
                {(localStorage.length === 0) ? <Logo/> : ""}

                {(localStorage.length > 0) ? <Menu/> : ""}

                <Route exact path="/app">
                    {(localStorage.length > 0) ? <ActivitiesView/> : <LoginApp/>}
                </Route>

                <Footer/>

                <Switch>
                    <Route path="/app/annuler-une-sortie" component={Cancel}/>
                    <Route path="/app/accueil" component={ActivitiesView}/>
                    <Route path="/app/loginForm" component={LoginForm}/>
                    <Route path="/app/ajouter-une-sortie" component={CreateActivity}/>
                    <Route path="/app/modifier-une-sortie" component={UpdateActivity}/>
                    <Route path="/app/detail-sortie" component={ActivityDetail}/>
                    <Route path="/app/profil" component={Profil}/>
                    <Route path="/app/logout" component={Logout}/>
                    <Route exact path="/app/login" component={LoginApp}/>
                    <Route path="/app/participants/:id" component={ViewParticipantProfil}/>
                </Switch>
            </BrowserRouter>
        )
}

export default Container;