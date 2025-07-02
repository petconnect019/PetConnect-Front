import { useForm } from "react-hook-form";
import { useAuth } from "../../Contexts/AuthContext/AuthContext.jsx";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser.jsx";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary.jsx";
import { useFetchLogin } from "../../Hooks/useFetchLogin/useFetchLogin.js";
import { ImSpinner2 } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputField } from "../../Components/InputField/InputField.jsx";
import { PasswordField } from "../../Components/InputField/PasswordField.jsx";
import emailIcon from '../../assets/images/emailIcon.png'
import passwordIcon from '../../assets/images/Lock.png'
import { NavButton } from "../../Components/NavButton/NavButton.jsx";

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
  const {
    handleLogin,
    userResult,
    accessTokenResult,
    hasPets,
    isNewUser,
    error,
    isSuccess,
    isLoading,
  } = useFetchLogin();

  // Estados locales que cambian con el customHook y con el Componente de Google
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [hasPetsState, setHasPetsState] = useState(false);
  const [isNewUserState, setIsNewUserState] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [showResendButton, setShowResendButton] = useState(false);
  const [lastEmail, setLastEmail] = useState('');

  const handleResendVerification = async () => {
    if (!lastEmail) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: lastEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Correo de verificación reenviado exitosamente');
        setShowResendButton(false);
      } else {
        toast.error(data.message || 'Error al reenviar el correo de verificación');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  const onSubmit = async (formData) => {
    setLastEmail(formData.email);
    const result = await handleLogin(formData);
    
    if (result?.error?.includes('verifica tu correo electrónico')) {
      setShowResendButton(true);
    } else {
      setShowResendButton(false);
    }
  };

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
  useEffect(() => {
    if (user) {
      login(accessToken, user);
      if (hasPetsState) {
        changeHasPetsUser(true);
      }
      
      // Check if there's a redirect URL saved in sessionStorage
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        // Clear the redirect URL from sessionStorage
        sessionStorage.removeItem('redirectAfterLogin');
        // Navigate to the saved URL
        navigate(redirectUrl);
      } else {
        // Normal flow based on user state
        if (isNewUserState) {
          navigate("/step-user");
        } else {
          navigate("/home");
        }
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
    <>
      {/* Loading Spinner */}
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-1 backdrop-blur-sm"
          aria-live="polite"
          aria-busy="true"
        >
          <ImSpinner2
            className="w-16 h-16 text-gray-500 animate-spin"
            aria-label="Cargando..."
          />
        </div>
      )}

      <div className="h-auto w-full 2xl:min-h-screen 3xl:min-h-screen 4xl:min-h-screen flex  bg-gray-100 xl:items-center xl:justify-center 2xl:items-center 2xl:justify-center 3xl:items-center 3xl:justify-center 4xl:items-center 4xl:justify-center">
        <div
          className={`
            bg-white w-full  xl:max-w-xl 2xl:max-w-2xl 3xl:max-w-2xl 4xl:max-w-2xl p-6 rounded-4xl xl:shadow-lg xl:border xl:border-gray-100 2xl:shadow-lg 2xl:border-gray-100 3xl:shadow-lg 3xl:border 3xl:border-gray-100 4xl:shadow-lg 4xl:border 4xl:border-gray-100
            ${isLoading ? "blur-sm pointer-events-none" : ""}
          `}
        >
          <div className="flex flex-col p-2 pt-4 w-full">
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
              className="z-50"
            />

            <div className=" sm:p-4 md:p-6 lg:p-8 2xl:p-2  xl:p-2">
              <div className="mb-6">
                <NavButton onClick={() => navigate(-1)} />
              </div>
             
              <header className="mb-4 sm:mb-6 text-left ml-1 xl:mb-1">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-4xl 2xl:text-5xl 3xl:text-5xl 4xl:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
                  Bienvenido de nuevo! 👋
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-xl 4xl:text-2xl text-gray-600 font-medium">
                  Continuemos el viaje con tus amigos peludos.
                </p>
              </header>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-label="Formulario de inicio de sesión"
                className="w-full"
              >
                {/* Email Input */}
                <div className="mb-4">
                  <InputField
                    name="email"
                    label="Email"
                    icon={emailIcon}
                    register={register}
                    placeholder="Correo electrónico"
                    validation={{
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Correo electrónico inválido",
                      },
                    }}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p
                      role="alert"
                      className="text-red-500 text-xs mt-1 animate-fade-in-down"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <PasswordField
                    name="password"
                    label="Contraseña"
                    icon={passwordIcon}
                    register={register}
                    type="password"
                    placeholder="Contraseña"
                    validation={{
                      required: "Este campo es obligatorio",
                      minLength: {
                        value: 8,
                        message: "Debe tener al menos 8 caracteres",
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
                        message: "Debe contener mayúscula, minúscula y número",
                      },
                    }}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p
                      role="alert"
                      className="text-red-500 text-xs mt-1 animate-fade-in-down"
                    >
                      {errors.password.message}
                    </p>
                  )}

                  {/* Remember me and Forgot Password */}
                  <div className="flex flex-row justify-between items-center my-4 sm:my-6">
                      <div className="flex items-center">
                          <input
                              type="checkbox"
                              id="remember-me"
                              disabled={isLoading}
                              className="mr-2 w-4 h-4 2xl:h-5 text-brand rounded focus:ring-brand"
                          />
                          <label
                              htmlFor="remember-me"
                              className="text-sm xs:text-base sm:text-base md:text-lg lg:text-lg xl:text-base 2xl:text-xl 3xl:text-lg 4xl:text-xl text-gray-600"
                          >
                              Recuérdame
                          </label>
                      </div>
                      <Link
                          to="/recover-email"
                          className="text-sm xs:text-base sm:text-base md:text-lg lg:text-lg xl:text-base 2xl:text-xl 3xl:text-lg 4xl:text-xl text-brand hover:underline transition duration-300"
                      >
                          ¿Has olvidado tu contraseña?
                      </Link>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center my-4 sm:my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm xs:text-base sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl 3xl:text-lg 4xl:text-xl">o</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Sign Up and Login Button */}
                <div className="space-y-3 sm:space-y-4 ">
                <GoogleSignUp
                  content={"Inicia sesión con Google"}
                  setUser={setUser}
                  setAccesToken={setAccessToken}
                  setHasPetsState={setHasPetsState}
                  setErrorState={setErrorState}
                  setIsnewUserState={setIsNewUserState}
                  className="w-full"
                />

                  <ButtonPrimary
                    text={"Iniciar Sesión"}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                {/* Registration Link */}
                <p className="mt-4 sm:mt-6 text-center text-sm xs:text-base sm:text-base md:text-lg lg:text-lg xl:text-base 2xl:text-xl 3xl:text-xl 4xl:text-xl text-gray-600">
                  ¿Aún no tienes una cuenta?{" "}
                  <Link
                    to="/register"
                    className="
                      text-brand 
                      font-semibold 
                      hover:underline 
                      transition 
                      duration-300
                    "
                  >
                    Regístrate aquí
                  </Link>
                </p>

                {showResendButton && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">¿No recibiste el correo de verificación?</p>
                    <button
                      onClick={handleResendVerification}
                      className="text-brand hover:underline text-sm font-semibold"
                    >
                      Reenviar correo de verificación
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
