import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { GoogleSignUp } from "../../Components/GoogleAuth/GoogleSignUp";
import { Link } from "react-router-dom";
import { registerSchema } from "../../Validations/validationSchema";
import { fetchRegister } from "../../Utils/Fetch/FetchRegister/FetchRegister";
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";

export const Register = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const pets = useHasPetsUser();

  // Verificamos si el contexto de autenticación y el de mascotas está disponible antes de usarlo
  if (!auth) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  const { login } = auth ?? {};
  const { changeHasPetsUser } = pets; 


  // Esquema de validación con Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  // Función que se ejecuta al enviar el formulario 
  const onSubmit = async (userData) => {
    try {
      const response = await fetchRegister(userData);
      if (!response.ok) {
        throw new Error(response.message || "Error al registrarse");
      }
      login(response.accessToken);
      if (response.hasPets) {
        changeHasPetsUser(true);
      }
      if (response.isNewUser) {
        navigate('/step-user');
        
      } else {
        navigate('/home');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-white">
      {/* <button
      className="mb-6" onClick={() => navigate(-1)}>
      </button> // Boton para ir atras falta configurar */}

      <h2 className="text-3xl font-bold">Únete a PetConnect <span className="inline-block">🐾</span></h2>
      <p className="text-gray-500">Un mundo de posibilidades peludas te esperan.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
            <input
              type="email"
              {...register("email")}
              className="ml-2 flex-1 bg-transparent outline-none"
              placeholder="Email"
            />
          </div>
          {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block font-medium">Contraseña</label>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
            <input
              type="password"
              {...register("password")}
              className="ml-2 flex-1 bg-transparent outline-none"
              placeholder="Contraseña"
            />
          </div>
          {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" className="w-5 h-5 text-orange-500 border-2 rounded-md focus:ring-orange-500" />
          <span className="text-sm">
            Aceptar Términos <span className="text-brand">& Condiciones de PetConnect.</span>
          </span>
        </div>

        <p className="text-center text-sm">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-brand font-medium">Iniciar Sesión</Link>
        </p>

        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-500">o</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <GoogleSignUp navigate={navigate} content={"Continuar con Google"} className="border rounded-lg py-2 flex justify-center items-center shadow-md" />
        
        <button type="submit" className="w-full bg-brand text-white py-3 rounded-full text-lg font-medium shadow-md hover:bg-orange-600 transition">
          Crear Cuenta
        </button>
      </form>
    </div>
  );
};
