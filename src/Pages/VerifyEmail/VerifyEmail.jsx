import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { ImSpinner2 } from 'react-icons/im';
import { toast } from 'react-toastify';

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState('verifying');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            if (!token) {
                setVerificationStatus('error');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setVerificationStatus('success');
                    toast.success('¡Correo electrónico verificado exitosamente!');
                } else {
                    setVerificationStatus('error');
                    toast.error(data.message || 'Error al verificar el correo electrónico');
                }
            } catch (error) {
                setVerificationStatus('error');
                toast.error('Error al conectar con el servidor');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmail();
    }, [searchParams]);

    const handleContinue = () => {
        navigate('/login');
    };

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
                                <ButtonPrimary
                                    text="Continuar al inicio de sesión"
                                    onClick={handleContinue}
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