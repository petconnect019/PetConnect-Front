import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { ImSpinner2 } from 'react-icons/im';
import { toast } from 'react-toastify';

export const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState('verifying');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setVerificationStatus('success');
                    toast.success('¡Correo electrónico verificado exitosamente!');
                    // Redirigir automáticamente después de 2 segundos
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    setVerificationStatus('error');
                    toast.error(data.message || 'Error al verificar el correo electrónico');
                }
            } catch (error) {
                console.error('Error durante la verificación:', error);
                setVerificationStatus('error');
                toast.error('Error al conectar con el servidor');
            } finally {
                setIsVerifying(false);
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setVerificationStatus('error');
            setIsVerifying(false);
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Verificación de Correo Electrónico</h2>
                
                {isVerifying ? (
                    <div className="flex flex-col items-center">
                        <ImSpinner2 className="w-12 h-12 text-brand animate-spin" />
                        <p className="mt-4 text-gray-600">Verificando tu correo electrónico...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        {verificationStatus === 'success' ? (
                            <>
                                <p className="text-green-600 mb-4">
                                    ¡Tu correo electrónico ha sido verificado exitosamente!
                                </p>
                                <p className="text-gray-600 mb-4">
                                    Serás redirigido a la página de inicio de sesión en unos segundos...
                                </p>
                                <ButtonPrimary
                                    text="Iniciar sesión ahora"
                                    onClick={() => navigate('/login')}
                                    className="w-full"
                                />
                            </>
                        ) : (
                            <>
                                <p className="text-red-600 mb-4">
                                    Lo sentimos, no pudimos verificar tu correo electrónico.
                                    Por favor, intenta nuevamente o contacta a soporte.
                                </p>
                                <ButtonPrimary
                                    text="Volver al inicio"
                                    onClick={() => navigate('/')}
                                    className="w-full"
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}; 