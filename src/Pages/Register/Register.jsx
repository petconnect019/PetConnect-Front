
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser,signInWithGoogle } from '../../Services/authService';
import { registerSchema } from '../../Validations/validationSchema';


export const Register = () => {
  
  const navigate = useNavigate();


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const result = await registerUser(data);
  
    console.log("Respuesta de registerUser:", result);
  
    if (result.success) {
      toast.success(result.message); 
      navigate("/introduction2"); 
    } else {
      toast.error(result.message); 
    }
  };
  
  const handleGoogleSignUp = () => {
    signInWithGoogle(navigate, toast);
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

        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Registrarse
        </button>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-2 text-gray-500">o</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <button type="button" onClick={handleGoogleSignUp}
          className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="w-5 h-5 mr-2" />
          Registrarse con Google
        </button>
      </form>
    </div>
  );
};
