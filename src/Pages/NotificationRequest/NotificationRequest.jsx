import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notifications from "../../assets/images/NotificacionesRequest.png";

export const NotificationRequest = () => {
  const navigate = useNavigate();
  const [permission, setPermission] = useState("default");
  const [isSupported, setIsSupported] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Verificar si ya se ha tomado una decisión sobre las notificaciones
    const notificationDecision = localStorage.getItem("notificationDecision");
    
    if (notificationDecision) {
      // Si ya se tomó una decisión, redirigir directamente a welcome
      navigate("/welcome");
      return;
    }

    // Verificar si el navegador soporta notificaciones
    const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window;
    setIsSupported(notificationsSupported);
    
    // Si las notificaciones son soportadas, obtener el permiso actual
    if (notificationsSupported) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      
      // Si ya hay un permiso diferente a default, guardar decisión y redirigir
      if (currentPermission !== "default") {
        localStorage.setItem("notificationDecision", currentPermission);
        navigate("/welcome");
      }
    } else {
      setMessage("Tu dispositivo no soporta notificaciones web, pero podrás usar la app normalmente.");
    }
  }, [navigate]);

  const requestPermission = async () => {
    // Si el navegador no soporta notificaciones o ya tenemos permiso, solo continuamos
    if (!isSupported || permission === "granted" || permission === "denied") {
      localStorage.setItem("notificationDecision", permission || "unsupported");
      navigate("/welcome");
      return;
    }

    // Para navegadores que soportan notificaciones pero no tienen permiso concedido todavía
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      // Guardar la decisión del usuario
      localStorage.setItem("notificationDecision", result);
      
      if (result === "granted") {
        setMessage("¡Notificaciones activadas con éxito!");
        
        // Intentar mostrar una notificación de prueba si es posible
        if ("serviceWorker" in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
              registration.showNotification("¡Notificaciones activadas!", {
                body: "Ahora recibirás alertas importantes en tu dispositivo.",
                icon: "/icon-192x192.png",
              });
            }
          } catch (err) {
            console.error("Error con el Service Worker:", err);
          }
        }
      } else if (result === "denied") {
        setMessage("Has bloqueado las notificaciones. Puedes activarlas en la configuración de tu navegador.");
      }
      
      // Esperamos un poco para que el usuario vea el mensaje antes de redirigir
      setTimeout(() => {
        navigate("/welcome");
      }, 1500);
    } catch (error) {
      console.error("Error al solicitar permisos de notificación:", error);
      // Guardar que hubo un error, para no volver a preguntar
      localStorage.setItem("notificationDecision", "error");
      navigate("/welcome");
    }
  };

  const handleSkip = () => {
    // Guardar la decisión de omitir
    localStorage.setItem("notificationDecision", "skipped");
    navigate("/welcome");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <img src={Notifications} alt="ImgNotifications" className="mt-8 w-64" />

        <div className="p-6 text-center w-full flex flex-col items-center">
          <h2 className="text-xl font-bold">
            ¡Activa las notificaciones para mensajería instantánea!
          </h2>
          <p className="text-gray-600 mt-2">
            Activa las notificaciones para recibir alertas sobre escaneos de etiquetas QR para mascotas, recordatorios de eventos y descuentos.
          </p>
          
          {message && (
            <p className={`mt-3 text-sm font-medium ${
              message.includes("bloqueado") ? "text-yellow-600" : 
              message.includes("no soporta") ? "text-blue-600" : "text-green-600"
            }`}>
              {message}
            </p>
          )}
        </div>

        <div className="flex flex-col w-full gap-3 max-w-[20rem]">
          <button
            onClick={requestPermission}
            className={`w-full py-3 font-semibold rounded-full shadow-md
              ${!isSupported || permission === "denied"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : permission === "granted"
                  ? "bg-green-500 text-white"
                  : "bg-orange-400 text-white hover:bg-orange-500"
              }`}
            disabled={!isSupported || permission === "denied"}
          >
            {permission === "granted" 
              ? "Notificaciones activadas" 
              : "Activar notificaciones"}
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 font-medium"
          >
            {!isSupported || permission === "denied" ? "Continuar sin notificaciones" : "Omitir este paso"}
          </button>
        </div>
      </div>
    </div>
  );
};
