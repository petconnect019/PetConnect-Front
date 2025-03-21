import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import { ProfileSection } from "../../Components/ProfileSection/ProfileSection";
import { PetsSection } from "../../Components/PetsSection/PetsSection";
import { FooterNav } from "../../Components/FooterNav/FooterNav";
import petImage from '../../assets/petImage.png'
import iconoHomeUno from '../../assets/iconoHomeUno.png'
import iconoHomeDos from '../../assets/iconoHomeDos.png'

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
    <div className="min-h-screen">
      <div className="flex flex-col bg-white p-8">
        {/* Header */}
        <header className="flex items-center justify-center bg-white my-8">
          <Link to={"/home"} className="text-3xl font-semibold">
            Pet Connect
          </Link>
        </header>

        {/* Profile Section */}
        <ProfileSection navigate={navigate} />

        {/* QR Section */}
        <section onClick={()=> navigate('/ecommerce')} className="relative flex bg-gradient-to-tr from-orange-900 via-brand to-orange-300 rounded-lg shadow-md overflow-hidden my-8 pb-2">
          <div className="z-10 w-3/4 p-6">
            <h2 className="text-xl text-white text-start font-semibold">
              ¿Aún no has adquirido nuestro QR?
            </h2>
            <p className="text-xs w-3/4 text-white text-start mt-2">
              No dejes su regreso al azar, consíguelo ahora
            </p>
          </div>
          <img src={petImage} alt="Pet-Image" className="absolute max-w-[185px] right-0 pt-2 pr-6" />
        </section>

        {/* Pets Section */}
        <PetsSection petList={petList} navigate={navigate}/>

        {/* Buttons Section */}
        <section className="flex justify-between mt-20">
          <button onClick={()=> navigate('/check-protection')} className="flex flex-col justify-between items-center p-3 bg-teal-50 w-9/20 h-30 rounded-lg text-sm hover:bg-blue-600 transition">
            <img src={iconoHomeUno} alt="Icono-Proteccion" className="w-17 rounded-full" />
            Revisar Protección
          </button>
          <button onClick={()=> navigate('/ecommerce')} className="flex flex-col justify-between items-center p-3 bg-teal-50 w-9/20 rounded-lg text-sm hover:bg-green-600 transition">
            <img src={iconoHomeDos} alt="Icono-Tienda" className="w-17 rounded-full" />
            Tienda
          </button>
        </section>

        {/* Footer Navigation */}
      </div>
        <FooterNav navigate={navigate} />
    </div>
  );
};

// bg-linear-to-r/srgb from-brand to-orange-200