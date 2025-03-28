import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";
import { PetTypeSelector } from "../../Components/PetSelector/PetTypeSelector";
import { useFetchAddPet } from "../../Hooks/useFetchAddPet/useFetchAddPet";
import { useHasPetsUser } from "../../Contexts/HasPetsUser/HasPetsUser";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
import ImgFrontal from "../../assets/images/ImgStepPet.png";
import Paper from "../../assets/images/Paper.png";

export const NewPet1 = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState({ name: null, species: null });
  const { register, handleSubmit } = useForm();
  const [selectedPet, setSelectedPet] = useState(null);
  const hasPets = useHasPetsUser();
  const { changeHasPetsUser } = hasPets;
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
      changeHasPetsUser(true);
      navigate(`/pet-profile/${pet._id}`);
    }
  }, [pet, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-start mb-6 gap-2">
            <NavButton onClick={() => navigate(-1)} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex-grow text-center">
              Nombra tu mascota 🐾
            </h2>
          </div>

          <div className="text-center mb-6">
            <img
              className="mx-auto w-48 h-48 object-contain"
              src={ImgFrontal}
              alt="Pet step"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <InputField
                label="Nombre"
                icon={Paper}
                register={register}
                name="name"
                placeholder="Nombre"
                validation={{ required: "El nombre es obligatorio" }}
                className="w-full"
              />
              <PetTypeSelector
                selectedPet={selectedPet}
                setSelectedPet={setSelectedPet}
              />
            </div>

            <div className="flex justify-center mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin text-2xl text-blue-500" />
                </div>
              ) : (
                <ButtonPrimary text="Continuar" />
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-center justify-center text-red-500 text-sm">
                <MdErrorOutline className="mr-2 text-lg" />
                {error || "Error al crear la mascota"}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
