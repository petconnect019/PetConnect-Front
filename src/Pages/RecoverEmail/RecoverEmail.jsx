import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FetchResetPassword } from "../../Utils/Fetch/FetchResetPassword/FetchResetPassword";
import { useState } from "react";

export const RecoverEmail = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    setDisabled(true);

    FetchResetPassword(data.email)
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900">¿Olvidaste tu contraseña? 🔑</h1>
        <p className="text-gray-600 mt-3 text-sm">
          Ingresa tu correo electrónico registrado para recibir instrucciones de recuperación.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg border border-gray-300">
            <span className="text-gray-600 mr-2">📧</span>
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
            type="submit"
            disabled={loading || disabled}
            className={`w-full py-2 px-4 rounded-lg text-white transition-all text-sm font-semibold 
              ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
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