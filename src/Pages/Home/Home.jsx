import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import { ProfileSection } from "../../Components/ProfileSection/ProfileSection";
import { PetsSection } from "../../Components/PetsSection/PetsSection";
import { FooterNav } from "../../Components/FooterNav/FooterNav";

export const Home = () => {
  const auth = useAuth();
  const petsValidation = useHasPetsUser();
  const petsUser = usePet();
  const navigate = useNavigate();

  if (!auth)
    return <div className="text-center text-gray-600">Cargando...</div>;

  const { logout } = auth ?? {};
  const { hasPetsUser } = petsValidation;
  const { petList } = petsUser;

  useFetchPets(hasPetsUser);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-center bg-white p-4 shadow-md">
        <Link to={"/home"} className="text-xl font-bold">
          Pet Connect
        </Link>
      </header>

      {/* Profile Section */}
      <ProfileSection navigate={navigate} />

      {/* QR Section */}
      <section onClick={()=> navigate('/ecommerce')} className="bg-white p-6 mx-4 rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold">
          ¿Aún no has adquirido nuestro QR?
        </h2>
        <p className="text-gray-600 mt-2">
          No dejes su regreso al azar, consíguelo ahora
        </p>
      </section>

      {/* Pets Section */}
      <PetsSection petList={petList} />

      {/* Buttons Section */}
      <section className="flex justify-center space-x-4 p-6">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
          Revisar Protección
        </button>
        <button onClick={()=> navigate('/ecommerce')} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
          Tienda
        </button>
        <button
          onClick={logout}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          LOG OUT
        </button>
      </section>

      {/* Footer Navigation */}
      <FooterNav navigate={navigate} petList={petList} />
    </div>
  );
};
