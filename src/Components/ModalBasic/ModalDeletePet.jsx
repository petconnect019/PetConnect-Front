import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

export const ModalDeletePet = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    petName, 
    isLoading 
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Fondo borroso */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            
            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">
                        Eliminar Mascota
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        disabled={isLoading}
                    >
                        <AiOutlineClose className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
                            <MdDelete className="h-6 w-6 text-red-500" />
                        </div>
                        <p className="text-gray-700 mb-2">
                            ¿Eliminar a <span className="font-medium">{petName}</span>?
                        </p>
                        <p className="text-sm text-gray-500">
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EC9216] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}; 