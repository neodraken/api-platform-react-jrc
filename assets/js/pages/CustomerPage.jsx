import React, {useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/customersAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({history, match}) => {
    const {id = "new"} = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });


    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    const [loading, setLoading] = useState(false);

    //récuperation du custome ren fonction de l'identifiant
    const fetchCustomer = async id => {
        try {
            const {lastName, firstName, email, company} = await CustomersAPI.find(id);
            setCustomer({lastName, firstName, email, company});
            setLoading(false);
        } catch (error) {
            console.log(error.response);
            //TODO: notification flash d'une erreur
            toast.error("Le client n'a pas pu être chargé");

            //redirection vers la liste des customers
            history.replace("/customers");
        }
    }

    //chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);


    //Gestion des changements des inputs dans les formulaires
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                await CustomersAPI.update(id, customer);

                //TODO: Flash notification de succès
                toast.success("Le client a bien été modifié !");
            } else {
                await CustomersAPI.create(customer);

                //TODO: flash notification de succès
                toast.success("Le client a bien été créé !");

                history.replace("/customers");
            }

        } catch ({response}) {
            console.log(response);
            const {violations} = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                //TODO: flash notification d'erreurs
                toast.error("Des erreurs dans votre formulaire !");
            }
        }
    };

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}
            {loading && <FormContentLoader/>}
            {!loading && (
                <form onSubmit={handleSubmit}>
                    <Field
                        name="lastName"
                        label="Nom de famille"
                        placeholder="Nom de famille du client"
                        value={customer.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                    />
                    <Field
                        name="firstName"
                        label="Prénom"
                        placeholder="Prénom du client"
                        value={customer.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                    />
                    <Field
                        name="email"
                        label="Email"
                        placeholder="Adresse email du client"
                        type="email"
                        value={customer.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <Field
                        name="company"
                        label="Entreprise"
                        placeholder="Entreprise du client"
                        value={customer.company}
                        onChange={handleChange}
                        error={errors.company}
                    />

                    <div className="form-group">
                        <button type="submit" className="btn btn-success">Enregistrer</button>
                        <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                    </div>
                </form>)}

        </>
    );
};

export default CustomerPage;
