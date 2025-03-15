import './App.css';
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos base de los componentes






function App() {


  return  <RouterProvider router={routes} />;
}

export default App;