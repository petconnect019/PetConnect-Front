import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import { useFetchUserProfile } from "../../Hooks/useFetchUserProfile/useFetchUserProfile"; // Añadir esta importación
import { ProfileSection } from "../../Components/ProfileSection/ProfileSection";
import { PetsSection } from "../../Components/PetsSection/PetsSection";
import { VetDocumentsSection } from "../../Components/VetDocumentsSection/VetDocumentsSection";
import { FooterNav } from "../../Components/FooterNav/FooterNav";
import petImage from '../../assets/images/petImage.png'
import iconoHomeUno from '../../assets/images/iconoHomeUno.png'
import iconoHomeDos from '../../assets/images/iconoHomeDos.png'
import logo from '../../assets/images/LogoPetConnect.png'
import notification from '../../assets/images/Notifications.png'
import { useEffect } from "react"; // Añadir esta importación

export const Home = () => {
  const auth = useAuth();
  const petsValidation = useHasPetsUser();
  const petsUser = usePet();
  const navigate = useNavigate();
  const { fetchUserProfile } = useFetchUserProfile(); // Usar el hook para cargar los datos del usuario

  if (!auth)
    return <div className="text-center text-gray-600">Cargando...</div>;

  const { isAuthenticated } = auth; // Añadir esta línea
  const { hasPetsUser } = petsValidation;
  const { petList } = petsUser;

  // Asegurarnos de cargar los datos del usuario cuando el componente se monta
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  useFetchPets(hasPetsUser);

  return (
    <div >
      <div className="flex flex-col bg-white p-4 sm:p-5 md:p-6 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between bg-white py-3 sm:py-4">
          <img src={logo} alt="Logo" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14" />
          <Link to={"/home"} className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-bold">
            Pet Connect
          </Link>
          <button 
            className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200" 
            onClick={() => navigate('/notifications')}
          >
            <img 
              className='w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14' 
              src={notification} 
              alt="Notification"
            />
          </button>
        </header>

        {/* Profile Section */}
        <ProfileSection navigate={navigate} />

        {/* QR Section */}
        <section 
          onClick={() => navigate('/ecommerce')} 
          className="relative flex bg-gradient-to-tr from-orange-900 via-brand to-orange-300 rounded-xl shadow-lg overflow-hidden my-4 sm:my-5 md:my-6 cursor-pointer hover:shadow-xl transition-all duration-300 h-[150px] sm:h-[160px] md:h-[180px]"
        >
          <div className="z-10 w-3/4 p-4 sm:p-5 md:p-6">
            <h2 className="text-lg sm:text-xl text-white font-semibold">
              ¿Aún no has adquirido nuestro QR?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-2">
              No dejes su regreso al azar, consíguelo ahora
            </p>
          </div>
          <img 
            src={petImage} 
            alt="Pet-Image" 
            className="absolute max-w-[180px] sm:max-w-[190px] md:max-w-[200px] h-full object-contain right-0 bottom-0 transform hover:scale-105 transition-transform duration-300" 
          />
        </section>

        {/* Pets Section */}
        <PetsSection petList={petList} navigate={navigate}/>

        {/* Vet Documents Section */}
        <VetDocumentsSection petList={petList} navigate={navigate}/>

        {/* Buttons Section */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 mt-12 sm:mt-14 md:mt-16 mb-16 sm:mb-20 md:mb-24">
          <button 
            onClick={() => navigate('/check-protection')} 
            className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-teal-50 rounded-xl text-xs sm:text-sm hover:bg-blue-50 transition-all duration-300 hover:shadow-md"
          >
            <img 
              src={iconoHomeUno} 
              alt="Icono-Proteccion" 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full mb-1 sm:mb-2" 
            />
            <span className="font-medium text-gray-700">Revisar Protección</span>
          </button>
          
          <button 
            onClick={() => navigate('/ecommerce')} 
            className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-teal-50 rounded-xl text-xs sm:text-sm hover:bg-green-50 transition-all duration-300 hover:shadow-md"
          >
            <img 
              src={iconoHomeDos} 
              alt="Icono-Tienda" 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full mb-1 sm:mb-2" 
            />
            <span className="font-medium text-gray-700">Tienda</span>
          </button>
        </section>
      </div>
      
      <FooterNav navigate={navigate} />
    </div>
  );
};