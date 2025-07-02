import { AiFillHome, AiFillMessage, AiFillSetting, AiOutlineHome, AiOutlineMessage, AiOutlineSetting } from "react-icons/ai";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { useNotifications } from "../../Contexts/NotificationContext/NotificationContext";

export const FooterNav = ({ navigate }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { unreadCount } = useNotifications();

    console.log("FooterNav - currentPath:", currentPath);

    const isActive = (path) => {
        let result = false;
        if (path === "/home") {
            result = currentPath === "/home";
        } else if (path === "/messages") {
            // Activar para /messages y /chat (con o sin parámetros)
            result = currentPath === "/messages" || currentPath.startsWith("/chat");
        } else if (path === "/notifications") {
            result = currentPath === "/notifications";
        } else if (path === "/settings") {
            result = currentPath === "/settings";
        }
        
        console.log(`FooterNav - isActive("${path}"):`, result);
        return result;
    };

    return (
        <footer className="bg-white flex justify-around fixed bottom-0 w-full py-3 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
            <button 
                onClick={() => navigate("/home")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/home") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/home") ? (
                    <AiFillHome className="text-2xl" />
                ) : (
                    <AiOutlineHome className="text-2xl" />
                )}
                <span className="text-xs">Inicio</span>
            </button>
            
            <button 
                onClick={() => navigate("/messages")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/messages") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/messages") ? (
                    <AiFillMessage className="text-2xl" />
                ) : (
                    <AiOutlineMessage className="text-2xl" />
                )}
                <span className="text-xs">Mensajes</span>
            </button>

            <button 
                onClick={() => navigate("/notifications")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                    isActive("/notifications") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/notifications") ? (
                    <IoNotifications className="text-2xl" />
                ) : (
                    <IoNotificationsOutline className="text-2xl" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                <span className="text-xs">Alertas</span>
            </button>
            
            <button 
                onClick={() => navigate("/settings")}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive("/settings") ? "text-brand" : "text-gray-400 hover:text-brand"
                }`}
            >
                {isActive("/settings") ? (
                    <AiFillSetting className="text-2xl" />
                ) : (
                    <AiOutlineSetting className="text-2xl" />
                )}
                <span className="text-xs">Ajustes</span>
            </button>
        </footer>
    );
};