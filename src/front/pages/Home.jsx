import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const login = async (email, password) => {
     const resp = await fetch(`https://your_api.com/login`, { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }) 
     })

     if(!resp.ok) throw Error("There was a problem in the login request")

     if(resp.status === 401){
          throw("Invalid credentials")
     }
     else if(resp.status === 400){
          throw ("Invalid email or password format")
     }
     const data = await resp.json()
     // Guarda el token en la localStorage
     localStorage.setItem("jwt-token", data.token);

     return data
}

const getProtectedData = async () => {
    // 1. Recuperamos el token almacenado
    const token = localStorage.getItem("jwt-token");

    // 2. Realizamos la petición con el Header de Authorization
    const resp = await fetch(`https://your_://api.com`, { 
         method: "GET",
         headers: { 
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}` // Importante: incluir 'Bearer '
         }
    })
    // 3. Manejo de errores siguiendo tu lógica
    if(!resp.ok) throw Error("There was a problem with the protected request")
    if(resp.status === 401){
         throw ("Invalid or expired token")
    }
    else if(resp.status === 404){
         throw ("User not found")
    }
    // 4. Retornamos los datos (id y email)
    const data = await resp.json()
    return data
}


	useEffect(() => {
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
		</div>
	);
}; 