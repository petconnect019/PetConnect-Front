import { useNavigate } from 'react-router-dom';
import Intro from '../../assets/images/PhoneImg.png'

export const Introduction1 = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/introduction2');
    }

    return (
        <div className='min-h-screen flex flex-col  '>
            <div className="flex-1  relative overflow-hidden ">
                {/* Sección superior con imagen */}
                <div 
                    className="w-full p-5 bg-orange-400 flex items-center justify-center h-[65vh] xs:h-[100vh] sm:h-[90vh] md:h-[90vh] lg:h-[90vh]"
                    style={{ 
                        clipPath: 'ellipse(100% 460px at center top)'
                    }}
                >
                    <img 
                        src={Intro} 
                        alt="Introducción" 
                        className="w-full max-w-md object-contain "
                    />
                </div>

                {/* Sección inferior con contenido */}
                <div className="absolute left-0 right-0 z-20 bottom-15 h-auto ">
                    <div className="p-8 text-center">
                        <h2 className="text-xl font-bold ">Más que una app, un puente hacia el hogar</h2>
                        <p className="text-gray-600 mb-8">
                            Cuando una mascota se pierde, cada segundo cuenta. Un escaneo y el reencuentro comienza.
                        </p>

                        <button 
                            onClick={handleContinue}  
                            className="w-full max-w-[20rem] py-3 bg-orange-400 text-white font-semibold rounded-full shadow-md hover:bg-orange-500 transition-colors"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
