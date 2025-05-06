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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchRegister } from "../../Hooks/useFetchRegister/useFetchRegister"; // Assuming this is the new custom hook
import { InputField } from "../../Components/InputField/InputField.jsx";
import { PasswordField } from "../../Components/InputField/PasswordField.jsx";
import emailIcon from '../../assets/images/emailIcon.png'
import passwordIcon from '../../assets/images/Lock.png'
import { NavButton } from "../../Components/NavButton/NavButton.jsx";

export const Register = () => {
  const navigate = useNavigate();

  // Local states // Estados locales que cambian con el customHook y con el Componente de Google
  const [user, setUser] = useState(null);
  const [hasPetsState, setHasPetsState] = useState(false);
  const [isNewUserState, setIsNewUserState] = useState(false);
  // Esquema de validación con Yup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  // instancias de contextos
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

  // Destructuring contexts and hooks
  const { login } = auth;
  const { changeHasPetsUser } = pets;
  const { handleRegister, accessTokenResult, userResult, error, isSuccess, isLoading } =
    useFetchRegister();

  // Local states
  const [accessToken, setAccessToken] = useState(null);
  const [errorState, setErrorState] = useState(null);

  // Form submission
  const onSubmit = async (formData) => {
    // Crear un nuevo objeto sin el campo confirmPassword
    const { confirmPassword, ...registerData } = formData;
    
    // Verificar que las contraseñas coincidan antes de registrar
    if (formData.password === formData.confirmPassword) {
      handleRegister(registerData);
    }
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
    if (accessToken && userResult) {
      login(accessToken, userResult);
      changeHasPetsUser(false);
      navigate("/step-user");
    }
  }, [accessToken, userResult]);

  // Efecto para manejar los estados de Google
  useEffect(() => {
    if (user && accessToken) {
      login(accessToken, user);
      changeHasPetsUser(hasPetsState);
      if (isNewUserState) {
        navigate("/step-user");
      } else {
        navigate("/home");
      }
    }
  }, [user, accessToken, hasPetsState, isNewUserState]);

  // Manejo de error
  useEffect(() => {
    if (errorState) {
      if (errorState.includes('Google')) {
        toast.error('Error en la autenticación con Google. Por favor, intente nuevamente.');
      } else {
        toast.error(errorState);
      }
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
      flex items-center justify-center h-auto
      ${isLoading ? "blur-sm pointer-events-none" : ""}
    `}
      >
        <div
          className="
        flex flex-col p-4 w-full items-center
      "
        >
          {/* Toastify Container with improved positioning */}
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

          <div className=" sm:p-4 md:p-6 lg:p-8  w-auto">
            <div className="mb-6 pl-2">
              <NavButton onClick={() => navigate(-1)} />
            </div>
            <header className="mb-4 sm:mb-6 text-left ml-2">
              <h2
                className="
              text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl 3xl:text-5xl 4xl:text-5xl
              font-extrabold 
              text-gray-900 
              mb-2 
              tracking-tight
            "
              >
                Únete a PetConnect <span className="inline-block">🐾</span>
              </h2>
              <p
                className="
              text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-xl 4xl:text-xl
              text-gray-600 
              font-medium
            "
              >
                Un mundo de posibilidades peludas te esperan.
              </p>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Formulario de registro"
              className="w-screen p-2"
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
                    className="
                  text-red-500 
                  text-xs xs:text-xs sm:text-sm md:text-base
                  mt-1 
                  animate-fade-in-down
                "
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
                    className="
                  text-red-500 
                  text-xs xs:text-xs sm:text-sm md:text-base
                  mt-1 
                  animate-fade-in-down
                "
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-4">
                <PasswordField
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  icon={passwordIcon}
                  register={register}
                  type="password"
                  placeholder="Confirmar Contraseña"
                  validation={{
                    required: "Este campo es obligatorio",
                    validate: (val) => {
                      if (watch("password") !== val) {
                        return "Las contraseñas no coinciden";
                      }
                    }
                  }}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p
                    role="alert"
                    className="
                  text-red-500 
                  text-xs xs:text-xs sm:text-sm md:text-base
                  mt-1 
                  animate-fade-in-down
                "
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="mb-4 mt-5 ml-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    disabled={isLoading}
                    className="
                  w-4 h-4 
                  text-brand 
                  rounded 
                  focus:ring-brand
                "
                    {...register("terms", {
                      required: "Debes aceptar los términos y condiciones",
                    })}
                  />
                  <label
                    htmlFor="terms"
                    className="
                  text-sm xs:text-base sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg 3xl:text-lg 4xl:text-lg
                  text-gray-600
                  leading-tight
                "
                  >
                    Aceptar Términos{" "}
                    <span className="text-brand">
                      & Condiciones de PetConnect.
                    </span>
                  </label>
                </div>
                {errors.terms && (
                  <p
                    role="alert"
                    className="
                  text-red-500 
                  text-xs xs:text-xs sm:text-sm md:text-base
                  mt-1 
                  animate-fade-in-down
                "
                  >
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Login Link */}
              <p
                className="
              text-center 
              text-sm xs:text-base sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg 3xl:text-lg 4xl:text-lg
              text-gray-600 
              mt-6
              mb-6
            "
              >
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="
                text-brand 
                font-semibold 
                hover:underline 
                transition 
                duration-300
              "
                >
                  Iniciar Sesión
                </Link>
              </p>

              {/* Divider */}
              <div
                className="
              flex 
              items-center 
              justify-center 
              my-4 sm:my-6
            "
              >
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm xs:text-base sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg 3xl:text-lg 4xl:text-lg">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Google Sign Up and Register Button */}
              <div className="space-y-4">
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
                  text={"Registrarse"}
                  disabled={isLoading}
                  className="w-full max-w-[400px] mx-auto 4xl:max-w-[500px]"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};