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
import { useFetchRegister } from "../../Hooks/useFetchRegister/useFetchRegister";
import { InputField } from "../../Components/InputField/InputField.jsx";
import { PasswordField } from "../../Components/InputField/PasswordField.jsx";
import emailIcon from '../../assets/images/emailIcon.png'
import passwordIcon from '../../assets/images/Lock.png'
import { NavButton } from "../../Components/NavButton/NavButton.jsx";
import { useFetchUserProfile } from "../../Hooks/useFetchUserProfile/useFetchUserProfile";

export const Register = () => {
  const navigate = useNavigate();
  const { fetchUserProfile } = useFetchUserProfile();

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

  // Form submission for regular email/password registration
  const onSubmit = async (formData) => {
    // Crear un nuevo objeto sin el campo confirmPassword
    const { confirmPassword, ...registerData } = formData;
    
    // Verificar que las contraseñas coincidan antes de registrar
    if (formData.password === formData.confirmPassword) {
      const result = await handleRegister(registerData);
      if (result?.success) {
        // Redirigir a la página de verificación pendiente solo para registro normal
        navigate('/pending-verification', { 
          state: { email: formData.email }
        });
      }
    }
  };

  // Efecto para actualizar estados cuando el customHook cambie
  useEffect(() => {
    if (error) {
      setErrorState(error);
      toast.error(error);
    }
  }, [error]);

  // Efectos para las acciones de los estados de Google
  useEffect(() => {
    if (user && accessToken) {
      // Los usuarios de Google no necesitan verificación de correo
      login(accessToken, user);
      changeHasPetsUser(hasPetsState);
      
      // Usar fetchUserProfile para normalizar los datos del usuario de Google
      fetchUserProfile().then(() => {
        // Check for redirect URL in sessionStorage
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          // Clear the redirect URL
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
      });
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
      <div className="h-auto w-full 2xl:min-h-screen 3xl:min-h-screen 4xl:min-h-screen flex bg-gray-100 xl:items-center xl:justify-center 2xl:items-center 2xl:justify-center 3xl:items-center 3xl:justify-center 4xl:items-center 4xl:justify-center">
          <div
            className={`
          bg-white w-full xl:max-w-xl 2xl:max-w-2xl 3xl:max-w-2xl 4xl:max-w-2xl p-6 xl:p-2 2xl:p-2 rounded-4xl xl:shadow-lg xl:border xl:border-gray-100 2xl:shadow-lg 2xl:border-gray-100 3xl:shadow-lg 3xl:border 3xl:border-gray-100 4xl:shadow-lg 4xl:border 4xl:border-gray-100
          ${isLoading ? "blur-sm pointer-events-none" : ""}
        `}
          >
            <div className="sm:p-4 md:p-6 lg:p-8 2xl:p-2 xl:p-2 w-auto">
                <div className="mb-6 pl-2">
                  <NavButton onClick={() => navigate(-1)} />
                </div>
                <header className="mb-4 2xl:mb-2 sm:mb-6 text-left ml-2 xl:mb-2">
                  <h2
                    className="
                  text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-3xl 2xl:text-5xl 3xl:text-5xl 4xl:text-5xl font-extrabold text-gray-900 mb-2 xl:mb-0 tracking-tight
                "
                  >
                    Únete a PetConnect <span className="inline-block">🐾</span>
                  </h2>
                  <p
                    className="
                  text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-lg 2xl:text-2xl 3xl:text-xl 4xl:text-2xl text-gray-600 font-medium
                "
                  >
                    Un mundo de posibilidades peludas te esperan.
                  </p>
                </header>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  aria-label="Formulario de registro"
                  className="p-2 xl:pb-0 xl:pt-1.5 4xl:pb-2 2xl:pb-2" 
                >
                  {/* Email Input */}
                  <div className="mb-4 ">
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
                        Aceptar{" "}
                        <Link to="/terms-and-conditions" className="text-brand hover:underline">
                          Términos & Condiciones
                        </Link>{" "}
                        de PetConnect.
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
                  xl:mt-4
                  xl:mb-4
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
                  my-4 sm:my-6 2xl:my-0 xl:my-0
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
            <div
              className="
            flex flex-col w-full items-center
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
            </div>
          </div>
      </div>
    </>
  );
};