import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Position from '../../assets/posicionamiento-Step.png';
import ImgFrontal from '../../assets/ImgStepPet.png';
import DogButton from '../../assets/DogButton.png';
import CatButton from '../../assets/CatButton.png';
import Paper from '../../assets/Paper.png';
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";
import { useForm } from "react-hook-form";
import { NavButtonStep } from "../../Components/NavButtonStep/NavButtonStep";
NavButtonStep


export const StepPet = () => {
    const navigate = useNavigate();
     const { register, handleSubmit } = useForm();
    const [selectedPet, setSelectedPet] = useState(null);

   const handleBack = () =>{
    navigate('/login')
   }

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-screen">
                    <div className="bg-white p-6 rounded-2xl  max-w-sm ">
                        <NavButtonStep  onClick={handleBack} img={Position} text={'1/3'} />
                        <h2 className="text-2xl font-bold mb-2 text-center">Nombra tu mascota 🐾</h2>
                        <img className="mx-auto w-auto h-60" src={ImgFrontal} alt="Pet step" />
        
                        <form onSubmit={handleSubmit} >
                            <div className="flex flex-col gap-2">
        
                                    <InputField
                                        label="Nombre"
                                        icon={Paper}
                                        register={register}
                                        name="name"
                                        placeholder="Nombre"
                                        validation={{ required: "El nombre es obligatorio" }}
                                        />
        
                                <label className="text-[1.4rem] mb-8">¿Cuál es tu tipo de Mascota?</label>
                                <div className="flex justify-around gap-2">
                                    <button
                                        type="button"
                                        className={`flex flex-col items-center p-2 h-[10rem] w-[10rem] rounded-lg border ${
                                            selectedPet === "dog" ? "border-orange-400" : "border-gray-300"
                                        }`}
                                        onClick={() => setSelectedPet("dog")}
                                    >
                                        <img className="w-27 h-[7rem]" src={DogButton} alt="Dog" />
                                        <p className="text-center mt-1 font-semibold text-[1.4rem]">Perro</p>
                                    </button>
        
                                    <button
                                        type="button"
                                        className={`flex flex-col items-center p-2 h-[10rem] w-[10rem] rounded-lg border ${
                                            selectedPet === "cat" ? "border-orange-400" : "border-gray-300"
                                        }`}
                                        onClick={() => setSelectedPet("cat")}
                                    >
                                        <img className="w-27 h-[7rem]" src={CatButton} alt="Cat" />
                                        <p className="text-center mt-1 font-semibold text-[1.4rem]">Gato</p>
                                    </button>
                                    
                                </div>
                            </div>
                            <ButtonPrimary path='/step-user' text='Continuar' />
                        </form>
                    </div>
                </div>
    );
};
