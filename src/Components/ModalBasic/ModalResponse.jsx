import React from 'react';




export const ModalResponse = ({ path, setModalOpen,  textResponse, navigate,imgProfile }) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <img src={imgProfile} alt="Éxito" className="mx-auto object-cover mb-4 w-28 h-28 rounded-full" />
        <h2 className="text-2xl font-bold text-gray-800">¡Ya estás listo!</h2>
        <p className="text-gray-600">{textResponse}</p>
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