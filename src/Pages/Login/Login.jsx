import { useForm } from "react-hook-form";
import { useAuth } from "../../Contexts/AuthContext/AuthContext.jsx";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchLogin } from "../../Utils/Fetch/FetchLogin/FetchLogin.jsx";

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  
    // Verificar si el usuario ya está autenticado
    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        navigate('/home');
      }
    }, [navigate]);

  //Funcion para iniciar por medio del formulario
  const onSubmit = userData => {
    fetchLogin(userData).then((response) => {
      if (response.ok) {
        localStorage.setItem('accessToken', response.accessToken);
        login();
        navigate('/welcome');
      } else {
        alert(`Error: ${response.message || 'No se pudo iniciar sesión'}`);
      }
    });
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Por favor, ingresa un correo electrónico válido"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("password", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres"
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
                  message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número"
                }
              })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center mb-4">
            <input type="checkbox" id="remember" className="h-4 w-4 text-indigo-600" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Recuérdame</label>
          </div>

          <div className="text-center mb-4">
            <a href="#" className="text-sm text-indigo-600 hover:underline">¿Has olvidado tu contraseña?</a>
          </div>

          <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Iniciar sesión
                  </button>
          
                  <div className="mt-6 flex items-center justify-center">
                    <div className="w-full border-t border-gray-300"></div>
                    <span className="px-2 text-gray-500">o</span>
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <GoogleSignUp navigate={navigate} content={"Inicia sesíon con Google"} />
        </form>
      </div>
    </div>
  );
};
