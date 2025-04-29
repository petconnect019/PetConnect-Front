import Intro2 from '../../assets/images/Introduction-2.png';
import { useNavigate } from 'react-router-dom';

export const Introduction2 = () => {
    const navigate = useNavigate();
    const handleContinue = () => {
        
        navigate('/notification-request');
    };

    return (
        <div>
            <div className="h-screen p-2 relative overflow-hidden ">
            
                <div 
                    className="absolute inset-0 bg-orange-400 flex justify-center items-end h-[95vh] xs:h-[95vh] sm:h-[35vh] md:h-[30vh] lg:h-[88vh] rounded-b-[5rem] "
                    style={{ clipPath: 'ellipse(100% 460px at center top)' }}
                >
                
                    <img 
                        src={Intro2} 
                        alt="Introducción" 
                        className="relative top-0 w-full max-w-md max-h-[90vh] h-auto object-contain"
                    />
                </div>

                {/* Contenedor blanco con ajustes */}
                <div className="absolute top-125 xs:top-115 lg:top-90 md:top-80 md:w-screen sm:buttom-40 relative w-full lg:w-screen  bg-white  flex flex-col items-center z-20  overflow-hidden   ">
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
