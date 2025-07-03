import { useNavigate } from "react-router-dom";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import logo from '../../assets/images/LogoPetConnect.png';
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { ButtonSecondary } from "../../Components/Buttons/ButtonSecondary";
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";
import { useEffect, useState } from "react";
import { useFetchLogin } from "../../Hooks/useFetchLogin/useFetchLogin";
import { useFetchUserProfile } from "../../Hooks/useFetchUserProfile/useFetchUserProfile";

export const Welcome = () => {
    const navigate = useNavigate();
    const { fetchUserProfile } = useFetchUserProfile();

    // instanciar contextos
    const auth = useAuth();
    const pets = useHasPetsUser();

    //verificamos si el contexto de autenticacion esta disponible antes de usarlo
    if (!auth) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    //desestrucuring de los contextos y hooks
    const { login } = auth;
    const { changeHasPetsUser } = pets;
    const { handleLogin, isSuccess, isLoading } = useFetchLogin();

    // Estados locales que cambian con el customHook y con el Componente de Google
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [hasPetsState, setHasPetsState] = useState(false);
    const [isNewUserState, setIsNewUserState] = useState(false);
    const [errorState, setErrorState] = useState(null);

    // Efectos para las acciones de los estados
    useEffect(() => {
        if (user) {
            login(accessToken, user);
            changeHasPetsUser(true);
            
            fetchUserProfile().then(() => {
                if (isNewUserState) {
                    navigate("/step-user");
                } else {
                    navigate("/home");
                }
            })
        }
    }, [user]);

    return (
        <div >
            <div className="h-auto w-full 2xl:min-h-screen 3xl:min-h-screen 4xl:min-h-screen flex  bg-gray-100 xl:items-center xl:justify-center 2xl:items-center 2xl:justify-center 3xl:items-center 3xl:justify-center 4xl:items-center 4xl:justify-center">
                <div className="bg-white w-full  xl:max-w-xl 2xl:max-w-2xl 3xl:max-w-2xl 4xl:max-w-2xl 2xl:p-16 4xl:p-10 4xl:p-6 rounded-4xl xl:shadow-lg xl:border xl:border-gray-100 2xl:shadow-lg 2xl:border-gray-100 3xl:shadow-lg 3xl:border 3xl:border-gray-100 4xl:shadow-lg 4xl:border 4xl:border-gray-100">
                    <div className="flex flex-col items-center justify-center h-full w-full xl:p-16 2xl:p-10 3xl:p-14 4xl:p-16">
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52 2xl:w-54 3xl:w-56 4xl:w-60 my-4 xs:my-6 sm:my-8 md:my-10" 
                        />
                        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl 3xl:text-5xl 4xl:text-6xl font-bold text-gray-900 mb-2">Bienvenido</h1>
                        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl 4xl:text-3xl text-gray-500 mb-6 xs:mb-8 sm:mb-10 4xl:mb-2">
                            Ingresa a tu cuenta para continuar
                        </h2>
                        <div className="w-full max-w-[300px] xs:max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[550px] 2xl:max-w-[600px] 3xl:max-w-[650px] 4xl:max-w-[700px]">
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
                        <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-xl 4xl:text-xl text-gray-400 absolute xl:bottom-2 2xl:bottom-17 bottom-4 xs:bottom-6">
                            Políticas de Privacidad • Términos de Servicio
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}