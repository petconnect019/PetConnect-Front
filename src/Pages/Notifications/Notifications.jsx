import React from 'react';
import { IoChevronForward, IoCheckmarkCircleOutline, IoLockClosedOutline, IoStarOutline, IoAlertCircleOutline, IoCloudDownloadOutline, IoSettingsOutline } from 'react-icons/io5';

export const Notifications = () => {
    return (
        <div className="font-sans bg-gray-100 min-h-screen p-5 box-border">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-2.5">
                <IoChevronForward className="text-2xl text-gray-700 transform rotate-180" />
                <h1 className="text-2xl font-bold text-gray-800 m-0">Notificaciones</h1>
                <IoSettingsOutline className="text-2xl text-gray-700" /> {/* Changed to settings icon */}
            </div>

            {/* Today's Notifications */}
            <div className="mb-8">
                <h2 className="text-base font-bold text-gray-600 mb-4 uppercase">Hoy</h2>

                {/* Security Alert Notification */}
                <div className="flex items-start bg-white rounded-lg p-4 mb-2 shadow-sm">
                    <div className="w-10 h-10 rounded-full flex justify-center items-center mr-4 flex-shrink-0 bg-blue-50">
                        <IoCheckmarkCircleOutline className="text-xl text-blue-500" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-base font-semibold text-gray-800 m-0 flex items-center gap-1">
                                Alerta de seguridad de cuenta <IoLockClosedOutline size={14} />
                            </p>
                            <div className="w-2 h-2 rounded-full bg-orange-500 ml-auto mr-2.5"></div>
                            <IoChevronForward className="text-lg text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 leading-tight mb-1">
                            Hemos notado alguna actividad inusual en su cuenta. Revise sus inicios de sesión recientes y actualice
                            su contraseña si es necesario.
                        </p>
                        <p className="text-xs text-gray-500 text-right">09:41 AM</p>
                    </div>
                </div>

                {/* System Update Notification */}
                <div className="flex items-start bg-white rounded-lg p-4 mb-2 shadow-sm">
                    <div className="w-10 h-10 rounded-full flex justify-center items-center mr-4 flex-shrink-0 bg-blue-50">
                        <IoAlertCircleOutline className="text-xl text-blue-500" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-base font-semibold text-gray-800 m-0 flex items-center gap-1">
                                Actualización del sistema disponible <IoCloudDownloadOutline size={14} />
                            </p>
                            <div className="w-2 h-2 rounded-full bg-orange-500 ml-auto mr-2.5"></div>
                            <IoChevronForward className="text-lg text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 leading-tight mb-1">
                            Una nueva actualización del sistema está lista para su instalación. Incluye
                            mejoras de rendimiento y corrección de errores.
                        </p>
                        <p className="text-xs text-gray-500 text-right">08:46 AM</p>
                    </div>
                </div>
            </div>

            {/* Yesterday's Notifications */}
            <div className="mb-8">
                <h2 className="text-base font-bold text-gray-600 mb-4 uppercase">Ayer</h2>

                {/* Password Reset Notification */}
                <div className="flex items-start bg-white rounded-lg p-4 mb-2 shadow-sm">
                    <div className="w-10 h-10 rounded-full flex justify-center items-center mr-4 flex-shrink-0 bg-red-50">
                        <IoLockClosedOutline className="text-xl text-red-500" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-base font-semibold text-gray-800 m-0 flex items-center gap-1">
                                Restablecimiento de contraseña exitoso <IoCheckmarkCircleOutline className="text-green-500" size={14} />
                            </p>
                            <IoChevronForward className="text-lg text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 leading-tight mb-1">
                            Su contraseña se ha restablecido correctamente. Si no solicitó este cambio,
                            comuníquese con el soporte de inmediato.
                        </p>
                        <p className="text-xs text-gray-500 text-right">20:30 PM</p>
                    </div>
                </div>

                {/* New Feature Notification */}
                <div className="flex items-start bg-white rounded-lg p-4 mb-2 shadow-sm">
                    <div className="w-10 h-10 rounded-full flex justify-center items-center mr-4 flex-shrink-0 bg-yellow-50">
                        <IoStarOutline className="text-xl text-yellow-500" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-base font-semibold text-gray-800 m-0 flex items-center gap-1">
                                Nueva característica emocionante <span className="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded">NEW</span>
                            </p>
                            <IoChevronForward className="text-lg text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 leading-tight">
                            Acabamos de lanzar una nueva función que mejorará su experiencia de usuario.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};