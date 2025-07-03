import React from 'react';
import { ButtonSecondary } from '../Buttons/ButtonSecondary';

export const ModalResponse = ({ path, setModalOpen,  textResponse, navigate,imgProfile }) => {

  return (
    <div className="fixed inset-0 flex items-center w-full justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <img src={imgProfile} alt="Éxito" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <h2 className="text-xl font-semibold mb-4">{textResponse}</h2>
        <button
          onClick={() => {
            setModalOpen(false);
            navigate(path);
          }}
          className="mt-4 w-full bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all"
        >
          Ir a la página de inicio
        </button>
      </div>
    </div>
  );
};