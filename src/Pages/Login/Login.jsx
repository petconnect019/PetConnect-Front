import { useForm } from "react-hook-form";
import { fetchLogin } from "../../Utils/FetchLogin/FetchLogin.jsx";
import { GoogleAuthComponent } from "../../Components/GoogleAuthComponent/GoogleAuthComponent.jsx";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  //Funcion para iniciar por medio del formulario
  const onSubmit = userData => {
    fetchLogin(userData).then((res)=>{
        console.log(res);

    })
  };

  const handleGoogleSignUp = () => {
    let messageListener = null;

    try {
      const popup = window.open(
        'http://localhost:5000/api/auth/google',
        'Google Login',
        'width=500,height=600,left=300,top=200'
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        throw new Error('Popup bloqueado');
      }

      messageListener = async (event) => {
        if (event.origin === 'http://localhost:5000' && event.data) {
          window.removeEventListener('message', messageListener);

          if (event.data.error) {
            alert('Este correo no está registrado. Por favor, regístrate.');
            navigate('/register');
          } else if (event.data.token) {
            localStorage.setItem('auth_token', event.data.token);
            popup.close();
            navigate('/welcome');
          }
        }
      };

      window.addEventListener('message', messageListener);
    } catch (error) {
      console.error('Error al abrir popup:', error);
      window.location.href = 'http://localhost:5000/api/auth/google';
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

          <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 flex items-center justify-center"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Registrarse con Google
        </button>
        </form>
      </div>
    </div>
  );
};
