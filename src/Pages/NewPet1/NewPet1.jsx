import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";
import { PetTypeSelector } from "../../Components/PetSelector/PetTypeSelector";
import { useFetchAddPet } from "../../Hooks/useFetchAddPet/useFetchAddPet";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
import ImgFrontal from '../../assets/ImgStepPet.png';
import Paper from '../../assets/Paper.png';

export const NewPet1 = () => {
    const navigate = useNavigate();
    const [petData, setPetData] = useState({ name: null, species: null });
    const { register, handleSubmit } = useForm();
    const [selectedPet, setSelectedPet] = useState(null);
    const { fetchNewPet, pet, isLoading, error } = useFetchAddPet();

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
            navigate(`/pet-profile/${pet.id}`);
        }
    }, [pet, navigate]);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl w-screen max-w-sm">
                <NavButton onClick={() => navigate('/Home')} />
                <h2 className="text-2xl font-bold mb-2 text-center">Nombra tu mascota 🐾</h2>
                <img className="mx-auto w-auto h-60" src={ImgFrontal} alt="Pet step" />

                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <div className="mt-4 flex justify-center">
                        {isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin text-2xl text-blue-500" />
                        ) : (
                            <ButtonPrimary text='Continuar' />
                        )}
                    </div>
                    {error && (
                        <div className="mt-2 flex items-center text-red-500 text-sm">
                            <MdErrorOutline className="mr-1" /> {error.message || "Error al crear la mascota"}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
