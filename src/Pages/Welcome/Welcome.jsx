import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Verificar si hay un token en la URL
        const params = new URLSearchParams(location.search);
        const urlToken = params.get('token');

        // Usar el token de la URL o del localStorage
        const token = urlToken || localStorage.getItem('accessToken');

        if (!token) {
          navigate('/login');
          return;
        }

        // Si hay un token en la URL, guardarlo en localStorage
        if (urlToken) {
          localStorage.setItem('accessToken', urlToken);
          // Limpiar la URL
          window.history.replaceState({}, document.title, '/welcome');
        }

        // Validar el token
        const response = await fetch('http://localhost:5000/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.decoded);
        } else {
          throw new Error('Token inválido');
        }
      } catch (error) {
        console.error('Error de autenticación:', error);
        localStorage.removeItem('accessToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [location, navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">¡Bienvenido a PetConnect!</h1>
        {userData && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">Sesión iniciada como:</p>
              <p className="font-semibold text-blue-600">{userData.email}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">
                Rol: <span className="font-medium">{userData.role}</span>
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};