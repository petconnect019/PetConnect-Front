import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { ModalLogout } from '../../Components/ModalBasic/ModalLogout';

export const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Cerrando sesión...');
        navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  const handleProfile = () => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    console.log("Datos del usuario en Settings:", userData);
    if (userData && userData._id) {
      console.log("Navegando a perfil con ID:", userData.id);
      navigate(`/user-profile-config/${userData._id}`);
    } else {
      console.error("No se encontró el ID del usuario en Settings");
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 w-screen max-w-[375px] xs:max-w-[576px] sm:max-w-[768px] md:max-w-[992px] lg:max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1680px] 3xl:max-w-[1920px] mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 3xl:px-16 4xl:px-18">   
        <div className="xs:p-1 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 3xl:p-16 4xl:p-18">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-10xl font-bold text-center text-gray-800 mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18 3xl:mb-20 4xl:mb-22">
            Configuración
          </h1>
          
          <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 2xl:space-y-14 3xl:space-y-16 4xl:space-y-18">
            <div onClick={handleProfile} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-blue-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Perfil</h3>
            </div>

            <div onClick={handleChangePassword} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-green-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Cambiar contraseña</h3>
            </div>

            <div onClick={handleMyPets} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-purple-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Mascotas</h3>
            </div>

            <div onClick={handleSupport} className="flex items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 3xl:p-10 4xl:p-11 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 3xl:w-13 3xl:h-13 4xl:w-14 4xl:h-14 bg-yellow-100 rounded-full flex items-center justify-center mr-3 xs:mr-4 sm:mr-5 md:mr-6 lg:mr-7 xl:mr-8 2xl:mr-9 3xl:mr-10 4xl:mr-11">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-semibold text-gray-800">Soporte</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cerrar sesión fijo al fondo */}
      <div className="w-screen max-w-[375px] xs:max-w-[576px] sm:max-w-[768px] md:max-w-[992px] lg:max-w-[1200px] xl:max-w-[1440px] 2xl:max-w-[1680px] 3xl:max-w-[1920px] mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 3xl:px-16 4xl:px-18 mt-auto mb-20">
        <button 
          onClick={handleOpenModal}
          className="w-full bg-brand text-white px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 xl:px-9 2xl:px-10 3xl:px-11 4xl:px-12 py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 xl:py-4.5 2xl:py-5 3xl:py-5.5 4xl:py-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12 mr-2 xs:mr-2.5 sm:mr-3 md:mr-3.5 lg:mr-4 xl:mr-4.5 2xl:mr-5 3xl:mr-5.5 4xl:mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl font-semibold">Cerrar sesión</span>
        </button>
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