import React, {Component} from 'react';
import axios from "axios";

class Publish extends Component {

    state = {
        message: '',
        error: false
    }

    publish = () => {

        const iriStatePublished = '/api/states/2'

        axios.put(`https://127.0.0.1:8000${this.props.activity["@id"]}`, {
            "state": iriStatePublished
        }).catch(() => {
            this.setState({error : true})
            this.setState({message : "Une erreur s'est produite a la publication"})
        }).then()

        this.props.publish();

    }

    render() {
        return (
            <a onClick={this.publish}>Publier</a>
        );
    }
}

export default Publish;