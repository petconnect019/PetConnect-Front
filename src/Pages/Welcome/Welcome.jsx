import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logoPetConnect.png';
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { ButtonSecondary } from "../../Components/Buttons/ButtonSecondary";

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="flex flex-col rounded-lg shadow-md w-full max-w-sm items-center bg-white p-6">
      <img src={logo} alt="Logo" className="w-30 my-24" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
      <h2 className="text-base text-gray-500 mb-14">Ingresa a tu cuenta para continuar</h2>
      <GoogleSignUp navigate={navigate} content="Continua con Google" />
      <ButtonPrimary path = '/register' text = 'Crear una Cuenta' />
      <ButtonSecondary path = '/login' text = 'Iniciar Sesión' />
      <p className="text-xs text-gray-400 mt-24">
        Políticas de Privacidad • Términos de Servicio
      </p>
      </div>
    </div>
  );
};