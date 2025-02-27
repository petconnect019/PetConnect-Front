import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FetchChangePassword } from "../../Utils/Fetch/FetchChangePassword/ChangePassword";

export const RecoverEmail = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    //fetch para enviar el correo de recuperación
    FetchChangePassword(data.email)
      .then((response) => {
        if (response.ok) {
          //crear alerta de se envió el correo
          alert("Se ha enviado un correo con las instrucciones para restablecer tu contraseña");
        } else {
          //crear alerta de error de email
          alert("El correo ingresado no se encuentra registrado");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error en la conexión con el servidor");
      }); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">¿Olvidaste tu contraseña? 🔑</h1>
        <p className="text-gray-600 mt-2">
          Lo tenemos cubierto. Ingresa tu correo electrónico registrado para restablecer tu contraseña. Te enviaremos un link donde podrás seguir los pasos.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <span className="text-gray-600 mr-2">📧</span>
            <input 
              type="email" 
              placeholder="Ingresa tu correo" 
              {...register("email", { required: "El correo es obligatorio", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Correo inválido" } })} 
              className="bg-transparent outline-none w-full text-gray-800" 
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          <button type="submit" className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
};
