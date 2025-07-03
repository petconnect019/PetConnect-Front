import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCheck, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';
import petLogo from '../../assets/images/PetConnect Logo.png'; // Usar el logo existente
import config from '../../Utils/config';

export const QRScanLanding = () => {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [scanSuccess, setScanSuccess] = useState(false);
  const [errorType, setErrorType] = useState(null);

  useEffect(() => {
    // Simular progreso automático para la animación de entrada
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleGetLocation = () => {
    setLocationStatus('requesting');
    setError(null);
    setErrorType(null);
    
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización. Por favor, intenta con otro navegador.');
      setErrorType('geo');
      setLocationStatus('error');
      return;
    }

    // Validar que el qrId esté presente y sea aparentemente válido
    if (!qrId || qrId === 'undefined') {
      setError('Este QR es inválido o fue generado con una versión antigua.');
      setErrorType('invalid_qr');
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLocationStatus('obtained');
          setIsLoading(true);
          
          const response = await fetch(`${config.api}/api/qr/manual-scan/${qrId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              scanType: 'qr_scan'
            })
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Error al registrar el escaneo');
          }

          // Mostrar mensaje de éxito
          setScanSuccess(true);
          
          // Esperar un momento para mostrar la confirmación
          setTimeout(() => {
            navigate(`/public-pet-profile/${qrId}`);
          }, 2000);
        } catch (err) {
          console.error('Error al enviar la ubicación:', err);
          setError(err.message || 'Error al registrar el escaneo. Por favor, intenta nuevamente.');
          setErrorType('backend');
          setLocationStatus('error');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Error al obtener la ubicación:', err);
        let errorMessage;
        switch (err.code) {
          case 1:
            errorMessage = 'Has denegado el permiso de ubicación. No podremos avisar al dueño dónde has visto a su mascota. Si deseas ayudar, por favor habilita el permiso de ubicación en tu navegador y vuelve a intentarlo.';
            break;
          case 2:
            errorMessage = 'No se pudo obtener tu ubicación. Verifica tu conexión a internet y que los servicios de ubicación estén activados.';
            break;
          case 3:
            errorMessage = 'Se agotó el tiempo para obtener tu ubicación. Por favor, intenta nuevamente.';
            break;
          default:
            errorMessage = 'Error al obtener tu ubicación. Por favor, intenta nuevamente.';
        }
        setError(errorMessage);
        setErrorType('geo');
        setLocationStatus('error');
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  const handleSkip = () => {
    // Redirigir al perfil de la mascota sin enviar ubicación
    navigate(`/public-pet-profile/${qrId}`);
  };

  const handleTryAgain = () => {
    setError(null);
    setErrorType(null);
    setLocationStatus('idle');
    setScanSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col justify-center items-center px-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <motion.img 
              src={petLogo} 
              alt="PetConnect Logo" 
              className="w-32 h-32 mx-auto mb-6"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            />
            <motion.h1 
              className="text-3xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              ¡Bienvenido a PetConnect!
            </motion.h1>
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-gray-600 mb-4">Estamos cargando la información de la mascota...</p>
              <div className="flex justify-center">
                <ImSpinner2 className="animate-spin text-orange-500 text-4xl" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="location-request"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
          >
            <div className="text-center mb-6">
              <motion.div 
                className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              >
                <FiMapPin className="text-3xl text-orange-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Has encontrado una mascota!</h2>
              <p className="text-gray-600 mb-4">
                Ayuda al dueño a saber dónde has visto a su mascota compartiendo tu ubicación.
              </p>
            </div>

            {locationStatus === 'idle' && (
              <div className="space-y-4">
                <motion.button 
                  onClick={handleGetLocation}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiMapPin className="mr-2" /> Compartir mi ubicación
                </motion.button>
                
                <button 
                  onClick={handleSkip}
                  className="w-full py-3 px-4 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  Continuar sin compartir
                </button>
                
                <div className="text-center text-sm text-gray-500 mt-6">
                  <p>Tu ubicación solo se usará para notificar al dueño dónde se ha visto a su mascota.</p>
                  <p className="mt-1">No almacenamos tu información personal.</p>
                </div>
              </div>
            )}

            {locationStatus === 'requesting' && (
              <div className="text-center py-4">
                <ImSpinner2 className="animate-spin text-orange-500 text-4xl mx-auto mb-4" />
                <p className="text-gray-600">Solicitando acceso a tu ubicación...</p>
                <p className="text-sm text-gray-500 mt-2">Por favor, acepta el permiso en tu navegador</p>
              </div>
            )}

            {locationStatus === 'obtained' && !scanSuccess && (
              <div className="text-center py-4">
                <ImSpinner2 className="animate-spin text-orange-500 text-4xl mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">Ubicación obtenida</p>
                <p className="text-gray-600">Registrando el escaneo...</p>
              </div>
            )}

            {scanSuccess && (
              <div className="text-center py-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiCheck className="text-3xl text-green-500" />
                </motion.div>
                <p className="text-gray-700 font-medium mb-2">¡Ubicación compartida con éxito!</p>
                <p className="text-gray-600 mb-4">El dueño será notificado sobre el escaneo.</p>
                <p className="text-sm text-gray-500">Redirigiendo al perfil de la mascota...</p>
              </div>
            )}

            {locationStatus === 'error' && (
              <div className="text-center py-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiAlertCircle className="text-3xl text-red-500" />
                </motion.div>
                <p className="text-red-600 font-medium mb-2">
                  {errorType === 'invalid_qr'
                    ? 'QR inválido'
                    : errorType === 'backend'
                    ? 'Error al registrar el escaneo'
                    : 'No pudimos obtener tu ubicación'}
                </p>
                <p className="text-gray-600 mb-4 text-sm">{error}</p>
                <div className="space-y-3 mt-4">
                  <button 
                    onClick={handleTryAgain}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Intentar nuevamente
                  </button>
                  <button 
                    onClick={handleSkip}
                    className="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors text-sm"
                  >
                    Continuar sin compartir ubicación
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer con animación sutil */}
      <motion.div 
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-center">
          <FiHeart className="text-orange-500 mr-1" />
          <p className="text-sm text-gray-500">PetConnect - Uniendo mascotas con sus familias</p>
        </div>
      </motion.div>
    </div>
  );
}; 