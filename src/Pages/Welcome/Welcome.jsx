import { useState, useEffect } from "react";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoPetConnect.png";
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
    <div className="bg-white flex items-center justify-center min-h-screen sm:p-4 md:bg-gray-100">
      <div className="flex flex-col p-6 w-screen rounded-xl max-w-md md:shadow-lg items-center bg-white">
        <img src={logo} alt="Logo" className="w-30 my-24" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
        <h2 className="text-base text-gray-500 mb-14">
          Ingresa a tu cuenta para continuar
        </h2>
        <GoogleSignUp
          content={"Inicia sesión con Google"}
          setUser={setUser}
          setAccesToken={setAccessToken}
          setHasPetsState={setHasPetsState}
          setErrorState={setErrorState}
          setIsnewUserState={setIsNewUserState}
          className="w-full"
        />
        <ButtonPrimary path="/register" text="Crear una Cuenta" />
        <ButtonSecondary path="/login" text="Iniciar Sesión" />
        <p className="text-xs text-gray-400 mt-24">
          Políticas de Privacidad • Términos de Servicio
        </p>
      </div>
    </div>
  );
};
