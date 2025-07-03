import { AiFillHome, AiFillMessage, AiFillSetting, AiOutlineHome, AiOutlineMessage, AiOutlineSetting } from "react-icons/ai";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { useNotifications } from "../../Contexts/NotificationContext/NotificationContext";
import User from '../../assets/images/DefaultProfile.png'
import QR from '../../assets/images/QR.png'
import Location from '../../assets/images/Location.png'
import { useAuth } from "../../Contexts/AuthContext/AuthContext";

export const FooterNav = ({ navigate }) => {
    const { pathname } = useLocation();
    const { unreadCount } = useNotifications();
    const { user } = useAuth();

    // Lógica de estado activo simplificada
    const isActive = (path) => pathname === path;
    const isMessagesActive = pathname === '/messages' || pathname.startsWith('/chat');

    return (
        <footer className="bg-white flex justify-around fixed bottom-0 left-0 right-0 py-3 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
            {/* Botón de Servicios */}
            <button
                onClick={() => navigate("/nearby-services")}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    isActive("/nearby-services") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src={Location} alt='Servicios Cercanos' className='max-w-full max-h-full' />
                </div>
                <span className="text-xs">Servicios</span>
            </button>
            
            {/* Botón de Mensajes */}
            <button 
                onClick={() => navigate("/messages")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isMessagesActive ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isMessagesActive ? <AiFillMessage className="text-2xl" /> : <AiOutlineMessage className="text-2xl" />}
                <span className="text-xs">Mensajes</span>
            </button>
            
            {/* Botón de Inicio (Posición Central) */}
            <button 
                onClick={() => navigate("/home")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/home") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/home") ? <AiFillHome className="text-2xl" /> : <AiOutlineHome className="text-2xl" />}
                <span className="text-xs">Inicio</span>
            </button>

            {/* Botón de Alertas */}
            <button 
                onClick={() => navigate("/notifications")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                    isActive("/notifications") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/notifications") ? <IoNotifications className="text-2xl" /> : <IoNotificationsOutline className="text-2xl" />}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                <span className="text-xs">Alertas</span>
            </button>
            
            {/* Botón de Ajustes */}
            <button 
                onClick={() => navigate("/settings")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/settings") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/settings") ? <AiFillSetting className="text-2xl" /> : <AiOutlineSetting className="text-2xl" />}
                <span className="text-xs">Ajustes</span>
            </button>
        </footer>
    );
};