import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImgFrontal from '../../assets/ImgStepPet.png';
import Paper from '../../assets/Paper.png';
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";
import { PetTypeSelector } from "../../Components/PetSelector/PetTypeSelector";
import { useFetchAddPet } from "../../Hooks/useFetchAddPet/useFetchAddPet";

export const NewPet1 = () => {
    const navigate = useNavigate();
    const [petData, setPetData] = useState({ name: null, type: null });
    const { register, handleSubmit } = useForm();
    const [selectedPet, setSelectedPet] = useState(null);
    const {addPet, pet, isSuccess, isLoading, error} = useFetchAddPet();

    const onSubmit = (formData) => {
        if (!selectedPet) return; 
        setPetData({ name: formData.name, type: selectedPet });
    };

    useEffect(()=> {
        if (petData.name && petData.type) {
            console.log(petData);
            //hacemos el fetch de la creacion de la mascota, se añade al contexto local de mascotas con la respuesta del backend y despues de eso lo redireccionamos a /pet-profile/:pet_id
            addPet(petData);
        }
    }, [petData])

    useEffect(()=> {
        console.log(
            `pet: ${pet}\n
            loading: ${isLoading}\n
            error: ${error}`
        );
        

    }, [pet, isLoading, error])


    return(
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl w-screen max-w-sm  ">
                <NavButton onClick={(()=>navigate('/Home'))} />
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
                    <ButtonPrimary text='Continuar' />      
                </form>
            </div>
        </div>
    );
};
