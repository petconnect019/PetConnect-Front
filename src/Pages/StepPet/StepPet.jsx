import { useNavigate } from "react-router-dom";
import Position from '../../assets/posicionamiento-Step.png';
import ButtonBack from '../../assets/BackButton.png';
import ImgFrontal from '../../assets/ImgStepPet.png';
import DogButton from '../../assets/DogButton.png';
import CatButton from '../../assets/CatButton.png';
import Paper from '../../assets/Paper.png';

export const StepPet = () => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        //se hace el fetch para guardar la mascota
        navigate("/step-user");

    };

    const handleSkip = () => {
        navigate("/step-user");
    }

    return (
        <div className="flex flex-col items-center justify-center aling-column min-h-screen bg-white p-1">
            <div className="bg-white p-4 rounded-2xl  w-full max-w-md">
                <nav className="flex justify-between items-center mb-[1rem]">
                    <li className="list-none"><img src={ButtonBack} alt="" /></li>
                    <img src={Position} alt="" />
                    <p>1/3</p>
                </nav>          
                    <h2 className="text-2xl font-bold mb-2 text-center" >Nombra tu mascota🐾</h2>        
                    <img className="mx-auto w-auto h-[9rem]" src={ImgFrontal} alt="" />
                    
                    <div className="flex flex-col gap-2">
                        <label  htmlFor="">Nombre</label>
                        <div className="relative w-full">
                            <img src={Paper} alt="Icono de papel" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                            <input 
                                type="text" 
                                id="nombre" 
                                placeholder="Nombre" 
                                className="border border-gray-300 rounded-md p-2 pl-10 w-full"
                            />
                        </div>

                        <label htmlFor="">¿Cual es tu tipo de Mascota?</label>
                            <div className="flex justify-around gap-2">
                                <button className="flex flex-col items-center">
                                    <img className="w-23 h-[5rem]" src={DogButton} alt="DogButton" />
                                    <p className="relative z-10 text-center mt-1 font-semibold bottom-9">Perro</p>
                                </button>
                                <button className="flex flex-col items-center">
                                    <img className="w-23 h-[5rem]" src={CatButton} alt="CatButton" />
                                    <p className="relative z-10 text-center mt-1 font-semibold bottom-9">Gato</p>
                                </button>
                            </div>
                    </div>
                    
            </div>
            <div className="flex flex-col gap-2 mb-4">
                    <button onClick={handleConfirm} className="w-[25rem] bg-orange-400 text-white p-3 rounded-3xl">Confirmar</button>
                    <button onClick={handleSkip} className="w-[25rem] bg-gray-200 text-gray-800 p-3 rounded-3xl ">Saltar</button>
                </div>
        </div>
    );
};
