import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logoPetConnect.png';

export const Welcome = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  }

  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-6">
      <img src={logo} alt="Logo" className="w-30 my-25" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
      <h2 className="text-base text-gray-500 mb-14">Ingresa a tu cuenta para continuar</h2>
      <GoogleSignUp navigate={navigate} content="Continua con Google" />
      <button 
        onClick={() => navigate('/register')} 
        className="w-full max-w-xs bg-brand text-white py-3 rounded-full mt-8 text-lg font-medium shadow-md">
          Crear una Cuenta
      </button>
      <button 
        onClick={() => navigate('/login')} 
        className="mt-4 text-brand text-lg font-medium hover:underline">
          Iniciar Sesión
      </button>
      <p className="text-xs text-gray-400 mt-30">
        Políticas de Privacidad • Términos de Servicio
      </p>
    </div>
  );
};
