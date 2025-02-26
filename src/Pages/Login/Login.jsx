import { useForm } from "react-hook-form";
import { useAuth } from "../../Contexts/AuthContext/AuthContext.jsx";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchLogin } from "../../Utils/Fetch/FetchLogin/FetchLogin.jsx";
import { Link } from "react-router-dom";

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (userData) => {
    try {
      const response = await fetchLogin(userData);
      if (!response.ok) {
        throw new Error(response.message || "Error al iniciar sesión");
      }
      login(response.accessToken);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Bienvenido de nuevo!👋
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Continuemos el viaje con tus amigos peludos.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            Iniciar sesión
          </button>

          <div className="mt-6 flex items-center justify-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-2 text-gray-500">o</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <GoogleSignUp navigate={navigate} content={"Inicia sesión con Google"} />

          {/* Texto de registro */}
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Aún no tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>;
        </form>
      </div>
    </div>
  );
};
