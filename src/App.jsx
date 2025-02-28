import './App.css';
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import { useEffect, useState } from 'react';
import { SplashScreen } from './Pages/SplashScreen/SplashScreen';



function App() {

   const [loading,setLoading] = useState(true);

   useEffect(() =>{

    const timer= setTimeout(() => setLoading(false),1000);
    return () => clearTimeout(timer)

  },[])


  return  loading? <SplashScreen /> : <RouterProvider router={routes} />;
}

export default App;