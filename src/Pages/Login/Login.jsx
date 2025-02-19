import { useForm } from "react-hook-form";
import { fetchLogin } from "../../Utils/Fetch/FetchLogin/FetchLogin.jsx";
import { GoogleAuthComponent } from "../../Components/GoogleAuthComponent/GoogleAuthComponent.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navitage = useNavigate();
  const [token, setTokenTrue] = useState(false);

  useEffect(()=> {
    if(token) {
      navitage('/introduction2');
    }

  }, [token])

  //Funcion para iniciar por medio del formulario
  const onSubmit = userData => {
    fetchLogin(userData).then((res)=>{
        localStorage.setItem('userToken', res.accessToken);
        setTokenTrue(true);
    })
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

          <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4">
            Iniciar sesión
          </button>

          <div className="text-center mb-4">
            <span className="text-sm text-gray-600">O</span>
          </div>

          <GoogleAuthComponent/>
        </form>
      </div>
    </div>
  );
};
