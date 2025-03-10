import { NewPet2 } from "./NewPet2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ImgFrontal from '../../assets/ImgStepPet.png';
import DogButton from '../../assets/DogButton.png';
import CatButton from '../../assets/CatButton.png';
import Paper from '../../assets/Paper.png';
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";



export const NewPet1 = () => {
    const navigate = useNavigate();
    const [renderPet2, setRenderPet2] = useState(false);
    const [data, setData] = useState({ name: '', type: '' });
    const { register, handleSubmit } = useForm();
    const [selectedPet, setSelectedPet] = useState(null);

    const handleRender = (formData) => {
        if (!selectedPet) return; 
        setData({ name: formData.name, type: selectedPet });
        setRenderPet2(true);
        
        
    };

    const handleHome = () =>{
        navigate('/Home')
    }

    return !renderPet2 ? (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl w-screen max-w-sm  ">
                <NavButton onClick={handleHome} />
                <h2 className="text-2xl font-bold mb-2 text-center">Nombra tu mascota 🐾</h2>
                <img className="mx-auto w-auto h-60" src={ImgFrontal} alt="Pet step" />

                <form onSubmit={handleSubmit(handleRender)} >
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
                    <ButtonPrimary text='Continuar' />
                    
                        
                
                </form>
            </div>
        </div>
    ) : (
        <NewPet2 name={data.name} type={data.type} navigate={navigate} setRenderPet2={setRenderPet2} />
    );
};
