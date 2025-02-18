import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//pages:
import { Introduction1 } from "./Pages/Introduccion1/introduction1";
import { Introduction2 } from "./Pages/Introduccion2/introduction2";
import { Welcome } from "./Pages/Welcome/welcome";
import { Login } from "./Pages/Login/login";
import { Register } from "./Pages/Register/register";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Introduction1></Introduction1>,
  },
  {
    path: '/introduction2',
    element: <Introduction2></Introduction2>,
  },
  {
    path: '/welcome',
    element: <Welcome></Welcome>,
  },
  {
    path: '/login',
    element: <Login></Login>,
  },
  {
    path: '/register',
    element: <Register></Register>,
  },
]);
function App() {

  return <RouterProvider router={routes}></RouterProvider>;
}

export default App;
