import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { Link } from "react-router-dom";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../Validations/validationSchema";
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchRegister } from "../../Hooks/useFetchRegister/useFetchRegister"; // Assuming this is the new custom hook

export const Register = () => {
  const navigate = useNavigate();
  // Esquema de validación con Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  
  // instancias de contextos
  const auth = useAuth();
  const pets = useHasPetsUser();

  // Verificamos si el contexto de autenticación está disponible antes de usarlo
  if (!auth) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  // Destructuring contexts and hooks
  const { login } = auth;
  const { changeHasPetsUser } = pets;
  const {
    handleRegister,
    accessTokenResult,
    error, 
    isSuccess, 
    isLoading
  } = useFetchRegister();

  // Local states
  const [accessToken, setAccessToken] = useState(null);
  const [errorState, setErrorState] = useState(null);

  // Form submission
  const onSubmit = async (formData) => {
    handleRegister(formData);
  };

  // Efecto para actualizar estados cuando el customHook cambie
  useEffect(() => {
    if (isSuccess) {      
      setAccessToken(accessTokenResult);
    }
    if (error) {
      setErrorState(error);

    }
  }, [isSuccess, error]);

  // Efectos para las acciones de los estados
  useEffect(() => {
    if (accessToken) {
      login(accessToken, null);
      changeHasPetsUser(false);
      navigate('/step-user');
    }
  }, [accessToken]);

  // Manejo de error
  useEffect(() => {
    if (errorState) {
      toast.error(errorState);
    }
  }, [errorState]);

  return (
    <>
      {/* Loading Spinner */}
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

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Únete a PetConnect <span className="inline-block">🐾</span>
          </h2>
          <p className="text-gray-500 mb-8">Un mundo de posibilidades peludas te esperan.</p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-md font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                disabled={isLoading}
                className={`bg-gray-50 mt-1 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
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
              <label htmlFor="password" className="block text-md font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                disabled={isLoading}
                className={`bg-gray-50 mt-1 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
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
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center space-x-2 my-10">
              <input 
                type="checkbox" 
                disabled={isLoading}
                className="w-5.5 h-5.5 appearance-none border-2 border-brand rounded-md checked:bg-brand focus:ring-2 focus:ring-brand mr-3" 
                {...register("terms", {
                  required: "Debes aceptar los términos y condiciones"
                })}
              />
              <span className="text-md">
                Aceptar Términos <span className="text-brand">& Condiciones de PetConnect.</span>
              </span>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>}

            {/* Login Link */}
            <p className="text-center mb-10">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-brand font-medium">Iniciar Sesión</Link>
            </p>

            {/* Divider */}
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-2 text-gray-500">o</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign Up and Register Button */}
            <div className="space-y-25">
              <GoogleSignUp
                navigate={navigate}
                content={"Regístrate con Google"}
                setUser={false}
                setAccesToken={setAccessToken}
                setHasPetsState={false}
                setErrorState={setErrorState}
                setIsnewUserState={false}
                disabled={isLoading}
              />

              <ButtonPrimary 
                text={'Registrarse'} 
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};