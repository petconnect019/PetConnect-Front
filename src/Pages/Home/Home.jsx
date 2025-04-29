import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import { ProfileSection } from "../../Components/ProfileSection/ProfileSection";
import { PetsSection } from "../../Components/PetsSection/PetsSection";
import { FooterNav } from "../../Components/FooterNav/FooterNav";
import petImage from '../../assets/images/petImage.png'
import iconoHomeUno from '../../assets/images/iconoHomeUno.png'
import iconoHomeDos from '../../assets/images/iconoHomeDos.png'
import logo from '../../assets/images/LogoPetConnect.png'
import notification from '../../assets/images/Notifications.png'

export const Home = () => {
  const auth = useAuth();
  const petsValidation = useHasPetsUser();
  const petsUser = usePet();
  const navigate = useNavigate();

  if (!auth)
    return <div className="text-center text-gray-600">Cargando...</div>;

  const { hasPetsUser } = petsValidation;
  const { petList } = petsUser;

  useFetchPets(hasPetsUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col bg-white p-6 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between bg-white py-4">
          <img src={logo} alt="Logo" className="w-7 h-7" />
          <Link to={"/home"} className="text-2xl font-bold">
            Pet Connect
          </Link>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200" 
            onClick={() => navigate('/notifications')}
          >
            <img className='w-10 h-10' src={notification} alt="Notification"/>
          </button>
        </header>

        {/* Profile Section */}
        <ProfileSection navigate={navigate} />

        {/* QR Section */}
        <section 
          onClick={() => navigate('/ecommerce')} 
          className="relative flex bg-gradient-to-tr from-orange-900 via-brand to-orange-300 rounded-xl shadow-lg overflow-hidden my-6 cursor-pointer hover:shadow-xl transition-all duration-300 h-[180px]"
        >
          <div className="z-10 w-3/4 p-6">
            <h2 className="text-xl text-white font-semibold">
              ¿Aún no has adquirido nuestro QR?
            </h2>
            <p className="text-sm text-white/90 mt-2">
              No dejes su regreso al azar, consíguelo ahora
            </p>
          </div>
          <img 
            src={petImage} 
            alt="Pet-Image" 
            className="absolute max-w-[200px] h-full object-contain right-0 bottom-0 transform hover:scale-105 transition-transform duration-300" 
          />
        </section>

        {/* Pets Section */}
        <PetsSection petList={petList} navigate={navigate}/>

        {/* Buttons Section */}
        <section className="flex justify-between gap-4 mt-8 mb-4">
          <button 
            onClick={() => navigate('/check-protection')} 
            className="flex flex-col items-center p-4 bg-teal-50 w-1/2 rounded-xl text-sm hover:bg-blue-50 transition-all duration-300 hover:shadow-md"
          >
            <img 
              src={iconoHomeUno} 
              alt="Icono-Proteccion" 
              className="w-16 h-16 object-cover rounded-full mb-2" 
            />
            <span className="font-medium text-gray-700">Revisar Protección</span>
          </button>
          
          <button 
            onClick={() => navigate('/ecommerce')} 
            className="flex flex-col items-center p-4 bg-teal-50 w-1/2 rounded-xl text-sm hover:bg-green-50 transition-all duration-300 hover:shadow-md"
          >
            <img 
              src={iconoHomeDos} 
              alt="Icono-Tienda" 
              className="w-16 h-16 object-cover rounded-full mb-2" 
            />
            <span className="font-medium text-gray-700">Tienda</span>
          </button>
        </section>
      </div>
      
      <FooterNav navigate={navigate} />
    </div>
  );
};

// bg-linear-to-r/srgb from-brand to-orange-200