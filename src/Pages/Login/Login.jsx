import { useForm } from "react-hook-form";
import { useAuth } from "../../Contexts/AuthContext/AuthContext.jsx";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchLogin } from "../../Utils/Fetch/FetchLogin/FetchLogin.jsx";
import { Link } from "react-router-dom";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser.jsx";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary.jsx";


export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  //instancias de contextos
  const auth = useAuth();
  const pets = useHasPetsUser();

  // Verificamos si el contexto de autenticación y el de mascotas está disponible antes de usarlo
  if (!auth) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  // desestrucuring de los contextos
  const { isAuthenticated, login } = auth ?? {};
  const { changeHasPetsUser } = pets ?? {}; 

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (isAuthenticated) {
      const userData = sessionStorage.getItem("accessToken");
      const hasPets = sessionStorage.getItem("hasPets");
      const user = JSON.parse(sessionStorage.getItem("userData"));
      
      if (userData) {
        // Check if it's a new user before redirecting
        if (user && user.isNewUser) {
          navigate('/step-pet');
        } else {
          navigate('/home');
        }
      }
      
      if (hasPets) {
        changeHasPetsUser();
      }
    }
  }, [isAuthenticated, navigate, changeHasPetsUser]);

  const onSubmit = async (userData) => {
    try {
      const response = await fetchLogin(userData);
      if (!response.ok) {
        throw new Error(response.message || "Error al iniciar sesión");
      }
      login(response.accessToken, response.user);
      if (response.hasPets) {
        changeHasPetsUser(true);
      }
      if (response.isNewUser) {
        navigate('/step-pet');
        
      } else {
        navigate('/home');
      }      
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center min-h-screen sm:p-4 md:bg-gray-100">
      <div className="bg-white w-screen p-6 rounded-4xl md:shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mt-15 mb-4">
          Bienvenido de nuevo!👋
        </h1>
        <p className="text-gray-500 mb-6">
          Continuemos el viaje con tus amigos peludos.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-100 mt-1 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <label htmlFor="password" className="block font-semibold text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-100 mt-1 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            <div className="flex items-center space-x-2 my-10">
            <input type="checkbox" className="w-5.5 h-5.5 appearance-none border-2 border-brand rounded-md checked:bg-brand focus:ring-2 focus:ring-brand mr-3" />
            <span className="flex">
              Recuerdame 
            <Link to="/recover-email" className="text-brand block hover:underline ml-5">
              ¿Has olvidado tu contraseña?
            </Link>
            </span>
            </div>
          </div>


          {/* <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
            Iniciar sesión
            </button> */}

          <div className="mt-6 flex items-center justify-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-2 text-gray-500">o</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <div className="space-y-20">
            <GoogleSignUp navigate={navigate} content={"Inicia sesión con Google"} />

            <ButtonPrimary text={'Iniciar Sesión'}/>
          </div>

          {/* Texto de registro */}
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
  );
};
