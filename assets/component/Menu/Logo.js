import React from 'react';
import {Link} from "react-router-dom";
import logo from "../../images/logo_sortir.png";

function Logo() {
    return <Link to="/app" className="brand"><img height="100" src={logo} alt="logo"/></Link>;
}

export default Logo;