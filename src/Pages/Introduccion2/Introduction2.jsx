import { useNavigate } from 'react-router-dom';
import Intro from '../../assets/images/Group.png'
import { useEffect, useState } from 'react';

export const Introduction2 = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Activar animación después de que el componente se monte
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    }, []);

    const handleContinue = () => {
        setIsVisible(false);
        setTimeout(() => {
            navigate('/notification-request');
        }, 500);
    }

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-0 lg:p-4'>
            <div className={`bg-white w-full max-w-7xl lg:rounded-3xl lg:shadow-2xl lg:border lg:border-gray-200 overflow-hidden transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* Mobile and Tablet Design */}
                <div className="lg:hidden relative h-screen flex flex-col">
                    {/* Orange top section */}
                    <div className="h-[55vh] bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center relative">
                        <img 
                            src={Intro} 
                            alt="Introducción" 
                            className={`w-full max-w-xs sm:max-w-sm object-contain mt-12 transition-all duration-700 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        />
                    </div>

                    {/* White content card */}
                    <div className={`-mt-6 flex-1 bg-white rounded-t-3xl shadow-md px-6 pt-8 pb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                                Gestiona la información sobre tu mascota
                            </h2>
                            <p className="text-gray-600 text-base leading-relaxed px-1">
                                Administra el perfil de tu mascota y mantén su información siempre disponible.
                            </p>

                            {/* Paginator */}
                            <div className="flex justify-center gap-1 pt-2">
                                <span className="w-1.5 h-1 bg-gray-300 rounded-full" />
                                <span className="w-10 h-1 bg-orange-500 rounded-full" />
                                <span className="w-1.5 h-1 bg-gray-300 rounded-full" />
                            </div>

                            {/* Button */}
                            <div className='flex justify-center pt-6'>
                                <button 
                                    onClick={handleContinue}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-full text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Continuar
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
                                Gestiona la información sobre tu mascota
                            </h2>
                            <p className="text-xl xl:text-2xl 2xl:text-3xl text-gray-600 leading-relaxed">
                                Administra el perfil de tu mascota y mantén su información siempre disponible.
                            </p>
                            
                            <div className='flex flex-col gap-6 pt-4'>
                                <button 
                                    onClick={handleContinue}
                                    className="w-full max-w-md bg-gradient-to-r from-orange-500 to-amber-500 text-white py-5 xl:py-6 rounded-full text-xl xl:text-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
