import { useNavigate } from "react-router-dom";

export const RecoverEmail = () => {
    const navigate = useNavigate();
    const handleConfirm = () => {
    //crear fetch para enviar el correo de recuperación
    }


    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800">¿Olvidaste tu contraseña? 🔑</h1>
          <p className="text-gray-600 mt-2">
            Lo tenemos cubierto. Ingresa tu correo electrónico registrado para restablecer tu contraseña. Te enviaremos un link donde podrás seguir los pasos.
          </p>
          <div className="mt-4 flex items-center bg-gray-100 p-3 rounded-lg">
            <span className="text-gray-600 mr-2">📧</span>
            <span className="text-gray-800">andrew.ainsley@yourdomain.com</span>
          </div>
          <button onClick={handleConfirm} className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all">
            Confirmar
          </button>
        </div>
      </div>
    );
  };
  