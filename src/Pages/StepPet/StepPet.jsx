import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Position from '../../assets/images/posicionamiento-Step-user.png';
import ImgFrontal from '../../assets/images/ImgStepPet.png';
import Paper from '../../assets/images/Paper.png';
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";
import { useForm } from "react-hook-form";
import { NavButtonStep } from "../../Components/NavButtonStep/NavButtonStep";
import { PetTypeSelector } from "../../Components/PetSelector/PetTypeSelector";
import { ButtonSecondary } from "../../Components/Buttons/ButtonSecondary";
import  {useFetchAddPet}  from "../../Hooks/useFetchAddPet/useFetchAddPet";



export const StepPet = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [selectedPet, setSelectedPet] = useState(null);
    const [petData, setPetData] = useState({ name: null, species: null });
    const { fetchNewPet, pet, isLoading, error } = useFetchAddPet();

   const handleBack = () =>{
    navigate('/step-user')
   }

   const onSubmit = (formData) => {
        if (!selectedPet) return;
        setPetData({ name: formData.name, species: selectedPet });
    };

    useEffect(() => {
        if (petData.name && petData.species) {
            fetchNewPet(petData);
        }
    }, [petData]);

    useEffect(() => {
        if (pet) {
            navigate(`/step-tag/${pet._id}`);
        }
    }, [pet, navigate]);   

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-screen">
                    <div className="bg-white p-6 rounded-2xl  max-w-sm ">
                        <NavButtonStep  onClick={handleBack} img={Position} text={'2/3'} />
                        <h2 className="text-2xl font-bold mb-2 text-center">Nombra tu mascota 🐾</h2>
                        <img className="mx-auto w-auto h-60" src={ImgFrontal} alt="Pet step" />
        
                        <form onSubmit={handleSubmit(onSubmit)} >
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
                            <ButtonPrimary  text='Continuar' />
                            <ButtonSecondary path='/home' text='Saltar' />
                        </form>
                    </div>
                </div>
    );
};
