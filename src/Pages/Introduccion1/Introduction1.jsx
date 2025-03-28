import { useNavigate } from 'react-router-dom';
import Intro1 from '../../assets/images/Introduccion_1.png';


export const Introduction1 = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/introduction2');
        
    }


    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100 ">
            <div className="min-h-screen relative items-center justify-end bg-white p-2 relative overflow-hidden ">
                
                <div 
                    className="absolute inset-0 bg-orange-400 flex justify-center items-end h-[95vh] sm:h-[35vh] md:h-[30vh] lg:h-[88vh] rounded-b-[5rem]"
                    style={{ clipPath: 'ellipse(100% 550px at center top)' }}
                >
                
                    <img 
                        src={Intro1} 
                        alt="Introducción" 
                        className="relative top-0 w-full max-w-md max-h-[85vh] h-auto object-contain"
                    />
                </div>

            
                <div className=" absolute top-150 lg:top-90 relative w-full lg:w-screen  bg-white  flex flex-col items-center z-20  overflow-hidden   ">
                
                    <div className="p-6 text-center w-full  flex flex-col items-center rounded-lg mb-10">
                        <h2 className="text-xl font-bold">Más que una app, un puente hacia el hogar</h2>
                        <p className="text-gray-600">
                            Cuando una mascota se pierde, cada segundo cuenta. Un escaneo y el reencuentro comienza.
                        </p>

                    
                        <button  onClick={handleContinue}  className="mt-16 w-full max-w-[20rem] py-3 bg-orange-400 text-white font-semibold rounded-full shadow-md">
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
