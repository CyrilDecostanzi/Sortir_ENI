import axios from "axios";
import React from "react";

const addLocalStorage = function () {
    axios.get(`/getuser`, {
        withCredentials: true
    }).then(res => {
        const loggedUser = res.data;
        localStorage.setItem('id', loggedUser.id);
        localStorage.setItem('pseudo', loggedUser.pseudo);
        localStorage.setItem('isAdmin', loggedUser.isAdmin);
    });
}
export default addLocalStorage;