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

export const Register = () => {
  const navigate = useNavigate();
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
  const { handleRegister, accessTokenResult, error, isSuccess, isLoading } =
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
    if (accessToken) {
      login(accessToken, null);
      changeHasPetsUser(false);
      navigate("/step-user");
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

          <div className="p-6 sm:p-8">
            <header className="mb-6 text-center">
              <h2
                className="
              text-3xl 
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
              text-gray-600 
              text-sm 
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
                  text-xs 
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
                  text-xs 
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
                  text-xs 
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
                  w-4 
                  h-4 
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
                  text-xs 
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
                  text-xs 
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
              text-sm 
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
              my-6
            "
              >
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Google Sign Up and Register Button */}
              <div className="space-y-4">
                <GoogleSignUp
                  content={"Regístrate con Google"}
                  setUser={false}
                  setAccesToken={setAccessToken}
                  setHasPetsState={false}
                  setErrorState={setErrorState}
                  setIsnewUserState={false}
                  disabled={isLoading}
                  className="w-full"
                />

                <ButtonPrimary
                  text={"Registrarse"}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};