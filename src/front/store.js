export const initialStore = () => {
  return {
    token: localStorage.getItem("jwt-token") || null, // Cargamos el token si ya existe
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'LOGIN':
      return {
        ...store,
        token: action.payload // Guardamos el token en el estado global
      };

    case 'LOGOUT':
      return {
        ...store,
        token: null // Limpiamos el token del estado global
      };

    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    default:
      return store; // Cambiado de throw Error a return store para evitar que la app explote con acciones desconocidas
  }    
}
