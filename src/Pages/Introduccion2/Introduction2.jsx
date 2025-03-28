import Intro2 from '../../assets/images/Introduccion2.png';
import { useNavigate } from 'react-router-dom';

export const Introduction2 = () => {
    const navigate = useNavigate();
    const handleContinue = () => {
        
        navigate('/notification-request');
    };

    return (
        <div  className="flex flex-col items-center justify-center  bg-gray-100 ">

            <div className="min-h-screen relative items-center justify-end bg-white p-2 relative overflow-hidden ">
            
                <div 
                    className="absolute inset-0 bg-orange-400 flex justify-center items-end h-[95vh] sm:h-[35vh] md:h-[98vh] lg:h-[95vh] "
                    style={{ clipPath: 'ellipse(100% 550px at center top)' }}
                >
                
                    <img 
                        src={Intro2} 
                        alt="Introducción" 
                        className="relative top-0 w-full max-w-md max-h-[90vh] h-auto object-contain"
                    />
                </div>

                {/* Contenedor blanco con ajustes */}
                <div className="absolute top-150 lg:top-90 md:top-80 md:w-screen sm:buttom-40 relative w-full lg:w-screen  bg-white  flex flex-col items-center z-20  overflow-hidden   ">
                    {/* Contenedor con borde negro */}
                    <div className="p-6 text-center w-full  flex flex-col items-center mb-10 ">
                        <h2 className="text-xl font-bold">Gestiona la información sobre tu mascota</h2>
                        <p className="text-gray-600">
                            Administra el perfil de tu mascota  y mantén su información siempre disponible.
                        </p>

                        {/* Botón centrado */}
                        <button onClick={handleContinue} className="mt-10 w-full max-w-[20rem] py-3 bg-orange-400 text-white font-semibold rounded-full shadow-md">
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
