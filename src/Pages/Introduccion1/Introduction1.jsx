import { useNavigate } from 'react-router-dom';
import Intro from '../../assets/images/PhoneImg.png'
import { useEffect, useState } from 'react';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';

export const Introduction1 = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar si existe un token y redirigir si es válido
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            navigate('/home');
            return;
        }

        // Activar animación después de que el componente se monte
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    }, [navigate]);

    const handleSkiped = () => {
        setIsVisible(false);
        setTimeout(() => {
            navigate('/welcome');
        }, 500);
    }

    const handleContinue = () => {
        setIsVisible(false);
        setTimeout(() => {
            navigate('/introduction2');
        }, 500);
    }

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-0 lg:p-4'>
            <div className={`bg-white w-full max-w-7xl lg:rounded-3xl lg:shadow-2xl lg:border lg:border-gray-200 overflow-hidden transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* Mobile and Tablet Design */}
                <div className="lg:hidden relative h-screen flex flex-col">
                    {/* Orange curved section - BACKGROUND */}
                    <div 
                        className="absolute top-0 left-0 right-0 bg-gradient-to-br from-orange-400 to-orange-500 h-[65vh]"
                        style={{
                            clipPath: 'ellipse(100% 100% at 50% 0%)'
                        }}
                    />
                    
                    {/* Image container - INSIDE the ellipse */}
                    <div className="relative z-10 flex items-center justify-center h-[65vh] pt-16">
                        <img 
                            src={Intro} 
                            alt="Introducción" 
                            className={`w-full max-w-xs sm:max-w-sm object-contain transition-all duration-700 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        />
                    </div>

                    {/* Content section - OUTSIDE the ellipse */}
                    <div className={`relative z-20 flex-1 flex flex-col justify-center px-6 py-4 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                                Más que una app, un puente hacia el hogar
                            </h2>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed px-2">
                                Cuando una mascota se pierde, cada segundo cuenta. Un escaneo y el reencuentro comienza.
                            </p>
                            
                            <div className='flex flex-col gap-4 pt-6'>
                                <button 
                                    onClick={handleContinue}
                                    className="w-full max-w-sm mx-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Continuar
                                </button>
                                <button 
                                    onClick={handleSkiped}
                                    className="w-full max-w-sm mx-auto bg-gray-100 text-orange-500 py-4 rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Saltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Design */}
                <div className="hidden lg:flex min-h-[600px] xl:min-h-[700px]">
                    {/* Left side - Image with curved background */}
                    <div className={`w-1/2 relative overflow-hidden transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                        {/* Background ellipse */}
                        <div 
                            className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500"
                            style={{
                                clipPath: 'ellipse(130% 100% at 0% 50%)'
                            }}
                        />
                        {/* Image inside the ellipse area */}
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <img 
                                src={Intro} 
                                alt="Introducción" 
                                className={`w-full max-w-sm xl:max-w-md object-contain transition-all duration-700 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                            />
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className={`w-1/2 flex flex-col justify-center p-12 xl:p-16 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                        <div className="space-y-8">
                            <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-800 leading-tight">
                                Más que una app, un puente hacia el hogar
                            </h2>
                            <p className="text-xl xl:text-2xl 2xl:text-3xl text-gray-600 leading-relaxed">
                                Cuando una mascota se pierde, cada segundo cuenta. Un escaneo y el reencuentro comienza.
                            </p>
                            
                            <div className='flex flex-col gap-6 pt-4'>
                                <button 
                                    onClick={handleContinue}
                                    className="w-full max-w-md bg-gradient-to-r from-orange-500 to-amber-500 text-white py-5 xl:py-6 rounded-full text-xl xl:text-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Continuar
                                </button>
                                <button 
                                    onClick={handleSkiped}
                                    className="w-full max-w-md bg-gray-100 text-orange-500 py-5 xl:py-6 rounded-full text-xl xl:text-2xl font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Saltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
