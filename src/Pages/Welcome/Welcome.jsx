import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { useNavigate } from "react-router-dom";

export const Welcome = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  }

  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido a PetConnect!</h1>
        <h2 className="text-lg text-gray-600 mb-6">Ingresa a tu cuenta para continuar</h2>
        
        <GoogleSignUp navigate={navigate} content="Iniciar sesión con Google" />

        <button onClick={handleCreateAccount} className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3 mt-3 hover:bg-blue-600">
          Crear una cuenta
        </button>

        <button onClick={handleLogin} className="w-full bg-gray-800 text-white py-2 rounded-lg mb-4 hover:bg-gray-900">
          Iniciar sesión
        </button>
        
        <p className="text-xs text-gray-500">
          Políticas de Privacidad • Términos de Servicio
        </p>
      </div>
    </div>
  );
};
