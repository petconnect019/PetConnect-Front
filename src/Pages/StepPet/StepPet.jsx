import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Position from '../../assets/posicionamiento-Step.png';
import ButtonBack from '../../assets/BackButton.png';
import ImgFrontal from '../../assets/ImgStepPet.png';
import DogButton from '../../assets/DogButton.png';
import CatButton from '../../assets/CatButton.png';
import Paper from '../../assets/Paper.png';

export const StepPet = () => {
    const navigate = useNavigate();
    const [selectedPet, setSelectedPet] = useState(null);

    const handleConfirm = () => {
        navigate("/step-user");
    };

    const handleSkip = () => {
        navigate("/step-user");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-4 rounded-2xl w-full max-w-md h-auto">
                <nav className="flex justify-between items-center mb-[1rem]">
                    <li className="list-none"><img src={ButtonBack} alt="" /></li>
                    <img src={Position} alt="" />
                    <p>1/3</p>
                </nav>          
                <h2 className="text-2xl font-bold mb-2 text-center">Nombra tu mascota🐾</h2>        
                <img className="mx-auto w-auto h-[9rem]" src={ImgFrontal} alt="" />
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="">Nombre</label>
                    <div className="relative w-full">
                        <img src={Paper} alt="Icono de papel" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                        <input 
                            type="text" 
                            id="nombre" 
                            placeholder="Nombre" 
                            className="border border-gray-300 rounded-md p-2 pl-10 w-full"
                        />
                    </div>

                    <label htmlFor="">¿Cuál es tu tipo de Mascota?</label>
                    <div className="flex justify-around gap-2">
                        <button 
                            className="flex flex-col items-center p-2 h-[6.5rem] rounded-lg " 
                            onClick={() => setSelectedPet("dog")}
                        >
                            <img className={` p-5 w-25 h-[6rem]  border-gray rounded-[0.4rem] transition-all ${
                                selectedPet === "dog" ? "border-3 rounded-[0.5rem] border-orange-400" : "border border-gray-300"
                            }`} src={DogButton} alt="DogButton" />
                            <p className="bottom-7 relative  text-center mt-1 ">Perro</p>
                        </button>

                        <button 
                            className="flex flex-col items-center p-2 h-[6.5rem] rounded-lg "
                            onClick={() => setSelectedPet("cat")}
                        >
                            <img className={`p-5 w-25 h-[6rem]  border-gray rounded-[0.4rem] transition-all ${
                                selectedPet === "cat" ? "border-3 rounded-[0.5rem] border-orange-400" : "border border-gray-300"
                            }`}  src={CatButton} alt="CatButton" />
                            <p className=" relative bottom-7  text-center mt-1 ">Gato</p>
                        </button>
                    </div>
                </div>
            

                <div className="flex flex-col gap-2 mt-6">
                    <button onClick={handleConfirm} className="w-[25rem] bg-orange-400 text-white p-3 rounded-3xl">Continuar</button>
                    <button onClick={handleSkip} className="w-[25rem] bg-gray-200 text-gray-800 p-3 rounded-3xl">Saltar</button>
                </div>
            </div>
        </div>
    );
};
