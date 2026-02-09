import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar

export const Home = () => {

     const { store, dispatch } = useGlobalReducer()
     const navigate = useNavigate(); // <-- AÑADE ESTA LÍNEA

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt-token"));


     const signup = async () => {
          const resp = await fetch(`https://expert-space-pancake-g4wjjjwpwwxrfw495-3001.app.github.dev/api/signup`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email: email, password: password })
          });
          if (resp.status === 409) {
               alert("El usuario ya existe, intenta hacer Login.");
               return;
          }
          if (resp.ok) {
               alert("¡Usuario creado con éxito!");
          }
     };


const login = async () => {

     if (email.trim() === "" || password.trim() === "") {
        alert("⚠️ Por favor, introduce tu correo y contraseña para continuar.");
        return; // Detenemos la ejecución aquí mismo
    }
    try {
        const resp = await fetch(`https://expert-space-pancake-g4wjjjwpwwxrfw495-3001.app.github.dev/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        });
        // CASO 401: Credenciales incorrectas
        if (resp.status === 401) {
            alert("❌ Error 401: El email o la contraseña son incorrectos.");
            return; // Cortamos la ejecución aquí
        }
        // OTROS ERRORES (Servidor caído, ruta mal escrita, etc.)
        if (!resp.ok) {
            const errorData = await resp.json();
            alert(`⚠️ Error: ${errorData.msg || "No se pudo iniciar sesión"}`);
            return;
        }
        // LOGIN EXITOSO (Status 200)
        const data = await resp.json();
        // 1. Guardar token en disco duro
        localStorage.setItem("jwt-token", data.token);
        // 2. Avisar al Store Global (para que el Navbar se entere)
        dispatch({ type: "LOGIN", payload: data.token }); 
        // 3. Actualizar estado local de la Home
        setIsLoggedIn(true);
        alert("✅ ¡Sesión iniciada con éxito!");
        navigate("/demo"); // Navegamos a la zona privada

    } catch (error) {
        console.error("Error en la petición:", error);
        alert("🚀 Error de conexión: Comprueba tu internet o vuelve a intentarlo más tarde.");
    }
};


     const getProtectedData = async () => {
          // 1. Recuperamos el token almacenado
          const token = localStorage.getItem("jwt-token");
          // NUEVO: Validación preventiva (Si no hay token, no perdemos tiempo con el fetch)
          if (!token) {
               setIsLoggedIn(false); // Actualizamos el estado para mostrar el Login
               throw Error("No token found");
          }
          // 2. Realizamos la petición con el Header de Authorization
          const resp = await fetch(`https://expert-space-pancake-g4wjjjwpwwxrfw495-3001.app.github.dev/api/demo`, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
               }
          })
          // 3. Manejo de errores corregido
          if (resp.status === 401) {
               localStorage.removeItem("jwt-token"); // Limpiamos el token expirado
               setIsLoggedIn(false); // Mostramos el Login
               throw ("Invalid or expired token")
          }
          if (!resp.ok) throw Error("There was a problem with the protected request")
          // 4. Retornamos los datos (id y email)
          const data = await resp.json()
          return data
     }


     useEffect(() => {
          // Si el usuario tiene un token, validamos si sigue siendo bueno
          if (localStorage.getItem("jwt-token")) {
               getProtectedData()
                    .catch(() => navigate("/")); // Si falla, nos aseguramos de estar en el Login
          }
     }, []);


     return (
          <div className="container text-center mt-5">
               <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-4">
                         <form>
                              <div className="mb-3 text-start">
                                   <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                   <input type="email" onChange={(e) => { setEmail(e.target.value) }}
                                        className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                   <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                              </div>
                              <div className="mb-3 text-start">
                                   <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                   <input type="password" onChange={(e) => { setPassword(e.target.value) }}
                                        className="form-control" id="exampleInputPassword1" />
                              </div>
                              <div className="mb-3 form-check d-flex justify-content-center align-items-center">
                                   <input className="form-check-input" type="checkbox" id="exampleCheck1"
                                        style={{ appearance: "checkbox", WebkitAppearance: "checkbox", marginRight: "10px", cursor: "pointer", position: "static" }}
                                   />
                                   <label className="form-check-label" htmlFor="exampleCheck1" style={{ cursor: "pointer" }}>
                                        Check me out
                                   </label>
                              </div>

                              {/* CONTENEDOR DE BOTONES */}
                              <div className="d-flex gap-2">
                                   {isLoggedIn ? (
                                        // Si isLoggedIn es true, solo mostramos el botón de Cerrar Sesión
                                        <button type="button"
                                             onClick={() => {
                                                  localStorage.removeItem("jwt-token");
                                                  setIsLoggedIn(false); // <--- Cambia el botón al instante
                                                  dispatch({ type: "LOGOUT" });
                                             }}
                                             className="btn btn-danger flex-grow-1"
                                        >
                                             Cerrar Sesión
                                        </button>
                                   ) : (
                                        // Si isLoggedIn es false, mostramos Login y Sign Up
                                        <>
                                             <button type="button" onClick={login} className="btn btn-success flex-grow-1">Login </button>
                                             <button type="button" onClick={signup} className="btn btn-outline-primary flex-grow-1">SignUp </button>
                                        </>
                                   )}
                              </div>
                         </form>
                    </div>
               </div>
          </div>

     );
}; 