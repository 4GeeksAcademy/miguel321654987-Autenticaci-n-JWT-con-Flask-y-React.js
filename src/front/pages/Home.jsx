import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const login = async (username, password) => {
     const resp = await fetch(`https://your_api.com/login`, { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }) 
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
     // También deberías almacenar el usuario en la store utilizando la función setItem
     localStorage.setItem("jwt-token", data.token);

     return data
}

	useEffect(() => {
		login()
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