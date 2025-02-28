import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notifications from "../../assets/NotificacionesRequest.png";

export const NotificationRequest = () => {
  const navigate = useNavigate();
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Verifica el permiso actual antes de redirigir
    if (Notification.permission !== "default") {
      navigate("/welcome");
    }
  }, [navigate]); // Solo dependemos de navigate para evitar redirecciones prematuras

  const requestPermission = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Tu navegador no soporta notificaciones o Service Workers.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        const registration = await navigator.serviceWorker.ready;

        if (!registration) {
          console.error("No se encontró un Service Worker registrado.");
          return;
        }

        registration.showNotification("¡Notificaciones activadas!", {
          body: "Ahora recibirás alertas importantes en tu dispositivo.",
          icon: "/icon-192x192.png",
        });
      }
    } catch (error) {
      console.error("Error al solicitar permisos de notificación:", error);
    }
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
