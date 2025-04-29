import React from 'react'

export const ModalSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Preparando pasarela de pago</h3>
        <p className="text-gray-600">Por favor espera mientras se carga la tienda de ePayco...</p>
      </div>
    </div>
  )
}
