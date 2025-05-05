import React from 'react'
import DogImage from '../../assets/images/DogByeSeeyou .png'

export const ModalLogout = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg  text-center">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-2">¿Estás seguro que deseas cerrar sesión?</h3>
        <img 
          src={DogImage} 
          alt="Dog" 
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 mx-auto rounded-full mb-4" 
        />
        <div className="flex justify-center space-x-3 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl bg-brand text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
