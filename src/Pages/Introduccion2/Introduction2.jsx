import { useNavigate } from 'react-router-dom';
import Intro from '../../assets/images/Group.svg'
import { useEffect, useState } from 'react';

export const Introduction2 = () => {
    const navigate = useNavigate();
    const [ellipseHeight, setEllipseHeight] = useState('400px');
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateEllipseSize = () => {
            const width = window.innerWidth;
            setIsLargeScreen(width >= 1280);
            
            if (width < 375) { 
                setEllipseHeight('460px');
            } else if (width < 427) {
                setEllipseHeight('460px');
            } else if (width < 479) {
                setEllipseHeight('550px');
            } else if (width < 819) {
                setEllipseHeight('570px');
            } else if (width < 1279) {
                setEllipseHeight('640px');
            } else if (width < 1642) {
                setEllipseHeight('480px');
            } else if (width < 1680) {
                setEllipseHeight('580px');
            } else if (width < 1920) {
                setEllipseHeight('700px');
            } else {
                setEllipseHeight('2000px');
            }
        };

        updateEllipseSize();
        window.addEventListener('resize', updateEllipseSize);
        
        // Activar animación después de que el componente se monte
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        return () => {
            window.removeEventListener('resize', updateEllipseSize);
        };
    }, []);

    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;
            setIsLargeScreen(width >= 1280);
        };

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        
        // Activar animación después de que el componente se monte
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    const handleContinue = () => {
        setIsVisible(false);
        setTimeout(() => {
            navigate('/notification-request');
        }, 500);
    }

    return (
        <div className='h-auto flex xl:bg-gray-100 2xl:bg-gray-100 3xl:bg-gray-100 4xl:bg-gray-100 xl:items-center xl:justify-center 2xl:items-center 2xl:justify-center 3xl:items-center 3xl:justify-center 4xl:items-center 4xl:justify-center'>
            <div className={`bg-white w-full rounded-4xl xl:shadow-lg xl:border xl:border-gray-100 2xl:shadow-lg 2xl:border-gray-100 3xl:shadow-lg 3xl:border 3xl:border-gray-100 4xl:shadow-lg 4xl:border 4xl:border-gray-100 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {!isLargeScreen ? (
                    // Diseño original para pantallas pequeñas
                    <div className="flex-1 relative overflow-hidden">
                        <div 
                            className="w-full p-5 bg-orange-400 flex items-center justify-center h-[100vh] xs:h-[100vh] sm:h-[120vh] md:h-[100vh] lg:h-[100vh] transition-all duration-700"
                            style={{ 
                                clipPath: `ellipse(100% ${ellipseHeight} at center top)`
                            }}
                        >
                            <img 
                                src={Intro} 
                                alt="Introducción" 
                                className={`w-full max-w-md object-contain transition-all duration-700 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                            />
                        </div>

                        <div className={`absolute left-0 right-0 z-20 bottom-15 sm:bottom-90 xs:bottom-30 md:bottom-30 lg:bottom-55 h-auto transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="p-8 text-center">
                                <h2 className="text-xl font-bold md:text-5xl lg:text-4xl">
                                    Gestiona la información sobre tu mascota
                                </h2>
                                <p className="text-gray-600 mb-8 md:mb-10 md:text-3xl lg:text-2xl md:p-7 lg:pl-20 lg:pr-20 lg:mb-0">
                                    Administra el perfil de tu mascota y mantén su información siempre disponible.
                                </p>

                                <button 
                                    onClick={handleContinue}  
                                    className="w-full max-w-[20rem] py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-500 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Nuevo diseño para pantallas grandes
                    <div className="flex xl:flex-row 2xl:flex-row 3xl:flex-row 4xl:flex-row min-h-screen">
                        <div className={`xl:w-1/2 2xl:w-1/2 3xl:w-1/2 4xl:w-1/2 bg-orange-400 flex items-center justify-center p-10 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                            <img 
                                src={Intro} 
                                alt="Introducción" 
                                className={`w-full max-w-2xl object-contain transition-all duration-700 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                            />
                        </div>
                        <div className={`xl:w-1/2 2xl:w-1/2 3xl:w-1/2 4xl:w-1/2 flex flex-col justify-center p-16 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                            <div className="space-y-8">
                                <h2 className="text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-8xl font-bold text-gray-800">
                                    Gestiona la información sobre tu mascota
                                </h2>
                                <p className="text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl text-gray-600 leading-relaxed">
                                    Administra el perfil de tu mascota y mantén su información siempre disponible.
                                </p>
                                <button 
                                    onClick={handleContinue}
                                    className="w-full max-w-md bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 xl:py-5 2xl:py-6 3xl:py-7 4xl:py-8 rounded-full text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl font-medium shadow-lg hover:bg-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
