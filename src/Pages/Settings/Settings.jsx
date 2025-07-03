import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { usePet } from '../../Contexts/PetContext/PetContext';
import { useIsFetchedPets } from '../../Contexts/IsFetchedPets/IsFetchedPets';
import { ModalLogout } from '../../Components/ModalBasic/ModalLogout';

export const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setPetList } = usePet();
  const { changeIsFetched } = useIsFetchedPets();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      setPetList([]);
      changeIsFetched(false);
      await logout();
      console.log('Cerrando sesión...');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  const handleProfile = () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      const userId = storedUserData._id || (storedUserData._doc && storedUserData._doc._id);
      if (userId) {
        console.log("Navegando a perfil con ID:", userId);
        navigate(`/user-profile-config/${userId}`);
      } else {
        console.error("No se encontró el ID del usuario en los datos almacenados");
      }
    } else {
      console.error("No se encontraron datos del usuario");
    }
  };

  const handleMyPets = () => {
    navigate('/my-pets');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleSupport = () => {
    navigate('/support');
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Ajustes</h1>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Section */}
        <div className="flex items-center p-4 rounded-lg bg-white shadow mb-8">
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h2 className="text-base font-semibold text-gray-800">Nombre del Usuario</h2>
            <p className="text-sm text-gray-500">usuario@example.com</p>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            <li onClick={handleProfile} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-blue-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Perfil</h3>
            </li>

            <li onClick={handleChangePassword} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-green-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Cambiar contraseña</h3>
            </li>

            <li onClick={handleMyPets} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-purple-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Mascotas</h3>
            </li>

            <li onClick={handleSupport} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-yellow-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Soporte</h3>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <button
            onClick={handleOpenModal}
            className="w-full flex items-center justify-center py-3 px-4 text-base font-medium rounded-lg text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 mr-2 xs:mr-2.5 sm:mr-3 md:mr-3.5 lg:mr-4 xl:mr-4.5 2xl:mr-5 3xl:mr-5.5 4xl:mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl font-semibold">Cerrar sesión</span>
          </button>
        </div>
      </div>

      <FooterNav navigate={navigate} />
      <ModalLogout 
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};