import React, {useState, useContext} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    // console.log(history);
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await authAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous êtes maintenant connecté !");
            history.replace("/customers");
        } catch (error) {
            console.log(error.response);
            setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas !");
            toast.error("Une erreur est survenue");
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form action="" onSubmit={handleSubmit}>
                <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange}
                       error={error} placeholder="Adresse email de connexion" type="email"/>

                <Field label="Mot de passe" name="password" value={credentials.password} onChange={handleChange}
                       error={error} placeholder="Mot de passe" type="password"/>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
