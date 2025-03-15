import { NewPet2 } from "./NewPet2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ImgFrontal from '../../assets/ImgStepPet.png';
import Paper from '../../assets/Paper.png';
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";
import { PetTypeSelector } from "../../Components/PetSelector/PetTypeSelector";
import Position from '../../assets/posicionamiento-Step.png'


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

                            <PetTypeSelector selectedPet={selectedPet} setSelectedPet={setSelectedPet} />           
                    </div>
                    <ButtonPrimary text='Continuar' />      
                </form>
            </div>
        </div>
    ) : (
        <NewPet2 name={data.name} type={data.type} navigate={navigate} setRenderPet2={setRenderPet2} />
    );
};
