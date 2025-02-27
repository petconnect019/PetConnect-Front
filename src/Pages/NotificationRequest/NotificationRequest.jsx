import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notifications from "../../assets/NotificacionesRequest.png";

export const NotificationRequest = () => {
  const navigate = useNavigate();
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Verifica si el usuario ya vio esta pantalla en esta sesión
    const hasSeenRequest = sessionStorage.getItem("hasSeenNotificationRequest");
    if (hasSeenRequest) {
      navigate("/welcome");
    }
  }, [navigate]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    // Guarda en sessionStorage que ya se pidió permiso en esta sesión
    sessionStorage.setItem("hasSeenNotificationRequest", "true");

    navigate("/welcome");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-4 relative overflow-hidden">
      <img src={Notifications} alt="ImgNotifications" className="mt-8 w-64" />

      <div className="p-6 text-center w-full flex flex-col items-center">
        <h2 className="text-xl font-bold">
          ¡Activa las notificaciones para mensajería instantánea!
        </h2>
        <p className="text-gray-600">
          Activa las notificaciones para recibir alertas sobre escaneos de etiquetas QR para mascotas, recordatorios de eventos y descuentos.
        </p>
      </div>

      <button
        onClick={requestPermission}
        className="mt-4 w-full max-w-[20rem] py-3 bg-orange-400 text-white font-semibold rounded-full shadow-md"
      >
        {permission === "granted" ? "Notificaciones activadas" : "Activar Notificaciones"}
      </button>
    </div>
  );
};
