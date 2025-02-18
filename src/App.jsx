import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
//pages:
import { Introduction1 } from "./Pages/Introduccion1/introduction1";
import { Introduction2 } from "./Pages/Introduccion2/introduction2";
import { Welcome } from "./Pages/Welcome/welcome";
import { Login } from "./Pages/Login/Login";
import { Register } from "./Pages/Register/Register";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


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
    element: 
    <GoogleOAuthProvider clientId={clientId}>
      <Login/>
    </GoogleOAuthProvider>,
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
