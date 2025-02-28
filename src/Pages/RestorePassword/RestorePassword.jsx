import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../Contexts/ResetPasswordContext/ResetPasswordContext";
import { FetchResetPassword } from "../../Utils/Fetch/FetchResetPassword/FetchResetPassword";
import BackButton from '../../assets/BackButton.png'
import Lock from '../../assets/Lock.png'
import Show from '../../assets/Show.png'
import Hide from '../../assets/NotShow.png'
import { useState } from "react";
import DefaultProfile from '../../assets/DefaultProfile.png';

export const RestorePassword = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useResetPassword();  
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = (data) => {
    if (validatePasswords(data.confirmPassword, data.newPassword)) {
      const tokenEmail = {
        resetToken: token,
        newPassword: data.newPassword,
      };
      FetchResetPassword(tokenEmail).then((response) => {
        if (response.ok) {
          setModalOpen(true); // Abrir el modal
        } else {
          alert("Error al actualizar la contraseña");
        }
      });
    } else {
      alert("Las contraseñas no coinciden");
    }
  };

    // Función que compara las contraseñas
    const validatePasswords = (confirmPassword, newPassword) => {
      return confirmPassword === newPassword;
    };

    const handleBack = () => {
      navigate('/recover-email');
    }
    
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };
    
    const toggleConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
    
    

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <nav className="flex justify-between items-center mb-[1rem]">
            <li onClick={handleBack} className="list-none"><img src={BackButton} alt="" /></li>
          </nav>
          <div className="mb-4 p-7">
          <h2 className="text-2xl font-bold text-gray-800">
          Asegura tu cuenta 🔒
          </h2>
            <p className="text-gray-600 mt-2">
            ¡Casi llegamos! Crea una nueva contraseña para su cuenta PetConnect
            para mantenerla segura. Recuerda elegir una contraseña única y segura.
            </p>
          </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="relative">
            <label >Nueva Contraseña</label>
            <span className="text-gray-600 absolute left-3 top-9"><img src={Lock} alt="" /></span>
            <input
              type={showPassword ? "text" : "password"}
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
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-600 mr-2 absolute left-87 top-10"><img onClick={togglePassword} src={showPassword ? Show : Hide} alt="" /></span>
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col  relative" >
            <label >Confirmar Contraseña</label>
            <span className="text-gray-600 absolute left-3 top-9 absolute"><img src={Lock} alt="" /></span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              {...register("confirmPassword", {
                required: "Este campo es obligatorio",
              })}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-87 top-10 text-gray-600 mr-2"><img onClick={toggleConfirmPassword} src={showConfirmPassword ? Show : Hide} alt="" /></span>
          </div>
          <button
            type="submit"
            className="  w-full bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all"
          >
            Confirmar
          </button>
        </form>
      </div>
              {/* Modal de éxito */}
              {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                  <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
                    <img src={DefaultProfile} alt="Éxito" className="mx-auto mb-4 w-24" />
                    <h2 className="text-2xl font-bold text-gray-800">¡Ya estás listo!</h2>
                    <p className="text-gray-600">Tu contraseña ha sido cambiada exitosamente.</p>
                    <button
                      onClick={() => {
                        setModalOpen(false);
                        navigate("/login");
                      }}
                      className="mt-4 w-full bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all"
                    >
                      Ir a la página de inicio
                    </button>
                  </div>
                </div>
              )}

    </div>
  );
};
