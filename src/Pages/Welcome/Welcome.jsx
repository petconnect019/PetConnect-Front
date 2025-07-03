import { useState, useEffect } from "react";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/LogoPetConnect.png";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { ButtonSecondary } from "../../Components/Buttons/ButtonSecondary";
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";

export const Welcome = () => {
  const navigate = useNavigate();

  //instancias de contextos
  const auth = useAuth();
  const pets = useHasPetsUser();

  // Verificamos si el contexto de autenticación está disponible antes de usarlo
  if (!auth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }
  // desestrucuring de los contextos y hooks
  const { login } = auth ?? {};
  const { changeHasPetsUser } = pets ?? {};

  // Estados locales que cambian con el Componente de Google
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [hasPetsState, setHasPetsState] = useState(false);
  const [isNewUserState, setIsNewUserState] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // Efectos para las acciones de los estados
  useEffect(() => {
    if (user) {
      login(accessToken, user);
      if (hasPetsState) {
        changeHasPetsUser(true);
      }
      if (isNewUserState) {
        navigate("/step-user");
      } else {
        navigate("/home");
      }
    }
  }, [user]);

  // Manejo de error
  useEffect(() => {
    if (errorState) {
      toast.error(errorState);
    }
  }, [errorState]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4">
      <header className="w-full text-center pt-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido a PetConnect</h1>
        <p className="text-gray-600 mt-2">Tu compañero para el cuidado de mascotas</p>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="w-full max-w-md">
          <ButtonPrimary text="Iniciar sesión" onClick={() => navigate('/login')} />
          <ButtonSecondary text="Regístrate" onClick={() => navigate('/register')} className="mt-4" />
        </div>
      </main>
      
      <footer className="w-full text-center pb-8">
        <GoogleSignUp />
      </footer>
    </div>
  );
};