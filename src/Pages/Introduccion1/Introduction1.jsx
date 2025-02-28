import { useNavigate } from 'react-router-dom';
import Intro1 from '../../assets/Introduccion_1.png';


export const Introduction1 = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/introduction2');
        
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="min-h-screen flex flex-col items-center justify-end bg-white p-2 relative overflow-hidden rounded-[1.5rem]">
                
                <div 
                    className="absolute inset-0 bg-orange-400 flex justify-center items-end h-[90vh] sm:h-[35vh] md:h-[30vh] lg:h-[88vh] rounded-b-[5rem]"
                    style={{ clipPath: 'ellipse(100% 270px at center top)' }}
                >
                
                    <img 
                        src={Intro1} 
                        alt="Introducción" 
                        className="relative top-0 w-full max-w-md max-h-[85vh] h-auto object-contain"
                    />
                </div>

            
                <div className="relative w-full max-w-md bg-white  flex flex-col items-center z-20 rounded-lg overflow-hidden pt-4 lg:p-10 px-4">
                
                    <div className="p-6 text-center w-full  flex flex-col items-center rounded-lg">
                        <h2 className="text-xl font-bold">Más que una app, un puente hacia el hogar</h2>
                        <p className="text-gray-600">
                            Cuando una mascota se pierde, cada segundo cuenta. Un escaneo y el reencuentro comienza.
                        </p>

                    
                        <button  onClick={handleContinue}  className="mt-4 w-full max-w-[20rem] py-3 bg-orange-400 text-white font-semibold rounded-full shadow-md">
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
