import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = (data) => {
      if (validatePasswords(data.confirmPassword, data.newPassword)) {
          alert("Contraseña actualizada");
          navigate("/home");
        }else {
            alert("Las contraseñas no coinciden");
        }
    };

    // Función que compara las contraseñas
    const validatePasswords = (confirmPassword, newPassword) => {
      return confirmPassword === newPassword;
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Asegura tu cuenta 🔒
        </h1>
        <p className="text-gray-600 mt-2">
          ¡Casi llegamos! Crea una nueva contraseña para su cuenta PetConnect
          para mantenerla segura. Recuerda elegir una contraseña única y segura.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <input
              type="password"
              placeholder="Nueva contraseña"
              {...register("newPassword", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                  message:
                    "Debe contener al menos una mayúscula, una minúscula y un número",
                },
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              {...register("confirmPassword", {
                required: "Este campo es obligatorio",
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
};
