import React, {Component} from "react";
import './cancel.css';
import axios from 'axios';




export default class Cancel extends Component {

    state = {
        error : false,
        message: '',
        activity: this.props.location.state.activity,
        cancelState : '/api/states/6'
    }


    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    cancel() {
        this.props.history.push('/app/accueil');
    }

    componentDidMount() {


    }

    handleSubmit(e) {
        e.preventDefault();
        if(e.target.elements.namedItem('cancel_motif').value === ""){
            this.setState({error : true})
            this.setState({message : 'Veuillez saisir un motif d\'annulation'})
        } else {
            axios.put(`https://127.0.0.1:8000${this.state.activity['@id']}`, {
                "state": this.state.cancelState,
                "description" : this.state.activity.description + ' ' + 'Motif d\'annulation : ' + e.target.elements.namedItem('cancel_motif').value
            }).catch(error => {
                this.setState({error : true})
                this.setState({message : error.response.data.violations[0].message})
            }).then(() => {
                this.setState({error : false})
                this.setState({message : `La sortie a bien été annulée vous allez être redirigé vers l'accueil`})
                setTimeout(this.cancel, 2000)
            })
        }

    }

    render() {
        const activity = this.state.activity;
        return (
            <div className="cancel_container">
               <h2 className="cancel_title animate__animated animate__backInDown">Annuler une sortie</h2>
               <p className={ this.state.error ? 'profile_message_error' : 'profile_message_success' }>{this.state.message}</p>
               <form onSubmit={this.handleSubmit} className="cancel_form_container">
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
                            <button type="button" onClick={this.cancel}>Annuler</button>
                        </div>
                    </div>

               </form>
            </div>


        )

    }


}
