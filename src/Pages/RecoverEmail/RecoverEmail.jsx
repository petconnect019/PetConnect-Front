import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FetchChangePassword } from "../../Utils/Fetch/FetchChangePassword/ChangePassword";
import BackButton from '../../assets/BackButton.png'
import { useState } from "react";
import EmailImg from '../../assets/emailIcon.png'

export const RecoverEmail = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    setDisabled(true);

    FetchChangePassword(data.email)
      .then((response) => {
        if (response.ok) {
          alert("Se ha enviado un correo con las instrucciones para restablecer tu contraseña");
        } else {
          alert("El correo ingresado no se encuentra registrado");
        }
      })
      .catch(() => {
        alert("Error en la conexión con el servidor");
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setDisabled(false), 20000);
      });
  };


  const handleBack = () => {
    navigate('/login');
  }

  const handleChangePaswword = () => {
    navigate('/change-password');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md ">
          <nav className="flex justify-between items-center mb-[1rem]">
            <li onClick={handleBack} className="list-none"><img src={BackButton} alt="" /></li>
          </nav>
          <div className="mb-4 p-7">
            <h2 className="text-2xl font-bold mb-2  text-center">¿Olvidaste tu contraseña? 🔑</h2>
              <p className="text-gray-600 mt-3 text-sm ">
              Lo tenemos cubierto. Ingresa tu correo electrónico registrado para restablecer tu contraseña. Te enviaremos un link donde podrás seguir los pasos.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div className="flex items-center bg-gray-100 p-3 rounded-lg border border-gray-300">
              <span className="text-gray-600 mr-2"><img src={EmailImg} alt="emailIcon" /></span>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Correo inválido",
                  },
                })}
                className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            <button
              onClick={handleChangePaswword}
              type="submit"
              disabled={loading || disabled}
              className={`w-full py-2 px-4 rounded-lg text-white transition-all text-sm font-semibold 
                ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-orange-400 hover:bg-orange-600"}`}
            >
              {loading ? "Enviando..." : "Confirmar"}
            </button>
            {disabled && (
              <p className="text-gray-500 text-xs">Podrás volver al enviar el código en 20 segundos</p>
            )}
          </form>
      </div>
    </div>
  );
};