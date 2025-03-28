import { useForm } from "react-hook-form";
import { useAuth } from "../../Contexts/AuthContext/AuthContext.jsx";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser.jsx";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary.jsx";
import { useFetchLogin } from "../../Hooks/useFetchLogin/useFetchLogin.js";
import {ImSpinner2} from "react-icons/im"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  //instancias de contextos
  const auth = useAuth();
  const pets = useHasPetsUser();

  // Verificamos si el contexto de autenticación está disponible antes de usarlo
  if (!auth) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  // desestrucuring de los contextos y hooks
  const { isAuthenticated, login } = auth ?? {};
  const { changeHasPetsUser } = pets ?? {}; 
  const {handleLogin, userResult, accessTokenResult, hasPets, isNewUser, error, isSuccess, isLoading} = useFetchLogin();

  // Estados locales que cambian con el customHook y con el Componente de Google
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [hasPetsState, setHasPetsState] = useState(false);
  const [isNewUserState, setIsNewUserState] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const onSubmit = async (formData)=> {
    handleLogin(formData);
  }

  // Efecto para actualizar estados cuando el customHook cambie
  useEffect(() => {
    if (isSuccess) {
      setAccessToken(accessTokenResult);
      setHasPetsState(hasPets);
      setIsNewUserState(isNewUser);
      setUser(userResult);
    }
    if (error) {
      setErrorState(error);
    }
  }, [isSuccess, error]);

  // Efectos para las acciones de los estados
  useEffect(()=> {
    if (user) {      
      login(accessToken, user);
      if (hasPetsState) {
        changeHasPetsUser(true);
      }
      if (isNewUserState) {
        navigate('/step-user')
      }else {
        navigate('/home');
      }
    }
  }, [user])

  // Manejo de error
  useEffect(() => {
    if (errorState) {
      toast.error(errorState);
    }
  }, [errorState]);


  return (
    <>
      {/* Spinner Overlay - shown during loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-1 backdrop-blur-xs">
          <ImSpinner2 className="w-16 h-16 text-gray-500" />
        </div>
      )}

      <div className={`bg-white flex items-center justify-center min-h-screen sm:p-4 md:bg-gray-100 ${isLoading ? 'blur-sm' : ''}`}>
        <div className="bg-white w-screen p-6 rounded-4xl md:shadow-lg max-w-md">
          {/* Toastify Container */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <h1 className="text-3xl font-bold text-gray-900 mt-15 mb-4">
            Bienvenido de nuevo!👋
          </h1>
          <p className="text-gray-500 mb-6">
            Continuemos el viaje con tus amigos peludos.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                disabled={isLoading}
                className={`bg-gray-100 mt-1 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                {...register("email", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Correo electrónico inválido",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block font-semibold text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                disabled={isLoading}
                className={`bg-gray-100 mt-1 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                {...register("password", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
                    message: "Debe contener mayúscula, minúscula y número",
                  },
                })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

              {/* Remember me and Forgot Password */}
              <div className="flex items-center space-x-2 my-10">
                <input 
                  type="checkbox" 
                  disabled={isLoading}
                  className="w-5.5 h-5.5 appearance-none border-2 border-brand rounded-md checked:bg-brand focus:ring-2 focus:ring-brand mr-3" 
                />
                <span className="flex">
                  Recuerdame 
                  <Link to="/recover-email" className="text-brand block hover:underline ml-5">
                    ¿Has olvidado tu contraseña?
                  </Link>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center justify-center">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-2 text-gray-500">o</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {/* Google Sign Up and Login Button */}
            <div className="space-y-20">
              <GoogleSignUp
                navigate={navigate}
                content={"Inicia sesión con Google"}
                setUser={setUser}
                setAccesToken={setAccessToken}
                setHasPetsState={setHasPetsState}
                setErrorState={setErrorState}
                setIsnewUserState={setIsNewUserState}
                disabled={isLoading}
              />

              <ButtonPrimary 
                text={'Iniciar Sesión'} 
                disabled={isLoading}
              />
            </div>

            {/* Registration Link */}
            <p className="mt-10 text-center text-sm text-gray-600">
              ¿Aún no tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-brand font-medium hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>
      </div>

    </>
  );
};
