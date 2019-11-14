import React, {useState, useContext} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ history }) => {

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
            history.replace("/customers");
        } catch (error) {
            console.log(error.response);
            setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas !");
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form action="" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="email"
                        placeholder="Adresse email de connexion"
                        id="username"
                        name="username"
                        className={"form-control" + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">
                        {error}
                    </p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        className="form-control"
                        placeholder="Mot de passe"
                        id="password"
                        name="password"/>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
