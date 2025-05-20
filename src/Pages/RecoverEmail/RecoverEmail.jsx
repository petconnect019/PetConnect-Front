import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FetchRequestEmail } from "../../Utils/Fetch/FetchRequestEmail/FetchRequestEmail";
import { useState } from "react";
import { NavButton } from "../../Components/NavButton/NavButton";
import { InputField } from "../../Components/InputField/InputField";
import emailIcon from '../../assets/images/emailIcon.png'


export const RecoverEmail = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    setDisabled(true);

    FetchRequestEmail(data.email)
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

  return (
    <div className="h-auto w-full xl:min-h-screen 2xl:min-h-screen 3xl:min-h-screen 4xl:min-h-screen flex  bg-gray-100 xl:items-center xl:justify-center 2xl:items-center 2xl:justify-center 3xl:items-center 3xl:justify-center 4xl:items-center 4xl:justify-center">
      <div className="bg-white  w-full xl:p-9  xl:max-w-xl 2xl:max-w-2xl 3xl:max-w-2xl 4xl:max-w-2xl 2xl:p-16 4xl:p-10 4xl:p-6 2xl:rounded-4xl 3xl:rounded-4xl 4xl:rounded-4xl xl:rounded-4xl xl:shadow-lg xl:border xl:border-gray-100 2xl:shadow-lg 2xl:border-gray-100 3xl:shadow-lg 3xl:border 3xl:border-gray-100 4xl:shadow-lg 4xl:border 4xl:border-gray-100">
          <NavButton />
          <div className="mb-4 p-4 ">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-4xl 2xl:text-4xl 3xl:text-4xl 4xl:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">¿Olvidaste tu contraseña? 🔑</h2>
              <p className="4xl:p-3 text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-xl 4xl:text-2xl text-gray-600 font-medium ">
              Lo tenemos cubierto. Ingresa tu correo electrónico registrado para restablecer tu contraseña. Te enviaremos un link donde podrás seguir los pasos.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="mb-4">
                  <InputField
                    name="email"
                    label="Email"
                    icon={emailIcon}
                    register={register}
                    placeholder="Correo electrónico"
                    validation={{
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Correo electrónico inválido",
                      },
                    }}
                   
                  />
                  {errors.email && (
                    <p
                      role="alert"
                      className="text-red-500 text-xs mt-1 animate-fade-in-down"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
            <button
              type="submit"
              disabled={loading || disabled}
              className={`block mx-auto w-full max-w-xl bg-brand mt-5  md:mt-10 md:ml-0 md:mr-0 md:max-w-4xl
              text-white py-3 xs:py-3.5 sm:py-4 md:py-4.5 lg:py-5 xl:py-2 2xl:py-3 3xl:py-3 4xl:py-3  rounded-full  
              text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-xl 2xl:text-2xl 3xl:text-2xl 4xl:text-2xl font-medium shadow-md 
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