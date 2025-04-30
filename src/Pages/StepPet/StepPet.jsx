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
        <div className="flex flex-col items-center justify-center w-full">
            <div className="p-4 sm:p-6 w-full max-w-[375px] sm:max-w-[576px] md:max-w-[768px] lg:max-w-[992px] xl:max-w-[1200px] 2xl:max-w-[1440px] 3xl:max-w-[1680px] 4xl:max-w-[1920px]">
                <NavButtonStep onClick={handleBack} img={Position} text={'2/3'} />
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-8xl font-bold mb-2 text-center">Nombra tu mascota 🐾</h2>
                <img className="mx-auto w-auto h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 2xl:h-80 3xl:h-96" src={ImgFrontal} alt="Pet step" />
    
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 sm:mt-6 md:mt-8">
                    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                        <InputField
                            label="Nombre"
                            icon={Paper}
                            register={register}
                            name="name"
                            placeholder="Nombre"
                            validation={{ required: "El nombre es obligatorio" }}
                        />
        
                        <PetTypeSelector textLabel="¿Cuál es tu tipo de Mascota?" selectedPet={selectedPet} setSelectedPet={setSelectedPet} />           
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
                        <ButtonPrimary text='Confirmar' />
                        <ButtonSecondary path='/home' text='Saltar' />
                    </div>
                </form>
            </div>
        </div>
    );
};
