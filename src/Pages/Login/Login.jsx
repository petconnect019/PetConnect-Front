import { useForm } from "react-hook-form";
import { useAuth } from "../../Contexts/AuthContext/AuthContext.jsx";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp.jsx";
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

  const onSubmit = async (formData) => {
    handleLogin(formData);
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

      <div
        className={`
          flex items-center justify-center 
          min-h-screen 
          px-4 py-6 
          bg-gray-100 
          ${isLoading ? "blur-sm pointer-events-none" : ""}
        `}
      >
        <div
          className="
            w-full 
            max-w-md 
            bg-white 
            rounded-2xl 
            shadow-xl 
            overflow-hidden 
            transition-all 
            duration-300 
            ease-in-out
            hover:shadow-2xl
          "
        >
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

          <div className="p-6 sm:p-8">
            <header className="mb-6 text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                Bienvenido de nuevo! 👋
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Continuemos el viaje con tus amigos peludos.
              </p>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Formulario de inicio de sesión"
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
                <div className="flex flex-col sm:flex-row justify-between items-center my-6">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <input
                      type="checkbox"
                      id="remember-me"
                      disabled={isLoading}
                      className="
                        mr-2 
                        w-4 
                        h-4 
                        text-brand 
                        rounded 
                        focus:ring-brand
                      "
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-sm text-gray-600"
                    >
                      Recuérdame
                    </label>
                  </div>
                  <Link
                    to="/recover-email"
                    className="
                      text-sm 
                      text-brand 
                      hover:underline 
                      transition 
                      duration-300
                    "
                  >
                    ¿Has olvidado tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Rest of the component remains the same */}
              {/* Divider, Google Sign Up, Login Button, Registration Link */}

              {/* Divider */}
              <div className="flex items-center justify-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Google Sign Up and Login Button */}
              <div className="space-y-4">
                <GoogleSignUp
                  content={"Inicia sesión con Google"}
                  setUser={setUser}
                  setAccesToken={setAccessToken}
                  setHasPetsState={setHasPetsState}
                  setErrorState={setErrorState}
                  setIsnewUserState={setIsNewUserState}
                  disabled={isLoading}
                  className="w-full"
                />

                <ButtonPrimary
                  text={"Iniciar Sesión"}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              {/* Registration Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
