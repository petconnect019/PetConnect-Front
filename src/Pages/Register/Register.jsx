
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { GoogleSignUp } from '../../Components/GoogleAuth/GoogleSignUp';
import { fetchRegister } from '../../Utils/Fetch/FetchLogin/FetchRegister/FetchRegister';


// Esquema de validación con Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Correo electrónico inválido')
    .required('Este campo es obligatorio')
    .matches(/@dominio\.com$|@gmail\.com$/, 'El correo debe ser del dominio @dominio.com o @gmail.com'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/, 'La contraseña debe incluir al menos una letra mayúscula')
    .matches(/[a-z]/, 'La contraseña debe incluir al menos una letra minúscula')
    .matches(/[0-9]/, 'La contraseña debe incluir al menos un número')
    .required('Este campo es obligatorio'),
});

export const Register = () => {
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  // Función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    fetchRegister(data).then((response) => {
      if (response.ok) {
        navigate('/home');
      } else {
        alert(`Error: ${response.message || 'No se pudo registrar'}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Regístrate</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico:</label>
          <input type="email" id="email" {...register('email')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
          />
          {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input type="password" id="password" {...register('password')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none"
          />
          {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Registrarse
        </button>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-2 text-gray-500">o</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <GoogleSignUp navigate={navigate} />
      </form>
    </div>
  );
};

