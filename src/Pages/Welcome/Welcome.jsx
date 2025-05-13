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
    <div className="bg-gray-50">
      <div className="flex items-center justify-center h-auto 4xl:m-h-screen">
        <div className="flex flex-col p-2 pt-4 w-full 4xl:max-w-md">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52 2xl:w-56 3xl:w-60 4xl:w-64 my-4 xs:my-6 sm:my-8 md:my-10" 
            />
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl 3xl:text-5xl 4xl:text-5xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl 4xl:text-2xl text-gray-500 mb-6 xs:mb-8 sm:mb-10">
              Ingresa a tu cuenta para continuar
            </h2>
            <div className="w-screen max-w-[300px] xs:max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[550px] 2xl:max-w-[600px] 3xl:max-w-[650px] 4xl:max-w-[700px]">
              <GoogleSignUp
                content={"Inicia sesión con Google"}
                setUser={setUser}
                setAccesToken={setAccessToken}
                setHasPetsState={setHasPetsState}
                setErrorState={setErrorState}
                setIsnewUserState={setIsNewUserState}
                className="w-full"
              />
              <div className="mt-2 xs:mt-3 sm:mt-4">
                <ButtonPrimary path="/register" text="Crear una Cuenta" />
              </div>
              <div className="mt-2 xs:mt-3 sm:mt-4">
                <ButtonSecondary path="/login" text="Iniciar Sesión" />
              </div>
            </div>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-xl 4xl:text-xl text-gray-400 absolute bottom-4 xs:bottom-6">
              Políticas de Privacidad • Términos de Servicio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};