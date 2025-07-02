import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { ButtonSecondary } from '../../Components/Buttons/ButtonSecondary';
import { ImSpinner2 } from 'react-icons/im';
import { toast } from 'react-toastify';
import { MdEmail, MdCheckCircle, MdError } from 'react-icons/md';
import { NavButton } from '../../Components/NavButton/NavButton';

export const PendingVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        // Obtener el email del estado de la navegación
        const email = location.state?.email;
        if (!email) {
            navigate('/register');
            return;
        }
        setEmail(email);
    }, [location.state, navigate]);

    useEffect(() => {
        // Contador regresivo para el reenvío
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendVerification = async () => {
        if (countdown > 0) return;
        
        setIsResending(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('¡Correo de verificación reenviado exitosamente!');
                setCountdown(60); // Esperar 60 segundos antes de permitir otro reenvío
            } else {
                toast.error(data.message || 'Error al reenviar el correo de verificación');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckEmail = () => {
        // Abrir el cliente de correo predeterminado
        window.open(`mailto:${email}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header con botón de retroceso */}
            <div className="p-4">
                <NavButton onClick={() => navigate(-1)} />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    {/* Icono de Email */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-brand/10 p-4 rounded-full">
                            <MdEmail className="w-16 h-16 text-brand" />
                        </div>
                    </div>

                    {/* Título y descripción */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
                        Verifica tu correo electrónico
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Hemos enviado un correo de verificación a:
                        <br />
                        <span className="font-semibold text-gray-900">{email}</span>
                    </p>

                    {/* Instrucciones */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h2 className="font-semibold text-gray-900 mb-2">Próximos pasos:</h2>
                        <ol className="list-decimal list-inside text-gray-600 space-y-2">
                            <li>Revisa tu bandeja de entrada</li>
                            <li>Haz clic en el enlace de verificación</li>
                            <li>Regresa aquí para iniciar sesión</li>
                        </ol>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-4">
                        <ButtonPrimary
                            text="Abrir mi correo"
                            onClick={handleCheckEmail}
                            className="w-full"
                        />
                        <ButtonSecondary
                            text={
                                isResending
                                    ? 'Reenviando...'
                                    : countdown > 0
                                    ? `Reenviar en ${countdown}s`
                                    : 'Reenviar correo de verificación'
                            }
                            onClick={handleResendVerification}
                            disabled={isResending || countdown > 0}
                            className="w-full"
                        />
                    </div>

                    {/* Nota de ayuda */}
                    <p className="text-sm text-gray-500 text-center mt-6">
                        ¿No recibiste el correo? Revisa tu carpeta de spam o solicita un nuevo correo de verificación.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
                <button
                    onClick={() => navigate('/login')}
                    className="text-brand hover:text-brand-dark font-medium"
                >
                    Volver al inicio de sesión
                </button>
            </div>
        </div>
    );
}; 