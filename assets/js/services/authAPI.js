import axios from "axios";
import CustomersAPI from "./customersAPI";
import jwtdecode from "jwt-decode";
import {LOGIN_API} from "../config";

/**
 * Deconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requete HTTP d'authentification et stockage du token dans le storage et sur axios
 * @param {object} credentials
 * @returns {Promise<AxiosResponse<any> | never | never>}
 */
function authenticate(credentials) {
    return axios.post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            //je stocke le token dans mon local storage
            window.localStorage.setItem("authToken", token);

            //on previent axios qu'on a maintenant un header par defaut sur toutes nos futures requetes HTTP
            setAxiosToken(token);
        });
}

/**
 * Positionne le token JWT sur axios
 * @param {string} token Le Token JWT
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
    //1. voir si on a un token ?
    const token = window.localStorage.getItem("authToken");

    //2. si le token est encore valide
    if (token) {
        const {exp: expiration} = jwtdecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            //donner le token à axios
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est identifié ou pas
 * @returns {boolean}
 */
function isAuthenticated() {
    //1. voir si on a un token ?
    const token = window.localStorage.getItem("authToken");

    //2. si le token est encore valide
    if (token) {
        const {exp: expiration} = jwtdecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};