// App.jsx
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//pages:
import { Introduction1 } from "./Pages/Introduccion1/introduction1";
import { Introduction2 } from "./Pages/Introduccion2/introduction2";
import { Login } from "./Pages/Login/login";
import { Register } from "./Pages/Register/Register";
import {Welcome} from "./Pages/Welcome/Welcome"; // Cambiado a importación por defecto

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Introduction1/>,
  },
  {
    path: '/introduction2',
    element: <Introduction2/>,
  },
  {
    path: '/welcome',
    element: <Welcome/>, // Actualizado para usar el componente importado
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/register',
    element: <Register/>,
  },
]);

function App() {
  return <RouterProvider router={routes}/>;
}

export default App;