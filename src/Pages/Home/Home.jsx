import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Home = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    // Verificamos si el contexto de autenticación está disponible antes de desestructurar
    if (!auth) return <div className="text-center text-gray-600">Cargando...</div>;

    const { logout } = auth;

    const handleLogout = () => {
      logout();
    };

    const handleMessages = () => {
      navigate("/messages");
    }

    const handleSettings = () => {
      navigate("/settings");
    }

    const handleEcommerce = () => {
      navigate("/ecommerce");
    }

    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="flex items-center justify-center bg-white p-4 shadow-md">
          <Link to={'/user-profile-config'} className="text-xl font-bold">Pet Connect</Link>
        </header>
  
        {/* Profile Section */}
        <section onClick={handleEcommerce} className="flex flex-col items-center p-6">
          <img src="/profile.jpg" alt="Profile" className="w-16 h-16 rounded-full border-2 border-gray-300" />
          <h2 className="mt-2 text-lg font-semibold">Andrew Ainsley</h2>
          <p className="text-gray-500 text-sm">Dueño</p>
        </section>
  
        {/* QR Section */}
        <section className="bg-white p-6 mx-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold">¿Aún no has adquirido nuestro QR?</h2>
          <p className="text-gray-600 mt-2">No dejes su regreso al azar, consíguelo ahora</p>
        </section>
  
        {/* Pets Section */}
        <section className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Mis Mascotas</h2>
            <Link to={'my-pets'} className="text-blue-500 font-medium hover:underline">Ver todas</Link>
          </div>
          <div className="flex space-x-4">
            <img src="/pet1.jpg" alt="Pet" className="w-14 h-14 rounded-full border-2 border-gray-300" />
            <img src="/pet2.jpg" alt="Pet" className="w-14 h-14 rounded-full border-2 border-gray-300" />
            <button className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-2xl font-bold">+</button>
          </div>
        </section>
  
        {/* Buttons Section */}
        <section className="flex justify-center space-x-4 p-6">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">Revisar Protección</button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">Tienda</button>
          <button onClick={handleLogout} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">LOG OUT</button>
        </section>
  
        {/* Footer Navigation */}
        <footer className="fixed bottom-0 w-full bg-white p-4 flex justify-around shadow-md border-t">
          <button className="text-blue-500 flex flex-col items-center">
            🏠<span className="text-xs">Home</span>
          </button>
          <button onClick={handleMessages} className="text-gray-500 flex flex-col items-center hover:text-blue-500">
            💬<span className="text-xs">Mensajes</span>
          </button>
          <button onClick={handleSettings} className="text-gray-500 flex flex-col items-center hover:text-blue-500">
            ⚙️<span className="text-xs">Configuración</span>
          </button>
        </footer>
      </div>
    );
};
