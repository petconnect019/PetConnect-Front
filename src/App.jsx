// App.jsx
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//pages:
import { Introduction1 } from "./Pages/Introduccion1/introduction1";
import { Introduction2 } from "./Pages/Introduccion2/introduction2";
import { Login } from "./Pages/Login/Login";
import { Register } from "./Pages/Register/Register";
import { Welcome } from "./Pages/Welcome/Welcome";
import { Home } from "./Pages/Home/Home";


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
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>,
  },
  {
    path: '/home',
    element: <Home/>,
  },
]);

function App() {
  return <RouterProvider router={routes}/>;
}

export default App;