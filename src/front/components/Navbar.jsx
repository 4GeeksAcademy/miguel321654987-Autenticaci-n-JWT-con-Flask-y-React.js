import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Sincronizamos la autenticación con el store y el storage
    const isAuthenticated = !!store.token || !!localStorage.getItem("jwt-token");

    const handleLogout = () => {
        localStorage.removeItem("jwt-token");
        dispatch({ type: "LOGOUT" }); 
        navigate("/");
    };

    // FUNCIÓN DE ACCESO PROTEGIDO
    const handlePrivateZone = () => {
        if (isAuthenticated) {
            navigate("/demo");
        } else {
            alert("¡Acceso denegado! Por favor, inicia sesión primero.");
            navigate("/"); // O a la ruta de login si la tienes aparte
        }
    };

    return (
        <nav className="navbar navbar-light bg-light mb-3">
            <div className="container">
                <div className="ml-auto d-flex gap-2">
                    {/* BOTÓN PROTEGIDO */}
                    <button className="btn btn-outline-info" onClick={handlePrivateZone}>
                        Zona Privada
                    </button>

                    {isAuthenticated ? (
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link to="/" className="btn btn-primary">Ir a Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
